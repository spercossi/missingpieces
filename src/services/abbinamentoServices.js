// Servizio per gestire gli abbinamenti tra capi della wishlist e capi personali
import { showBrandSuccess } from '../utils/notifications.jsx';
import { createUserStorageHelper, valutazioniHelper } from '../utils/storage.js';
import { abbinamentiEvents } from '../utils/events.js';

const STORAGE_KEY_PREFIX = 'abbinamenti_';
const OUTFIT_STORAGE_KEY_PREFIX = 'outfitSalvati_';
const DATE_CACHE_KEY = 'abbinamenti_date_cache_';

// Cache per memorizzare le date di creazione degli abbinamenti
function getOrCreateAbbinamentoDate(abbinamentoId, userId) {
  if (!userId) return new Date().toISOString();
  
  try {
    const userStorage = createUserStorageHelper(userId);
    const cache = userStorage.getAbbinamentoDateCache();
    
    // Se l'abbinamento esiste già, usa la data esistente
    if (cache[abbinamentoId]) {
      return cache[abbinamentoId];
    }
    
    // altrimenti crea una nuova data e la salva in cache
    const newDate = new Date().toISOString();
    cache[abbinamentoId] = newDate;
    userStorage.setAbbinamentoDateCache(cache);
    
    return newDate;
  } catch {
    return new Date().toISOString();
  }
}

// Pulisce le date degli abbinamenti che non esistono più
function cleanupAbbinamentoDateCache(currentAbbinamentoIds, userId) {
  if (!userId) return;
  
  try {
    const cacheKey = `${DATE_CACHE_KEY}${userId}`;
    const cache = JSON.parse(localStorage.getItem(cacheKey) || '{}');
    
    // Mantieni solo le date per abbinamenti che esistono ancora
    const cleanedCache = {};
    currentAbbinamentoIds.forEach(id => {
      if (cache[id]) {
        cleanedCache[id] = cache[id];
      }
    });
    
    localStorage.setItem(cacheKey, JSON.stringify(cleanedCache));
  } catch {
    // ignore cache cleanup errors
  }
}

// trova abbinamenti tra capi della wishlist e capi personali
export function calcolaAbbinamenti(mieiCapi, listaDesideri, userId) {
  // Se non ci sono capi personali, non posso fare abbinamenti
  if (!mieiCapi.length) {
    return [];
  }

  const abbinamenti = [];

  // 1. ABBINAMENTI WISHLIST ↔ CAPI PERSONALI (solo se c'è una wishlist)
  if (listaDesideri && listaDesideri.length > 0) {
    listaDesideri.forEach((capoDesiderato) => {
      mieiCapi.forEach(mioCapo => {
        const match = controllaCompatibilita(capoDesiderato, mioCapo);
        
        if (match.compatibile) {
          const abbinamentoId = `abbinamento_wishlist_${capoDesiderato.id}_${mioCapo.id}`;
          
          abbinamenti.push({
            id: abbinamentoId,
            capoDesiderato,
            mioCapo,
            tipoAbbinamento: match.tipo,
            compatibilita: match.score,
            motivazione: match.motivazione,
            dataCreazione: getOrCreateAbbinamentoDate(abbinamentoId, userId),
            fonte: "wishlist_personali" // Indica che abbina wishlist con capi personali
          });
        }
      });
    });
  }

  // 2. ABBINAMENTI TRA CAPI PERSONALI
  if (mieiCapi.length >= 2) {
    for (let i = 0; i < mieiCapi.length; i++) {
      for (let j = i + 1; j < mieiCapi.length; j++) {
        const capo1 = mieiCapi[i];
        const capo2 = mieiCapi[j];
        
        // controlla compatibilità tra i due capi personali
        const match = controllaCompatibilita(capo1, capo2);
        
        if (match.compatibile) {
          const abbinamentoId = `abbinamento_personali_${capo1.id}_${capo2.id}`;
          
          abbinamenti.push({
            id: abbinamentoId,
            capoDesiderato: capo1, // Primo capo come "base"
            mioCapo: capo2,        // Secondo capo come "abbinamento"
            tipoAbbinamento: match.tipo,
            compatibilita: match.score,
            motivazione: match.motivazione,
            dataCreazione: getOrCreateAbbinamentoDate(abbinamentoId, userId),
            fonte: "personali_personali" // Indica che abbina due capi personali
          });
        }
      }
    }
  }

  // Ordina per compatibilità (dal più recente al più vecchio)
  const abbinamenti_ordinati = abbinamenti.sort((a, b) => new Date(b.dataCreazione) - new Date(a.dataCreazione));

  // Pulisce la cache delle date per abbinamenti che non esistono più
  if (userId) {
    const currentIds = abbinamenti_ordinati.map(a => a.id);
    cleanupAbbinamentoDateCache(currentIds, userId);
  }

  // Marca i nuovi abbinamenti (non ancora visti)
  const abbinamenti_con_flag_new = marcaNuoviAbbinamenti(abbinamenti_ordinati, userId);

  // controlla sempre se ci sono nuovi abbinamenti (basato sul numero totale)
  checkNuoviAbbinamenti(abbinamenti_ordinati.length);
  
  return abbinamenti_con_flag_new;
}

// controlla la compatibilità tra due capi
function controllaCompatibilita(capoDesiderato, mioCapo) {
  let score = 0;
  let motivazioni = [];
  let tipoAbbinamento = [];

  // Se non ci sono i dati necessari, impossibile fare abbinamenti
  if (!capoDesiderato || !mioCapo) {
    return { compatibile: false, score: 0, tipo: '', motivazione: 'Dati mancanti' };
  }

  // 1. Controllo colore - Solo algoritmo
  if (capoDesiderato["Colore"] && mioCapo["Colore"]) {
    const colore1 = capoDesiderato["Colore"];
    const colore2 = mioCapo["Colore"];
    
    // usa la logica algoritmica dei colori complementari
    if (sonoColoriComplementari(colore1, colore2)) {
      score += 50; // Punteggio massimo per colori complementari
      tipoAbbinamento.push("colori_complementari");
      motivazioni.push(`I colori ${colore1} e ${colore2} si abbinano molto bene insieme`);
    }
  }

  // 2. Controllo stagione
  if (capoDesiderato["Stagione"] && mioCapo["Stagione"]) {
    if (capoDesiderato["Stagione"] === mioCapo["Stagione"] || 
        capoDesiderato["Stagione"] === "Tutto l'anno" || 
        mioCapo["Stagione"] === "Tutto l'anno") {
      score += 20;
      tipoAbbinamento.push("stagione_compatibile");
      motivazioni.push(`Entrambi i capi sono adatti per ${capoDesiderato["Stagione"]}`);
    }
  }

  // 3. Controllo stile
  if (capoDesiderato["Stile"] && mioCapo["Stile"]) {
    const stiliCompatibili = verificaStiliCompatibili(capoDesiderato["Stile"], mioCapo["Stile"]);
    if (stiliCompatibili) {
      score += 15;
      tipoAbbinamento.push("stile_compatibile");
      motivazioni.push(`Gli stili ${capoDesiderato["Stile"]} e ${mioCapo["Stile"]} si abbinano bene`);
    }
  }

  // 4. Controllo genere
  if (capoDesiderato["Genere"] && mioCapo["Genere"]) {
    if (capoDesiderato["Genere"] === mioCapo["Genere"] || 
        capoDesiderato["Genere"] === "Unisex" || 
        mioCapo["Genere"] === "Unisex") {
      score += 10;
      tipoAbbinamento.push("genere_compatibile");
      motivazioni.push("Compatibili per genere");
    }
  }

  // 5. Bonus per capi diversi (evita di abbinare due camicie, ecc.)
  if (capoDesiderato["Tipo di Capo"] && mioCapo["Tipo di Capo"]) {
    if (capoDesiderato["Tipo di Capo"] !== mioCapo["Tipo di Capo"]) {
      score += 5;
      motivazioni.push("Tipologie di capi complementari");
    }
  }

  return {
    compatibile: score >= 40, // Soglia minima abbinamento
    score: Math.min(score, 100),
    tipo: tipoAbbinamento.join(", "),
    motivazione: motivazioni.join(". ")
  };
}



// Verifica se due stili sono compatibili
function verificaStiliCompatibili(stile1, stile2) {
  const stiliCompatibili = {
    "Casual": ["Casual", "Sportivo", "Boho"],
    "Formale": ["Formale", "Elegante"],
    "Sportivo": ["Sportivo", "Casual"],
    "Elegante": ["Elegante", "Formale", "Vintage"],
    "Vintage": ["Vintage", "Elegante", "Boho", "Sexy"],
    "Boho": ["Boho", "Casual", "Vintage"],
    "Sexy": ["Sexy", "Elegante", "Vintage"],
    "Creativo": ["Creativo", "Boho", "Vintage"],
    "Tradizionale": ["Tradizionale", "Formale", "Elegante"]
  };

  return stiliCompatibili[stile1]?.includes(stile2) || stiliCompatibili[stile2]?.includes(stile1);
}

// salva un outfit
export function salvaOutfit(abbinamento, userId, nomeOutfit) {
  if (!abbinamento || !userId) return false;

  try {
    const userStorage = createUserStorageHelper(userId);
    const outfit = {
      id: `outfit_${userId}_${Date.now()}`,
      userId,
      nome: nomeOutfit || `Outfit ${new Date().toLocaleDateString()}`,
      abbinamento,
      dataSalvataggio: new Date().toISOString(),
      preferito: false
    };

    const outfitSalvati = userStorage.getOutfitSalvati();
    outfitSalvati.push(outfit);

    return userStorage.setOutfitSalvati(outfitSalvati);
  } catch (error) {
    console.error('Errore nel salvare outfit:', error);
    return false;
  }
}

// ottiene gli outfit salvati per un utente
export function getOutfitSalvati(userId) {
  if (!userId) return [];

  try {
    const userStorage = createUserStorageHelper(userId);
    return userStorage.getOutfitSalvati();
  } catch (error) {
    console.error('Errore nel leggere outfit salvati:', error);
    return [];
  }
}

// rimuove un outfit salvato
export function rimuoviOutfit(outfitId, userId) {
  if (!outfitId || !userId) return false;

  try {
    const outfitSalvati = getOutfitSalvati(userId);
    const nuoviOutfit = outfitSalvati.filter(outfit => outfit.id !== outfitId);
      localStorage.setItem(`${OUTFIT_STORAGE_KEY_PREFIX}${userId}`, JSON.stringify(nuoviOutfit));
    
    return true;
  } catch (error) {
    console.error('Errore nella rimozione outfit:', error);
    return false;
  }
}

// Valuta un abbinamento (feedback utente)
export function votoAbbinamento(abbinamentoId, valutazione, userId) {
  if (!abbinamentoId || !valutazione || !userId) return false;

  try {
    const valutazioni = valutazioniHelper.get();
    
    if (!valutazioni[userId]) {
      valutazioni[userId] = {};
    }

    valutazioni[userId][abbinamentoId] = {
      valutazione, // "positiva" | "negativa"
      data: new Date().toISOString()
    };

    return valutazioniHelper.set(valutazioni);
  } catch (error) {
    console.error('Errore nel salvare valutazione:', error);
    return false;
  }
}

// Pulisce i dati dell'utente (logout)
export function clearAbbinamenti(userId) {
  if (!userId) return;

  try {
    localStorage.removeItem(`${OUTFIT_STORAGE_KEY_PREFIX}${userId}`);
    
    // rimuove anche le valutazioni dell'utente
    const valutazioni = JSON.parse(localStorage.getItem('valutazioniAbbinamenti') || '{}');
    delete valutazioni[userId];
    localStorage.setItem('valutazioniAbbinamenti', JSON.stringify(valutazioni));
    
    // Pulisce anche gli abbinamenti visti
    clearAbbinamentiVisti(userId);
    
    // Pulisce anche la cache delle date
    localStorage.removeItem(`${DATE_CACHE_KEY}${userId}`);
    
  } catch (error) {
    console.error('Errore nella pulizia abbinamenti:', error);
  }
}

// Funzione helper per verificare se due colori sono complementari
function sonoColoriComplementari(colore1, colore2) {
  // Mappa base di colori complementari per abbinamenti tra capi personali
  const coloriComplementari = {
    "Red": ["Green", "Teal", "Khaki"],
    "Blue": ["Orange", "Yellow", "Goldenrod"],
    "Green": ["Red", "Pink", "Fuscia"],
    "Yellow": ["Purple", "Violet", "Indigo"],
    "Orange": ["Blue", "Turquoise", "Aquamarine"],
    "Purple": ["Yellow", "Goldenrod", "Light Blue"],
    "Light Blue": ["Orange", "Yellow", "Pink"],
    "Turquoise": ["Orange", "Red", "Pink"],
    "Teal": ["Red", "Orange", "Pink"],
    "Pink": ["Green", "Teal", "Light Blue"],
    "Fuscia": ["Green", "Teal", "Aquamarine"],
    "Violet": ["Yellow", "Goldenrod", "Green"],
    "Puce": ["Green", "Teal", "Yellow"],
    // Colori neutri si abbinano con molti colori
    "Bianco": ["Blue", "Red", "Green", "Purple", "Orange", "Yellow"],
    "Nero": ["Bianco", "Yellow", "Orange", "Pink", "Light Blue"],
    "Grigio": ["Yellow", "Orange", "Pink", "Light Blue", "Green"],
    "Beige": ["Blue", "Turquoise", "Purple", "Teal"],
    "Marrone": ["Blue", "Turquoise", "Light Blue", "Aquamarine"]
  };

  // controlla se colore2 è nella lista dei complementari di colore1
  return coloriComplementari[colore1]?.includes(colore2) || 
         coloriComplementari[colore2]?.includes(colore1) ||
         false;
}

// controlla se ci sono nuovi abbinamenti e mostra notifica discreta
export function checkNuoviAbbinamenti(numeroAttualeAbbinamenti) {
  const key = 'ultimoNumeroAbbinamenti';
  const ultimoNumero = parseInt(localStorage.getItem(key) || '0');
  
  // Caso 1: Numero aumentato - mostra notifica E aggiorna
  if (numeroAttualeAbbinamenti > ultimoNumero && ultimoNumero > 0) {
    const differenza = numeroAttualeAbbinamenti - ultimoNumero;
    
    if (differenza === 1) {
      showBrandSuccess('🎉 Nuovo abbinamento trovato!', 'bottom-center');
    } else {
      showBrandSuccess(`🎉 ${differenza} nuovi abbinamenti trovati!`, 'bottom-center');
    }
    
    localStorage.setItem(key, numeroAttualeAbbinamenti.toString());
  } 
  // Caso 2: Numero diminuito - aggiorna immediatamente senza notifica
  else if (numeroAttualeAbbinamenti < ultimoNumero) {
    localStorage.setItem(key, numeroAttualeAbbinamenti.toString());
  }
  // Caso 3: Numero uguale o primo caricamento - non fare nulla
}

// Funzioni per gestire la flag "NEW" sugli abbinamenti
const VISTI_STORAGE_KEY = 'abbinamenti_visti_';

// Marca gli abbinamenti come nuovi se non sono stati ancora visti
function marcaNuoviAbbinamenti(abbinamenti, userId) {
  if (!userId) {
    // Se non c'è userId, marca tutti come non nuovi
    return abbinamenti.map(abbinamento => ({ ...abbinamento, isNew: false }));
  }

  const abbinamentiVisti = getAbbinamentiVisti(userId);
  
  const result = abbinamenti.map(abbinamento => {
    const isNew = !abbinamentiVisti.includes(abbinamento.id);
    return {
      ...abbinamento,
      isNew
    };
  });

  return result;
}

// Ottiene la lista degli abbinamenti già visti dall'utente
function getAbbinamentiVisti(userId) {
  if (!userId) return [];
  
  try {
    const stored = localStorage.getItem(`${VISTI_STORAGE_KEY}${userId}`);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// Marca abbinamenti come visti quando l'utente apre la tab
export function marcaAbbinamentiVisti(abbinamenti, userId) {
  if (!userId || !abbinamenti.length) return;
  
  try {
    const abbinamentiVisti = getAbbinamentiVisti(userId);
    const nuoviIds = abbinamenti.map(a => a.id).filter(id => !abbinamentiVisti.includes(id));
    
    if (nuoviIds.length > 0) {
      const abbinamentiVistiAggiornati = [...abbinamentiVisti, ...nuoviIds];
      localStorage.setItem(`${VISTI_STORAGE_KEY}${userId}`, JSON.stringify(abbinamentiVistiAggiornati));
    }
  } catch (error) {
    console.error('❌ Errore nel marcare abbinamenti come visti:', error);  
  }
}

// Conta quanti abbinamenti sono nuovi
export function contaNuoviAbbinamenti(abbinamenti, userId) {
  if (!userId || !abbinamenti.length) return 0;
  
  const abbinamentiVisti = getAbbinamentiVisti(userId);
  const nuovi = abbinamenti.filter(a => !abbinamentiVisti.includes(a.id));
  
  return nuovi.length;
}

// Pulisce la lista degli abbinamenti visti (per logout)
export function clearAbbinamentiVisti(userId) {
  if (!userId) return;
  
  try {
    localStorage.removeItem(`${VISTI_STORAGE_KEY}${userId}`);
  } catch (error) {
    console.error('Errore nella pulizia abbinamenti visti:', error);
  }
}

// Invalida abbinamenti specifici quando un elemento viene rimosso dalla wishlist
export function rimuoviAbbinamenti(prodottoId, userId) {
  if (!userId || !prodottoId) return;
  
  try {
    // Rimuovi gli abbinamenti dalla cache "visti" SOLO se includono questo prodotto
    const vistiKey = `${VISTI_STORAGE_KEY}${userId}`;
    const abbinamentiVisti = JSON.parse(localStorage.getItem(vistiKey) || '[]');
    
    const abbinamentiVistiAggiornati = abbinamentiVisti.filter(abbinamentoId => {
      if (abbinamentoId.startsWith('abbinamento_wishlist_')) {
        const parts = abbinamentoId.split('_');
        const prodottoIdNellAbbinamento = parts[2];
        return prodottoIdNellAbbinamento !== prodottoId.toString();
      }
      return true; // Mantieni tutti gli altri abbinamenti
    });
    
    localStorage.setItem(vistiKey, JSON.stringify(abbinamentiVistiAggiornati));
    
    // Rimuovi anche le date dalla cache con confronto esatto dell'ID
    const cacheKey = `${DATE_CACHE_KEY}${userId}`;
    const dateCache = JSON.parse(localStorage.getItem(cacheKey) || '{}');
    
    Object.keys(dateCache).forEach(abbinamentoId => {
      if (abbinamentoId.startsWith('abbinamento_wishlist_')) {
        const parts = abbinamentoId.split('_');
        const prodottoIdNellAbbinamento = parts[2];
        if (prodottoIdNellAbbinamento === prodottoId.toString()) {
          delete dateCache[abbinamentoId];
        }
      }
    });
    
    localStorage.setItem(cacheKey, JSON.stringify(dateCache));
  } catch (error) {
    console.error('Errore nell\'invalidare abbinamenti:', error);
  }
}

// Forza il refresh degli abbinamenti (utile per ricalcoli)
export function ricalcolaAbbinamenti() {
  // Emette un evento per far rigenerare gli abbinamenti
  abbinamentiEvents.fresh();
}

// DEBUG: Funzione per resettare tutti i dati degli abbinamenti visti (solo per testing)
export function resetAbbinamentiVisti(userId) {
  if (!userId) return;
  
  try {
    localStorage.removeItem(`${VISTI_STORAGE_KEY}${userId}`);
    localStorage.removeItem(`${DATE_CACHE_KEY}${userId}`);
    localStorage.removeItem('ultimoNumeroAbbinamenti');
  } catch (error) {
    console.error('❌ Errore nel reset:', error);
  }
}

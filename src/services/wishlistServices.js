// gestione wishlist (localStorage FIRST + database sync)
import { calcolaAbbinamenti, rimuoviAbbinamenti, ricalcolaAbbinamenti } from './abbinamentoServices.js';
import { getMieiCapi } from './capiPersonaliServices.js';
import { createUserStorageHelper } from '../utils/storage.js';
import { wishlistEvents } from '../utils/events.js';

const API_BASE = "http://localhost:3001";

// aggiunge prodotto alla wishlist
export const addToWishlist = async (prodotto, userId) => {
  // 1. prima aggiorna localStorage (immediato)
  const localWishlist = getUserWishlistLS(userId);
  const isAlreadyInWishlist = localWishlist.some(item => item.id === prodotto.id);
  
  if (isAlreadyInWishlist) {
    return false; // già presente
  }

  // aggiorna localStorage subito con prodotto base
  const updatedWishlist = [...localWishlist, prodotto];
  salvaWishlistLocale(userId, updatedWishlist);

  // 2. calcolo immediato degli abbinamenti con la nuova wishlist
  try {
    const { getMieiCapi } = await import('./capiPersonaliServices.js');
    const { calcolaAbbinamenti } = await import('./abbinamentoServices.js');
    
    const mieiCapi = getMieiCapi(userId);
    if (mieiCapi.length > 0) {
      // Arricchisci solo il nuovo capo se necessario
      let wishlistCompleta = updatedWishlist;
      if (!prodotto.Colore || !prodotto.Stile) {
        wishlistCompleta = await completaDatiWishlist(updatedWishlist);
      }
      
      // Calcola abbinamenti con la wishlist aggiornata
      calcolaAbbinamenti(mieiCapi, wishlistCompleta, userId);
    }
  } catch (error) {
    console.error('Errore nel calcolo immediato abbinamenti:', error);
  }

  // 3. forza refresh degli abbinamenti per aggiornare l'UI
  ricalcolaAbbinamenti();
  
  // 4. poi sincronizza con database (background) 
  salvaInDatabase(prodotto, userId);
  
  return true; // Aggiunto con successo
};

// rimuove un prodotto dalla wishlist
export const removeFromWishlist = (prodottoId, userId) => {
  // 1. PRIMA aggiorna localStorage (IMMEDIATO)
  const localWishlist = getUserWishlistLS(userId);
  const updatedWishlist = localWishlist.filter(item => item.id !== prodottoId);
  const wasRemoved = updatedWishlist.length !== localWishlist.length;
  
  if (wasRemoved) {
    salvaWishlistLocale(userId, updatedWishlist);
    
    // 2. Invalida gli abbinamenti che includevano questo prodotto
    rimuoviAbbinamenti(prodottoId, userId);
    
    // 3. POI rimuove dal database (BACKGROUND)
    rimuoviDaDB(prodottoId, userId);
    
    // 4. Forza refresh degli abbinamenti (per ricalcolo immediato)
    ricalcolaAbbinamenti();
    
    // 5. controlla abbinamenti aggiornati (BACKGROUND)
    checkAbbinamenti(userId);
  }
  
  return wasRemoved;
};

// controlla se un prodotto è nella wishlist (SEMPRE localStorage)
export const isInWishlist = (prodottoId, userId) => {
  const localWishlist = getUserWishlistLS(userId);
  return localWishlist.some(item => item.id === prodottoId);
};

// ottiene tutta la wishlist (SEMPRE localStorage)
export const getWishlist = (userId) => {
  const userStorage = createUserStorageHelper(userId);
  return userStorage.getWishlist();
};

// carica la wishlist dal database al login (chiamata una volta)
export const loadWishlistFromDatabase = async (userId) => {
  try {
    const userWishlist = await getUserWishlistDB(userId);
    const products = userWishlist.map(item => item.product);
    
    // arricchisce i prodotti con dati completi per gli abbinamenti
    const productsArricchiti = await completaDatiWishlist(products);
    
    // aggiorna localStorage con i dati dal database
    salvaWishlistLocale(userId, productsArricchiti);
    
    return productsArricchiti;
  } catch {
    // ritorna quello che c'è in localStorage
    return getUserWishlistLS(userId);
  }
};

// cancella tutta la wishlist
export const clearWishlist = (userId) => {
  cancellaWishlistLocale(userId);
  // sincronizza anche con database
  svuotaWishlistDatabase(userId);
};

// === FUNZIONI DI SINCRONIZZAZIONE BACKGROUND ===

// sincronizza aggiunta con database (background)
const salvaInDatabase = async (prodotto, userId) => {
  try {
    const wishlistItem = {
      id: Date.now().toString(),
      userId: userId,
      productId: prodotto.id,
      product: prodotto,
      addedAt: new Date().toISOString()
    };

    await fetch(`${API_BASE}/wishlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(wishlistItem)
    });
  } catch {
    // silently ignore sync errors
  }
};

// rimuove dal database (background)
const rimuoviDaDB = async (prodottoId, userId) => {
  try {
    const userWishlist = await getUserWishlistDB(userId);
    const itemToRemove = userWishlist.find(item => item.productId === prodottoId);
    
    if (itemToRemove) {
      await fetch(`${API_BASE}/wishlist/${itemToRemove.id}`, {
        method: 'DELETE'
      });
    }
  } catch {
    // silently ignore
  }
};

// cancella tutto dal database (background)
const svuotaWishlistDatabase = async (userId) => {
  try {
    const userWishlist = await getUserWishlistDB(userId);
    await Promise.all(
      userWishlist.map(item => 
        fetch(`${API_BASE}/wishlist/${item.id}`, { method: 'DELETE' })
      )
    );
  } catch {
    // silently ignore
  }
};

// === HELPER FUNCTIONS ===

// funzione helper per verificare nuovi abbinamenti dopo cambiamenti alla wishlist
const checkAbbinamenti = async (userId) => {
  try {
    // ottiene i capi personali dell'utente
    const mieiCapi = getMieiCapi(userId);
    
    // se non ha capi personali, non ci possono essere abbinamenti
    if (!mieiCapi.length) return;
    
    // ottiene la wishlist attuale
    const wishlistSemplice = getUserWishlistLS(userId);
    
    // arricchisci la wishlist con dati completi per il calcolo degli abbinamenti
    const wishlistCompleta = await completaDatiWishlist(wishlistSemplice);
    
    // calcola gli abbinamenti (questo triggerirà automaticamente la notifica se ci sono nuovi)
    calcolaAbbinamenti(mieiCapi, wishlistCompleta, userId);
    
  } catch {
    // ignore errors
  }
};

// funzione per completare la wishlist con dati completi dal database
const completaDatiWishlist = async (wishlistSemplice) => {
  if (!wishlistSemplice.length) return [];
  
  try {
    // Per ogni prodotto, carica solo quello specifico invece di tutti i vestiti
    const wishlistArricchita = await Promise.all(
      wishlistSemplice.map(async (itemWishlist) => {
        try {
          // Carica solo il vestito specifico
          const response = await fetch(`${API_BASE}/vestiti/${itemWishlist.id}`);
          
          if (response.ok) {
            const vestitoCompleto = await response.json();
            
            // Combina i dati: mantieni i dati base della wishlist, 
            // ma aggiunge le proprietà complete necessarie per l'abbinamento
            return {
              ...itemWishlist,
              "Colore": vestitoCompleto["Colore"],
              "Stile": vestitoCompleto["Stile"],
              "Stagione": vestitoCompleto["Stagione"],
              "Genere": vestitoCompleto["Genere"],
              "Tipo di Capo": vestitoCompleto["Tipo di Capo"],
              "Materiale": vestitoCompleto["Materiale"]
            };
          }
          
          return itemWishlist; // se la fetch fallisce, mantieni originale
        } catch {
          return itemWishlist; // se errore, mantieni originale
        }
      })
    );
    
    return wishlistArricchita;
    
  } catch {
    return wishlistSemplice; // Fallback alla wishlist originale
  }
};

// Esporta per l'uso in altri moduli
export { completaDatiWishlist };

// Database helpers
const getUserWishlistDB = async (userId) => {
  const response = await fetch(`${API_BASE}/wishlist?userId=${userId}`);
  if (!response.ok) throw new Error('Errore caricando wishlist');
  return response.json();
};

// localStorage helpers (cache)
const getUserWishlistLS = (userId) => {
  const wishlistKey = `wishlist_${userId}`;
  return JSON.parse(localStorage.getItem(wishlistKey) || '[]');
};

const salvaWishlistLocale = (userId, wishlist) => {
  const wishlistKey = `wishlist_${userId}`;
  localStorage.setItem(wishlistKey, JSON.stringify(wishlist));
  
  // Triggerare evento per aggiornare le UI components
  wishlistEvents.updated(userId, wishlist);
};

const cancellaWishlistLocale = (userId) => {
  const wishlistKey = `wishlist_${userId}`;
  localStorage.removeItem(wishlistKey);
};

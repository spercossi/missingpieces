// Servizio per gestire le marche e i loro siti web
import { API_BASE_URL } from '../utils/constants';

/**
 * Genera dinamicamente il dizionario SITI_MARCHE basato sui dati nel database
 * @returns {Object} Dizionario con marca -> URL ufficiale
 */
export const generateSitiMarche = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/vestiti`);
    if (!response.ok) {
      throw new Error('Errore nel caricamento dei dati');
    }
    
    const vestiti = await response.json();
    
    // Estrai tutte le marche uniche
    const marcheUniche = [...new Set(vestiti.map(capo => capo.Marca).filter(Boolean))];
    
    // Dizionario con i siti web ufficiali delle marche
    // Questo può essere espanso o caricato da un file di configurazione
    const sitiUfficiali = {
     
      'Balenciaga': 'https://www.balenciaga.com',
      'Chanel': 'https://www.chanel.com',
      'Louis Vuitton': 'https://www.louisvuitton.com',
      'Yves Saint Laurent': 'https://www.ysl.com',
      'Givenchy': 'https://www.givenchy.com',
      'Valentino': 'https://www.valentino.com',
      'Burberry': 'https://www.burberry.com',
      'Prada': 'https://www.prada.com',
      'Gucci': 'https://www.gucci.com',
      'Celine': 'https://www.celine.com',
      'Loewe': 'https://www.loewe.com',
      'Kenzo': 'https://www.kenzo.com',
      'Comme des Garçons': 'https://www.comme-des-garcons.com',
      'Salvatore Ferragamo': 'https://www.ferragamo.com',
      'Max Mara': 'https://www.maxmara.com',
      'Ralph Lauren': 'https://www.ralphlauren.com',
      'Calvin Klein': 'https://www.calvinklein.com',
      'Tommy Jeans': 'https://www.tommy.com',
      'Harmont & Blaine': 'https://www.harmontblaine.com',
      'Imperial': 'https://www.imperialfashion.com',
      'G-Star Raw': 'https://www.g-star.com',
      'Scotch & Soda': 'https://www.scotch-soda.com',
      '7 Camicie': 'https://www.7camicie.com',
      'Lacoste': 'https://www.lacoste.com',
      'Nike': 'https://www.nike.com',
      'Adidas': 'https://www.adidas.com',
      'Puma': 'https://www.puma.com',
      'Reebok': 'https://www.reebok.com',
      'Fila': 'https://www.fila.com',
      'Champion': 'https://www.champion.com',
      'Diadora': 'https://www.diadora.com',
      'Geox': 'https://www.geox.com',
      'Zara': 'https://www.zara.com',
      'Uniqlo': 'https://www.uniqlo.com',
      'Benetton': 'https://www.benetton.com',
      'Mango': 'https://www.mango.com',
      'OVS': 'https://www.ovs.it',
      'Primark': 'https://www.primark.com',
      'Desigual': 'https://www.desigual.com',
      'Intimissimi': 'https://www.intimissimi.com',
      'Patagonia': 'https://www.patagonia.com',
      'Carhartt': 'https://www.carhartt.com',
      'Superdry': 'https://www.superdry.com',
      'Dickies': 'https://www.dickies.com'
    };
    
    // Genera il dizionario finale solo con le marche presenti nel database
    const sitiMarche = {};
    marcheUniche.forEach(marca => {
      if (sitiUfficiali[marca]) {
        sitiMarche[marca] = sitiUfficiali[marca];
      } else {
        // Fallback: genera un URL di ricerca Google se il sito non è noto
        const searchQuery = encodeURIComponent(`${marca} official website store`);
        sitiMarche[marca] = `https://www.google.com/search?q=${searchQuery}`;
        console.warn(`Sito non trovato per la marca: ${marca}, usando ricerca Google`);
      }
    });
    
    return sitiMarche;
  } catch (error) {
    console.error('Errore nella generazione del dizionario SITI_MARCHE:', error);
    // Ritorna il dizionario statico come fallback
    return await import('../utils/constants').then(module => module.SITI_MARCHE);
  }
};

/**
 * Ottiene l'URL del sito web per una marca specifica
 * @param {string} marca - Nome della marca
 * @returns {string} URL del sito web della marca
 */
export const getSitoMarca = async (marca) => {
  const sitiMarche = await generateSitiMarche();
  return sitiMarche[marca] || `https://www.google.com/search?q=${encodeURIComponent(marca + ' official website')}`;
};

/**
 * Carica e cache il dizionario SITI_MARCHE per evitare chiamate ripetute
 */
let cachedSitiMarche = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minuti

export const getCachedSitiMarche = async () => {
  const now = Date.now();
  
  if (!cachedSitiMarche || !cacheTimestamp || (now - cacheTimestamp) > CACHE_DURATION) {
    cachedSitiMarche = await generateSitiMarche();
    cacheTimestamp = now;
  }
  
  return cachedSitiMarche;
};

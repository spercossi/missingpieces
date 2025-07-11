/**
 * Utility centralizzata per la gestione di localStorage
 * Fornisce metodi type-safe e con error handling per le operazioni comuni
 */

// Chiavi di storage costanti per evitare typo
export const STORAGE_KEYS = {
  // Wishlist
  WISHLIST: 'wishlist_',
  
  // Capi personali
  CAPI_PERSONALI: 'mieiCapi_',
  
  // Abbinamenti
  ABBINAMENTI_DATE_CACHE: 'abbinamenti_date_cache_',
  ABBINAMENTI_VISTI: 'abbinamenti_visti_',
  OUTFIT_SALVATI: 'outfitSalvati_',
  VALUTAZIONI_ABBINAMENTI: 'valutazioniAbbinamenti',
  ULTIMO_NUMERO_ABBINAMENTI: 'ultimoNumeroAbbinamenti_',
  
  // Immagini
  IMAGE_MAPPINGS: 'imageMappings',
  
  // Auth/User
  USER_DATA: 'userData'
};

/**
 * Legge un valore da localStorage con parsing JSON automatico
 * @param {string} key - Chiave localStorage
 * @param {any} defaultValue - Valore di default se la chiave non esiste
 * @returns {any} Valore parsato o default
 */
export function getStorageItem(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Errore lettura localStorage per chiave "${key}":`, error);
    return defaultValue;
  }
}

/**
 * Scrive un valore in localStorage con stringify JSON automatico
 * @param {string} key - Chiave localStorage
 * @param {any} value - Valore da salvare
 * @returns {boolean} True se salvato con successo
 */
export function setStorageItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Errore scrittura localStorage per chiave "${key}":`, error);
    return false;
  }
}

/**
 * Rimuove un elemento da localStorage
 * @param {string} key - Chiave da rimuovere
 * @returns {boolean} True se rimosso con successo
 */
export function removeStorageItem(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Errore rimozione localStorage per chiave "${key}":`, error);
    return false;
  }
}

/**
 * Ottiene tutte le chiavi localStorage che iniziano con un prefisso
 * @param {string} prefix - Prefisso da cercare
 * @returns {string[]} Array di chiavi trovate
 */
export function getStorageKeysWithPrefix(prefix) {
  try {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        keys.push(key);
      }
    }
    return keys;
  } catch (error) {
    console.error(`Errore ricerca chiavi con prefisso "${prefix}":`, error);
    return [];
  }
}

/**
 * Rimuove tutte le chiavi localStorage che iniziano con un prefisso
 * @param {string} prefix - Prefisso delle chiavi da rimuovere
 * @returns {number} Numero di chiavi rimosse
 */
export function clearStorageByPrefix(prefix) {
  try {
    const keysToRemove = getStorageKeysWithPrefix(prefix);
    keysToRemove.forEach(key => localStorage.removeItem(key));
    return keysToRemove.length;
  } catch (error) {
    console.error(`Errore pulizia localStorage con prefisso "${prefix}":`, error);
    return 0;
  }
}

/**
 * Crea una factory function per operazioni specifiche di un utente
 * @param {string} userId - ID dell'utente
 * @returns {object} Oggetto con metodi per operazioni user-specific
 */
export function createUserStorageHelper(userId) {
  if (!userId) {
    throw new Error('UserId è richiesto per createUserStorageHelper');
  }

  return {
    // Wishlist
    getWishlist: () => getStorageItem(`${STORAGE_KEYS.WISHLIST}${userId}`, []),
    setWishlist: (wishlist) => setStorageItem(`${STORAGE_KEYS.WISHLIST}${userId}`, wishlist),
    clearWishlist: () => removeStorageItem(`${STORAGE_KEYS.WISHLIST}${userId}`),

    // Capi personali
    getCapiPersonali: () => getStorageItem(`${STORAGE_KEYS.CAPI_PERSONALI}${userId}`, []),
    setCapiPersonali: (capi) => setStorageItem(`${STORAGE_KEYS.CAPI_PERSONALI}${userId}`, capi),
    clearCapiPersonali: () => removeStorageItem(`${STORAGE_KEYS.CAPI_PERSONALI}${userId}`),

    // Abbinamenti
    getAbbinamentiVisti: () => getStorageItem(`${STORAGE_KEYS.ABBINAMENTI_VISTI}${userId}`, []),
    setAbbinamentiVisti: (visti) => setStorageItem(`${STORAGE_KEYS.ABBINAMENTI_VISTI}${userId}`, visti),
    clearAbbinamentiVisti: () => removeStorageItem(`${STORAGE_KEYS.ABBINAMENTI_VISTI}${userId}`),

    getAbbinamentoDateCache: () => getStorageItem(`${STORAGE_KEYS.ABBINAMENTI_DATE_CACHE}${userId}`, {}),
    setAbbinamentoDateCache: (cache) => setStorageItem(`${STORAGE_KEYS.ABBINAMENTI_DATE_CACHE}${userId}`, cache),
    clearAbbinamentoDateCache: () => removeStorageItem(`${STORAGE_KEYS.ABBINAMENTI_DATE_CACHE}${userId}`),

    getOutfitSalvati: () => getStorageItem(`${STORAGE_KEYS.OUTFIT_SALVATI}${userId}`, []),
    setOutfitSalvati: (outfit) => setStorageItem(`${STORAGE_KEYS.OUTFIT_SALVATI}${userId}`, outfit),
    clearOutfitSalvati: () => removeStorageItem(`${STORAGE_KEYS.OUTFIT_SALVATI}${userId}`),

    getUltimoNumeroAbbinamenti: () => getStorageItem(`${STORAGE_KEYS.ULTIMO_NUMERO_ABBINAMENTI}${userId}`, 0),
    setUltimoNumeroAbbinamenti: (numero) => setStorageItem(`${STORAGE_KEYS.ULTIMO_NUMERO_ABBINAMENTI}${userId}`, numero),

    // Pulizia completa dei dati utente
    clearAllUserData: () => {
      const removed = clearStorageByPrefix(`${STORAGE_KEYS.WISHLIST}${userId}`) +
                     clearStorageByPrefix(`${STORAGE_KEYS.CAPI_PERSONALI}${userId}`) +
                     clearStorageByPrefix(`${STORAGE_KEYS.ABBINAMENTI_DATE_CACHE}${userId}`) +
                     clearStorageByPrefix(`${STORAGE_KEYS.ABBINAMENTI_VISTI}${userId}`) +
                     clearStorageByPrefix(`${STORAGE_KEYS.OUTFIT_SALVATI}${userId}`) +
                     clearStorageByPrefix(`${STORAGE_KEYS.ULTIMO_NUMERO_ABBINAMENTI}${userId}`);
      return removed;
    }
  };
}

// Helper specifici per operazioni comuni

/**
 * Helper per gestire la cache delle valutazioni abbinamenti
 */
export const valutazioniHelper = {
  get: () => getStorageItem(STORAGE_KEYS.VALUTAZIONI_ABBINAMENTI, {}),
  set: (valutazioni) => setStorageItem(STORAGE_KEYS.VALUTAZIONI_ABBINAMENTI, valutazioni),
  clear: () => removeStorageItem(STORAGE_KEYS.VALUTAZIONI_ABBINAMENTI),
  
  getValutazione: (abbinamentoId) => {
    const valutazioni = valutazioniHelper.get();
    return valutazioni[abbinamentoId] || null;
  },
  
  setValutazione: (abbinamentoId, valutazione) => {
    const valutazioni = valutazioniHelper.get();
    valutazioni[abbinamentoId] = valutazione;
    return valutazioniHelper.set(valutazioni);
  }
};

/**
 * Costanti per eventi personalizzati utilizzati nell'applicazione
 * Centralizza tutti i nomi degli eventi per evitare typo e facilitare la manutenzione
 */

export const EVENTS = {
  // Eventi wishlist
  WISHLIST_UPDATED: 'wishlistUpdated',
  
  // Eventi capi personali
  CAPO_ADDED: 'capoAdded',
  MIEI_CAPI_UPDATED: 'mieiCapiUpdated',
  
  // Eventi abbinamenti
  ABBINAMENTI_FRESH: 'abbinamentiFresh',
  
  // Eventi autenticazione
  USER_LOGGED_IN: 'userLoggedIn',
  USER_LOGGED_OUT: 'userLoggedOut',
  
  // Eventi UI
  TAB_CHANGED: 'tabChanged',
  MODAL_OPENED: 'modalOpened',
  MODAL_CLOSED: 'modalClosed'
};

/**
 * Helper per dispatch di eventi personalizzati
 * @param {string} eventName - Nome dell'evento (usa EVENTS costanti)
 * @param {any} detail - Dati da passare con l'evento
 * @param {Element} target - Elemento target (default: window)
 */
export function dispatchCustomEvent(eventName, detail = null, target = window) {
  try {
    const event = new CustomEvent(eventName, {
      detail,
      bubbles: true,
      cancelable: true
    });
    target.dispatchEvent(event);
    return true;
  } catch (error) {
    console.error(`Errore dispatch evento "${eventName}":`, error);
    return false;
  }
}

/**
 * Helper per aggiungere listener di eventi personalizzati
 * @param {string} eventName - Nome dell'evento
 * @param {Function} handler - Funzione handler
 * @param {Element} target - Elemento target (default: window)
 * @returns {Function} Cleanup function per rimuovere il listener
 */
export function addCustomEventListener(eventName, handler, target = window) {
  try {
    target.addEventListener(eventName, handler);
    
    // Restituisce una cleanup function
    return () => {
      target.removeEventListener(eventName, handler);
    };
  } catch (error) {
    console.error(`Errore aggiunta listener per evento "${eventName}":`, error);
    return () => {}; // Cleanup function vuota in caso di errore
  }
}

/**
 * Hook-like helper per gestire multiple event listeners
 * Utile nei componenti React per gestire cleanup automatico
 * @param {Array<{event: string, handler: Function, target?: Element}>} listeners
 * @returns {Function} Cleanup function per tutti i listeners
 */
export function addMultipleEventListeners(listeners) {
  const cleanupFunctions = [];
  
  listeners.forEach(({ event, handler, target = window }) => {
    try {
      target.addEventListener(event, handler);
      cleanupFunctions.push(() => target.removeEventListener(event, handler));
    } catch (error) {
      console.error(`Errore aggiunta listener per evento "${event}":`, error);
    }
  });
  
  // Restituisce una funzione che pulisce tutti i listeners
  return () => {
    cleanupFunctions.forEach(cleanup => cleanup());
  };
}

// Helper specifici per eventi comuni

/**
 * Dispatcher per eventi wishlist
 */
export const wishlistEvents = {
  updated: (userId, wishlist) => dispatchCustomEvent(EVENTS.WISHLIST_UPDATED, { userId, wishlist }),
};

/**
 * Dispatcher per eventi capi personali
 */
export const capiPersonaliEvents = {
  added: (userId, newCapo) => dispatchCustomEvent(EVENTS.CAPO_ADDED, { userId, newCapo }),
  updated: (userId, capi) => dispatchCustomEvent(EVENTS.MIEI_CAPI_UPDATED, { userId, capi }),
};

/**
 * Dispatcher per eventi abbinamenti
 */
export const abbinamentiEvents = {
  fresh: () => dispatchCustomEvent(EVENTS.ABBINAMENTI_FRESH),
};

/**
 * Dispatcher per eventi autenticazione
 */
export const authEvents = {
  loggedIn: (user) => dispatchCustomEvent(EVENTS.USER_LOGGED_IN, { user }),
  loggedOut: () => dispatchCustomEvent(EVENTS.USER_LOGGED_OUT),
};

/**
 * Helper per creare listeners tipizzati per eventi specifici
 * Facilita l'uso nei componenti React con useEffect
 */
export const createEventListeners = {
  wishlistUpdated: (handler) => addCustomEventListener(EVENTS.WISHLIST_UPDATED, handler),
  capoAdded: (handler) => addCustomEventListener(EVENTS.CAPO_ADDED, handler),
  mieiCapiUpdated: (handler) => addCustomEventListener(EVENTS.MIEI_CAPI_UPDATED, handler),
  abbinamentiFresh: (handler) => addCustomEventListener(EVENTS.ABBINAMENTI_FRESH, handler),
  userLoggedIn: (handler) => addCustomEventListener(EVENTS.USER_LOGGED_IN, handler),
  userLoggedOut: (handler) => addCustomEventListener(EVENTS.USER_LOGGED_OUT, handler),
};

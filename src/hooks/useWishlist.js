import { useState, useEffect, useCallback } from 'react';
import { createUserStorageHelper } from '../utils/storage.js';
import { createEventListeners } from '../utils/events.js';
import { showError } from '../utils/notifications.jsx';

/**
 * Custom hook per gestire la wishlist
 * Centralizza tutta la logica relativa alla lista desideri
 */
export function useWishlist(user) {
  const [listaDesideri, setListaDesideri] = useState([]);

  // Funzione per caricare la wishlist dal localStorage e arricchirla con i dati dal database
  const loadWishlist = useCallback(async () => {
    if (!user) return;
    
    try {
      // Prima carica dai localStorage
      const userStorage = createUserStorageHelper(user.id);
      const localWishlist = userStorage.getWishlist();
      setListaDesideri(localWishlist);
      
      // Arricchimento rimosso per velocità
    } catch (error) {
      console.error("Errore nel caricamento della wishlist:", error);
      showError("Errore nel caricamento della lista desideri");
    }
  }, [user]);

  // Effect per caricare wishlist al mount e quando cambia utente
  useEffect(() => {
    if (user) {
      loadWishlist();
    } else {
      setListaDesideri([]);
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  // Effect per listener eventi wishlist
  useEffect(() => {
    if (!user) return;

    const cleanupWishlistUpdated = createEventListeners.wishlistUpdated((event) => {
      if (event.detail.userId === user.id) {
        setListaDesideri(event.detail.wishlist || []);
        // Non arricchire automaticamente per evitare delay
        // L'arricchimento avverrà solo quando serve per gli abbinamenti
      }
    });

    return cleanupWishlistUpdated;
  }, [user]); // Rimosso loadWishlist dalle dipendenze per evitare loop infinito

  // Funzione per aggiornare la wishlist quando cambiano i dati
  const updateWishlistData = useCallback((newWishlist) => {
    setListaDesideri(newWishlist);
  }, []);

  // Funzione per ricaricare forzatamente la wishlist
  const reloadWishlist = useCallback(() => {
    if (user) {
      loadWishlist();
    }
  }, [user, loadWishlist]);

  // Restituisce stati e funzioni
  return {
    listaDesideri: listaDesideri, // Usa sempre la versione base per velocità
    updateWishlistData,
    reloadWishlist,
    isLoading: false // Potresti aggiungere uno stato di loading se necessario
  };
}

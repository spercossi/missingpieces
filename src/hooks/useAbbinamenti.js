import { useState, useEffect, useCallback } from 'react';
import { createEventListeners } from '../utils/events.js';
import { 
  calcolaAbbinamenti, 
  salvaOutfit, 
  votoAbbinamento,
  marcaAbbinamentiVisti,
  contaNuoviAbbinamenti
} from '../services/abbinamentoServices';
import { showError, showBrandSuccess } from '../utils/notifications.jsx';

/**
 * Custom hook per gestire gli abbinamenti
 * Centralizza tutta la logica relativa agli abbinamenti tra capi
 */
export function useAbbinamenti(user, mieiCapi, listaDesideri, loading) {
  const [abbinamenti, setAbbinamenti] = useState([]);

  // Funzione per generare abbinamenti
  const generateAbbinamenti = useCallback(async () => {
    // Genera abbinamenti se c'è almeno un capo personale
    // Può abbinare: wishlist ↔ capi personali OR capi personali ↔ capi personali
    if (mieiCapi.length > 0) {
      // Arricchisci la lista desideri se necessario
      let listaArricchita = listaDesideri;
      
      if (listaDesideri && listaDesideri.length > 0) {
        const primoCapo = listaDesideri[0];
        if (!primoCapo.Colore || !primoCapo.Stile) {
          // Importa dinamicamente per evitare dipendenze circolari
          const { completaDatiWishlist } = await import('../services/wishlistServices.js');
          listaArricchita = await completaDatiWishlist(listaDesideri);
        }
      }
      
      const nuoviAbbinamenti = calcolaAbbinamenti(mieiCapi, listaArricchita, user?.id);
      setAbbinamenti(nuoviAbbinamenti);
    } else {
      setAbbinamenti([]);
    }
  }, [mieiCapi, listaDesideri, user?.id]);

  // funzione per salvare un outfit
  const handleSalvaOutfit = useCallback((abbinamento, nomeOutfit) => {
    if (!user) return;
    
    const success = salvaOutfit(abbinamento, user.id, nomeOutfit);
    if (success) {
      showBrandSuccess(`Outfit "${nomeOutfit}" salvato con successo! 👔`);
    } else {
      showError("Errore nel salvare l'outfit. Riprova più tardi.");
    }
  }, [user]);

  // Funzione per valutare un abbinamento
  const handleValutaAbbinamento = useCallback((abbinamentoId, valutazione) => {
    if (!user) return;
    
    votoAbbinamento(abbinamentoId, valutazione, user.id);
  }, [user]);

  // Funzione per marcare abbinamenti come visti
  const marcaAbbinamentiComeVisti = useCallback(() => {
    if (!user || abbinamenti.length === 0) return;
    
    marcaAbbinamentiVisti(abbinamenti, user.id);
  }, [user, abbinamenti]);

  // Funzione per contare abbinamenti freschi
  const contaAbbinamentiFreschi = useCallback(() => {
    if (!user || abbinamenti.length === 0) return 0;
    
    return contaNuoviAbbinamenti(abbinamenti, user.id);
  }, [user, abbinamenti]);

  // Effect per generare abbinamenti quando cambiano i capi o la wishlist
  useEffect(() => {
    if (!loading) {
      generateAbbinamenti();
    }
  }, [mieiCapi, listaDesideri, loading]); // eslint-disable-line react-hooks/exhaustive-deps

  // Effect per listener eventi abbinamenti
  useEffect(() => {
    if (!user) return;

    const cleanupAbbinamentiFresh = createEventListeners.abbinamentiFresh(() => {
      if (!loading && user) {
        generateAbbinamenti();
      }
    });

    return cleanupAbbinamentiFresh;
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    abbinamenti,
    generateAbbinamenti,
    handleSalvaOutfit,
    handleValutaAbbinamento,
    marcaAbbinamentiComeVisti,
    contaAbbinamentiFreschi
  };
}

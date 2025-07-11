import { useState, useEffect, useCallback } from 'react';
import { createEventListeners } from '../utils/events.js';
import { 
  getMieiCapi, 
  caricaCapidaDB, 
  rimuoviCapo, 
  aggiornaCapo,
  syncCapoWithDB 
} from '../services/capiPersonaliServices';
import { showError, showBrandSuccess, showConfirm } from '../utils/notifications.jsx';

/**
 * Custom hook per gestire i capi personali dell'utente
 * Centralizza tutta la logica relativa ai capi dell'utente
 */
export function useCapiPersonali(user) {
  const [mieiCapi, setMieiCapi] = useState([]);

  // funzione per caricare i capi dell'utente
  const loadMieiCapi = useCallback(async () => {
    if (!user) return;
    
    try {
      // prima prova a caricare dal localStorage
      const localCapi = getMieiCapi(user.id);
      setMieiCapi(localCapi);
      
      // poi sincronizza con il database
      const dbCapi = await caricaCapidaDB(user.id);
      setMieiCapi(dbCapi);
    } catch (error) {
      console.error('Errore nel caricamento dei capi:', error);
      // Fallback al localStorage
      const localCapi = getMieiCapi(user.id);
      setMieiCapi(localCapi);
    }
  }, [user]);

  // funzione per eliminare un capo
  const handleDeleteCapo = useCallback(async (capoId) => {
    if (!user) return;
    
    showConfirm(
      'Sei sicuro di voler eliminare questo capo dal tuo guardaroba?',
      async () => {
        try {
          // rimuove dal localStorage
          const success = rimuoviCapo(capoId, user.id);
          
          if (success) {
            // Aggiorna la lista locale
            setMieiCapi(prev => prev.filter(capo => capo.id !== capoId));
            
            // sincronizza con il database
            await syncCapoWithDB({ id: capoId }, 'delete');
            
            showBrandSuccess('Capo eliminato con successo! 👔');
          } else {
            throw new Error('Errore nella rimozione locale');
          }
        } catch (error) {
          console.error('Errore:', error);
          showError('Errore nell\'eliminare il capo. Riprova più tardi.');
        }
      }
    );
  }, [user]);

  // Funzione per modificare un capo
  const handleEditCapo = useCallback(async (capoId, updatedData) => {
    if (!user) return false;
    
    try {
      // Aggiorna nel localStorage
      const success = aggiornaCapo(capoId, updatedData, user.id);
      
      if (success) {
        // Aggiorna la lista locale
        setMieiCapi(prev => prev.map(capo => 
          capo.id === capoId ? { ...capo, ...updatedData } : capo
        ));
        
        // sincronizza con il database
        const capoCompleto = { id: capoId, ...updatedData };
        await syncCapoWithDB(capoCompleto, 'update');
        
        showBrandSuccess('capo modificato con successo!');
        return true;
      } else {
        throw new Error('Errore nell\'aggiornamento locale');
      }
    } catch (error) {
      console.error('Errore:', error);
      showError('Errore nel modificare il capo. Riprova più tardi.');
      return false;
    }
  }, [user]);

  // effect per caricare capi al mount/cambio user
  useEffect(() => {
    if (user) {
      loadMieiCapi();
    } else {
      setMieiCapi([]);
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  // Effect per listener eventi capi
  useEffect(() => {
    if (!user) return;

    const cleanupCapoAdded = createEventListeners.capoAdded(() => {
      loadMieiCapi();
    });

    const cleanupMieiCapiUpdated = createEventListeners.mieiCapiUpdated((event) => {
      if (event.detail.userId === user.id) {
        setMieiCapi(event.detail.capi);
      }
    });

    return () => {
      cleanupCapoAdded();
      cleanupMieiCapiUpdated();
    };
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    mieiCapi,
    loadMieiCapi,
    handleDeleteCapo,
    handleEditCapo
  };
}

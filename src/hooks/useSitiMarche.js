import { useState, useEffect } from 'react';
import { getCachedSitiMarche } from '../services/brandServices';

/**
 * Hook per gestire il caricamento dinamico del dizionario SITI_MARCHE
 * @returns {Object} { sitiMarche, loading, error, refreshMarche }
 */
export const useSitiMarche = () => {
  const [sitiMarche, setSitiMarche] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadSitiMarche = async () => {
    try {
      setLoading(true);
      setError(null);
      const siti = await getCachedSitiMarche();
      setSitiMarche(siti);
    } catch (err) {
      console.error('Errore nel caricamento dei siti marche:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSitiMarche();
  }, []);

  const refreshMarche = () => {
    loadSitiMarche();
  };

  return {
    sitiMarche,
    loading,
    error,
    refreshMarche
  };
};

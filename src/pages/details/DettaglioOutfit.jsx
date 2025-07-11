// pagina dettaglio outfit - routing dinamico /outfit/:id
// mostra dettagli completi di un abbinamento salvato

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
// REDUX MIGRATION - sostituito useAuth con Redux hooks
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/slices/authSlice';
import CardProdotto from '../../components/CardProdotto';
import TerracottaButton from '../../components/buttons/TerracottaButton';
import GreyButton from '../../components/buttons/GreyButton';
import { showError, showBrandInfo } from '../../utils/notifications';
import { getOutfitSalvati } from '../../services/abbinamentoServices';

export default function DettaglioOutfit() {
  const { id } = useParams(); // ROUTING DINAMICO - ottiene ID da URL
  const navigate = useNavigate();
  // REDUX HOOK - migrato da Context API
  const user = useSelector(selectUser);
  const [outfit, setOutfit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // carica dettagli outfit
  useEffect(() => {
    const fetchOutfit = async () => {
      try {
        setLoading(true);
        
        if (!user) {
          throw new Error('Devi essere loggato per vedere gli outfit');
        }

        // ottiene outfit salvati e trova quello specifico
        const outfitSalvati = getOutfitSalvati(user.id);
        const outfitTrovato = outfitSalvati.find(o => o.id === id);
        
        if (!outfitTrovato) {
          throw new Error('Outfit non trovato');
        }
        
        setOutfit(outfitTrovato);
        showBrandInfo(`Outfit caricato: ${outfitTrovato.nome}`);
      } catch (err) {
        setError(err.message);
        showError(`Errore caricamento outfit: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOutfit();
    }
  }, [id, user]);

  // Redirect se non loggato
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="text-center bg-white rounded-lg shadow-lg p-8 max-w-md">
          <h2 className="text-2xl font-bold text-[#D27D7D] mb-4">
            Accesso Richiesto
          </h2>
          <p className="text-gray-600 mb-6">
            Devi essere loggato per visualizzare i dettagli degli outfit.
          </p>
          <Link to="/login">
            <TerracottaButton fullWidth>
              Accedi Ora
            </TerracottaButton>
          </Link>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="text-center">
          <div className="text-2xl font-semibold text-[#D27D7D] mb-2">
            Caricamento outfit...
          </div>
          <div className="text-gray-600">Outfit ID: {id}</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !outfit) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="text-center bg-white rounded-lg shadow-lg p-8 max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Outfit Non Trovato
          </h2>
          <p className="text-gray-600 mb-6">
            L'outfit con ID "{id}" non esiste o non è accessibile.
          </p>
          <div className="space-y-3">
            <Link to="/my-wardrobe">
              <TerracottaButton fullWidth>
                Il Mio Guardaroba
              </TerracottaButton>
            </Link>
            <GreyButton 
              fullWidth 
              onClick={() => navigate(-1)}
            >
              Pagina Precedente
            </GreyButton>
          </div>
        </div>
      </div>
    );
  }

  // Calcola statistiche outfit
  const dataCreazione = outfit.dataCreazione ? new Date(outfit.dataCreazione) : new Date();
  const isRecente = (Date.now() - dataCreazione.getTime()) < 7 * 24 * 60 * 60 * 1000; // 7 giorni

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Breadcrumb Navigation */}
        <nav className="mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-[#D27D7D]">Home</Link>
            <span>›</span>
            <Link to="/my-wardrobe" className="hover:text-[#D27D7D]">Il Mio Guardaroba</Link>
            <span>›</span>
            <span className="text-[#D27D7D] font-semibold">{outfit.nome}</span>
          </div>
        </nav>

        {/* Header con titolo e azioni */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-[#1E1E1E] mb-2">
                {outfit.nome}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>Creato: {dataCreazione.toLocaleDateString()}</span>
                {isRecente && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                    Nuovo
                  </span>
                )}
                {outfit.score && (
                  <span className="bg-[#D27D7D] text-white px-2 py-1 rounded-full text-xs font-semibold">
                    Compatibilità: {outfit.score}%
                  </span>
                )}
              </div>
            </div>
            <div className="flex space-x-3">
              <GreyButton onClick={() => navigate(-1)}>
                ← Indietro
              </GreyButton>
              <Link to="/my-wardrobe">
                <TerracottaButton>
                  mio guardaroba
                </TerracottaButton>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Colonna sinistra: Capo Desiderato */}
          {outfit.capoDesiderato && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-[#1E1E1E] mb-4 flex items-center">
                <span className="bg-[#D27D7D] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                  1
                </span>
                capo desiderato
              </h2>
              <CardProdotto 
                prodotto={outfit.capoDesiderato}
                className="border-0 shadow-none"
              />
              <div className="mt-4 p-4 bg-pink-50 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">Dettagli:</h4>
                <dl className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Tipo:</dt>
                    <dd className="text-gray-900">{outfit.capoDesiderato.tipo}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Colore:</dt>
                    <dd className="text-gray-900">{outfit.capoDesiderato.colore}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Stile:</dt>
                    <dd className="text-gray-900">{outfit.capoDesiderato.stile}</dd>
                  </div>
                </dl>
              </div>
            </div>
          )}

          {/* Colonna destra: Mio Capo */}
          {outfit.mioCapo && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-[#1E1E1E] mb-4 flex items-center">
                <span className="bg-[#8B7D7D] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                  2
                </span>
                il mio capo
              </h2>
              <CardProdotto 
                prodotto={outfit.mioCapo}
                className="border-0 shadow-none"
              />
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">Dettagli:</h4>
                <dl className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Tipo:</dt>
                    <dd className="text-gray-900">{outfit.mioCapo.tipo}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Colore:</dt>
                    <dd className="text-gray-900">{outfit.mioCapo.colore}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Stile:</dt>
                    <dd className="text-gray-900">{outfit.mioCapo.stile}</dd>
                  </div>
                </dl>
              </div>
            </div>
          )}
        </div>

        {/* Analisi Compatibilità */}
        {outfit.motivazione && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-[#1E1E1E] mb-4">
              analisi compatibilità
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Motivazione:</h4>
                <p className="text-gray-600 leading-relaxed">
                  {outfit.motivazione}
                </p>
              </div>
              {outfit.score && (
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Score di Compatibilità:</h4>
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-[#D27D7D] to-[#B05858] h-3 rounded-full transition-all duration-300"
                        style={{ width: `${outfit.score}%` }}
                      ></div>
                    </div>
                    <span className="text-2xl font-bold text-[#D27D7D]">
                      {outfit.score}%
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {outfit.score >= 80 ? 'Abbinamento Eccellente!' : 
                     outfit.score >= 60 ? 'Buon Abbinamento' : 
                     'Abbinamento Accettabile'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Azioni Rapide */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <Link to="/create-outfit">
            <TerracottaButton fullWidth>
              crea nuovo outfit
            </TerracottaButton>
          </Link>
          <Link to="/my-wardrobe">
            <GreyButton fullWidth>
              tutti i miei outfit
            </GreyButton>
          </Link>
          <Link to="/catalog">
            <GreyButton fullWidth>
              esplora catalogo
            </GreyButton>
          </Link>
        </div>

        {/* Informazioni aggiuntive */}
        <div className="mt-8 bg-gradient-to-r from-[#D27D7D] to-[#B05858] rounded-lg shadow-lg p-6 text-white">
          <h3 className="text-xl font-semibold mb-4">suggerimenti</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Per migliorare questo outfit:</h4>
              <ul className="space-y-1 opacity-90">
                <li>• Prova accessori coordinati</li>
                <li>• Considera calzature adatte</li>
                <li>• Aggiungi un capospalla se necessario</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Occasioni consigliate:</h4>
              <ul className="space-y-1 opacity-90">
                <li>• Evento casual con amici</li>
                <li>• Uscita giornaliera</li>
                <li>• Aperitivo serale</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// pagina dettaglio prodotto - routing dinamico /prodotto/:id
// mostra informazioni complete di un singolo prodotto con navigazione parametrica

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
// REDUX MIGRATION - sostituito useAuth con Redux hooks
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/slices/authSlice';
import CardProdotto from '../../components/CardProdotto';
import TerracottaButton from '../../components/buttons/TerracottaButton';
import GreyButton from '../../components/buttons/GreyButton';
import { showError, showBrandInfo } from '../../utils/notifications';

export default function DettaglioProdotto() {
  const { id } = useParams(); // ROUTING DINAMICO - ottiene ID da URL
  const navigate = useNavigate();
  // REDUX HOOK - migrato da Context API
  const user = useSelector(selectUser);
  const [prodotto, setProdotto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carica dettagli prodotto tramite API
  useEffect(() => {
    const fetchProdotto = async () => {
      try {
        setLoading(true);
        // API CALL con parametro dinamico dall'URL
        const response = await fetch(`http://localhost:3001/vestiti/${id}`);
        
        if (!response.ok) {
          throw new Error('Prodotto non trovato');
        }
        
        const data = await response.json();
        setProdotto(data);
        
        // Notifica informativa
        showBrandInfo(`Dettagli caricati per: ${data.nome}`);
      } catch (err) {
        setError(err.message);
        showError(`Errore caricamento prodotto: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProdotto();
    }
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="text-center">
          <div className="text-2xl font-semibold text-[#D27D7D] mb-2">
            Caricamento dettagli...
          </div>
          <div className="text-gray-600">Prodotto ID: {id}</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !prodotto) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="text-center bg-white rounded-lg shadow-lg p-8 max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Prodotto Non Trovato
          </h2>
          <p className="text-gray-600 mb-6">
            Il prodotto con ID "{id}" non esiste o non è più disponibile.
          </p>
          <div className="space-y-3">
            <Link to="/catalog">
              <TerracottaButton fullWidth>
                Torna al Catalogo
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

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Breadcrumb Navigation */}
        <nav className="mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-[#D27D7D]">Home</Link>
            <span>›</span>
            <Link to="/catalog" className="hover:text-[#D27D7D]">Catalogo</Link>
            <span>›</span>
            <span className="text-[#D27D7D] font-semibold">{prodotto.nome}</span>
          </div>
        </nav>

        {/* Header con titolo e azioni */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-[#1E1E1E] mb-2">
                {prodotto.nome}
              </h1>
              <p className="text-lg text-[#D27D7D] font-semibold">
                {prodotto.prezzo}€
              </p>
            </div>
            <div className="flex space-x-3">
              <GreyButton onClick={() => navigate(-1)}>
                ← Indietro
              </GreyButton>
              <Link to="/catalog">
                <TerracottaButton>
                  Vedi Catalogo
                </TerracottaButton>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Colonna sinistra: Card Prodotto */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-[#1E1E1E] mb-4">
                Prodotto
              </h2>
              {/* 🔄 RIUSO CardProdotto esistente in modalità dettaglio */}
              <CardProdotto 
                prodotto={prodotto} 
                isDettaglio={true}
                className="border-0 shadow-none"
              />
            </div>
          </div>

          {/* Colonna destra: Informazioni dettagliate */}
          <div className="space-y-6">
            {/* Specifiche tecniche */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-[#1E1E1E] mb-4">
                Specifiche Tecniche
              </h3>
              <dl className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <dt className="font-semibold text-gray-700">Tipo:</dt>
                  <dd className="text-gray-900">{prodotto.tipo}</dd>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <dt className="font-semibold text-gray-700">Colore:</dt>
                  <dd className="text-gray-900">{prodotto.colore}</dd>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <dt className="font-semibold text-gray-700">Stile:</dt>
                  <dd className="text-gray-900">{prodotto.stile}</dd>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <dt className="font-semibold text-gray-700">Materiale:</dt>
                  <dd className="text-gray-900">{prodotto.materiale || 'Non specificato'}</dd>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <dt className="font-semibold text-gray-700">Stagione:</dt>
                  <dd className="text-gray-900">{prodotto.stagione || 'Tutte'}</dd>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <dt className="font-semibold text-gray-700">Taglia:</dt>
                  <dd className="text-gray-900">{prodotto.taglia || 'Unica'}</dd>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <dt className="font-semibold text-gray-700">Genere:</dt>
                  <dd className="text-gray-900">{prodotto.genere || 'Unisex'}</dd>
                </div>
              </dl>
            </div>

            {/* Informazioni commerciali */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-[#1E1E1E] mb-4">
                Informazioni Commerciali
              </h3>
              <dl className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <dt className="font-semibold text-gray-700">Prezzo:</dt>
                  <dd className="text-2xl font-bold text-[#D27D7D]">{prodotto.prezzo}€</dd>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <dt className="font-semibold text-gray-700">Disponibilità:</dt>
                  <dd className={`font-semibold ${prodotto.disponibile ? 'text-green-600' : 'text-red-600'}`}>
                    {prodotto.disponibile ? 'Disponibile' : 'Non Disponibile'}
                  </dd>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <dt className="font-semibold text-gray-700">Negozio:</dt>
                  <dd>
                    <a 
                      href={prodotto.negozio || '#'} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#D27D7D] hover:underline"
                    >
                      Visita Negozio
                    </a>
                  </dd>
                </div>
              </dl>
            </div>

            {/* Azioni utente (se loggato) */}
            {user && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold text-[#1E1E1E] mb-4">
                  Azioni Rapide
                </h3>
                <div className="space-y-3">
                  <Link to="/create-outfit">
                    <TerracottaButton fullWidth>
                      Crea Outfit con questo capo
                    </TerracottaButton>
                  </Link>
                  <Link to="/my-wardrobe">
                    <GreyButton fullWidth>
                      vedi il mio guardaroba
                    </GreyButton>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Link correlati */}
        <div className="mt-8 text-center">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-[#1E1E1E] mb-4">
              Esplora Altri Prodotti
            </h3>
            <div className="flex justify-center space-x-4">
              <Link to="/catalog">
                <TerracottaButton>
                  📱 Catalogo Completo
                </TerracottaButton>
              </Link>
              {user && (
                <Link to="/my-wardrobe">
                  <GreyButton>
                    Il Mio Guardaroba
                  </GreyButton>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
// REDUX MIGRATION - sostituito useAuth con Redux hooks
import { useSelector } from 'react-redux';
import { selectUser, selectIsAuthenticated } from '../store/slices/authSlice';
import CardProdotto from "../components/CardProdotto";
import CardCapoPersonale from "../components/CardCapoPersonale";
import AbbinamentoCard from "../components/AbbinamentoCard";
import TerracottaButton from "../components/buttons/TerracottaButton";
import GreyButton from "../components/buttons/GreyButton";
import { Link } from "react-router-dom";

// custom hooks
import { useWishlist } from "../hooks/useWishlist";
import { useCapiPersonali } from "../hooks/useCapiPersonali";
import { useAbbinamenti } from "../hooks/useAbbinamenti";

// DEBUG IMPORT per testing
import { resetAbbinamentiVisti } from "../services/abbinamentoServices";

export default function IlMioGuardaroba() {
  // REDUX HOOKS - migrato da Context API
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [activeTab, setActiveTab] = useState("capi"); // "capi", "desideri", "abbinamenti"
  const [loading, setLoading] = useState(true);

  // Custom hooks per gestire la logica separata
  const { 
    listaDesideri
  } = useWishlist(user);
  
  const { 
    mieiCapi, 
    handleDeleteCapo, 
    handleEditCapo 
  } = useCapiPersonali(user);
  
  const { 
    abbinamenti, 
    generateAbbinamenti,
    handleSalvaOutfit, 
    handleValutaAbbinamento, 
    marcaAbbinamentiComeVisti,
    contaAbbinamentiFreschi 
  } = useAbbinamenti(user, mieiCapi, listaDesideri, loading);

  // Effect per gestire il loading iniziale
  useEffect(() => {
    if (user) {
      // Caricamento immediato
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [user]);

  // DEBUG: Esponi funzione globale per testing
  useEffect(() => {
    if (user && typeof window !== 'undefined') {
      window.debugResetAbbinamenti = () => {
        resetAbbinamentiVisti(user.id);
        generateAbbinamenti(); // Rigenera abbinamenti
      };
    }
  }, [user, generateAbbinamenti]);

  // Effect per marcare come visti quando si lascia la pagina o si cambia tab
  useEffect(() => {
    return () => {
      // Cleanup: marca come visti solo quando l'utente lascia la pagina
      if (activeTab === "abbinamenti" && abbinamenti.length > 0 && user) {
        marcaAbbinamentiComeVisti();
      }
    };
  }, [activeTab, abbinamenti.length, user, marcaAbbinamentiComeVisti]);

  // Effect per marcare abbinamenti come visti quando vengono visualizzati nella tab abbinamenti
  // Rimosso per evitare cicli infiniti - ora gestito nel click del button

  if (!isAuthenticated) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Il Mio Guardaroba</h2>
        <p className="text-lg text-[#666] mb-6">
          Effettua il login per accedere al tuo guardaroba personale
        </p>
        <Link to="/login" aria-label="Vai alla pagina di login">
          <TerracottaButton>Accedi</TerracottaButton>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-[#1E1E1E] mb-6">
        Il Mio Guardaroba
      </h1>

      {/* Tab Navigation */}
      <div className="flex mb-8 border-b border-[#E5E5E5]">
        <button
          onClick={() => {
            // Se stiamo lasciando la tab abbinamenti, marca come visti
            if (activeTab === "abbinamenti" && abbinamenti.length > 0 && user) {
              marcaAbbinamentiComeVisti();
            }
            setActiveTab("capi");
          }}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === "capi"
              ? "text-[#C4A574] border-b-2 border-[#C4A574]"
              : "text-[#666] hover:text-[#1E1E1E]"
          }`}
          aria-label="Visualizza i miei capi"
        >
          I Miei Capi ({mieiCapi.length})
        </button>
        <button
          onClick={() => {
            // Se stiamo lasciando la tab abbinamenti, marca come visti
            if (activeTab === "abbinamenti" && abbinamenti.length > 0 && user) {
              marcaAbbinamentiComeVisti();
            }
            setActiveTab("desideri");
          }}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === "desideri"
              ? "text-[#C4A574] border-b-2 border-[#C4A574]"
              : "text-[#666] hover:text-[#1E1E1E]"
          }`}
          aria-label="Visualizza lista desideri"
        >
          Lista Desideri ({listaDesideri.length})
        </button>
        <button
          onClick={() => {
            setActiveTab("abbinamenti");
            // NON marcare più come visti al click - lasciamo che rimangano "new"
          }}
          className={`px-6 py-3 font-medium transition-all duration-300 rounded-t-lg ${
            activeTab === "abbinamenti"
              ? abbinamenti.length > 0 
                  ? "text-white bg-gradient-to-r from-[#D27D7D] to-[#C4A574] border-b-2 border-[#C4A574] shadow-lg" 
                  : "text-[#C4A574] border-b-2 border-[#C4A574]"
              : abbinamenti.length > 0 
                ? "text-[#1E1E1E] bg-gradient-to-r from-[#F3E7E4] to-[#F8D9C6] hover:from-[#F8D9C6] hover:to-[#F3E7E4] shadow-md font-semibold" 
                : "text-[#666] hover:text-[#1E1E1E]"
          }`}
          aria-label="Visualizza abbinamenti suggeriti"
        >
          abbinamenti suggeriti ({abbinamenti.length})
          {/* Mostra numero di abbinamenti nuovi */}
          {user && abbinamenti.length > 0 && contaAbbinamentiFreschi() > 0 && (
            <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
              {contaAbbinamentiFreschi()}
            </span>
          )}
        </button>
      </div>

      {/* Content Area */}
      {activeTab === "capi" && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-[#1E1E1E]">I Miei Capi</h2>
            <Link to="/crea-outfit" aria-label="Aggiungi nuovo capo al guardaroba">
              <TerracottaButton size="sm">Aggiungi Nuovo Capo</TerracottaButton>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-lg text-[#666]">Caricamento...</p>
            </div>
          ) : mieiCapi.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {mieiCapi.map((capo) => (
                <CardCapoPersonale 
                  key={capo.id} 
                  capo={capo} 
                  onEdit={handleEditCapo}
                  onDelete={handleDeleteCapo}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-[#666] mb-4">
                Non hai ancora aggiunto nessun capo al tuo guardaroba
              </p>
              <Link to="/crea-outfit">
                <TerracottaButton>Crea il tuo primo outfit</TerracottaButton>
              </Link>
            </div>
          )}
        </div>
      )}

      {activeTab === "desideri" && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-[#1E1E1E]">Lista Desideri</h2>
            <Link to="/catalogo">
              <GreyButton size="sm">Esplora Catalogo</GreyButton>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-lg text-[#666]">Caricamento...</p>
            </div>
          ) : listaDesideri.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {listaDesideri.map((capo) => (
                <CardProdotto key={capo.id} prodotto={capo} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-[#666] mb-4">
                non hai ancora aggiunto nessun capo alla lista desideri
              </p>
              <p className="text-[#666] mb-6">
                Metti "Mi piace" ai capi del catalogo per aggiungerli qui
              </p>
              <Link to="/catalogo">
                <GreyButton>Vai al Catalogo</GreyButton>
              </Link>
            </div>
          )}
        </div>
      )}

      {activeTab === "abbinamenti" && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-[#1E1E1E]">Abbinamenti Suggeriti</h2>
            <div className="flex gap-2">
              <button
                onClick={generateAbbinamenti}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition"
              >
                🔄 Rigenera
              </button>
              <Link to="/catalogo">
                <GreyButton size="sm">Trova più capi</GreyButton>
              </Link>
            </div>
          </div>

          {loading && (
            <div className="text-center py-12">
              <p className="text-lg text-[#666]">Caricamento...</p>
            </div>
          )}

          {!loading && abbinamenti.length > 0 && (
            <>
              {/* Statistiche rapide */}
              <div className="bg-gradient-to-r from-[#C4A574] to-[#D27D7D] text-white rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">I tuoi abbinamenti</h3>
                    <p className="text-sm opacity-90">
                      {(() => {
                        const wishlistPersonali = abbinamenti.filter(a => a.fonte === "wishlist_personali");
                        const personaliPersonali = abbinamenti.filter(a => a.fonte === "personali_personali");
                        
                        if (wishlistPersonali.length > 0 && personaliPersonali.length > 0) {
                          return `${wishlistPersonali.length} abbinament${wishlistPersonali.length === 1 ? 'o' : 'i'} con la wishlist e ${personaliPersonali.length} tra i tuoi capi!`;
                        } else if (wishlistPersonali.length > 0) {
                          return `${wishlistPersonali.length} abbinament${wishlistPersonali.length === 1 ? 'o' : 'i'} perfett${wishlistPersonali.length === 1 ? 'o' : 'i'} con la wishlist!`;
                        } else if (personaliPersonali.length > 0) {
                          return `${personaliPersonali.length} abbinament${personaliPersonali.length === 1 ? 'o' : 'i'} perfett${personaliPersonali.length === 1 ? 'o' : 'i'} tra i tuoi capi!`;
                        } else {
                          return `Abbiamo trovato ${abbinamenti.length} abbinament${abbinamenti.length === 1 ? 'o' : 'i'} perfett${abbinamenti.length === 1 ? 'o' : 'i'} per te!`;
                        }
                      })()}
                    </p>
                  </div>
                  <div className="text-3xl"></div>
                </div>
              </div>

              {/* Griglia abbinamenti */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {abbinamenti.map((abbinamento) => (
                  <AbbinamentoCard 
                    key={abbinamento.id} 
                    abbinamento={abbinamento} 
                    onSalvaOutfit={handleSalvaOutfit}
                    onValutazione={handleValutaAbbinamento}
                  />
                ))}
              </div>
            </>
          )}

          {!loading && mieiCapi.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👔</div>
              <p className="text-lg text-[#666] mb-4">
                Non hai ancora capi nel tuo guardaroba
              </p>
              <p className="text-[#666] mb-6">
                Aggiungi alcuni capi per vedere gli abbinamenti suggeriti
              </p>
              <Link to="/crea-outfit">
                <TerracottaButton>Aggiungi il primo capo</TerracottaButton>
              </Link>
            </div>
          )}

          {!loading && mieiCapi.length > 0 && abbinamenti.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🤔</div>
              <p className="text-lg text-[#666] mb-4">
                Non abbiamo trovato abbinamenti compatibili
              </p>
              <p className="text-[#666] mb-6">
                prova ad aggiungere più capi alla lista desideri o al guardaroba.
                I nostri algoritmi cercano abbinamenti basati sui colori e gli stili.
              </p>
              <div className="flex gap-4 justify-center">
                <Link to="/catalogo">
                  <GreyButton>Esplora catalogo</GreyButton>
                </Link>
                <Link to="/crea-outfit">
                  <TerracottaButton>Aggiungi capo</TerracottaButton>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

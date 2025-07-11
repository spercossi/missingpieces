import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TerracottaButton from "../components/buttons/TerracottaButton";
import BlackButton from "../components/buttons/BlackButton";
import GreyButton from "../components/buttons/GreyButton";
import AdminModal from "../components/admin/AdminModal";
import CapiTable from "../components/admin/CapiTable";
import UtentiTable from "../components/admin/UtentiTable";
import AddCapoForm from "../components/admin/AddCapoForm";
import { showBrandSuccess, showError, showInfo } from "../utils/notifications";
import {
  caricaDatiCompleti,
  aggiungiNuovoCapo,
  modificaCapoEsistente,
  eliminaCapo,
  eliminaUtenteCompleto,
  resetPasswordUtente as resetPasswordService,
} from "../services/adminServices";

const TABS_CONFIG = [
  { id: "capi", label: "Gestione Capi" },
  { id: "utenti", label: "Gestione Utenti" }
];

// helper per stili tab button
const getTabButtonStyle = (isActive) => {
  return `px-6 py-2 rounded-md font-medium transition-all ${
    isActive
      ? "bg-[#D27D7D] text-white"
      : "text-gray-600 hover:text-[#D27D7D]"
  }`;
};

export default function Sviluppatori() {
  const [loading, setLoading] = useState(false);
  const [capi, setCapi] = useState([]);
  const [utenti, setUtenti] = useState([]);
  const [activeTab, setActiveTab] = useState("capi");
  const [showAddForm, setShowAddForm] = useState(false);

  // gestione click importa CSV - funzionalità in sviluppo
  const handleImportCSV = () => {
    showInfo("La funzionalità è ancora in sviluppo :)");
  };

  // carica dati automaticamente al mount
  useEffect(() => {
    caricaDati();
  }, []);

  // carica dati iniziali
  const caricaDati = async () => {
    setLoading(true);
    try {
      const { capiData, utentiData } = await caricaDatiCompleti();
      setCapi(capiData);
      setUtenti(utentiData);
      showBrandSuccess(
        `Caricati ${capiData.length} capi e ${utentiData.length} utenti`
      );
    } catch {
      showError("Errore nel caricamento dati");
    } finally {
      setLoading(false);
    }
  };

  // GESTIONE CAPI
  const rimuoviCapo = async (id) => {
    try {
      await eliminaCapo(id);
      setCapi((prev) => prev.filter((capo) => capo.id !== id));
    } catch {
      showError("Errore di connessione");
    }
  };

  const modificaCapo = async (capo) => {
    try {
      await modificaCapoEsistente(capo);
      setCapi((prev) => prev.map((c) => (c.id === capo.id ? capo : c)));
    } catch {
      showError("Errore di connessione");
    }
  };

  const aggiungiCapo = async (formData) => {
    setLoading(true);
    try {
      const capoCreato = await aggiungiNuovoCapo(formData);
      setCapi((prev) => [...prev, capoCreato]);
      setShowAddForm(false);
    } catch (error) {
      showError(error.message || "Errore di connessione");
    } finally {
      setLoading(false);
    }
  };

  // GESTIONE UTENTI
  const eliminaUtente = async (id) => {
    try {
      await eliminaUtenteCompleto(id);
      setUtenti((prev) => prev.filter((utente) => utente.id !== id));
    } catch {
      showError("Errore di connessione");
    }
  };

  const resetPassword = async (utente) => {
    try {
      const utenteAggiornato = await resetPasswordService(utente);
      setUtenti((prev) =>
        prev.map((u) => (u.id === utente.id ? utenteAggiornato : u))
      );
    } catch {
      showError("Errore di connessione");
    }
  };

  // funzione per scaricare un template CSV
  const scaricaTemplateCSV = () => {
    showInfo("La funzionalità è ancora in sviluppo :)");
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Admin Panel</h1>

          {/* Carica Dati Button */}
          <div className="mb-8">
            <GreyButton
              onClick={caricaDati}
            >
            Aggiorna Dati
            </GreyButton>
          </div>
        </div>

        {/* Tab Navigation */}
        {(capi.length > 0 || utenti.length > 0) && (
          <>
            <div className="flex justify-center mb-8">
              <div className="bg-white rounded-lg shadow-md p-2 flex">
                {TABS_CONFIG.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={getTabButtonStyle(activeTab === tab.id)}
                  >
                    {tab.label} ({tab.id === "capi" ? capi.length : utenti.length})
                  </button>
                ))}
              </div>
            </div>

            {/* SEZIONE CAPI */}
            {activeTab === "capi" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Catalogo Capi
                  </h2>
                  <div className="flex gap-3">
                    <GreyButton
                      onClick={scaricaTemplateCSV}
                      title="Scarica template CSV di esempio"
                    >
                      Template CSV
                    </GreyButton>
                    <BlackButton
                      onClick={handleImportCSV}
                      disabled={loading}
                      title="Importa capi da file CSV (in sviluppo)"
                    >
                      Importa CSV
                    </BlackButton>
                    <TerracottaButton
                      onClick={() => setShowAddForm(true)}
                      disabled={loading}
                    >
                      Aggiungi Capo
                    </TerracottaButton>
                  </div>
                </div>

                <CapiTable 
                  capi={capi} 
                  onModifica={modificaCapo} 
                  onRimuovi={rimuoviCapo} 
                />
              </div>
            )}

            {/* SEZIONE UTENTI */}
            {activeTab === "utenti" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Gestione Utenti
                </h2>

                <UtentiTable 
                  utenti={utenti} 
                  onResetPassword={resetPassword} 
                  onElimina={eliminaUtente} 
                />
              </div>
            )}
          </>
        )}

        {/* MODAL AGGIUNGI CAPO */}
        <AdminModal
          isOpen={showAddForm}
          onClose={() => setShowAddForm(false)}
          title="Aggiungi Nuovo Capo"
        >
          <AddCapoForm 
            onSubmit={aggiungiCapo} 
            onCancel={() => setShowAddForm(false)} 
            loading={loading} 
          />
        </AdminModal>

        <div className="text-center mt-8">
          <Link to="/">
            <BlackButton>Torna alla Home</BlackButton>
          </Link>
        </div>
      </div>
    </section>
  );
}

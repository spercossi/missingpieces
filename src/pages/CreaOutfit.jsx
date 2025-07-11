import React, { useRef, useState } from "react";
// REDUX MIGRATION - sostituito useAuth con Redux hooks
import { useSelector } from 'react-redux';
import { selectUser } from '../store/slices/authSlice';
import TerracottaButton from "../components/buttons/TerracottaButton";
import GreyButton from "../components/buttons/GreyButton";
import { salvaImmagine } from "../services/imageServices";
import { aggiungiCapo, syncCapoWithDB } from "../services/capiPersonaliServices";
import { AVAILABLE_COLORS, getCategoriaColore } from "../services/colorServices";
import { showBrandSuccess, showError, showWarning, showLoading, dismissLoading } from "../utils/notifications";
import { Link } from "react-router-dom";
import { STILI_DISPONIBILI, TIPI_CAPO_DISPONIBILI, MATERIALI_DISPONIBILI, STAGIONI_DISPONIBILI, GENERI_DISPONIBILI } from "../utils/constants";

export default function CreaOutfit() {
  // REDUX HOOK - migrato da Context API
  const user = useSelector(selectUser);
  const fileInputRef = useRef(null);
  const [step, setStep] = useState(1); // 1: upload foto, 2: compila form
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Dati del form
  const [formData, setFormData] = useState({
    tipoCapo: '',
    colore: '',
    stile: '',
    materiale: '',
    stagione: '',
    genere: ''
  });

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // crea preview dell'immagine
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
        setStep(2); // Passa al form
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageSave = async (file) => {
    // usa il servizio per salvare l'immagine
    try {
      return await salvaImmagine(file, user.id);
    } catch (error) {
      console.error('Errore nel salvataggio immagine:', error);
      // Fallback al metodo precedente
      const timestamp = Date.now();
      const extension = file.name.split('.').pop() || 'jpg';
      return `/user_uploads/${user.id}_${timestamp}.${extension}`;
    }
  };

  const generateImagePath = () => {
    // Fallback se non c'è file selezionato
    const timestamp = Date.now();
    const userId = user?.id || 'user';
    return `/user_uploads/${userId}_${timestamp}.jpg`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      showWarning("Devi essere loggato per aggiungere un capo!");
      return;
    }

    setLoading(true);
    const loadingToastId = showLoading("Salvando il capo nel guardaroba...");

    try {
      // determina il percorso dell'immagine e la salva
      const imagePath = selectedFile ? await handleImageSave(selectedFile) : generateImagePath();
      
      // Prepara i dati del nuovo capo
      const newCapo = {
        id: `user_${user.id}_${Date.now()}`,
        userId: user.id,
        "Tipo di Capo": formData.tipoCapo,
        "Image": imagePath,
        "Colore": formData.colore,
        "Stile": formData.stile,
        "Materiale": formData.materiale,
        "Stagione": formData.stagione,
        "Genere": formData.genere,
        "Data inserimento": new Date().toLocaleDateString(),
        "Disponibilità": true
      };

      // salva nel localStorage
      const localSuccess = aggiungiCapo(newCapo, user.id);
      
      if (localSuccess) {
        // sincronizza con il database
        await syncCapoWithDB(newCapo, 'add');
        
        dismissLoading(loadingToastId);
        showBrandSuccess('Capo aggiunto con successo al tuo guardaroba!');
        
        // Emetti evento per aggiornare il guardaroba
        window.dispatchEvent(new CustomEvent('capoAdded'));
        
        // Reset del form
        setStep(1);
        setImagePreview(null);
        setSelectedFile(null);
        setFormData({
          tipoCapo: '',
          colore: '',
          stile: '',
          materiale: '',
          stagione: '',
          genere: ''
        });
      } else {
        throw new Error('Errore nel salvataggio locale');
      }
    } catch (error) {
      console.error('Errore completo:', error);
      dismissLoading(loadingToastId);
      showError(`Errore nel salvare il capo: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    setStep(1);
    setImagePreview(null);
    setSelectedFile(null);
  };

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-4xl font-bold mb-4 text-[#1E1E1E]">Accesso Richiesto</h1>
        <p className="text-lg text-[#666] mb-6">
          Devi essere loggato per aggiungere capi al tuo guardaroba.
        </p>
        <Link to="/login">
        <TerracottaButton>
          Vai al Login
        </TerracottaButton>
        </Link>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#FAFAFA] px-4">
        <h1 className="text-4xl font-bold mb-4 text-[#1E1E1E]">Aggiungi un Capo</h1>
        <p className="text-lg text-[#666] mb-8 text-center max-w-xl">
          Carica una foto del tuo capo e aggiungilo al tuo guardaroba digitale!
        </p>
        
        <button
          onClick={handleButtonClick}
          className="bg-[#D27D7D] hover:bg-[#C4A574] text-white font-semibold px-8 py-4 rounded-lg shadow transition mb-4 flex items-center gap-3"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12" />
          </svg>
          Carica Foto
        </button>
        
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
        
        <span className="text-sm text-[#999]">Formato accettato: JPG, PNG, WEBP</span>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="min-h-[70vh] bg-[#FAFAFA] px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-[#1E1E1E] text-center">Completa le informazioni</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Preview immagine */}
            <div className="flex flex-col items-center">
              <h3 className="text-xl font-semibold mb-4">Anteprima</h3>
              <div className="w-64 h-64 bg-white rounded-lg shadow-lg overflow-hidden">
                <img 
                  src={imagePreview} 
                  alt="Preview capo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <button 
                onClick={handleGoBack}
                className="mt-4 text-[#666] hover:text-[#1E1E1E] underline"
              >
                Cambia foto
              </button>
            </div>

            {/* Form */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#1E1E1E] mb-2">
                    Tipo di Capo *
                  </label>
                  <select
                    name="tipoCapo"
                    value={formData.tipoCapo}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D27D7D]"
                  >
                    <option value="">Seleziona...</option>
                    {TIPI_CAPO_DISPONIBILI.map((tipo) => (
                      <option key={tipo} value={tipo}>
                        {tipo}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1E1E1E] mb-2">
                    Colore *
                  </label>
                  <select
                    name="colore"
                    value={formData.colore}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D27D7D]"
                  >
                    <option value="">Seleziona colore...</option>
                    {AVAILABLE_COLORS.map((colore) => (
                      <option key={colore} value={colore}>
                        {colore} ({getCategoriaColore(colore)})
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-[#666] mt-1">
                    Seleziona da colori standardizzati per abbinamenti ottimali
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1E1E1E] mb-2">
                    Stile *
                  </label>
                  <select
                    name="stile"
                    value={formData.stile}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D27D7D]"
                  >
                    <option value="">Seleziona...</option>
                    {STILI_DISPONIBILI.map((stile) => (
                      <option key={stile} value={stile}>
                        {stile}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1E1E1E] mb-2">
                    Materiale *
                  </label>
                  <select
                    name="materiale"
                    value={formData.materiale}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D27D7D]"
                  >
                    <option value="">Seleziona...</option>
                    {MATERIALI_DISPONIBILI.map((materiale) => (
                      <option key={materiale} value={materiale}>
                        {materiale}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1E1E1E] mb-2">
                    Stagione *
                  </label>
                  <select
                    name="stagione"
                    value={formData.stagione}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D27D7D]"
                  >
                    <option value="">Seleziona...</option>
                    {STAGIONI_DISPONIBILI.map((stagione) => (
                      <option key={stagione} value={stagione}>
                        {stagione}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1E1E1E] mb-2">
                    Genere *
                  </label>
                  <select
                    name="genere"
                    value={formData.genere}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D27D7D]"
                  >
                    <option value="">Seleziona...</option>
                    {GENERI_DISPONIBILI.map((genere) => (
                      <option key={genere} value={genere}>
                        {genere === "Male" ? "Uomo" : genere === "Female" ? "Donna" : genere}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-4 pt-4">
                  <GreyButton type="button" onClick={handleGoBack}>
                    Indietro
                  </GreyButton>
                  <TerracottaButton type="submit" disabled={loading}>
                    {loading ? 'Salvando...' : 'Aggiungi al Guardaroba'}
                  </TerracottaButton>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
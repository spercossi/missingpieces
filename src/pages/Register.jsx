import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { showLoading, dismissLoading, showError, showBrandSuccess } from '../utils/notifications';

export default function Register() {
  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [conferma, setConferma] = useState("");
  const [errore, setErrore] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrore("");
    setLoading(true);
    
    if (!nome || !cognome || !email || !password || !conferma) {
      showError("Tutti i campi sono obbligatori");
      setLoading(false);
      return;
    }
    if (password !== conferma) {
      showError("Le password non coincidono");
      setLoading(false);
      return;
    }
    
    const loadingToastId = showLoading("Creazione account in corso...");
    
    try {
      await registerUser({ nome: nome, cognome: cognome, username: email, password, role: "user" });
      localStorage.setItem("user", JSON.stringify({ email }));
      dismissLoading(loadingToastId);
      showBrandSuccess("Account creato con successo! Benvenuto!");
      setSuccess(true); // Mostra il banner
    } catch (err) {
      console.error(err);
      dismissLoading(loadingToastId);
      showError("Errore nella registrazione. Riprova più tardi.");
    } finally {
      setLoading(false);
    }
  };

  async function registerUser(userData) {
    const response = await fetch('http://localhost:3001/utenti', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    if (!response.ok) throw new Error('Errore nella registrazione');
    return await response.json();
  }

  // Gestione chiusura banner
  const handleBannerClose = () => {
    setSuccess(false);
    navigate("/login");
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#FAFAFA] px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-[#D27D7D] text-center">Registrati</h1>
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 flex justify-between items-center" role="status" aria-live="polite">
            <span>Utente registrato correttamente!</span>
            <button
              onClick={handleBannerClose}
              className="ml-4 text-green-700 font-bold px-2 py-1 rounded hover:bg-green-200"
              aria-label="Chiudi banner di successo"
            >
              Chiudi
            </button>
          </div>
        )}
        {!success && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4" aria-label="Form di registrazione">
            <label className="font-medium text-[#1E1E1E]">
              Nome
              <input
                type="text"
                className="mt-1 w-full border rounded px-3 py-2"
                value={nome}
                onChange={e => setNome(e.target.value)}
                required
                aria-label="Nome"
              />
            </label>
            <label className="font-medium text-[#1E1E1E]">
              Cognome
              <input
                type="text"
                className="mt-1 w-full border rounded px-3 py-2"
                value={cognome}
                onChange={e => setCognome(e.target.value)}
                required
                aria-label="Cognome"
              />
            </label>
            <label className="font-medium text-[#1E1E1E]">
              Email
              <input
                type="email"
                className="mt-1 w-full border rounded px-3 py-2"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoFocus
                aria-label="Email"
              />
            </label>
            <label className="font-medium text-[#1E1E1E]">
              Password
              <input
                type="password"
                className="mt-1 w-full border rounded px-3 py-2"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                aria-label="Password"
              />
            </label>
            <label className="font-medium text-[#1E1E1E]">
              Conferma Password
              <input
                type="password"
                className="mt-1 w-full border rounded px-3 py-2"
                value={conferma}
                onChange={e => setConferma(e.target.value)}
                required
                aria-label="Conferma Password"
              />
            </label>
            {errore && <div className="text-[#B05858] text-sm" role="alert">{errore}</div>}
            <button
              type="submit"
              className="bg-[#D27D7D] hover:bg-[#A6A1B1] text-white font-semibold px-4 py-2 rounded-lg shadow transition mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Registrati"
              disabled={loading}
            >
              {loading ? "Registrazione..." : "Registrati"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
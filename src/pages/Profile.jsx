import React, { useState } from "react";
import BlackButton from "../components/buttons/BlackButton";
import TerracottaButton from "../components/buttons/TerracottaButton";

export default function Profile() {
  // Recupera i dati utente da localStorage (o da context)
  const user = JSON.parse(localStorage.getItem("user")) || {
    nome: "",
    cognome: "",
    email: "",
  };

  const [nome, setNome] = useState(user.nome || "");
  const [cognome, setCognome] = useState(user.cognome || "");
  const [email, setEmail] = useState(user.username || "");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    setSuccess("");
    setError("");
    // Qui aggiorna i dati dove preferisci (API, localStorage, context, ecc)
    // Esempio: aggiorna localStorage
    localStorage.setItem(
      "user",
      JSON.stringify({ ...user, nome, cognome, email, ...(password && { password }) })
    );
    setSuccess("Profilo aggiornato localmente!");
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#FAFAFA] px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-[#D27D7D] text-center">
          Il mio profilo
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" role="form" aria-label="Modifica profilo utente">
          <label className="font-medium text-[#1E1E1E]">
            Nome
            <input
              type="text"
              className="mt-1 w-full border rounded px-3 py-2"
              value={nome}
              onChange={e => setNome(e.target.value)}
              required
              aria-label="Nome utente"
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
              aria-label="Cognome utente"
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
              aria-label="Email utente"
            />
          </label>
          <label className="font-medium text-[#1E1E1E]">
            Nuova password
            <input
              type="password"
              className="mt-1 w-full border rounded px-3 py-2"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Lascia vuoto per non cambiare"
              aria-label="Nuova password"
            />
          </label>
          {success && <div className="text-green-600 text-sm">{success}</div>}
          {error && <div className="text-[#B05858] text-sm">{error}</div>}
          <div className="flex space-x-4">
            <TerracottaButton type="submit" aria-label="Aggiorna profilo">Aggiorna profilo</TerracottaButton>
            <BlackButton 
              type="button" 
              onClick={() => {
                setNome(user.nome || "");
                setCognome(user.cognome || "");
                setEmail(user.username || "");
                setPassword("");
                setSuccess("");
                setError("");
              }}
              aria-label="Ripristina dati profilo"
            >
              Ripristina
            </BlackButton>
          </div>
        </form>
      </div>
    </div>
  );
}
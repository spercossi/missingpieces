// servizi per il pannello admin sviluppatori
import { showBrandSuccess } from "../utils/notifications";
import { NEGOZIO_DEFAULT } from "../utils/constants";

const API_BASE_URL = "http://localhost:3001";

// GESTIONE DATI GENERICI
export const caricaDatiCompleti = async () => {
  const [capiRes, utentiRes] = await Promise.all([
    fetch(`${API_BASE_URL}/vestiti`),
    fetch(`${API_BASE_URL}/utenti`),
  ]);

  if (!capiRes.ok || !utentiRes.ok) {
    throw new Error("Errore nel caricamento dei dati");
  }

  const capiData = await capiRes.json();
  const utentiData = await utentiRes.json();

  return { capiData, utentiData };
};

// GESTIONE CAPI
export const aggiungiNuovoCapo = async (formData) => {
  // validazione campi obbligatori
  const campiObbligatori = [
    "Marca", "Tipo di Capo", "Prezzo", "Colore", 
    "Stile", "Materiale", "Stagione", "Size", "Genere"
  ];
  
  const campiMancanti = campiObbligatori.filter(campo => !formData[campo]);
  if (campiMancanti.length > 0) {
    throw new Error(`Campi obbligatori mancanti: ${campiMancanti.join(", ")}`);
  }

  const nuovoCapo = {
    ...formData,
    Prezzo: parseFloat(formData.Prezzo),
    "Data inserimento": new Date().toLocaleDateString("en-GB"),
    Negozio: formData.Negozio || NEGOZIO_DEFAULT,
  };

  const response = await fetch(`${API_BASE_URL}/vestiti`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nuovoCapo),
  });

  if (!response.ok) {
    throw new Error(`Errore nell'aggiunta del capo: ${response.status}`);
  }

  const capoCreato = await response.json();
  showBrandSuccess("Nuovo capo aggiunto al catalogo");
  return capoCreato;
};

export const modificaCapoEsistente = async (capo) => {
  const response = await fetch(`${API_BASE_URL}/vestiti/${capo.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(capo),
  });

  if (!response.ok) {
    throw new Error("Errore nella modifica del capo");
  }

  showBrandSuccess("Capo modificato con successo");
  return capo;
};

export const eliminaCapo = async (id) => {
  const response = await fetch(`${API_BASE_URL}/vestiti/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Errore nella rimozione del capo");
  }

  showBrandSuccess("Capo rimosso dal catalogo");
  return id;
};

// GESTIONE UTENTI
export const eliminaUtenteCompleto = async (id) => {
  const response = await fetch(`${API_BASE_URL}/utenti/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Errore nell'eliminazione utente");
  }

  showBrandSuccess("Utente eliminato");
  return id;
};

export const resetPasswordUtente = async (utente) => {
  const utenteAggiornato = {
    ...utente,
    password: "123456", // password di default
  };

  const response = await fetch(`${API_BASE_URL}/utenti/${utente.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(utenteAggiornato),
  });

  if (!response.ok) {
    throw new Error("Errore nel reset password");
  }

  showBrandSuccess(`Password di ${utente.username} resettata a "123456"`);
  return utenteAggiornato;
};

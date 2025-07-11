import { useState } from "react";
import TerracottaButton from "../buttons/TerracottaButton";
import BlackButton from "../buttons/BlackButton";
import { showLoading, dismissLoading, showError } from "../../utils/notifications";
import {
  COLORI_DISPONIBILI,
  STILI_DISPONIBILI,
  TIPI_CAPO_DISPONIBILI,
  MATERIALI_DISPONIBILI,
  STAGIONI_DISPONIBILI,
  TAGLIE_DISPONIBILI,
  GENERI_DISPONIBILI,
  CURRENCY_DEFAULT,
  IMAGE_PLACEHOLDER,
} from "../../utils/constants";

export default function AddCapoForm({ onSubmit, onCancel, loading }) {
  const [form, setForm] = useState({
    Marca: "",
    "Tipo di Capo": "",
    Prezzo: "",
    Currency: CURRENCY_DEFAULT,
    Negozio: "",
    Image: IMAGE_PLACEHOLDER,
    Colore: "",
    Stile: "",
    Materiale: "",
    Stagione: "",
    Size: "",
    Disponibilità: true,
    Genere: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    const requiredFields = ['Marca', 'Tipo di Capo', 'Colore', 'Stile', 'Materiale'];
    const missingFields = requiredFields.filter(field => !form[field]);
    
    if (missingFields.length > 0) {
      showError(`Campi obbligatori mancanti: ${missingFields.join(', ')}`);
      return;
    }

    const loadingToastId = showLoading("Aggiungendo nuovo capo al catalogo...");
    
    try {
      await onSubmit(form);
      dismissLoading(loadingToastId);
    } catch (error) {
      console.error('Errore submit form:', error);
      dismissLoading(loadingToastId);
      showError("Errore nell'aggiunta del capo. Riprova più tardi.");
    }
  };

  const updateForm = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Marca */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Marca *
          </label>
          <input
            type="text"
            value={form.Marca}
            onChange={(e) => updateForm("Marca", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D27D7D] focus:border-transparent"
            placeholder="Es. Nike, Zara, H&M..."
            required
          />
        </div>

        {/* Tipo di Capo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo di Capo *
          </label>
          <select
            value={form["Tipo di Capo"]}
            onChange={(e) => updateForm("Tipo di Capo", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D27D7D] focus:border-transparent"
            required
          >
            <option value="">Seleziona tipo...</option>
            {TIPI_CAPO_DISPONIBILI.map((tipo) => (
              <option key={tipo} value={tipo}>{tipo}</option>
            ))}
          </select>
        </div>

        {/* Prezzo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prezzo * (EUR)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={form.Prezzo}
            onChange={(e) => updateForm("Prezzo", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D27D7D] focus:border-transparent"
            placeholder="0.00"
            required
          />
        </div>

        {/* Negozio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Negozio/URL
          </label>
          <input
            type="text"
            value={form.Negozio}
            onChange={(e) => updateForm("Negozio", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D27D7D] focus:border-transparent"
            placeholder="https://..."
          />
        </div>

        {/* Altri campi select */}
        {[
          { field: "Colore", options: COLORI_DISPONIBILI },
          { field: "Stile", options: STILI_DISPONIBILI },
          { field: "Materiale", options: MATERIALI_DISPONIBILI },
          { field: "Stagione", options: STAGIONI_DISPONIBILI },
          { field: "Size", options: TAGLIE_DISPONIBILI },
          { field: "Genere", options: GENERI_DISPONIBILI },
        ].map(({ field, options }) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field} *
            </label>
            <select
              value={form[field]}
              onChange={(e) => updateForm(field, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D27D7D] focus:border-transparent"
              required
            >
              <option value="">Seleziona {field.toLowerCase()}...</option>
              {options.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        ))}

        {/* Immagine URL */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL Immagine
          </label>
          <input
            type="text"
            value={form.Image}
            onChange={(e) => updateForm("Image", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D27D7D] focus:border-transparent"
            placeholder="/placeholder.jpg"
          />
        </div>

        {/* Disponibilità */}
        <div className="md:col-span-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.Disponibilità}
              onChange={(e) => updateForm("Disponibilità", e.target.checked)}
              className="rounded focus:ring-[#D27D7D]"
            />
            <span className="text-sm font-medium text-gray-700">
              Disponibile per l'acquisto
            </span>
          </label>
        </div>
      </div>

      {/* Bottoni */}
      <div className="flex gap-4 pt-6 border-t">
        <BlackButton type="button" onClick={onCancel} className="flex-1">
          Annulla
        </BlackButton>
        <TerracottaButton type="submit" disabled={loading} className="flex-1">
          {loading ? "Salvando..." : "Salva Capo"}
        </TerracottaButton>
      </div>
    </form>
  );
}

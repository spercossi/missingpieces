import React, { useState } from "react";
import TerracottaButton from "./buttons/TerracottaButton";
import GreyButton from "./buttons/GreyButton";
import UserImage from "./UserImage";

export default function CardCapoPersonale({ capo, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    "Tipo di Capo": capo["Tipo di Capo"] || '',
    "Colore": capo["Colore"] || '',
    "Stile": capo["Stile"] || '',
    "Materiale": capo["Materiale"] || '',
    "Stagione": capo["Stagione"] || '',
    "Genere": capo["Genere"] || ''
  });

  const handleSave = async () => {
    const success = await onEdit(capo.id, editData);
    if (success) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditData({
      "Tipo di Capo": capo["Tipo di Capo"] || '',
      "Colore": capo["Colore"] || '',
      "Stile": capo["Stile"] || '',
      "Materiale": capo["Materiale"] || '',
      "Stagione": capo["Stagione"] || '',
      "Genere": capo["Genere"] || ''
    });
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-4 border border-[#D27D7D]">
        <div className="aspect-square w-full mb-4 bg-gray-100 rounded-lg overflow-hidden">
          <UserImage 
            src={capo["Image"]} 
            alt={capo["Tipo di Capo"]} 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Tipo di Capo
            </label>
            <select
              value={editData["Tipo di Capo"]}
              onChange={(e) => handleInputChange("Tipo di Capo", e.target.value)}
              className="w-full px-2 py-1 text-sm border rounded focus:ring-1 focus:ring-[#D27D7D]"
            >
              <option value="">Seleziona...</option>
              <option value="T-shirt">T-shirt</option>
              <option value="Camicia">Camicia</option>
              <option value="Maglione">Maglione</option>
              <option value="Giacca">Giacca</option>
              <option value="Jeans">Jeans</option>
              <option value="Pantaloni">Pantaloni</option>
              <option value="Gonna">Gonna</option>
              <option value="Vestito">Vestito</option>
              <option value="Scarpe">Scarpe</option>
              <option value="Accessorio">Accessorio</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Colore
            </label>
            <input
              type="text"
              value={editData["Colore"]}
              onChange={(e) => handleInputChange("Colore", e.target.value)}
              className="w-full px-2 py-1 text-sm border rounded focus:ring-1 focus:ring-[#D27D7D]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Stile
            </label>
            <select
              value={editData["Stile"]}
              onChange={(e) => handleInputChange("Stile", e.target.value)}
              className="w-full px-2 py-1 text-sm border rounded focus:ring-1 focus:ring-[#D27D7D]"
            >
              <option value="">Seleziona...</option>
              <option value="Casual">Casual</option>
              <option value="Formale">Formale</option>
              <option value="Sportivo">Sportivo</option>
              <option value="Elegante">Elegante</option>
              <option value="Vintage">Vintage</option>
              <option value="Boho">Boho</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Materiale
            </label>
            <input
              type="text"
              value={editData["Materiale"]}
              onChange={(e) => handleInputChange("Materiale", e.target.value)}
              className="w-full px-2 py-1 text-sm border rounded focus:ring-1 focus:ring-[#D27D7D]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Stagione
            </label>
            <select
              value={editData["Stagione"]}
              onChange={(e) => handleInputChange("Stagione", e.target.value)}
              className="w-full px-2 py-1 text-sm border rounded focus:ring-1 focus:ring-[#D27D7D]"
            >
              <option value="">Seleziona...</option>
              <option value="Primavera">Primavera</option>
              <option value="Estate">Estate</option>
              <option value="Autunno">Autunno</option>
              <option value="Inverno">Inverno</option>
              <option value="Tutto l'anno">Tutto l'anno</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Genere
            </label>
            <select
              value={editData["Genere"]}
              onChange={(e) => handleInputChange("Genere", e.target.value)}
              className="w-full px-2 py-1 text-sm border rounded focus:ring-1 focus:ring-[#D27D7D]"
            >
              <option value="">Seleziona...</option>
              <option value="Unisex">Unisex</option>
              <option value="Male">Uomo</option>
              <option value="Female">Donna</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={handleSave}
            className="flex-1 bg-[#D27D7D] text-white py-2 px-3 rounded text-sm font-medium hover:bg-[#C4A574] transition"
          >
            Salva
          </button>
          <button
            onClick={handleCancel}
            className="flex-1 bg-gray-500 text-white py-2 px-3 rounded text-sm font-medium hover:bg-gray-600 transition"
          >
            Annulla
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow">
      {/* Immagine */}
      <div className="aspect-square w-full mb-4 bg-gray-100 rounded-lg overflow-hidden">
        <UserImage 
          src={capo["Image"]} 
          alt={capo["Tipo di Capo"]} 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Informazioni */}
      <div className="space-y-2">
        <h3 className="font-semibold text-lg text-[#1E1E1E]">
          {capo["Tipo di Capo"]}
        </h3>
        
        <div className="space-y-1 text-sm text-gray-600">
          <p><span className="font-medium">Colore:</span> {capo["Colore"]}</p>
          <p><span className="font-medium">Stile:</span> {capo["Stile"]}</p>
          <p><span className="font-medium">Materiale:</span> {capo["Materiale"]}</p>
          <p><span className="font-medium">Stagione:</span> {capo["Stagione"]}</p>
          <p><span className="font-medium">Genere:</span> {capo["Genere"]}</p>
          
          {capo["Data inserimento"] && (
            <p className="text-xs text-gray-500 mt-2">
              Aggiunto il: {capo["Data inserimento"]}
            </p>
          )}
        </div>
      </div>

      {/* Azioni */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => setIsEditing(true)}
          className="flex-1 bg-[#C4A574] text-white py-2 px-3 rounded text-sm font-medium hover:bg-[#B8985F] transition"
        >
          Modifica
        </button>
        <button
          onClick={() => onDelete(capo.id)}
          className="flex-1 bg-red-500 text-white py-2 px-3 rounded text-sm font-medium hover:bg-red-600 transition"
        >
          Elimina
        </button>
      </div>
    </div>
  );
}

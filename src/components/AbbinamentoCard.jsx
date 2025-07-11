import React, { useState } from "react";
import UserImage from "./UserImage";
import TerracottaButton from "./buttons/TerracottaButton";
import GreyButton from "./buttons/GreyButton";

export default function AbbinamentoCard({ abbinamento, onSalvaOutfit, onValutazione }) {
  const [showDetails, setShowDetails] = useState(false);

  const { capoDesiderato, mioCapo, compatibilita, motivazione, fonte } = abbinamento;

  // Determina se è un abbinamento tra capi personali o wishlist+personali
  const isPersonaliPersonali = fonte === "personali_personali";

  // Determina il colore del badge di compatibilità
  const getCompatibilitaBadge = (score) => {
    if (score >= 80) return { color: "bg-green-500", text: "Perfetto" };
    if (score >= 60) return { color: "bg-yellow-500", text: "Buono" };
    return { color: "bg-orange-500", text: "Accettabile" };
  };

  const badge = getCompatibilitaBadge(compatibilita);

  const handleSalvaOutfit = () => {
    const nomeOutfit = prompt("Dai un nome a questo outfit:", `Outfit ${new Date().toLocaleDateString()}`);
    if (nomeOutfit) {
      onSalvaOutfit(abbinamento, nomeOutfit);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100 relative">
      {/* Badge NEW per abbinamenti non ancora visti */}
      {abbinamento.isNew && (
        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
          NEW
        </div>
      )}
      
      {/* Header con badge compatibilità */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-[#1E1E1E]">
            {isPersonaliPersonali ? "Outfit dal Guardaroba" : "Abbinamento Suggerito"}
          </h3>
          {isPersonaliPersonali && (
            <p className="text-xs text-[#666] mt-1">
              👔 Dai tuoi capi personali
            </p>
          )}
        </div>
        <div className={`${badge.color} text-white px-3 py-1 rounded-full text-sm font-medium`}>
          {badge.text} {compatibilita}%
        </div>
      </div>

      {/* Abbinamento visuale */}
      <div className="flex items-center justify-center gap-4 mb-4">
        {/* Primo capo */}
        <div className="flex-1 text-center">
          <div className="w-20 h-20 mx-auto mb-2 bg-gray-100 rounded-lg overflow-hidden">
            <UserImage 
              src={capoDesiderato.immagine || capoDesiderato.Image} 
              alt={capoDesiderato.nome || capoDesiderato["Tipo di Capo"]} 
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-sm font-medium text-[#1E1E1E]">
            {capoDesiderato.nome || capoDesiderato["Tipo di Capo"]}
          </p>
          <p className="text-xs text-[#666]">
            {capoDesiderato.categoria || capoDesiderato["Colore"]}
          </p>
          <span className={`inline-block text-xs px-2 py-1 rounded mt-1 ${
            isPersonaliPersonali 
              ? "bg-green-100 text-green-800" 
              : "bg-blue-100 text-blue-800"
          }`}>
            {isPersonaliPersonali ? "Guardaroba" : "Lista Desideri"}
          </span>
        </div>

        {/* Simbolo + */}
        <div className="text-2xl text-[#C4A574] font-bold">+</div>

        {/* Secondo capo */}
        <div className="flex-1 text-center">
          <div className="w-20 h-20 mx-auto mb-2 bg-gray-100 rounded-lg overflow-hidden">
            <UserImage 
              src={mioCapo["Image"]} 
              alt={mioCapo["Tipo di Capo"]} 
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-sm font-medium text-[#1E1E1E]">
            {mioCapo["Tipo di Capo"]}
          </p>
          <p className="text-xs text-[#666]">
            {mioCapo["Colore"]}
          </p>
          <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mt-1">
            {isPersonaliPersonali ? "Guardaroba" : "Il Mio Guardaroba"}
          </span>
        </div>
      </div>

      {/* Motivazione */}
      <div className="bg-gray-50 rounded-lg p-3 mb-4">
        <p className="text-sm text-[#666] leading-relaxed">
          <strong>perché funziona:</strong> {motivazione}
        </p>
      </div>

      {/* Dettagli aggiuntivi (collassibili) */}
      {showDetails && (
        <div className="bg-blue-50 rounded-lg p-3 mb-4">
          <h4 className="font-medium text-[#1E1E1E] mb-2">Dettagli abbinamento:</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>Capo desiderato:</strong></p>
              <p>• Stile: {capoDesiderato["Stile"] || "Non specificato"}</p>
              <p>• Stagione: {capoDesiderato["Stagione"] || "Non specificato"}</p>
              <p>• Materiale: {capoDesiderato["Materiale"] || "Non specificato"}</p>
            </div>
            <div>
              <p><strong>Tuo capo:</strong></p>
              <p>• Stile: {mioCapo["Stile"] || "Non specificato"}</p>
              <p>• Stagione: {mioCapo["Stagione"] || "Non specificato"}</p>
              <p>• Materiale: {mioCapo["Materiale"] || "Non specificato"}</p>
            </div>
          </div>
        </div>
      )}

      {/* Azioni */}
      <div className="flex gap-2">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex-1 text-sm py-2 px-3 text-[#666] hover:text-[#1E1E1E] transition"
        >
          {showDetails ? "Nascondi dettagli" : "Mostra dettagli"}
        </button>
        
        <GreyButton 
          size="sm" 
          onClick={() => onValutazione(abbinamento.id, 'negativa')}
          className="text-xs"
        >
          👎 Non mi piace
        </GreyButton>
        
        <GreyButton 
          size="sm" 
          onClick={() => onValutazione(abbinamento.id, 'positiva')}
          className="text-xs"
        >
          👍 Mi piace
        </GreyButton>
        
        <TerracottaButton 
          size="sm" 
          onClick={handleSalvaOutfit}
          className="text-xs"
        >
          Salva Outfit
        </TerracottaButton>
      </div>
    </div>
  );
}

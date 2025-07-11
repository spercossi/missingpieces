import React, { useState, useEffect } from "react";

export default function HeartButton({ 
  onClick, 
  isLiked = false, 
  size = "w-10 h-10", 
  className = "items-center justify-center" 
}) {
  const [liked, setLiked] = useState(isLiked);

  // Sincronizza lo stato interno con la prop isLiked
  useEffect(() => {
    setLiked(isLiked);
  }, [isLiked]);

  const handleClick = async () => {
    if (onClick) {
      // Chiama la funzione onClick e aspetta il risultato
      const shouldUpdate = await onClick(!liked);
      
      // Aggiorna lo stato solo se il genitore permette l'aggiornamento
      if (shouldUpdate !== false) {
        setLiked(!liked);
      }
    } else {
      // Se non c'è onClick, aggiorna normalmente
      setLiked(!liked);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`transition-all duration-200 hover:scale-110 ${className}`}
      type="button"
      aria-label={liked ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
    >
      <svg
        className={`${size} transition-colors duration-200`}
        viewBox="0 0 24 24"
        fill={liked ? "#D27D7D" : "none"}
        stroke={liked ? "#D27D7D" : "#666"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}

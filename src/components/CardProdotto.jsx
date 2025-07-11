import React, { useState, useEffect } from "react";
import HeartButton from "./buttons/HeartButton";
import { addToWishlist, removeFromWishlist, isInWishlist } from '../services/wishlistServices.js';
// REDUX MIGRATION - sostituito useAuth con Redux hooks
import { useSelector } from 'react-redux';
import { selectUser } from '../store/slices/authSlice';
import { showWarning, showConfirm, showBrandSuccess, showError } from '../utils/notifications';
import { getImageFromStorage } from '../services/imageServices.js';
import { getSitoMarca } from '../utils/constants.js';

export default function CardProdotto({ prodotto }) {
  // REDUX HOOK - migrato da Context API
  const user = useSelector(selectUser);
  const [isLiked, setIsLiked] = useState(false);
  const [imageSrc, setImageSrc] = useState('');

  // al mount, controlla se è già nella wishlist e carica l'immagine
  useEffect(() => {
    if (user && prodotto) {
      const inWishlist = isInWishlist(prodotto.id, user.id);
      setIsLiked(inWishlist);
    } else {
      // se non c'è user, resetta lo stato
      setIsLiked(false);
    }

    // carica l'immagine corretta - CAMPO CORRETTO: "Image"
    if (prodotto?.Image) {
      // se l'immagine inizia con /user_uploads, prova a recuperarla dal localStorage
      if (prodotto.Image.startsWith('/user_uploads/')) {
        const storedImage = getImageFromStorage(prodotto.Image);
        setImageSrc(storedImage || '/placeholder.svg');
      } else if (prodotto.Image.startsWith('/')) {
        // immagine locale nel public folder
        setImageSrc(prodotto.Image);
      } else {
        // URL esterno
        setImageSrc(prodotto.Image);
      }
    } else {
      setImageSrc('../placeholder.svg');
    }
  }, [user, prodotto]);

  // listener per aggiornamenti della wishlist
  useEffect(() => {
    const handleWishlistUpdate = () => {
      if (user && prodotto) {
        const inWishlist = isInWishlist(prodotto.id, user.id);
        setIsLiked(inWishlist);
      }
    };

    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    return () => window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
  }, [user, prodotto]);

  // gestisce il click per andare al sito del produttore
  const handleProductClick = () => {
    if (prodotto?.Marca) {
      const sitoMarca = getSitoMarca(prodotto.Marca);
      
      if (sitoMarca) {
        window.open(sitoMarca, '_blank');
        showBrandSuccess(`Apertura sito ${prodotto.Marca}...`);
      } else {
        showError(`Sito web per ${prodotto.Marca} non disponibile`);
      }
    } else {
      showError("Informazioni marca non disponibili");
    }
  };

  // gestisce il click sul cuore
  const handleHeartClick = async (liked) => {
    if (!user) {
      showWarning("Devi essere loggato per aggiungere ai preferiti");
      return false; // restituisce false per impedire l'aggiornamento del cuore
    }

    if (liked) {
      // AGGIUNTA ALLA WISHLIST - notifica di successo immediata
      try {
        const added = await addToWishlist(prodotto, user.id);
        if (added) {
          setIsLiked(true);
          showBrandSuccess(`${prodotto["Tipo di Capo"] || 'Elemento'} ${prodotto.Marca || ''} aggiunto ai preferiti!`);
        }
      } catch (error) {
        console.error('Errore nell\'aggiunta alla wishlist:', error);
        showError('Errore nell\'aggiunta alla wishlist');
      }
    } else {
      // RIMOZIONE DALLA WISHLIST - richiedendo conferma
      showConfirm(
        `Sei sicuro di voler rimuovere "${prodotto["Tipo di Capo"] || 'questo elemento'}" ${prodotto.Marca || ''} dai tuoi preferiti?`,
        () => {
          // callback di conferma - procede con la rimozione
          const removed = removeFromWishlist(prodotto.id, user.id);
          if (removed) {
            setIsLiked(false);
            showBrandSuccess(`${prodotto["Tipo di Capo"] || 'Elemento'} rimosso dai preferiti!`);
          }
        }
      );
      return false; // non aggiorna immediatamente il cuore, aspetta la conferma
    }
    return true; // permette l'aggiornamento del cuore per l'aggiunta
  };

  // destruttura le proprietà del prodotto
  const { Marca, "Tipo di Capo": categoria, Prezzo: prezzo, Currency: currency } = prodotto || {};

  return (
    <div className="bg-[#FAFAFA] rounded-lg shadow p-4 flex flex-col items-center hover:shadow-lg transition-shadow">
      {/* Immagine cliccabile */}
      <div className="cursor-pointer" onClick={handleProductClick} title={`Vai al sito ${Marca || 'del produttore'}`}>
        {imageSrc ? (
          <img src={imageSrc} alt={categoria} className="w-32 h-32 object-cover mb-4 rounded hover:opacity-80 transition-opacity" />
        ) : (
          <div className="w-32 h-32 bg-gray-200 mb-4 rounded flex items-center justify-center hover:opacity-80 transition-opacity">
            <span className="text-gray-400 text-sm">Caricamento...</span>
          </div>
        )}
      </div>
      
      {/* Informazioni prodotto cliccabili */}
      <div className="cursor-pointer text-center" onClick={handleProductClick} title={`Vai al sito ${Marca || 'del produttore'}`}>
        <h2 className="text-xl font-semibold hover:text-[#D27D7D] transition-colors">{categoria}</h2>
        <p className="text-gray-600 hover:text-gray-800 transition-colors font-medium">{Marca}</p>
        <p className="text-xs text-gray-400 mt-1">Clicca per visitare il sito</p>
      </div>
      
      <div className="w-full mt-2 flex justify-between items-center">
        <div></div> {/* Spazio vuoto a sinistra */}
        {prezzo !== undefined && prezzo !== null && prezzo !== "" ? (
          <p className="text-[#D27D7D] font-bold">
            {prezzo} {currency || 'EUR'}
          </p>
        ) : (
          <p className="text-[#6B6B6B] font-bold">Prezzo n/d</p>
        )}
        <HeartButton 
          isLiked={isLiked}
          onClick={handleHeartClick}
        />
      </div>
    </div>
  );
};
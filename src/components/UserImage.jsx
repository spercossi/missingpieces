import React, { useState, useEffect } from 'react';
import { getImageFromStorage } from '../services/imageServices';

export default function UserImage({ src, alt, className, onError, ...props }) {
  const [imageSrc, setImageSrc] = useState(src);
  const [hasErrored, setHasErrored] = useState(false);

  useEffect(() => {
    // Reset quando cambia il src
    setImageSrc(src);
    setHasErrored(false);
  }, [src]);

  const handleImageError = () => {
    if (!hasErrored && src && src.startsWith('/user_uploads/')) {
      // Prova a caricare dal localStorage
      const storageImage = getImageFromStorage(src);
      if (storageImage && storageImage !== src) {
        setImageSrc(storageImage);
        setHasErrored(true); // Previene loop infiniti
        return;
      }
    }
    
    // Fallback al placeholder
    setImageSrc('/placeholder.svg');
    setHasErrored(true);
    
    // Chiama l'handler personalizzato se fornito
    if (onError) {
      onError();
    }
  };

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      onError={handleImageError}
      {...props}
    />
  );
}

// Redux Store Configuration
// Configurazione centralizzata dello store Redux per l'applicazione Missing Pieces

import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';

// Configurazione store Redux con Redux Toolkit
export const store = configureStore({
  reducer: {
    auth: authSlice,
    // Qui aggiungeremo wishlist, products, etc. se necessario
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: true, // Redux DevTools abilitato
});

export default store;

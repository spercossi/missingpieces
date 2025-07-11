// auth slice - gestione autenticazione con Redux Toolkit
// implementa state management per login/logout e operazioni asincrone

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// THUNK ASINCRONO per login
// riusa la stessa logica fetch esistente di Login.jsx
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      // stesso endpoint dell'app esistente
      const emailLowercase = credentials.email.toLowerCase();
      const response = await fetch(
        `http://localhost:3001/utenti?username=${encodeURIComponent(emailLowercase)}`
      );
      
      if (!response.ok) {
        throw new Error('Errore di rete');
      }
      
      const utenti = await response.json();
      
      if (utenti.length === 1) {
        const user = utenti[0];
        // salva in localStorage come già fa l'app
        localStorage.setItem("user", JSON.stringify(user));
        return user;
      } else {
        throw new Error('Credenziali non valide');
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// THUNK ASINCRONO per logout
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // Optional: API call per logout server-side se necessario
      // await fetch('/api/logout', { method: 'POST' });
      
      // Cleanup localStorage
      localStorage.removeItem('user');
      
      return null; // Restituisce null per pulire user
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// THUNK ASINCRONO per registrazione (bonus)
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:3001/utenti', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        throw new Error('Errore durante la registrazione');
      }
      
      const newUser = await response.json();
      localStorage.setItem("user", JSON.stringify(newUser));
      return newUser;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// inizializza stato da localStorage (come già fa l'app)
const getUserFromStorage = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

// auth slice principale
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: getUserFromStorage(),
    isLoggedIn: !!getUserFromStorage(),
    loading: false,
    error: null,
  },
  reducers: {
    // Azioni sincrone
    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      state.error = null;
      // rimuove da localStorage
      localStorage.removeItem("user");
    },
    clearError: (state) => {
      state.error = null;
    },
    // Azione per sincronizzare con Context esistente
    setUserFromContext: (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = !!action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login user cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isLoggedIn = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
        state.isLoggedIn = false;
      })
      // Register user cases  
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isLoggedIn = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
        state.isLoggedIn = false;
      })
      // Logout user cases
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isLoggedIn = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const { logout, clearError, setUserFromContext } = authSlice.actions;

// Export selectors (helper per componenti)
export const selectUser = (state) => state.auth.user;
export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectIsAuthenticated = (state) => !!state.auth.user; // Alias per compatibilità
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

// Selectors per campi specifici user
export const selectUserId = (state) => state.auth.user?.id;
export const selectUserEmail = (state) => state.auth.user?.email || state.auth.user?.username;
export const selectUserName = (state) => state.auth.user?.name || state.auth.user?.username;

// Export reducer
export default authSlice.reducer;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TerracottaButton from "../components/buttons/TerracottaButton";
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, selectAuthLoading, selectAuthError, clearError } from '../store/slices/authSlice';
import { showError, showBrandSuccess, showLoading, dismissLoading } from '../utils/notifications';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  

  const dispatch = useDispatch();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    dispatch(clearError());
    
    const loadingToastId = showLoading("Accesso in corso...");
    
    try {
      const result = await dispatch(loginUser({ email, password }));
      
      if (result.type === 'auth/login/fulfilled') {
        dismissLoading(loadingToastId);
        showBrandSuccess("login effettuato con successo!");
        navigate("/");
      } else {
        dismissLoading(loadingToastId);
        showError(error || "Email o password non corretti");
      }
    } catch (err) {
      console.error("Errore login:", err);
      dismissLoading(loadingToastId);
      showError("Errore di connessione al server");
    }
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#FAFAFA] px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-[#D27D7D] text-center">Accedi</h1>
        <form
  onSubmit={(e) => {
    handleSubmit(e);
  }}
  className="flex flex-col gap-4"
  aria-label="Form di login"
>
          <label className="font-medium text-[#1E1E1E]">
            Email
            <input
              type="email"
              className="mt-1 w-full border rounded px-3 py-2"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
              aria-label="Email"
            />
          </label>
          <label className="font-medium text-[#1E1E1E]">
            Password
            <input
              type="password"
              className="mt-1 w-full border rounded px-3 py-2"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              aria-label="Password"
            />
          </label>
          {/* REDUX ERROR DISPLAY */}
          {error && <div className="text-[#B05858] text-sm" role="alert">{error}</div>}
          <TerracottaButton
            type="submit"
            fullWidth
            className="mt-2"
            disabled={loading}
            aria-label="Accedi"
          >
            {loading ? "Accesso..." : "Log In"}
          </TerracottaButton>
          <div className="text-center mt-4">
            <span className="text-sm text-gray-700">Non hai un account? </span>
            <a
              href="/register"
              className="text-sm text-[#E08B86] font-semibold underline ml-1"
              aria-label="Registrati ora"
            ><br />
              Registrati ora!
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
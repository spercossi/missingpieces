import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./index.css";
import NavbarDefault from "./components/nav/Navbar";
import Footer from "./components/Footer";

// Lazy loading per le pagine più pesanti
const CatalogoCapi = lazy(() => import("./pages/CatalogoCapi"));
const IlMioGuardaroba = lazy(() => import("./pages/IlMioGuardaroba"));
const CreaOutfit = lazy(() => import("./pages/CreaOutfit"));
const Sviluppatori = lazy(() => import("./pages/sviluppatori"));
const Profile = lazy(() => import("./pages/Profile"));

// Componente Loading
const PageLoading = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C4A574] mx-auto mb-4"></div>
      <p className="text-[#666]">Caricamento...</p>
    </div>
  </div>
);

function App() {
  return (
    <>
      <NavbarDefault />
      <Suspense fallback={<PageLoading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<CatalogoCapi />} />
          <Route path="/guardaroba" element={<IlMioGuardaroba />} />
          <Route path="/crea-outfit" element={<CreaOutfit />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/sviluppatori" element={<Sviluppatori />} />
          <Route path="/profile" element={<Profile />} />
          
          {/* Route di fallback */}
          <Route path="*" element={<Home />} />
        </Routes>
      </Suspense>
      <Footer />
    </>
  );
}

export default App;

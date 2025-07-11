import TerracottaButton from "../components/buttons/TerracottaButton";
import GreyButton from "../components/buttons/GreyButton";
import { Link } from "react-router-dom";
// REDUX MIGRATION - sostituito useAuth con Redux hooks
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUser } from '../store/slices/authSlice';

export default function Home() {
  // REDUX HOOKS - migrato da Context API
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  return (
    <section className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <h1 className="text-4xl md:text-6xl font-bold text-[#1E1E1E] mb-4">
        Il <span className="text-primary">pezzo mancante</span> del tuo stile.
      </h1>
      <p className="text-lg md:text-2xl text-[#444] max-w-2xl mb-10 mx-20">
        Trova abbinamenti per gli elementi del tuo armadio o Trova nuovi capi per completare il tuo outfit.
        <br />
        Scopri un nuovo modo di <b>matchare</b> i tuoi capi preferiti.
      </p>
      
      {/* Messaggi personalizzati in base all'autenticazione */}
      {isAuthenticated && (
        <p className="text-lg text-[#C4A574] mb-6">
          Ciao <span className="font-semibold">{user?.nome}</span>! Benvenuto/a nel tuo guardaroba digitale.
        </p>
      )}
      
      <div className="flex gap-4">
        {!isAuthenticated ? (
          // Utente NON loggato - pulsanti per login e catalogo
          <>
            <Link to="/login" aria-label="Vai alla pagina di login">
              <TerracottaButton fullWidth size="sm">
                Inizia ora
              </TerracottaButton>
            </Link>
            <Link to="/catalogo" aria-label="Vai al catalogo prodotti">
              <GreyButton fullWidth size="sm">
                Scopri il catalogo
              </GreyButton>
            </Link>
          </>
        ) : (
          // Utente LOGGATO - pulsanti per le funzionalità principali
          <>
            <Link to="/crea-outfit" aria-label="Vai alla pagina crea outfit">
              <TerracottaButton fullWidth size="sm">
                Inizia ora
              </TerracottaButton>
            </Link>
            <Link to="/guardaroba" aria-label="Vai al mio guardaroba">
              <GreyButton fullWidth size="sm">
                Il Mio Guardaroba
              </GreyButton>
            </Link>
          </>
        )}
      </div>
      
      {/* Link secondario sempre presente */}
      <div className="mt-4">
        <Link to="/catalogo" className="text-[#666] hover:text-[#1E1E1E] underline" aria-label="Esplora il catalogo completo">
          Esplora il catalogo completo
        </Link>
      </div>
    </section>
  );
}

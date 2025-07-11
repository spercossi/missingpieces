import React from "react";
import {
  Navbar,
  Typography,
  IconButton,
  Collapse,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import BlackButton from "../buttons/BlackButton";
import TerracottaButton from "../buttons/TerracottaButton";
// REDUX MIGRATION - sostituito Context con Redux
import { useSelector, useDispatch } from 'react-redux';
import { selectIsAuthenticated, selectUser, logoutUser } from '../../store/slices/authSlice';
import CreaOutfitIcon from "../icons/CreaOutfitIcon";
import NavItem from "./NavItem";
import GuardarobaIcon from "../icons/GuardarobaIcon";
import CatalogoIcon from "../icons/CatalogoIcon";
import SviluppatoriIcon from "../icons/SviluppatoriIcon";
import ProfileIcon from "../icons/ProfileIcon";
import XIcon from "../icons/XIcon";
import HamIcon from "../icons/HamIcon";
export default function NavbarDefault() {
  const [openNav, setOpenNav] = React.useState(false);
  
  // REDUX MIGRATION - sostituito useAuth con Redux hooks
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  
  const handleLogout = () => {
    dispatch(logoutUser());
  };

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);

  return (
    <Navbar className=" bg-[#F3E7E4] mx-auto mt-1 max-w-screen-xl px-1 py-0.5 lg:px-8 lg:py-2 rounded-xl">
      <div className="container mx-auto flex items-center justify-between text-blue-gray-900">
        <Typography
          as={Link}
          to="/"
          className="cursor-pointer font-medium flex items-center"
        >
          <img src="/Logo.png" alt="Logo" className="h-[8rem] w-auto " />
        </Typography>
        <div className="hidden lg:block">
          <ul className="flex text-black flex-row gap-6 items-center">
            <NavItem to="/crea-outfit" icon={CreaOutfitIcon}>
              Crea Outfit
            </NavItem>
            <NavItem to="/guardaroba" icon={GuardarobaIcon}>
              Il Mio Guardaroba
            </NavItem>
            <NavItem to="/catalogo" icon={CatalogoIcon}>
              Catalogo Capi
            </NavItem>
            {user?.role === "admin" && (
              <NavItem to="/sviluppatori" icon={SviluppatoriIcon}>
                Sviluppatori
              </NavItem>
            )}
          </ul>
        </div>
        <div className="hidden lg:flex items-center gap-x-1">
          {!isAuthenticated ? (
            <>
              <Link to="/login" aria-label="Vai alla pagina di login">
                <TerracottaButton>Log In</TerracottaButton>
              </Link>
              <Link to="/register" aria-label="Vai alla pagina di registrazione">
                <BlackButton>Sign In</BlackButton>
              </Link>
            </>
          ) : (
            <>
              <NavItem to="/profile" icon={ProfileIcon}>
                Il mio profilo
              </NavItem>
              <BlackButton
                onClick={handleLogout}
                aria-label="Esci dall'account"
              >
                Log Out
              </BlackButton>
            </>
          )}
        </div>

        <IconButton
          variant="text"
          className="ml-4 h-10 w-10 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden flex items-center justify-center"
          ripple={false}
          onClick={() => setOpenNav(!openNav)}
          aria-label={openNav ? "Chiudi menu" : "Apri menu"}
        >
          {openNav ? (
            <XIcon className="h-8 w-8 mx-5" />
          ) : (
            <HamIcon className="h-12 w-12 mx-5" />
          )}
        </IconButton>
      </div>

      <Collapse open={openNav}>
        <div className="container mx-auto">
          <ul
            className={`flex flex-col text-black gap-2 mt-2 ${
              openNav ? "lg:hidden" : "hidden"
            }`}
          >
            <NavItem to="/crea-outfit" vertical>
              Crea Outfit
            </NavItem>
            <NavItem to="/guardaroba" vertical>
              Il Mio Guardaroba
            </NavItem>
            <NavItem to="/catalogo" vertical>
              Catalogo Capi
            </NavItem>
            {user?.role === "admin" && (
              <NavItem to="/sviluppatori" vertical>
                Sviluppatori
              </NavItem>
            )}
            {isAuthenticated && (
              <NavItem to="/profile" icon={ProfileIcon} vertical>
                Il mio profilo
              </NavItem>
            )}
          </ul>
          <div
            className={`flex flex-col gap-2 mt-4 ${
              openNav ? "lg:hidden" : "hidden"
            }`}
          >
            {!isAuthenticated && (
              <>
                <Link to="/login">
                  <TerracottaButton fullWidth size="sm">
                    Log In
                  </TerracottaButton>
                </Link>
                <Link to="/register">
                  <BlackButton fullWidth size="sm">
                    Sign In
                  </BlackButton>
                </Link>
              </>
            )}
            {isAuthenticated && (
              <BlackButton fullWidth size="sm" onClick={handleLogout}>
                Log Out
              </BlackButton>
            )}
          </div>
        </div>
      </Collapse>
    </Navbar>
  );
}

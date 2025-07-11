export default function Footer() {
  return (
    <div className="relative mt-16 bg-deep-purple-accent-400">
      <svg
        className="absolute top-0 w-full h-6 -mt-5 sm:-mt-10 sm:h-16 text-deep-purple-accent-400"
        preserveAspectRatio="none"
        viewBox="0 0 1440 54"
      >
        <path
          fill="#A6A1B1"
          d="M0 22L120 16.7C240 11 480 1.00001 720 0.700012C960 1.00001 1200 11 1320 16.7L1440 22V54H1320C1200 54 960 54 720 54C480 54 240 54 120 54H0V22Z"
        />
      </svg>

      <div className="bg-[#A6A1B1] pt-12 px-6">
        <div className="grid gap-16 row-gap-10 mb-8 lg:grid-cols-6 text-white">
          {/* Logo + descrizione */}
          <div className="md:max-w-md lg:col-span-2">
            <a
              href="/"
              aria-label="Go home"
              title="MissingPiece"
              className="inline-flex items-center mb-4"
            >
              <svg
                className="w-8 text-white"
                viewBox="0 0 24 24"
                strokeLinejoin="round"
                strokeWidth="2"
                strokeLinecap="round"
                strokeMiterlimit="10"
                stroke="currentColor"
                fill="none"
              >
                <rect x="3" y="1" width="7" height="12" />
                <rect x="3" y="17" width="7" height="6" />
                <rect x="14" y="1" width="7" height="6" />
                <rect x="14" y="11" width="7" height="12" />
              </svg>
              <span className="ml-2 text-xl font-bold tracking-wide text-[#FFFFFF]">
                MissingPiece
              </span>
            </a>
            <p className="text-sm text-[#EDEDED]">
              Scopri la piattaforma che unisce moda, stile e personalizzazione.
              <br /><br />
              Trova il capo perfetto per te, abbina i tuoi outfit e completa il tuo guardaroba con il pezzo mancante.
            </p>
          </div>

          {/* Categorie */}
          <div>
            <p className="text-base font-semibold tracking-wide mb-2">Categorie</p>
            <ul className="space-y-2 text-sm text-white/80">
              <li><a href="/" className="hover:text-primary transition text-[#EDEDED]">Nuovi arrivi</a></li>
              <li><a href="/" className="hover:text-primary transition text-[#EDEDED]">Outfit consigliati</a></li>
              <li><a href="/" className="hover:text-primary transition text-[#EDEDED]">Completa il look</a></li>
              <li><a href="/" className="hover:text-primary transition text-[#EDEDED]">Brand preferiti</a></li>
            </ul>
          </div>

          {/* Per te */}
          <div>
            <p className="text-base font-semibold tracking-wide mb-2">Per te</p>
            <ul className="space-y-2 text-sm text-white/80">
              <li><a href="/" className="hover:text-primary transition text-[#EDEDED]">Il tuo guardaroba</a></li>
              <li><a href="/" className="hover:text-primary transition text-[#EDEDED]">Wishlist</a></li>
              <li><a href="/" className="hover:text-primary transition text-[#EDEDED]">Cronologia acquisti</a></li>
              <li><a href="/" className="hover:text-primary transition text-[#EDEDED]">Stilista virtuale</a></li>
            </ul>
          </div>

          {/* Informazioni */}
          <div>
            <p className="text-base font-semibold tracking-wide mb-2">Informazioni</p>
            <ul className="space-y-2 text-sm text-white/80">
              <li><a href="/" className="hover:text-primary transition text-[#EDEDED]">Chi siamo</a></li>
              <li><a href="/" className="hover:text-primary transition text-[#EDEDED]">Contatti</a></li>
              <li><a href="/" className="hover:text-primary transition text-[#EDEDED]">Termini e condizioni</a></li>
              <li><a href="/" className="hover:text-primary transition text-[#EDEDED]">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <p className="text-base font-semibold tracking-wide mb-2">Social</p>
            <ul className="space-y-2 text-sm text-white/80">
              <li><a href="/" className="hover:text-primary transition text-[#EDEDED]">Instagram</a></li>
              <li><a href="/" className="hover:text-primary transition text-[#EDEDED]">Pinterest</a></li>
              <li><a href="/" className="hover:text-primary transition text-[#EDEDED]">TikTok</a></li>
              <li><a href="/" className="hover:text-primary transition text-[#EDEDED]">Facebook</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col justify-between pt-5 pb-10 border-t border-[#FFFFFF] sm:flex-row">
          <p className="text-sm text-[#EDEDED]">
            © 2025 MissingPiece. Tutti i diritti riservati.
          </p>
<div className="flex items-center mt-4 space-x-4 sm:mt-0">
  {/* Instagram */}
  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="transition-colors duration-300 text-white hover:text-primary">
    <svg fill="currentColor" viewBox="0 0 24 24" className="h-6 w-6">
      <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5zm4.25 3.25a5.25 5.25 0 1 1 0 10.5 5.25 5.25 0 0 1 0-10.5zm0 1.5a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5zm5.25.75a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
    </svg>
  </a>
  {/* Pinterest */}
  <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="transition-colors duration-300 text-white hover:text-primary">
    <svg fill="currentColor" viewBox="0 0 24 24" className="h-6 w-6">
      <path d="M12 2.04C6.48 2.04 2 6.52 2 12.04c0 4.21 2.66 7.8 6.41 9.09-.09-.77-.17-1.95.04-2.79.19-.77 1.22-4.91 1.22-4.91s-.31-.62-.31-1.54c0-1.44.84-2.52 1.89-2.52.89 0 1.32.67 1.32 1.47 0 .9-.57 2.25-.86 3.5-.25 1.05.53 1.91 1.57 1.91 1.89 0 3.16-2.42 3.16-5.29 0-2.19-1.48-3.83-4.18-3.83-3.04 0-4.94 2.28-4.94 4.83 0 .87.26 1.48.67 1.95.19.23.22.32.15.58-.05.19-.17.65-.22.83-.07.27-.29.36-.54.26-1.5-.61-2.18-2.25-2.18-4.1 0-3.04 2.57-6.68 7.67-6.68 4.1 0 6.8 2.97 6.8 6.16 0 4.21-2.34 7.36-5.8 7.36-1.16 0-2.25-.63-2.62-1.34l-.71 2.7c-.21.8-.62 1.8-.92 2.41.69.21 1.42.32 2.18.32 5.52 0 10-4.48 10-10S17.52 2.04 12 2.04z"/>
    </svg>
  </a>
  {/* TikTok */}
<a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="transition-colors duration-300 text-white hover:text-primary">
  <svg fill="currentColor" viewBox="0 0 32 32" className="h-6 w-6">
    <path d="M21.333 2.667h2.667a1.333 1.333 0 0 1 1.333 1.333v2.667a5.333 5.333 0 0 0 5.334 5.333v3.334a8.667 8.667 0 0 1-8-4.667v10.333a6.667 6.667 0 1 1-6.667-6.667h1.333v3.334h-1.333a3.333 3.333 0 1 0 3.333 3.333V2.667z"/>
  </svg>
</a>
  {/* Facebook */}
  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="transition-colors duration-300 text-white hover:text-primary">
    <svg fill="currentColor" viewBox="0 0 24 24" className="h-6 w-6">
      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 5 3.66 9.13 8.44 9.88v-6.99H7.9v-2.89h2.54V9.41c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.45h-1.25c-1.23 0-1.61.77-1.61 1.56v1.87h2.74l-.44 2.89h-2.3v6.99C18.34 21.13 22 17 22 12z"/>
    </svg>
  </a>
</div>
        </div>
      </div>
    </div>
  );
}

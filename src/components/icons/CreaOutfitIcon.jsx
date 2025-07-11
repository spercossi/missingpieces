const CreaOutfitIcon = () => (
<svg width="50" height="50" fill="none" viewBox="0 0 32 32" aria-label="Crea outfit" role="img">

            {/* Gancio: parte dritto da 16,16 e poi curva */}
            <path
              d="M16 16 L16 12 Q16 9 19 9 Q21 9 21 11"
              stroke="#D27D7D"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Spalle */}
            <polyline
              points="8,22 16,16 24,22"
              stroke="#90A4AE"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {/* Barra base */}
            <line
              x1="8"
              y1="22"
              x2="24"
              y2="22"
              stroke="#90A4AE"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Simbolo + */}
            <line
              x1="26"
              y1="26"
              x2="30"
              y2="26"
              stroke="#D27D7D"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="28"
              y1="24"
              x2="28"
              y2="28"
              stroke="#D27D7D"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
);
export default CreaOutfitIcon;
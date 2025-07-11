import React from "react";

export default function XIcon({ className = "h-6 w-6 text-black mx-5" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#1E1E1E"
      strokeWidth={2}
      className={className}
      aria-label="Chiudi"
      role="img"
    >
      <line
        x1="6"
        y1="6"
        x2="18"
        y2="18"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="6"
        y1="18"
        x2="18"
        y2="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Servizio per gestire i colori e le loro mappature
// Mappatura completa dei colori presenti nel database con i loro complementari

export const COLOR_MAPPINGS = {
  // Colori di base
  "Red": {
    complementari: ["Green", "Teal", "Khaki"],
    categoria: "Caldi",
    hex: "#FF0000"
  },
  "Blue": {
    complementari: ["Orange", "Yellow", "Goldenrod"],
    categoria: "Freddi",
    hex: "#0000FF"
  },
  "Green": {
    complementari: ["Red", "Pink", "Fuscia"],
    categoria: "Naturali",
    hex: "#008000"
  },
  "Yellow": {
    complementari: ["Purple", "Violet", "Indigo"],
    categoria: "Caldi",
    hex: "#FFFF00"
  },
  "Orange": {
    complementari: ["Blue", "Turquoise", "Aquamarine"],
    categoria: "Caldi",
    hex: "#FFA500"
  },
  "Purple": {
    complementari: ["Yellow", "Goldenrod", "Light Blue"],
    categoria: "Freddi",
    hex: "#800080"
  },
  
  // Varianti di blu
  "Light Blue": {
    complementari: ["Orange", "Yellow", "Pink"],
    categoria: "Freddi",
    hex: "#ADD8E6"
  },
  "Turquoise": {
    complementari: ["Orange", "Red", "Pink"],
    categoria: "Freddi",
    hex: "#40E0D0"
  },
  "Aquamarine": {
    complementari: ["Orange", "Red", "Yellow"],
    categoria: "Freddi",
    hex: "#7FFFD4"
  },
  "Teal": {
    complementari: ["Red", "Orange", "Pink"],
    categoria: "Freddi",
    hex: "#008080"
  },
  "Indigo": {
    complementari: ["Yellow", "Orange", "Goldenrod"],
    categoria: "Freddi",
    hex: "#4B0082"
  },

  // Varianti di rosso/rosa
  "Pink": {
    complementari: ["Green", "Teal", "Light Blue"],
    categoria: "Caldi",
    hex: "#FFC0CB"
  },
  "Fuscia": {
    complementari: ["Green", "Teal", "Aquamarine"],
    categoria: "Caldi",
    hex: "#FF00FF"
  },
  "Violet": {
    complementari: ["Yellow", "Goldenrod", "Green"],
    categoria: "Freddi",
    hex: "#8A2BE2"
  },
  "Puce": {
    complementari: ["Green", "Teal", "Yellow"],
    categoria: "Neutri",
    hex: "#CC8899"
  },
  "Mauv": {
    complementari: ["Yellow", "Green", "Light Blue"],
    categoria: "Neutri",
    hex: "#E0B0FF"
  },

  // Colori naturali
  "Khaki": {
    complementari: ["Blue", "Purple", "Indigo"],
    categoria: "Neutri",
    hex: "#F0E68C"
  },
  "Goldenrod": {
    complementari: ["Blue", "Purple", "Indigo"],
    categoria: "Caldi",
    hex: "#DAA520"
  },

  // Neutri
  "Bianco": {
    complementari: ["Blue", "Red", "Green", "Purple", "Orange", "Yellow"],
    categoria: "Neutri",
    hex: "#FFFFFF"
  },
  "Nero": {
    complementari: ["Bianco", "Yellow", "Orange", "Pink", "Light Blue"],
    categoria: "Neutri",
    hex: "#000000"
  },
  "Grigio": {
    complementari: ["Yellow", "Orange", "Pink", "Light Blue", "Green"],
    categoria: "Neutri",
    hex: "#808080"
  },
  "Beige": {
    complementari: ["Blue", "Turquoise", "Purple", "Teal"],
    categoria: "Neutri",
    hex: "#F5F5DC"
  },
  "Marrone": {
    complementari: ["Blue", "Turquoise", "Light Blue", "Aquamarine"],
    categoria: "Neutri",
    hex: "#A52A2A"
  }
};

import { COLORI_DISPONIBILI } from "../utils/constants";

// Lista di tutti i colori disponibili (ordinata alfabeticamente)  
export const AVAILABLE_COLORS = COLORI_DISPONIBILI.sort();

// Ottiene la categoria di un colore
export function getCategoriaColore(colore) {
  if (!colore || !COLOR_MAPPINGS[colore]) {
    return "Sconosciuto";
  }
  return COLOR_MAPPINGS[colore].categoria;
}

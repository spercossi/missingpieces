// Costanti condivise per le picklist dell'applicazione
// Utilizzate in CreaOutfit, sviluppatori e altri componenti

export const COLORI_DISPONIBILI = [
  "Red", "Blue", "Light Blue", "Yellow", "Green", "Goldenrod", "Bianco", 
  "Turquoise", "Puce", "Pink", "Purple", "Orange", "Violet", "Indigo", 
  "Khaki", "Black", "White", "Gray", "Brown", "Navy"
];

export const STILI_DISPONIBILI = [
  "Tradizionale", "Casual", "Sexy", "Creativo", "Romantico", 
  "Drammatico", "Elegante", "Sportivo", "Vintage"
];

export const TIPI_CAPO_DISPONIBILI = [
  "Camicia", "Guanti", "Canottiera Intima", "Blazer", "Vestito", "Giacca",
  "Scarpe da Running", "Salopette", "Pantalone", "Impermeabile", "Muta da Sub",
  "Tuta da Ginnastica", "Cappello", "T-shirt", "Jeans", "Gonna", "Felpa",
  "Cardigan", "Sneakers", "Stivali", "Borsa", "Cintura"
];

export const MATERIALI_DISPONIBILI = [
  "Cotone", "Cashmere", "Felpa", "Gore-Tex", "Lana", "Seta", "Poliestere", 
  "Denim", "Pelle", "Viscosa", "Lino", "Spandex"
];

export const STAGIONI_DISPONIBILI = ["Primavera", "Estate", "Autunno", "Inverno"];

export const TAGLIE_DISPONIBILI = ["petite", "small", "medium", "large", "extra large"];

export const GENERI_DISPONIBILI = ["Male", "Female", "Unisex"];

// Costanti aggiuntive per validazione
export const CURRENCY_DEFAULT = "EUR";
export const IMAGE_PLACEHOLDER = "/placeholder.jpg";
export const NEGOZIO_DEFAULT = "https://example.com";
export const API_BASE_URL = "http://localhost:3001";

// Dizionario statico delle marche e loro siti ufficiali
// Basato sulle marche effettivamente presenti nel database
export const SITI_MARCHE = {
  // Luxury brands
  'Alexander McQueen': 'https://www.alexandermcqueen.com',
  'Ami Paris': 'https://www.amiparis.com',
  'Balenciaga': 'https://www.balenciaga.com',
  'Bottega Veneta': 'https://www.bottegaveneta.com',
  'Brunello Cucinelli': 'https://www.brunellocucinelli.com',
  'Burberry': 'https://www.burberry.com',
  'Celine': 'https://www.celine.com',
  'Chanel': 'https://www.chanel.com',
  'Comme des Garçons': 'https://www.comme-des-garcons.com',
  'Dior': 'https://www.dior.com',
  'Dolce & Gabbana': 'https://www.dolcegabbana.com',
  'Emilio Pucci': 'https://www.emiliopucci.com',
  'Ermenegildo Zegna': 'https://www.zegna.com',
  'Fendi': 'https://www.fendi.com',
  'Giorgio Armani': 'https://www.armani.com',
  'Givenchy': 'https://www.givenchy.com',
  'Gucci': 'https://www.gucci.com',
  'ucci': 'https://www.gucci.com', // Fix per il typo nel db
  'Hermès': 'https://www.hermes.com',
  'HermÃ¨s': 'https://www.hermes.com', // Fix per l'encoding
  'Hugo Boss': 'https://www.hugoboss.com',
  'Jacquemus': 'https://www.jacquemus.com',
  'Kenzo': 'https://www.kenzo.com',
  'Loewe': 'https://www.loewe.com',
  'Loro Piana': 'https://www.loropiana.com',
  'Louis Vuitton': 'https://www.louisvuitton.com',
  'Michael Kors': 'https://www.michaelkors.com',
  'Missoni': 'https://www.missoni.com',
  'Miu Miu': 'https://www.miumiu.com',
  'Moncler': 'https://www.moncler.com',
  'Moschino': 'https://www.moschino.com',
  'Prada': 'https://www.prada.com',
  'Roberto Cavalli': 'https://www.robertocavalli.com',
  'Salvatore Ferragamo': 'https://www.ferragamo.com',
  'Stella McCartney': 'https://www.stellamccartney.com',
  'Tod\'s': 'https://www.tods.com',
  'Valentino': 'https://www.valentino.com',
  'Versace': 'https://www.versace.com',
  'Yves Saint Laurent': 'https://www.ysl.com',

  // Fashion brands
  'Calvin Klein': 'https://www.calvinklein.com',
  'Diesel': 'https://www.diesel.com',
  'G-Star Raw': 'https://www.g-star.com',
  'Guess': 'https://www.guess.com',
  'Harmont & Blaine': 'https://www.harmontblaine.com',
  'Imperial': 'https://www.imperialfashion.com',
  'Lacoste': 'https://www.lacoste.com',
  'Lee': 'https://www.lee.com',
  'Levi\'s': 'https://www.levi.com',
  'Liu Jo': 'https://www.liujo.com',
  'Max Mara': 'https://www.maxmara.com',
  'Ralph Lauren': 'https://www.ralphlauren.com',
  'Replay': 'https://www.replay.it',
  'Scotch & Soda': 'https://www.scotch-soda.com',
  'Tommy Hilfiger': 'https://www.tommy.com',
  'Tommy Jeans': 'https://www.tommy.com',
  'Twinset': 'https://www.twinset.com',
  '7 Camicie': 'https://www.7camicie.com',

  // Sports brands
  'Adidas': 'https://www.adidas.com',
  'Arc\'teryx': 'https://www.arcteryx.com',
  'Champion': 'https://www.champion.com',
  'Columbia Sportswear': 'https://www.columbia.com',
  'Diadora': 'https://www.diadora.com',
  'Fila': 'https://www.fila.com',
  'Geox': 'https://www.geox.com',
  'Joma': 'https://www.joma-sport.com',
  'Kappa': 'https://www.kappa.com',
  'Montura': 'https://www.montura.it',
  'New Balance': 'https://www.newbalance.com',
  'Nike': 'https://www.nike.com',
  'Puma': 'https://www.puma.com',
  'Reebok': 'https://www.reebok.com',
  'The North Face': 'https://www.thenorthface.com',
  'Umbro': 'https://www.umbro.com',
  'Under Armour': 'https://www.underarmour.com',

  // Outdoor brands
  'Carhartt': 'https://www.carhartt.com',
  'Dickies': 'https://www.dickies.com',
  'Patagonia': 'https://www.patagonia.com',
  'Superdry': 'https://www.superdry.com',

  // Fast fashion / Casual
  'ASOS': 'https://www.asos.com',
  'Benetton': 'https://www.benetton.com',
  'Bershka': 'https://www.bershka.com',
  'Decathlon': 'https://www.decathlon.com',
  'Desigual': 'https://www.desigual.com',
  'Forever 21': 'https://www.forever21.com',
  'Gant': 'https://www.gant.com',
  'H&M': 'https://www.hm.com',
  'Jack & Jones': 'https://www.jackjones.com',
  'Mango': 'https://www.mango.com',
  'Only': 'https://www.only.com',
  'OVS': 'https://www.ovs.it',
  'Primark': 'https://www.primark.com',
  'Pull & Bear': 'https://www.pullandbear.com',
  'Selected Femme': 'https://www.selected.com',
  'Selected Homme': 'https://www.selected.com',
  'Shein': 'https://www.shein.com',
  'Stradivarius': 'https://www.stradivarius.com',
  'Temu': 'https://www.temu.com',
  'Topshop': 'https://www.topshop.com',
  'Uniqlo': 'https://www.uniqlo.com',
  'Vero Moda': 'https://www.veromoda.com',
  'Wrangler': 'https://www.wrangler.com',
  'Zara': 'https://www.zara.com',
  'Zara Home': 'https://www.zarahome.com',

  // Underwear / Intimates
  'Calzedonia': 'https://www.calzedonia.com',
  'Intimissimi': 'https://www.intimissimi.com',
  'Oysho': 'https://www.oysho.com',
  'Tezenis': 'https://www.tezenis.com',
  'Triumph': 'https://www.triumph.com',

  // Test/Demo brands
  'Marca Prova': 'https://www.google.com/search?q=Marca+Prova'
};

// Funzione helper per ottenere il sito di una marca
export const getSitoMarca = (marca) => {
  if (!marca) return null;
  
  // cerca la marca esatta
  if (SITI_MARCHE[marca]) {
    return SITI_MARCHE[marca];
  }

  return null;
};

# MissingPieces

Un'applicazione web per la gestione intelligente del guardaroba che aiuta a creare abbinamenti tra i capi posseduti e quelli desiderati.

## Descrizione

MissingPieces è un'app che permette agli utenti di catalogare i propri vestiti, creare una wishlist di capi desiderati e ricevere suggerimenti automatici di abbinamenti basati su algoritmi di compatibilità di colori e stili.

## Funzionalità principali

- **Gestione capi personali**: Upload e catalogazione dei propri vestiti con foto
- **Wishlist intelligente**: Aggiunta di capi dal catalogo alla lista desideri
- **Sistema di abbinamenti**: Algoritmo che suggerisce combinazioni tra capi posseduti e desiderati
- **Notifiche**: Avvisi quando si creano nuovi abbinamenti possibili
- **Pannello amministratore**: Gestione completa del catalogo prodotti e utenti
- **Autenticazione**: Sistema di login con gestione profili utente

## Tecnologie utilizzate

- **Frontend**: React 18, Redux Toolkit per la gestione dello stato
- **Styling**: Tailwind CSS, Material Tailwind per i componenti UI
- **Backend**: JSON Server per simulare API
- **Routing**: React Router DOM
- **Upload**: Gestione caricamento e preview immagini

## Installazione e avvio

Clona il repository:
```bash
git clone https://github.com/TUO_USERNAME/missingpieces.git
cd missingpieces
```

Installa le dipendenze:
```bash
npm install
```

Avvia il server di sviluppo:
```bash
npm run dev
```

In un terminale separato, avvia il backend:
```bash
npm run server
```

L'applicazione sarà disponibile su `http://localhost:5173`

## Script disponibili

- `npm run dev` - Avvia il server di sviluppo Vite
- `npm run build` - Crea la build di produzione
- `npm run server` - Avvia JSON Server sulla porta 3001
- `npm run preview` - Anteprima della build di produzione

## Struttura del progetto

```
src/
├── components/          # Componenti riutilizzabili
│   ├── buttons/
│   ├── cards/
│   └── modals/
├── hooks/              # Custom hooks React
├── pages/              # Componenti pagina
├── services/           # Logica business e API calls
├── store/              # Configurazione Redux
└── utils/              # Funzioni di utilità
```

## Account demo

Per testare l'applicazione:

- **Amministratore**: email `admin@admin.it`, password `admin`
- **Utente standard**: email `utente@gmail.com`, password `utente`

## Design system

L'applicazione utilizza un design coerente con:

- Palette colori terracotta e grigi
- Typography Poppins
- Componenti Material Design
- Animazioni fluide e micro-interazioni

## Database

Il progetto utilizza un file `db.json` con JSON Server che contiene:
- Oltre 300 capi d'abbigliamento nel catalogo
- Dati utenti con autenticazione
- Struttura per capi personali e wishlist

## Algoritmo di abbinamento

L'app implementa un sistema di scoring per valutare la compatibilità tra capi basato su:
- Compatibilità colori (algoritmo colori complementari)
- Abbinamento stili
- Appropriatezza stagionale
- Combinazioni tipologia di capi

## Sviluppo

Il progetto è stato sviluppato come esame finale per il corso Front-End Development di EPICODE, implementando le competenze acquisite in React, gestione stato, API integration e responsive design.

## Licenza

MIT License - vedi file LICENSE per dettagli

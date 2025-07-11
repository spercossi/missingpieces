// gestione capi personali con localStorage e database
const STORAGE_KEY_PREFIX = 'mieiCapi_';

// prende capi dal localStorage
export function getMieiCapi(userId) {
  if (!userId) return [];
  
  const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}${userId}`);
  return stored ? JSON.parse(stored) : [];
}

// salva capi nel localStorage
export function salvaCapi(userId, capi) {
  if (!userId) return false;
  
  try {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${userId}`, JSON.stringify(capi));
    
    // evento per altri componenti
    window.dispatchEvent(new CustomEvent('mieiCapiUpdated', {
      detail: { userId, capi }
    }));
    
    return true;
  } catch {
    return false;
  }
}

// aggiunge capo ai capi personali
export function aggiungiCapo(capo, userId) {
  if (!capo || !userId) return false;
  
  const capi = getMieiCapi(userId);
  
  // controlla se esiste già
  const exists = capi.some(c => c.id === capo.id);
  if (exists) {
    return false;
  }
  
  capi.push(capo);
  return salvaCapi(userId, capi);
}

// rimuove un capo dai capi personali
export function rimuoviCapo(capoId, userId) {
  if (!capoId || !userId) return false;
  
  const capi = getMieiCapi(userId);
  const filteredCapi = capi.filter(c => c.id !== capoId);
  
  if (filteredCapi.length === capi.length) {
    return false;
  }
  
  return salvaCapi(userId, filteredCapi);
}

// aggiorna un capo nei capi personali
export function aggiornaCapo(capoId, updatedData, userId) {
  if (!capoId || !updatedData || !userId) return false;
  
  const capi = getMieiCapi(userId);
  const index = capi.findIndex(c => c.id === capoId);
  
  if (index === -1) {
    return false;
  }
  
  // aggiorna il capo mantenendo i dati originali e sovrascrivendo con i nuovi
  capi[index] = { ...capi[index], ...updatedData };
  
  return salvaCapi(userId, capi);
}

// controlla se un capo è nei capi personali
export function isCapoPersonale(capoId, userId) {
  if (!capoId || !userId) return false;
  
  const capi = getMieiCapi(userId);
  return capi.some(c => c.id === capoId);
}

// carica i capi dal database e sincronizza con localStorage
export async function caricaCapidaDB(userId) {
  if (!userId) return [];

  try {
    
    const response = await fetch('http://localhost:3001/capi_utente');
    
    if (!response.ok) {
      throw new Error('Errore nella risposta del server');
    }
    
    const allCapi = await response.json();
    const userCapi = allCapi.filter(capo => capo.userId === userId);
    
    // salva nel localStorage
    salvaCapi(userId, userCapi);
    
    return userCapi;
  } catch {
    // in caso di errore, ritorna i dati dal localStorage
    const localCapi = getMieiCapi(userId);
    return localCapi;
  }
}

// sincronizza un capo con il database
export async function syncCapoWithDB(capo, operation = 'add') {
  try {
    let response;
    
    switch (operation) {
      case 'add':
        response = await fetch('http://localhost:3001/capi_utente', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(capo)
        });
        break;
        
      case 'update':
        response = await fetch(`http://localhost:3001/capi_utente/${capo.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(capo)
        });
        break;
        
      case 'delete':
        response = await fetch(`http://localhost:3001/capi_utente/${capo.id}`, {
          method: 'DELETE'
        });
        break;
        
      default:
        throw new Error('Operazione non supportata');
    }
    
    if (!response.ok) {
      throw new Error(`Errore nella sincronizzazione: ${response.status}`);
    }
    
    return true;
  } catch {
    return false;
  }
}

// pulisce i dati dal localStorage (logout)
export function clearMieiCapi(userId) {
  if (!userId) return;
  
  try {
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}${userId}`);
  } catch {
    // silently ignore
  }
}

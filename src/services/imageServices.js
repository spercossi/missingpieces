// gestione upload e salvataggio immagini
export async function salvaImmagine(file, userId) {
  if (!file || !userId) {
    throw new Error('File o userId mancanti');
  }

  // genera nome file unico
  const timestamp = Date.now();
  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const fileName = `${userId}_${timestamp}.${extension}`;
  const imagePath = `/user_uploads/${fileName}`;

  // crea formdata per upload
  const formData = new FormData();
  formData.append('image', file);
  formData.append('fileName', fileName);
  formData.append('userId', userId);

  // in un'app reale manderebbe questo al server
  // per ora simula con localStorage
  
  // converte in base64 per salvataggio locale
  const imageBase64 = await convertiInBase64(file);
  
  // salva nel mock storage con chiave speciale
  const imageKey = `userImage_${userId}_${timestamp}`;
  localStorage.setItem(imageKey, imageBase64);
  
  // salva mappatura del percorso
  const imageMappings = JSON.parse(localStorage.getItem('imageMappings') || '{}');
  imageMappings[imagePath] = imageKey;
  localStorage.setItem('imageMappings', JSON.stringify(imageMappings));

  return imagePath;
}

// converte file in base64
function convertiInBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}

// prende immagine dal mock storage
export function getImageFromStorage(imagePath) {
  const imageMappings = JSON.parse(localStorage.getItem('imageMappings') || '{}');
  const imageKey = imageMappings[imagePath];
  
  if (imageKey) {
    const imageBase64 = localStorage.getItem(imageKey);
    if (imageBase64) {
      return imageBase64;
    }
  }
  
  return '/placeholder.svg';
}

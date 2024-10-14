import axios from 'axios';

export const getCityCoordinates = async (address) => {
  try {
    // Remplacez YOUR_API_KEY par votre clé API réelle si nécessaire
    const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
    
    if (response.data && response.data.length > 0) {
      const { lat, lon } = response.data[0];
      return { lat: parseFloat(lat), lon: parseFloat(lon) };
    } else {
      throw new Error('Aucune coordonnée trouvée pour cette adresse');
    }
  } catch (error) {
    console.error('Erreur lors de la géolocalisation:', error);
    throw error;
  }
};
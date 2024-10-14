import axios from 'axios';

interface Coordinates {
  lat: number;
  lon: number;
}

export const getCityCoordinates = async (address: string): Promise<Coordinates> => {
  try {
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
import AsyncStorage from '@react-native-async-storage/async-storage';

let storedToken = null;

// Fonction pour charger le jeton depuis AsyncStorage au démarrage de l'application
export const loadToken = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    storedToken = token;
  } catch (error) {
    console.error('Erreur lors du chargement du jeton', error);
  }
};

// Fonction synchrone pour obtenir le jeton
export const getToken = () => storedToken;

// Fonction pour mettre à jour le jeton
export const setToken = (token) => {
  storedToken = token;
};
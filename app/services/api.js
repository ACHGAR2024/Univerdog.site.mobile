import axios from 'axios';
import { getToken, removeToken } from './auth'; // Assurez-vous d'avoir une fonction removeToken
import { Alert } from 'react-native';
import * as RootNavigation from '../navigation/RootNavigation'; // Créez ce fichier pour la navigation globale

// Créer une instance Axios
const api = axios.create({
  baseURL: 'https://api.univerdog.site/api', // Remplacez par l'URL de votre API
});

// Ajouter un intercepteur pour inclure le token dans chaque requête
api.interceptors.request.use(
  async (config) => {
    const token = await getToken(); // Récupérer le token d'authentification
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Ajouter un intercepteur pour gérer les erreurs d'authentification
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      //console.log('Token expiré ou invalide, déconnexion automatique');
      await removeToken(); // Supprime le token
      
      Alert.alert(
        'Session expirée',
        'Votre session a expiré. Vous allez être redirigé vers la page de connexion.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Redirection vers la page de connexion
              RootNavigation.navigate('Login');
            }
          }
        ]
      );
    }
    return Promise.reject(error);
  }
);

export default api;

export const updateUser = async (user) => {
    try {
        const response = await fetch(`https://api.univerdog.site/api/update/${user.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${await getToken()}`, // Inclure le token ici aussi
            },
            body: JSON.stringify(user),
        });
        return await response.json();
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};
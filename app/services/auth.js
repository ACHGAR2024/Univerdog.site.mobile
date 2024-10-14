import AsyncStorage from '@react-native-async-storage/async-storage'; // Assurez-vous d'installer ce module

export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken'); // Assurez-vous que le nom du jeton est correct
    //console.log('Token récupéré:', token); // Ajout de log
    return token;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem('userToken');
    //console.log('Token supprimé'); // Ajout de log
  } catch (error) {
    console.error('Error during token removal:', error);
    throw error;
  }
};

export const setToken = async (token) => {
  try {
    await AsyncStorage.setItem('userToken', token);
    //console.log('Token stocké:', token); // Ajout de log
  } catch (error) {
    console.error('Error during token storage:', error);
    throw error;
  }
};
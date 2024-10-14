import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { UserContext } from '../context/UserContext';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const DogManagement = () => {
  const user = useContext(UserContext);
  const { token } = useContext(AuthContext);
  const [dogs, setDogs] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetchDogs();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchDogs();
    }, [])
  );

  const fetchDogs = async () => {
    try {
      //console.log('Fetching dogs for user:', user.id);
      const response = await api.get(`/dogs_user/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      //console.log('Dogs fetched successfully:', response.data);
      setDogs(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des chiens', error);
      Alert.alert('Erreur', 'Impossible de récupérer les chiens');
    }
  };

  const handleEditDog = dog => {
    navigation.navigate('UpdateDog', { dog });
  };

  const handleDeleteDog = async dogId => {
    Alert.alert(
      'Confirmation',
      'Êtes-vous sûr de vouloir supprimer ce chien ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          onPress: async () => {
            try {
              //console.log('Tentative de suppression du chien avec ID:', dogId);
              //console.log('Token utilisé:', token);

              const response = await api.delete(`/dogs/${dogId}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              console.log('Réponse de suppression:', response.data);

              Alert.alert('Succès', 'Chien supprimé avec succès');
              fetchDogs();
            } catch (error) {
              console.error(
                'Erreur détaillée lors de la suppression du chien:',
                error.response || error,
              );
              //console.log("Status de l'erreur:", error.response?.status);
              //console.log("Message d'erreur:", error.response?.data);

              if (error.response?.status === 401) {
                Alert.alert(
                  "Erreur d'authentification",
                  'Votre session a peut-être expiré. Veuillez vous reconnecter.',
                );
                // Ici, vous pouvez ajouter une logique pour rediriger l'utilisateur vers la page de connexion
              } else {
                Alert.alert(
                  'Erreur',
                  'Impossible de supprimer le chien. Veuillez réessayer.',
                );
              }
            }
          },
        },
      ],
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.subtitle}>Mes chiens</Text>
      {dogs.map(dog => (
        <View key={dog.id} style={styles.dogItem}>
          <Text style={styles.dogName}>{dog.name_dog}</Text>
          <View style={styles.dogActions}>
            <TouchableOpacity onPress={() => handleEditDog(dog)}>
              <FontAwesome5 name="edit" size={24} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteDog(dog.id)}>
              <FontAwesome5 name="trash" size={24} color={colors.error} />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const colors = {
  primary: '#ff4b2b',
  secondary: '#121212',
  white: '#ffffff',
  lightGray: '#E0E0E0',
  darkGray: '#484848',
  yellow: '#ffc333',
  gray: '#808080',
  error: '#CF6679',
  black: '#000000',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondary,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.yellow,
    marginTop: 20,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: colors.primary,
    marginVertical: 5,
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  dogItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.darkGray,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  dogName: {
    fontSize: 18,
    color: colors.white,
  },
  dogActions: {
    flexDirection: 'row',
    width: 70,
    justifyContent: 'space-between',
  },
});

export default DogManagement;

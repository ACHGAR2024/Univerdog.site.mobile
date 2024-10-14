import React, { useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Importez Picker depuis le nouveau package
import { FontAwesome } from '@expo/vector-icons';
import colors from '../styles/colors';
import { UserContext } from '../context/UserContext';

const BASE_URL = 'https://api.univerdog.site/api/appointments';

// Fonction pour récupérer les rendez-vous
const fetchAppointments = async (professionalId, token) => {
  console.log('Début de fetchAppointments');
  console.log('professionalId:', professionalId);
  console.log('token:', token);
  try {
    const response = await axios.get(
      `https://api.univerdog.site/api/appointments_pro/${professionalId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );
    console.log("Réponse de l'API:", response.data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      // Ne pas afficher d'erreur dans la console pour 404
      return []; // Retourner une liste vide
    } else {
      console.error('Erreur lors de la récupération des rendez-vous:', error);
      console.error("Message d'erreur:", error.message);
      console.error("Réponse de l'API en cas d'erreur:", error.response?.data);
      throw error;
    }
  }
};

// Fonction pour mettre à jour un rendez-vous
const updateAppointment = async (appointmentId, updatedData, token) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/${appointmentId}`,
      updatedData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du rendez-vous:', error);
    throw error;
  }
};

// Fonction pour supprimer un rendez-vous
const deleteAppointment = async (appointmentId, token) => {
  try {
    await axios.delete(`${BASE_URL}/${appointmentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du rendez-vous:', error);
    throw error;
  }
};

// Composant React pour gérer les rendez-vous
const AppointmentsManagerUser = () => {
  const user = useContext(UserContext);
  const [appointments, setAppointments] = useState([]);
  const [updatedReason, setUpdatedReason] = useState(''); // State for reason input
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null); // Track selected appointment for update
  const { token } = useContext(AuthContext); // Get the token from AuthContext
  const [professionals, setProfessionals] = useState([]);
  const [selectedProfessional, setSelectedProfessional] = useState(null);

  const [dogData, setDogData] = useState(null);
  console.log('user:', user.id);
  useEffect(() => {
    // Charger la liste des professionnels
    const fetchProfessionals = async () => {
      try {
        const response = await axios.get(
          'https://api.univerdog.site/api/professionals',
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );
        setProfessionals(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des professionnels:', error);
      }
    };

    fetchProfessionals();
  }, [token]);

  const fetchDogUsers = useCallback(async () => {
    if (!user || !user.id) return;
    try {
      const response = await axios.get(
        `https://api.univerdog.site/api/dogs_user/${user.id}`,
      );
      const dogData = response.data
        .filter(dog => dog.user_id === user.id)
        .map(dog => ({ id: dog.id, name: dog.name_dog }));
      setDogData(dogData);
      console.log('dogData:', dogData);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des chiens de l'utilisateur",
        error,
      );
    }
  }, [user]);

  useEffect(() => {
    if (selectedProfessional && dogData) {
      const loadAppointments = async () => {
        try {
          const data = await fetchAppointments(selectedProfessional, token);
          const filteredData = data.filter(appointment =>
            dogData.some(dog => dog.id === appointment.dog_id),
          );
          setAppointments(filteredData);
        } catch (error) {
          if (error.response && error.response.status === 404) {
            // Ne pas afficher d'erreur dans la console pour 404
            setAppointments([]); // Vider la liste des rendez-vous
          } else {
            console.error('Erreur dans loadAppointments:', error);
          }
        }
      };
      loadAppointments();
    }
  }, [selectedProfessional, token, dogData]);

  useEffect(() => {
    fetchDogUsers(); // Appeler fetchDogUsers pour récupérer les données des chiens
  }, [fetchDogUsers]);

  const handleUpdateAppointment = async () => {
    if (!selectedAppointmentId || !updatedReason) return;

    try {
      const updatedAppointment = await updateAppointment(
        selectedAppointmentId,
        { reason: updatedReason },
        token,
      );
      setAppointments(
        appointments.map(app =>
          app.id === selectedAppointmentId ? updatedAppointment : app,
        ),
      );
      setUpdatedReason(''); // Reset input field after update
      setSelectedAppointmentId(null); // Reset selected appointment
    } catch (error) {
      console.error('Erreur lors de la mise à jour du rendez-vous:', error);
    }
  };

  const handleDeleteAppointment = async id => {
    try {
      const confirmDelete = await new Promise(resolve => {
        Alert.alert(
          'Confirmation',
          'Êtes-vous sûr de vouloir supprimer ce rendez-vous ?',
          [
            { text: 'Non', onPress: () => resolve(false), style: 'cancel' },
            { text: 'Oui', onPress: () => resolve(true) },
          ],
          { cancelable: false },
        );
      });

      if (confirmDelete) {
        await deleteAppointment(id, token);
        setAppointments(appointments.filter(app => app.id !== id));
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du rendez-vous:', error);
    }
  };

  const editAppointment = id => {
    const appointment = appointments.find(app => app.id === id);
    setUpdatedReason(appointment.reason); // Changé de setUpdateReason à setUpdatedReason
    setSelectedAppointmentId(id); // Ajouté pour garder une trace de l'ID du rendez-vous en cours d'édition
  };

  const renderAppointment = ({ item }) => {
    const dogName =
      dogData.find(dog => dog.id === item.dog_id)?.name || 'Nom inconnu';

    return (
      <View style={styles.appointmentItem}>
        <View style={styles.appointmentInfo}>
          <Text style={styles.dateTime}>
            <FontAwesome name="calendar" size={18} color={styles.text.color} />{' '}
            {item.date_appointment}{' '}
            <FontAwesome name="clock-o" size={18} color={styles.text.color} />{' '}
            {item.time_appointment}
          </Text>
          <Text style={styles.nameDog}>
            <FontAwesome name="paw" size={22} color={styles.text.color} />{' '}
            {dogName}
          </Text>
          <Text style={styles.reason}>
            <FontAwesome
              name="info-circle"
              size={18}
              color={styles.text.color}
            />{' '}
            {item.reason}
          </Text>
          <Text
            style={[
              styles.status,
              {
                color:
                  item.status === 'Confirmé'
                    ? styles.primaryColor
                    : item.status === 'Annulé'
                    ? styles.errorColor
                    : styles.warningColor,
              },
            ]}
          >
            <FontAwesome name="flag" size={18} /> {item.status}
          </Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => editAppointment(item.id)}
            style={styles.actionButton}
          >
            <FontAwesome
              name="pencil"
              size={30}
              color={styles.secondaryColor}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDeleteAppointment(item.id)}
            style={styles.actionButton}
          >
            <FontAwesome name="trash" size={30} color={styles.errorColor} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <FontAwesome name="calendar" size={24} color="#ff6200" />
        <Text style={styles.title}>Gestion des Rendez-vous</Text>
      </View>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedProfessional}
          style={styles.picker}
          onValueChange={itemValue => setSelectedProfessional(itemValue)}
        >
          <Picker.Item label="Sélectionnez un professionnel" value={null} />
          {professionals.map(pro => (
            <Picker.Item key={pro.id} label={pro.company_name} value={pro.id} />
          ))}
        </Picker>
      </View>

      <View style={styles.updateForm}>
        <TextInput
          style={styles.input}
          placeholder="Modification raison"
          placeholderTextColor={styles.secondaryColor}
          value={updatedReason}
          onChangeText={setUpdatedReason}
        />
        <TouchableOpacity
          style={styles.updateButton}
          onPress={handleUpdateAppointment}
        >
          <Text style={styles.buttonText}>Modifier</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        style={styles.flatList}
        data={appointments}
        renderItem={renderAppointment}
        keyExtractor={item => item.id.toString()}
        ListHeaderComponent={<View style={styles.listHeader} />}
        ListFooterComponent={<View style={styles.listFooter} />}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>
            Aucun rendez-vous trouvé pour ce professionnel
          </Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: 10,
  },
  updateForm: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 5,
    backgroundColor: colors.inputBackground,
    color: colors.text,
    marginRight: 10,
  },
  updateButton: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  appointmentItem: {
    backgroundColor: colors.cardBackground,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: colors.border,
  },
  appointmentInfo: {
    marginBottom: 10,
  },
  dateTime: {
    color: colors.text,
    fontSize: 16,
    marginBottom: 5,
  },
  nameDog: {
    color: colors.text,
    fontSize: 16,
    marginBottom: 5,
    marginTop: 5,
  },
  reason: {
    color: colors.text,
    marginTop: 5,
  },
  status: {
    fontWeight: 'bold',
    marginTop: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    padding: 5,
    marginLeft: 10,
  },
  text: {
    color: '#ffffff', // --text-color
  },
  primaryColor: 'green', // --primary-color
  secondaryColor: '#6c757d', // --secondary-color
  warningColor: '#ffc107', // Couleur d'avertissement pour "En attente"
  errorColor: '#dc3545', // --error-color
  flatList: {
    flex: 1,
  },
  listHeader: {
    height: 20, // Ajustez selon vos besoins
  },
  listFooter: {
    height: 20, // Ajustez selon vos besoins
  },
  emptyText: {
    color: colors.text,
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
  pickerContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 5,
    backgroundColor: colors.inputBackground,
  },
  picker: {
    color: colors.text,
    height: 50,
  },
});

export default AppointmentsManagerUser;

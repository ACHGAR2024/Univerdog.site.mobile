import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  ScrollView,
  Alert,
} from 'react-native';
import { colors, fontSizes } from '../styles/theme';
import CalendarComponent from '../components/CalendarComponent';
import TimePicker from '../components/TimePicker';
import { useRoute, useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import { UserContext } from '../context/UserContext';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import api from '../services/api';

const availableTimes = [
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
];

const RdvVet = () => {
  const { token } = useContext(AuthContext);
  const route = useRoute();
  const navigation = useNavigation();
  const { serviceType, vetId } = route.params;
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDog, setSelectedDog] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const user = useContext(UserContext);
  const [dogs, setDogs] = useState([]);

  console.log('vetId', vetId);
  const fetchAppointmentsForProfessional = async vetId => {
    try {
      const response = await api.get(`/appointments_pro/${vetId}`);
      const data = response.data;

      const filteredData = data
        .map(appointment => {
          let service = appointment.reason;
          if (appointment.reason && appointment.reason.includes(':')) {
            [, service] = appointment.reason.split(':');
          }

          return {
            date: appointment.date_appointment || '',
            time: appointment.time_appointment
              ? appointment.time_appointment.slice(0, 3) + '00'
              : '',
            service: service ? service.trim().toLowerCase() : '',
            status: appointment.status || '',
            id: appointment.id,
            professional_id: appointment.professional_id,
          };
        })
        .filter(appointment => appointment.date && appointment.time);
      console.log('filteredData', filteredData); // Correction ici
      setFilteredAppointments(filteredData);
    } catch (error) {
      setFilteredAppointments([]);
      console.log('Erreur lors de la récupération des rendez-vous:', error);
    }
  };

  useEffect(() => {
    const fetchDogs = async () => {
      try {
        const response = await api.get(`/dogs_user/${user.id}`);
        const dogsData = response.data.map(dog => ({
          label: dog.name_dog,
          value: dog.id,
        }));
        setDogs(dogsData);
      } catch (error) {
        console.error('Erreur lors de la récupération des chiens:', error);
        Alert.alert(
          'Erreur',
          'Impossible de récupérer la liste des chiens. Veuillez réessayer.',
        );
      }
    };

    fetchDogs();
    fetchAppointmentsForProfessional(vetId); // Appel de la fonction pour récupérer les rendez-vous
  }, [user.id, vetId]);

  const handleDateSelect = date => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = time => {
    setSelectedTime(time);
  };

  const handleDogSelect = value => {
    setSelectedDog(value);
  };

  const handleSubmit = async () => {
    if (selectedDate && selectedTime && selectedDog) {
      const newAppointment = {
        date_appointment: selectedDate,
        time_appointment: selectedTime,
        reason: 'RDV :' + serviceType,
        status: 'En attente',
        dog_id: selectedDog,
        professional_id: vetId.toString(),
      };
      setAppointments([...appointments, newAppointment]);

      try {
        const response = await axios.post(
          'https://api.univerdog.site/api/appointments',
          newAppointment,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        console.log('Réponse de la création de rendez-vous:', response.data);
        Alert.alert('Succès', 'Rendez-vous confirmé avec succès !');
        navigation.navigate('DashboardUser');
      } catch (error) {
        console.error('Erreur lors de la prise de rendez-vous:', error);
        Alert.alert(
          'Erreur',
          'Échec de la prise de rendez-vous. Veuillez vérifier votre connexion et réessayer.',
        );
      }
    } else {
      Alert.alert(
        'Erreur',
        'Veuillez sélectionner une date, une heure et un chien.',
      );
    }
  };

  const isDayFullyBooked = date => {
    const timesInDay = filteredAppointments
      .filter(appointment => appointment.date === date)
      .map(appointment => appointment.time);
    return availableTimes.every(time => timesInDay.includes(time));
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.text}>
          Prendre un rendez-vous pour {serviceType}
        </Text>
        <View style={styles.viewPicker}>
          <RNPickerSelect
            style={pickerSelectStyles}
            placeholder={{ label: 'Choisir un de vos chiens', value: null }}
            onValueChange={handleDogSelect}
            items={dogs}
          />
        </View>

        <View style={styles.calendarContainer}>
          <CalendarComponent
            onDateSelect={handleDateSelect}
            appointments={filteredAppointments}
            isDayFullyBooked={isDayFullyBooked}
          />
        </View>
        {selectedDate && (
          <View style={styles.timePickerContainer}>
            <TimePicker
              onTimeSelect={handleTimeSelect}
              selectedDate={selectedDate}
              appointments={filteredAppointments.filter(
                a => a && a.date && a.time,
              )}
            />
          </View>
        )}
        <View style={styles.buttonContainer}>
          <Button
            title="Confirmer le rendez-vous"
            onPress={handleSubmit}
            color={colors.primary}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    marginBottom: 40,
    marginTop: 15,
    width: '100%',
  },
  calendarContainer: {
    height: 350,
    width: '100%',
  },
  container: {
    alignItems: 'center',
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  text: {
    color: colors.text.primary,
    fontSize: fontSizes.large,
    marginBottom: 15,
    textAlign: 'center',
  },
  timePickerContainer: {
    marginTop: 5,
    width: '100%',
  },
  viewPicker: {
    backgroundColor: colors.secondaryText,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
  },
});

const pickerSelectStyles = StyleSheet.create({
  // Suppression des styles inutilisés
});

export default RdvVet;

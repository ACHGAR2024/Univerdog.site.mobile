import React, { useState, useEffect } from 'react'; // Supprimer useEffect
import {
  View,
  Text,
  StyleSheet,
  Button,
  ScrollView,
  Alert,
} from 'react-native'; // Importer Alert
import { colors, fontSizes } from '../styles/theme';
import CalendarComponent from '../components/CalendarComponent';
import TimePicker from '../components/TimePicker';
import { useRoute, useNavigation } from '@react-navigation/native'; // Importer useNavigation et useRoute
import RNPickerSelect from 'react-native-picker-select';
import api from '../services/api'; // Importer le service API
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { AuthContext } from '../context/AuthContext';

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

const Rdv = () => {
  const { token } = useContext(AuthContext);
  const route = useRoute();
  const navigation = useNavigation(); // Utiliser useNavigation pour la navigation
  const { serviceType } = route.params;
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDog, setSelectedDog] = useState('');
  const [selectedProfessional, setSelectedProfessional] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const user = useContext(UserContext);
  const [dogs, setDogs] = useState([]);
  const [professionals, setProfessionals] = useState([]);

  useEffect(() => {
    const fetchDogs = async () => {
      try {
        const response = await api.get(`/dogs_user/${user.id}`);
        const dogsData = response.data.map(dog => ({
          label: dog.name_dog,
          value: dog.id.toString(),
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

    const fetchProfessionals = async () => {
      try {
        // Récupérer tous les professionnels
        const professionalResponse = await api.get('/professionals');
        const allProfessionals = professionalResponse.data;

        // Récupérer les spécialités de toiletteur canin
        const specialtyResponse = await api.get('/speciality', {
          params: { name_speciality: 'Toiletteur canin' },
        });
        const toiletteurSpecialties = specialtyResponse.data;

        // Filtrer les professionnels qui sont des toiletteurs canins
        const toiletteurProfessionals = allProfessionals.filter(professional =>
          toiletteurSpecialties.some(
            specialty =>
              specialty.professional_id === professional.id &&
              specialty.name_speciality === 'Toiletteur canine',
          ),
        );

        // Formater les données pour le sélecteur
        const professionalsData = toiletteurProfessionals.map(professional => ({
          label: `${professional.company_name}`,
          value: professional.id.toString(),
        }));

        setProfessionals(professionalsData);
      } catch (error) {
        console.error(
          'Erreur lors de la récupération des professionnels:',
          error,
        );
        Alert.alert(
          'Erreur',
          'Impossible de récupérer la liste des toiletteurs canins. Veuillez réessayer.',
        );
      }
    };

    fetchDogs();
    fetchProfessionals();
  }, [user.id]);

  const fetchAppointmentsForProfessional = async professionalId => {
    try {
      // Nous gardons la requête originale pour le moment
      const response = await api.get(`/appointments_pro/${professionalId}`);
      const data = response.data;

      //console.log('Données brutes reçues:', data);

      // Filtrer les données pour ne garder que les rendez-vous du professionnel sélectionné
      const filteredData = data;

      //console.log('Données filtrées pour le professionnel:', filteredData);

      // Transformer les données filtrées
      const formattedData = filteredData
        .map(appointment => {
          // console.log("Traitement de l'appointment:", appointment);

          let service = appointment.reason;
          if (appointment.reason && appointment.reason.includes(':')) {
            [, service] = appointment.reason.split(':');
          }

          //appointment.time_appointment = appointment.time_appointment.slice(0, 3) + ':00:00';
          console.log(
            'appointment.time_appointment',
            appointment.time_appointment,
          );
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

      //console.log('Données formatées:', formattedData);

      setFilteredAppointments(formattedData);
    } catch (error) {
      setFilteredAppointments([]); // Vider le calendrier en cas d'erreur
      console.log('Erreur lors de la récupération des rendez-vous:', error);
      // Vous pouvez également afficher une alerte à l'utilisateur si nécessaire
      // Alert.alert('Erreur', 'Impossible de récupérer les rendez-vous. Veuillez réessayer.');
    }
  };

  const handleProfessionalSelect = value => {
    setSelectedProfessional(value);
    if (value) {
      setFilteredAppointments([]);
      fetchAppointmentsForProfessional(value);
    } else {
      setFilteredAppointments([]);
    }
  };

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
    if (selectedDate && selectedTime && selectedDog && selectedProfessional) {
      const newAppointment = {
        date_appointment: selectedDate,
        time_appointment: selectedTime, // Utiliser le format H:i
        reason: 'Toilettage :' + serviceType,
        status: 'En attente',
        dog_id: selectedDog,
        professional_id: selectedProfessional,
      };
      setAppointments([...appointments, newAppointment]);

      //console.log('Données envoyées:', newAppointment);

      try {
        const response = await api.post('/appointments', newAppointment, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Réponse de création de rendez-vous:', response.data);
        //console.log('Rendez-vous confirmé:', response.data);
        // Afficher un message de réussite
        Alert.alert('Succès', 'Rendez-vous confirmé avec succès !');

        // Naviguer immédiatement
        navigation.navigate('DashboardUser');
      } catch (error) {
        console.error('Erreur lors de la prise de rendez-vous:', error);
        // Utilisez error ici si nécessaire
        Alert.alert(
          'Erreur',
          'Impossible de prendre le rendez-vous. Veuillez réessayer.',
        );
      }
    } else {
      Alert.alert(
        'Erreur',
        'Veuillez sélectionner une date, une heure, un chien et un professionnel.',
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
        <View style={styles.viewPicker}>
          <RNPickerSelect
            style={pickerSelectStyles}
            placeholder={{
              label: 'Choisir un toiletteur canin',
              value: null,
            }}
            onValueChange={handleProfessionalSelect}
            items={professionals}
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
    marginBottom: 40, // Réorganisé
    marginTop: 15, // Réorganisé
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
    flexGrow: 1, // Réorganisé
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
    borderRadius: 10, // Réorganisé
    marginBottom: 20,
    width: '100%',
  },
});

const pickerSelectStyles = StyleSheet.create({
  // Suppression des styles inutilisés
});

export default Rdv;

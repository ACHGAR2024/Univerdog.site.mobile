import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { colors, fontSizes } from '../styles/theme';
import { Calendar } from 'react-native-calendars';
import { useRoute, useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import api from '../services/api';
import { UserContext } from '../context/UserContext';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Icon from 'react-native-vector-icons/FontAwesome';

const ReservationGard = () => {
  const { token } = useContext(AuthContext);
  const route = useRoute();
  const navigation = useNavigation();
  const { serviceType } = route.params;
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [selectedDog, setSelectedDog] = useState('');
  const [selectedProfessional, setSelectedProfessional] = useState('');
  const [appointments, setAppointments] = useState([]);
  const user = useContext(UserContext);
  const [dogs, setDogs] = useState([]);
  const [professionals, setProfessionals] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);

  // console.log('Initial state:', { serviceType, user });

  useEffect(() => {
    const fetchDogs = async () => {
      try {
        const response = await api.get(`/dogs_user/${user.id}`);
        const dogsData = response.data.map(dog => ({
          label: dog.name_dog,
          value: dog.id.toString(),
        }));
        setDogs(dogsData);
        //console.log('Fetched dogs:', dogsData.id);
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
        const professionalResponse = await api.get('/professionals');
        const allProfessionals = professionalResponse.data;

        const specialtyResponse = await api.get('/speciality', {
          params: { name_speciality: 'Pension canine' },
        });
        const pensionSpecialties = specialtyResponse.data;

        const pensionProfessionals = allProfessionals.filter(professional =>
          pensionSpecialties.some(
            specialty =>
              specialty.professional_id === professional.id &&
              specialty.name_speciality === 'Pension canine',
          ),
        );
        // Formater les données pour le sélecteur
        const professionalsData = pensionProfessionals.map(professional => ({
          label: `${professional.company_name}`,
          value: professional.id.toString(),
        }));

        setProfessionals(professionalsData);
        // console.log('Fetched professionals:', professionalsData);
      } catch (error) {
        console.error(
          'Erreur lors de la récupération des professionnels:',
          error,
        );
        Alert.alert(
          'Erreur',
          'Impossible de récupérer la liste des pensions canines. Veuillez réessayer.',
        );
      }
    };

    fetchDogs();
    fetchProfessionals();
  }, [user.id]);

  useEffect(() => {
    if (filteredAppointments.length > 0) {
      console.log('Nombre de rendez-vous filtrés:', filteredAppointments.length);
    }
  }, [filteredAppointments]);

  const fetchAppointmentsForProfessional = async professionalId => {
    try {
      const response = await api.get(`/appointments_pro/${professionalId}`);
      const data = response.data;

      const formattedData = data
        .map(appointment => ({
          date: appointment.date_appointment || '',
          reason: appointment.reason || '',
          status: appointment.status || '',
          id: appointment.id,
          professional_id: appointment.professional_id,
        }))
        .filter(appointment => appointment.date);

      setFilteredAppointments(formattedData);
      // console.log('Fetched appointments:', formattedData);
    } catch (error) {
      setFilteredAppointments([]);
      console.error('Erreur lors de la récupération des rendez-vous:', error);
    }
  };

  useEffect(() => {
    if (selectedProfessional) {
      fetchAppointmentsForProfessional(selectedProfessional);
    }
  }, [selectedProfessional]);

  const handleProfessionalSelect = value => {
    setSelectedProfessional(value);
    // console.log('Selected professional:', value);
    if (value) {
      setFilteredAppointments([]);
      fetchAppointmentsForProfessional(value);
    } else {
      setFilteredAppointments([]);
    }
  };

  const handleDateSelect = day => {
    // console.log('Selected day:', day);
    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      setSelectedStartDate(day.dateString);
      setSelectedEndDate(null);
    } else {
      if (new Date(day.dateString) >= new Date(selectedStartDate)) {
        setSelectedEndDate(day.dateString);
      } else {
        setSelectedEndDate(selectedStartDate);
        setSelectedStartDate(day.dateString);
      }
    }
    // console.log('Updated dates:', { start: selectedStartDate, end: selectedEndDate });
  };

  const getMarkedDates = () => {
    const markedDates = {};
    if (selectedStartDate) {
      markedDates[selectedStartDate] = {
        startingDay: true,
        color: colors.primary,
        textColor: colors.white,
      };
    }
    if (selectedEndDate) {
      markedDates[selectedEndDate] = {
        endingDay: true,
        color: colors.primary,
        textColor: colors.white,
      };
    }
    if (selectedStartDate && selectedEndDate) {
      let currentDate = new Date(selectedStartDate);
      const endDate = new Date(selectedEndDate);
      while (currentDate < endDate) {
        currentDate.setDate(currentDate.getDate() + 1);
        const dateString = currentDate.toISOString().split('T')[0];
        if (dateString !== selectedEndDate) {
          markedDates[dateString] = {
            color: colors.primary,
            textColor: colors.white,
          };
        }
      }
    }
    // console.log('Marked dates:', markedDates.dateString);
    return markedDates;
  };

  const handleDogSelect = value => {
    setSelectedDog(value);
    //console.log('Selected dog:', value);
  };

  const handleSubmit = async () => {
    //console.log('Soumission de la réservation avec:', { selectedStartDate, selectedEndDate, selectedDog, selectedProfessional });
    if (
      selectedStartDate &&
      selectedEndDate &&
      selectedDog &&
      selectedProfessional
    ) {
      const daysDifference = Math.ceil(
        (new Date(selectedEndDate) - new Date(selectedStartDate)) /
          (1000 * 60 * 60 * 24),
      );
      const newAppointment = {
        date_appointment: selectedStartDate,
        time_appointment: '09:00', // Modifié pour correspondre au format H:i
        reason: `Garde chien ${serviceType} : ${daysDifference} jours`,
        status: 'En attente',
        dog_id: selectedDog,
        professional_id: selectedProfessional,
      };
      setAppointments([...appointments, newAppointment]);
      // console.log('Nouveau rendez-vous:', newAppointment);

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
        console.log('Réponse API:', response.data);
        Alert.alert('Succès', 'Réservation confirmée avec succès !');
        navigation.navigate('DashboardUser');
      } catch (error) {
        console.error('Erreur lors de la prise de rendez-vous:', error);
        if (error.response) {
          console.error("Réponse d'erreur:", error.response.data);
        }
        Alert.alert(
          'Erreur',
          'Impossible de faire la réservation. Veuillez réessayer.',
        );
      }
    } else {
      //  console.log('Informations manquantes pour la réservation');
      Alert.alert(
        'Erreur',
        'Veuillez sélectionner une date de début, une date de fin, un chien et un professionnel.',
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Icon name="calendar" size={24} color={colors.primary} />
        <Text style={styles.titlepage}>Réservation de garde</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>{serviceType}</Text>

        <View style={styles.pickerContainer}>
          <RNPickerSelect
            style={pickerSelectStyles}
            placeholder={{ label: 'Choisir un de vos chiens', value: null }}
            onValueChange={handleDogSelect}
            items={dogs}
          />
        </View>

        <View style={styles.pickerContainer}>
          <RNPickerSelect
            style={pickerSelectStyles}
            placeholder={{
              label: 'Choisir une pension canine',
              value: null,
            }}
            onValueChange={handleProfessionalSelect}
            items={professionals}
          />
        </View>

        <View style={styles.calendarContainer}>
          <Text style={styles.calendarLabel}>
            Sélectionnez les dates de garde :
          </Text>
          <Calendar
            onDayPress={handleDateSelect}
            markedDates={getMarkedDates()}
            markingType={'period'}
            theme={{
              calendarBackground: colors.darkGray,
              textSectionTitleColor: colors.white,
              dayTextColor: colors.white,
              todayTextColor: colors.primary,
              selectedDayTextColor: colors.white,
              monthTextColor: colors.white,
              indicatorColor: colors.primary,
            }}
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Confirmer la réservation</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    
    flex: 1,
    backgroundColor: colors.black,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: colors.darkGray, // Changé de black à darkGray
  },
  titlepage: {
    color: colors.white,
    fontSize: fontSizes.large,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
    backgroundColor: colors.gray, // Ajout d'un fond gris pour le contenu
  },
  sectionTitle: {
    color: colors.white,
    fontSize: fontSizes.medium,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  pickerContainer: {
    backgroundColor: colors.white, // Changé de darkGray à lightGray
    borderRadius: 10,
    marginBottom: 5,
  },
  calendarContainer: {
    backgroundColor: colors.darkGray, // Ajout d'un fond gris foncé pour le calendrier
    padding: 5,
    borderRadius: 10,
  },
  calendarLabel: {
    color: colors.lightGray, // Changé de white à lightGray
    fontSize: fontSizes.medium,
  },
  submitButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: fontSizes.medium,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 4,
    color: colors.darkGray,
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: colors.gray,
    borderRadius: 8,
    color: colors.darkGray,
    paddingRight: 30,
  },
});

export default ReservationGard;

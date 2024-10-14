import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { colors, fontSizes } from '../styles/theme';
import { globalStyles } from '../styles/styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../services/api';
import defaultVetImage from '../../assets/images/vet_defaut.png';

const ServiceCard = ({ icon, title, price, onPress, isSelected }) => (
  <TouchableOpacity
    style={[styles.serviceCard, isSelected && styles.serviceCardSelected]}
    onPress={onPress}
  >
    <Icon name={icon} size={24} color={colors.primary} />
    <Text style={styles.serviceTitle}>{title}</Text>
    <Text style={styles.servicePrice}>{price}</Text>
  </TouchableOpacity>
);

ServiceCard.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
};

const Veterinary = () => {
  const [selectedService, setSelectedService] = useState('');
  // Supprimez ces lignes si elles ne sont pas utilisées
  // const [selectedVet, setSelectedVet] = useState(null);
  const [veterinarians, setVeterinarians] = useState([]);
  const navigation = useNavigation();

  const handleServiceSelection = service => {
    setSelectedService(service);
    // console.log(`Service sélectionné : ${service}`);
  };

  const handleBooking = (vetId, vetName) => {
    if (selectedService) {
      navigation.navigate('RdvVet', {
        serviceType: selectedService,
        vetId: vetId,
        vetName: vetName,
      });
    } else {
      Alert.alert('Erreur', 'Veuillez sélectionner un service.');
    }
  };

  useEffect(() => {
    const fetchVeterinarians = async () => {
      try {
        const professionalResponse = await api.get('/professionals');
        const allProfessionals = professionalResponse.data;

        const specialtyResponse = await api.get('/speciality', {
          params: { name_speciality: 'Vétérinaire' },
        });
        const vetSpecialties = specialtyResponse.data;

        const veterinarianProfessionals = allProfessionals.filter(
          professional =>
            vetSpecialties.some(
              specialty =>
                specialty.professional_id === professional.id &&
                specialty.name_speciality === 'Vétérinaire',
            ),
        );

        const placesResponse = await api.get('/places');
        const places = Array.isArray(placesResponse.data.places)
          ? placesResponse.data.places
          : [];

        const veterinariansData = veterinarianProfessionals.map(
          professional => {
            const place = places.find(
              p => p.user_id === professional.user_id && p.type === 'stethoscope',
            );

            const photoUri =
              place && place.photo ? { uri: place.photo } : defaultVetImage;

            return {
              id: professional.id,
              name: professional.company_name,
              rating: 4.5,
              speciality: 'Vétérinaire',
              photo: photoUri,
            };
          },
        );

        setVeterinarians(veterinariansData);
      } catch (error) {
        console.error(
          'Erreur lors de la récupération des vétérinaires:',
          error,
        );
        Alert.alert(
          'Erreur',
          'Impossible de récupérer la liste des vétérinaires. Veuillez réessayer.',
        );
      }
    };

    fetchVeterinarians();
  }, []);

  return (
    <ScrollView style={globalStyles.container}>
      <View style={styles.marginContainer}>
        <View style={styles.header}>
          <Icon name="user-md" size={30} color={colors.primary} />
          <Text style={styles.titlepage}>Vétérinaires</Text>
        </View>

        <View style={styles.serviceOptions}>
          <ServiceCard
            icon="stethoscope"
            title="Consultation générale"
            price="50€"
            onPress={() => handleServiceSelection('Consultation générale')}
            isSelected={selectedService === 'Consultation générale'}
          />
          <ServiceCard
            icon="calendar-check-o"
            title="Vaccination"
            price="40€"
            onPress={() => handleServiceSelection('Vaccination')}
            isSelected={selectedService === 'Vaccination'}
          />
          <ServiceCard
            icon="flask"
            title="Analyses sanguines"
            price="75€"
            onPress={() => handleServiceSelection('Analyses sanguines')}
            isSelected={selectedService === 'Analyses sanguines'}
          />
          <ServiceCard
            icon="hospital-o"
            title="Radiographie"
            price="100€"
            onPress={() => handleServiceSelection('Radiographie')}
            isSelected={selectedService === 'Radiographie'}
          />
        </View>

        <View style={styles.bookingForm}>
          {veterinarians.map(vet => (
            <View key={vet.id} style={styles.vetCard}>
              <Image
                source={{ uri: `https://api.univerdog.site${vet.photo.uri}` }}
                style={styles.vetPhoto}
              />

              <View style={styles.vetInfo}>
                
                <Text style={styles.vetName}>{`${vet.id}. ${vet.name}`}</Text>
                <Text style={styles.vetRating}>
                  {'⭐'.repeat(Math.floor(vet.rating))}
                  {vet.rating % 1 !== 0 && '⭐️'}
                </Text>
                <Text style={styles.vetSpeciality}>{vet.speciality}</Text>
              </View>
              <TouchableOpacity
                style={globalStyles.button}
                onPress={() => handleBooking(vet.id)}
              >
                <Text style={globalStyles.buttonTextReserve}>
                  Prendre rendez-vous
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  marginContainer: {
    marginBottom: 100,
  },
  bookingForm: {
    backgroundColor: colors.background,
    borderRadius: 10,
    marginVertical: 0,
    padding: 15,
  },
  header: {
    alignItems: 'center',
    backgroundColor: colors.headerBackground,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  serviceCard: {
    alignItems: 'center',
    backgroundColor: colors.black,
    borderRadius: 10,
    elevation: 5,
    marginBottom: 15,
    padding: 15,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    width: '48%',
  },
  serviceCardSelected: {
    backgroundColor: colors.selectedBackground,
  },
  serviceOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
  },
  servicePrice: {
    color: colors.link,
  },
  serviceTitle: {
    color: colors.text.primary,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  titlepage: {
    color: colors.white,
    fontSize: fontSizes.large,
    fontWeight: 'bold',
  },
  vetCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  vetPhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  vetInfo: {
    alignItems: 'center',
    marginBottom: 10,
  },
  vetName: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: fontSizes.medium,
    marginBottom: 5,
  },
  vetRating: {
    color: colors.secondary,
    marginBottom: 5,
  },
  vetSpeciality: {
    color: colors.text.secondary,
    fontSize: fontSizes.small,
  },
  bookAppointmentBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  bookAppointmentBtnText: {
    color: colors.background,
    fontWeight: 'bold',
  },
});

export default Veterinary;

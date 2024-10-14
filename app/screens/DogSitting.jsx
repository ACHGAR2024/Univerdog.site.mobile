import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { colors, fontSizes } from '../styles/theme';
import { globalStyles } from '../styles/styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

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

const DogSitting = () => {
  const [selectedService, setSelectedService] = useState('');
  const navigation = useNavigation();

  const handleServiceSelection = service => {
    setSelectedService(service);
  };

  const handleBooking = () => {
    if (selectedService) {
      navigation.navigate('ReservationGard', { serviceType: selectedService });
    } else {
      Alert.alert('Erreur', 'Veuillez sélectionner un service.');
    }
  };

  return (
    <ScrollView style={globalStyles.container}>
      <View style={styles.header}>
        <Icon name="home" size={24} color={colors.primary} />
        <Text style={styles.titlepage}>Garde de chiens</Text>
      </View>

      <View style={styles.serviceOptions}>
        <ServiceCard
          icon="calendar"
          title="Garde journalière"
          price="30€/jour"
          onPress={() => handleServiceSelection('Garde journalière')}
          isSelected={selectedService === 'Garde journalière'}
        />
        <ServiceCard
          icon="calendar-check-o"
          title="Garde hebdomadaire"
          price="150€/semaine"
          onPress={() => handleServiceSelection('Garde hebdomadaire')}
          isSelected={selectedService === 'Garde hebdomadaire'}
        />
        <ServiceCard
          icon="calendar-plus-o"
          title="Garde mensuelle"
          price="500€/mois"
          onPress={() => handleServiceSelection('Garde mensuelle')}
          isSelected={selectedService === 'Garde mensuelle'}
        />
        <ServiceCard
          icon="paw"
          title="Promenade"
          price="15€/heure"
          onPress={() => handleServiceSelection('Promenade')}
          isSelected={selectedService === 'Promenade'}
        />
      </View>

      <View style={styles.bookingForm}>
        <Text style={styles.bookingTitle}>Réserver une garde</Text>
        <TouchableOpacity style={styles.bookingButton} onPress={handleBooking}>
          <Text style={styles.bookingButtonText}>
            Réserver maintenant
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.promoSection}>
        <Text style={styles.promoTitle}>Promotion du mois</Text>
        <Text style={styles.promoCode}>GARDECHIEN10</Text>
        <Text style={styles.promoDescription}>
          Utilisez ce code pour obtenir 10% de réduction sur votre prochaine garde !
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
 
  header: {
    alignItems: 'center',
    backgroundColor: colors.cardBackground, // Correspond à Shop.jsx
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    
  },
  titlepage: {
    color: colors.white,
    fontSize: fontSizes.large,
    fontWeight: 'bold',
  },
  serviceOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
  },
  serviceCard: {
    alignItems: 'center',
    backgroundColor: colors.black,
    borderRadius: 10,
    elevation: 5, // Correspond à Shop.jsx
    marginBottom: 10,
    marginTop: 20,
    padding: 15,
    shadowColor: colors.shadow, // Correspond à Shop.jsx
    shadowOffset: { width: 0, height: 2 }, // Correspond à Shop.jsx
    shadowOpacity: 0.8, // Correspond à Shop.jsx
    shadowRadius: 2, // Correspond à Shop.jsx
    width: '48%',
    
  },
  serviceCardSelected: {
    backgroundColor: colors.primary,
  },
  serviceTitle: {
    color: colors.white,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  servicePrice: {
    color: colors.primary,
  },
  bookingForm: {
    backgroundColor: colors.black,
    padding: 20,
    marginTop: 10,
  },
  bookingTitle: {
    color: colors.white,
    fontSize: fontSizes.medium,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  bookingButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  bookingButtonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  promoSection: {
    backgroundColor: colors.darkGray,
    padding: 10,
    margin: 10,
    borderRadius: 10,
    marginBottom: 100,
  },
  promoTitle: {
    color: colors.primary,
    fontSize: fontSizes.medium,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  promoCode: {
    backgroundColor: colors.black,
    color: colors.primary,
    padding: 10,
    borderRadius: 5,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  promoDescription: {
    color: colors.white,
    fontSize: fontSizes.small,
  },
});

export default DogSitting;
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { colors, fontSizes } from '../styles/theme';
import { globalStyles } from '../styles/styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Importez le hook de navigation

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

const ProfessionalCard = ({ name, rating, speciality }) => (
  <View style={styles.professionalCard}>
    <View style={styles.professionalAvatar}>
      <Icon name="user" size={24} color={colors.background} />
    </View>
    <View style={styles.professionalInfo}>
      <Text style={styles.professionalName}>{name}</Text>
      <Text style={styles.professionalRating}>{'⭐'.repeat(rating)}</Text>
      <Text style={styles.professionalSpeciality}>{speciality}</Text>
    </View>
  </View>
);

ProfessionalCard.propTypes = {
  name: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired,
  speciality: PropTypes.string.isRequired,
};

const Grooming = () => {
  const [selectedService, setSelectedService] = useState('');
  const navigation = useNavigation(); // Utilisez le hook de navigation

  const handleServiceSelection = service => {
    setSelectedService(service);
    ////console.log(`Service sélectionné : ${service}`);
  };

  const handleBooking = () => {
    if (selectedService) {
      navigation.navigate('Rdv', { serviceType: selectedService });
    } else {
      Alert.alert('Erreur', 'Veuillez sélectionner un service.');
    }
  };

  return (
    <ScrollView style={globalStyles.container}>
      <View style={styles.header}>
        <Icon name="shopping-bag" size={24} color={colors.primary} />
        <Text style={styles.titlepage}>Toilettage</Text>
      </View>

      <View style={styles.serviceOptions}>
        <ServiceCard
          icon="bath"
          title="Bain complet"
          price="30€"
          onPress={() => handleServiceSelection('Bain')}
          isSelected={selectedService === 'Bain'}
        />
        <ServiceCard
          icon="cut"
          title="Coupe et coiffure"
          price="45€"
          onPress={() => handleServiceSelection('Coupe')}
          isSelected={selectedService === 'Coupe'}
        />
        <ServiceCard
          icon="paw"
          title="Coupe de griffes"
          price="15€"
          onPress={() => handleServiceSelection('Griffes')}
          isSelected={selectedService === 'Griffes'}
        />
        <ServiceCard
          icon="gift"
          title="Forfait complet"
          price="75€"
          onPress={() => handleServiceSelection('Forfait complet')}
          isSelected={selectedService === 'Forfait complet'}
        />
      </View>

      <View style={styles.bookingForm}>
        <Text style={globalStyles.title}>Réserver un toilettage</Text>
        <TouchableOpacity style={globalStyles.button} onPress={handleBooking}>
          <Text style={globalStyles.buttonTextReserve}>
            Réserver maintenant
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.promoSection}>
        <Text style={styles.promoTitle}>Promotion du mois</Text>
        <Text style={styles.promoCode}>WOOFWOOF20</Text>
        <Text style={styles.promoDescription}>
          Utilisez ce code pour obtenir 20% de réduction sur votre prochain
          toilettage !
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  bookingForm: {
    backgroundColor: colors.background, // Correspond à Shop.jsx
    borderRadius: 10,
    marginVertical: 0, // Ajouté pour correspondre à Shop.jsx
    padding: 15, // Ajouté pour correspondre à Shop.jsx
  },
  header: {
    alignItems: 'center',
    backgroundColor: colors.cardBackground, // Correspond à Shop.jsx
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  professionalAvatar: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 30,
    height: 60,
    justifyContent: 'center',
    marginRight: 15,
    width: 60,
  },
  professionalCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 10,
    elevation: 5, // Correspond à Shop.jsx
    flexDirection: 'row',
    marginBottom: 10,
    marginHorizontal: 10,
    padding: 15,
    shadowColor: colors.shadow, // Correspond à Shop.jsx
    shadowOffset: { width: 0, height: 2 }, // Correspond à Shop.jsx
    shadowOpacity: 0.8, // Correspond à Shop.jsx
    shadowRadius: 2, // Correspond à Shop.jsx
  },
  professionalInfo: {
    flex: 1,
  },
  professionalName: {
    color: colors.text.primary,
    fontWeight: 'bold',
  },
  professionalRating: {
    color: colors.secondary,
  },
  professionalSpeciality: {
    color: colors.text.secondary,
    fontSize: fontSizes.small,
  },
  promoCode: {
    backgroundColor: colors.background,
    borderRadius: 5,
    color: colors.primary,
    fontWeight: 'bold',
    marginBottom: 10,
    padding: 10,
    textAlign: 'center',
  },
  promoDescription: {
    color: colors.text.secondary,
    fontSize: fontSizes.small,
  },
  promoSection: {
    backgroundColor: colors.cardBackground,
    borderRadius: 10,
    elevation: 5, // Correspond à Shop.jsx
    margin: 10,
    padding: 15,
    shadowColor: colors.shadow, // Correspond à Shop.jsx
    shadowOffset: { width: 0, height: 2 }, // Correspond à Shop.jsx
    shadowOpacity: 0.8, // Correspond à Shop.jsx
    shadowRadius: 2, // Correspond à Shop.jsx
  },
  promoTitle: {
    color: colors.primary,
    fontSize: fontSizes.medium,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  serviceCard: {
    alignItems: 'center',
    backgroundColor: colors.black,
    borderRadius: 10,
    elevation: 5, // Correspond à Shop.jsx
    marginBottom: 15,
    padding: 15,
    shadowColor: colors.shadow, // Correspond à Shop.jsx
    shadowOffset: { width: 0, height: 2 }, // Correspond à Shop.jsx
    shadowOpacity: 0.8, // Correspond à Shop.jsx
    shadowRadius: 2, // Correspond à Shop.jsx
    width: '48%',
  },
  serviceCardSelected: {
    backgroundColor: colors.selectedBackground, // Ajoutez cette couleur dans votre thème
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
});

export default Grooming;

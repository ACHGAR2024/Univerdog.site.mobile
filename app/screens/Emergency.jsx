import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors, fontSizes } from '../styles/theme';
import PropTypes from 'prop-types';

const Emergency = () => {
  const makeCall = () => {
    Linking.openURL('tel:3115');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <FontAwesome5 name="phone-alt" size={40} color={colors.primary} />
        <Text style={styles.title}>Urgences Vétérinaires 3115</Text>
      </View>

      <TouchableOpacity style={styles.callButton} onPress={makeCall}>
        <FontAwesome5 name="phone" size={24} color={colors.white} />
        <Text style={styles.callButtonText}>Appeler le 3115</Text>
      </TouchableOpacity>

      <View style={styles.infoSection}>
        <InfoItem 
          icon="info-circle" 
          text="Numéro national gratuit pour les urgences vétérinaires" 
        />
        <InfoItem 
          icon="clock" 
          text="Disponible 24h/24 et 7j/7" 
        />
        <InfoItem 
          icon="map-marked-alt" 
          text="Couvre plus de 30 millions d'habitants dans 45 départements" 
        />
        <InfoItem 
          icon="user-md" 
          text="Mise en relation avec un vétérinaire de garde à proximité" 
        />
        <InfoItem 
          icon="paw" 
          text="Pour chiens, chats et nouveaux animaux de compagnie" 
        />
      </View>

      <Text style={styles.disclaimer}>
        En cas d&apos;urgence, contactez d&apos;abord votre vétérinaire habituel. Le 3115 est un service complémentaire pour les urgences en dehors des heures d&apos;ouverture.
      </Text>
    </ScrollView>
  );
};

const InfoItem = ({ icon, text }) => (
  <View style={styles.infoItem}>
    <FontAwesome5 name={icon} size={24} color={colors.primary} style={styles.infoIcon} />
    <Text style={styles.infoText}>{text}</Text>
  </View>
);

InfoItem.propTypes = {
  icon: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  container: {
    
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: fontSizes.xlarge,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginTop: 10,
    textAlign: 'center',
  },
  callButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 30,
  },
  callButtonText: {
    color: colors.white,
    fontSize: fontSizes.large,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  infoSection: {
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoIcon: {
    marginRight: 15,
  },
  infoText: {
    fontSize: fontSizes.medium,
    color: colors.text.secondary,
    flex: 1,
  },
  disclaimer: {
    fontSize: fontSizes.small,
    color: colors.text.secondary,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default Emergency;

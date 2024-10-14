import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import axios from 'axios';
import QRCode from 'react-native-qrcode-svg'; // Assurez-vous que ce module est installé

const generateSecureQRCodeURL = dogId => {
  const dogIdcrypted = (dogId * 3456).toString();
  return `https://univerdog.site/dog/${dogIdcrypted}`;
};

const DogProfile = ({ dogData, navigation }) => {
  const [dogPhoto, setDogPhoto] = useState(null);

  useEffect(() => {
    const fetchDogPhoto = async () => {
      try {
        const response = await axios.get(
          'https://api.univerdog.site/api/dogs-photos',
        );
        const photos = response.data;
        const dogPhoto = photos.find(photo => photo.dog_id === dogData.id);
        if (dogPhoto) {
          setDogPhoto(
            `https://api.univerdog.site/storage/dogs_photos/${dogPhoto.photo_name_dog}`,
          );
        }
      } catch (error) {
        console.error(
          'Erreur lors de la récupération de la photo du chien:',
          error,
        );
      }
    };

    fetchDogPhoto();
  }, [dogData.id]);

  const calculateAge = birthDate => {
    const ageDifMs = Date.now() - new Date(birthDate).getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };
  //console.log(dogPhoto);
  return (
    <View style={styles.dogProfile}>
      <View style={styles.dogInfo}>
        <View style={styles.dogAvatar}>
          {dogPhoto ? (
            <Image source={{ uri: dogPhoto }} style={styles.dogAvatarImage} />
          ) : (
            <FontAwesome5 name="dog" size={24} color={colors.secondary} />
          )}
        </View>
        <View style={styles.dogDetails}>
          <Text style={styles.dogName}>{dogData.name_dog}</Text>
          <Text style={styles.dogBreed}>{dogData.breed}</Text>
        </View>
        <Pressable
          style={styles.qrCodeContainer}
          onPress={() =>
            navigation.navigate('QRCode', {
              qrCode: generateSecureQRCodeURL(dogData.id),
            })
          }
        >
          <QRCode
            value={generateSecureQRCodeURL(dogData.id)}
            size={60}
            color="black"
            backgroundColor="white"
          />
        </Pressable>
      </View>
      <View style={styles.healthStatus}>
        <View style={styles.healthItem}>
          <Text style={styles.healthLabel}>Âge</Text>
          <Text style={styles.healthValue}>
            {calculateAge(dogData.birth_date)} ans
          </Text>
        </View>
        <View style={styles.healthItem}>
          <Text style={styles.healthLabel}>Poids</Text>
          <Text style={styles.healthValue}>
            {parseFloat(dogData.weight).toFixed(1)} kg
          </Text>
        </View>
        <View style={styles.healthItem}>
          <Text style={styles.healthLabel}>Sexe</Text>
          <Text style={styles.healthValue}>{dogData.sex}</Text>
        </View>
      </View>
    </View>
  );
};

DogProfile.propTypes = {
  dogData: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name_dog: PropTypes.string.isRequired,
    breed: PropTypes.string.isRequired,
    birth_date: PropTypes.string.isRequired,
    weight: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
      .isRequired,
    sex: PropTypes.string.isRequired,
    qr_code: PropTypes.string.isRequired,
  }).isRequired,
  navigation: PropTypes.object.isRequired,
};

const colors = {
  primary: '#ff4b2b',
  secondary: '#121212',
  white: '#ffffff',
  lightGray: '#E0E0E0',
  darkGray: '#484848',
  yellow: '#ffc333',
  gray: '#AAAAAA',
  orange: '#ff6200',
  lightYellow: '#FFB74D',
  error: '#CF6679',
  red: '#FF0000',
  green: '#00FF00',
  black: '#000000',
};

const styles = StyleSheet.create({
  // ... Copiez les styles pertinents depuis DashboardUser.jsx ...
  container: {
    backgroundColor: colors.secondary,
    borderRadius: 10,
    marginBottom: 20,
    padding: 15,
  },
  dogAvatar: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 30,
    height: 50,
    justifyContent: 'center',
    marginRight: 15,
    width: 50,
  },
  dogBreed: {
    color: colors.gray,
    fontSize: 14,
  },
  dogDetails: {
    flex: 1,
  },
  dogName: {
    color: colors.lightGray,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  dogProfile: {
    backgroundColor: colors.darkGray,
    borderRadius: 10,
    marginBottom: 20,
    padding: 15,
  },
  dogInfo: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  qrCodeContainer: {
    alignItems: 'center',
    backgroundColor: colors.lightYellow,
    borderRadius: 5,
    marginLeft: 'auto',
    padding: 10,
  },
  qrCodeText: {
    color: colors.secondary,
    fontSize: 12,
    marginTop: 5,
  },
  healthStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  healthItem: {
    alignItems: 'center',
  },
  healthLabel: {
    color: colors.gray,
    fontSize: 12,
    marginBottom: 5,
  },
  healthValue: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  dogProfileContainer: {
    backgroundColor: colors.darkGray,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  dogProfileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  dogProfileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  dogProfileInfo: {
    flex: 1,
  },
  dogProfileName: {
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  dogProfileBreed: {
    color: colors.lightGray,
    fontSize: 16,
  },
  qrCodeContainer: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 10,
    height: 60,
    justifyContent: 'center',
    padding: 5,
    width: 60,
  },
  qrCodeText: {
    color: colors.secondary,
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 5,
  },
  sectionTitle: {
    color: colors.yellow,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dogAvatarImage: {
    width: 60,
    height: 60,
    borderRadius: 25,
  },
});

export default DogProfile;

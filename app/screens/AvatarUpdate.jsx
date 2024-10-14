import React, { useCallback, useContext, useState } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { UserContext } from '../context/UserContext';
import * as ImagePicker from 'expo-image-picker';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import colors from '../dashboard/DashboardUser'; // Importation des couleurs
import { FontAwesome5 } from '@expo/vector-icons';
import logo from '../../assets/logo.png';

// Hook personnalisé pour gérer la mise à jour de l'avatar
const useAvatarUpdate = (user, token) => {
  const [avatarUri, setAvatarUri] = useState(null);

  const updateAvatar = useCallback(
    async newImage => {
      if (!user || !user.id) return;

      try {
        const formData = new FormData();
        if (newImage) {
          const uriParts = newImage.split('.');
          const fileType = uriParts[uriParts.length - 1];
          formData.append('image', {
            uri: newImage,
            name: `photo.${fileType}`,
            type: `image/${fileType}`,
          });
        }
        formData.append('_method', 'PUT');

        const response = await axios.post(
          `https://api.univerdog.site/api/update/${user.id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
              'Content-Type': 'multipart/form-data',
            },
          },
        );

        if (response.status === 200) {
          setAvatarUri(response.data.image);
          return response.data.image;
        } else {
          throw new Error("Échec de la mise à jour de l'avatar");
        }
      } catch (error) {
        console.error("Erreur lors de la mise à jour de l'avatar", error);
        throw error;
      }
    },
    [user, token],
  );

  return { avatarUri, updateAvatar };
};

const AvatarUpdate = () => {
  const navigation = useNavigation();
  const { token } = useContext(AuthContext);
  const user = useContext(UserContext);
  const [image, setImage] = useState(null);
  const { avatarUri } = useAvatarUpdate(user, token);

  useFocusEffect(
    useCallback(() => {
      console.log('AvatarUpdate est focalisé');
    }, []),
  );

  const handleImageChange = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      if (image) {
        const uriParts = image.split('.');
        const fileType = uriParts[uriParts.length - 1];
        formData.append('image', {
          uri: image,
          name: `photo.${fileType}`,
          type: `image/${fileType}`,
        });
      }
      formData.append('_method', 'PUT');

      const response = await axios.post(
        `https://api.univerdog.site/api/update/${user.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      if (response.status === 200) {
        Alert.alert('Succès', 'Avatar modifié avec succès !', [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ]);
        // Naviguer vers DashboardUser et forcer le rafraîchissement de l'avatar
        navigation.navigate('DashboardUser', { refreshAvatar: true });
      } else {
        throw new Error("Échec de la mise à jour de l'avatar");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'avatar", error);
      Alert.alert(
        'Erreur',
        "Impossible de mettre à jour l'avatar. Veuillez réessayer.",
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.logoText}>UniverDog</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <FontAwesome5 name="arrow-left" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <View style={styles.imageContainer}>
          {image ? (
            <Image source={{ uri: image }} style={styles.profileImage} />
          ) : avatarUri ? (
            <Image
              source={{ uri: `https://api.univerdog.site${avatarUri}` }}
              style={styles.profileImage}
            />
          ) : (
            <Image
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
              }}
              style={styles.profileImage}
            />
          )}
        </View>

        <TouchableOpacity onPress={handleImageChange}>
          <Text style={styles.uploadButton}>Choisir une image</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
          <Text style={styles.saveButtonText}>Sauvegarder</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const colorsupdate = {
  primary: '#ff4b2b',
  secondary: '#121212',
  white: '#ffffff',
  darkGray: '#484848',
  lightYellow: '#FFB74D',
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colorsupdate.secondary,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 5,
    backgroundColor: colorsupdate.darkGray,
  },
  logo: {
    width: 50,
    height: 50,
  },
  logoText: {
    color: colorsupdate.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 10,
    color: colorsupdate.white,
  },
  form: {
    padding: 30,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 2,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 50,
    borderWidth: 0,
    borderColor: colorsupdate.primary,
  },
  uploadButton: {
    backgroundColor: colorsupdate.darkGray,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: colorsupdate.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonText: {
    color: colorsupdate.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AvatarUpdate;

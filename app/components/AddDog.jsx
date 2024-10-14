import React, { useState, useContext, useEffect, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  Platform,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { UserContext } from '../context/UserContext';
import { AuthContext } from '../context/AuthContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import api from '../services/api';

const getMimeType = uri => {
  if (uri.endsWith('.jpg') || uri.endsWith('.jpeg')) {
    return 'image/jpeg';
  } else if (uri.endsWith('.png')) {
    return 'image/png';
  } else if (uri.endsWith('.webp')) {
    return 'image/webp';
  }
  return '';
};

const AddDog = () => {
  const navigation = useNavigation();
  const user = useContext(UserContext);
  const { token } = useContext(AuthContext);

  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [birthDate, setBirthDate] = useState(new Date());
  const [weight, setWeight] = useState('');
  const [sex, setSex] = useState('');
  const [medicalInfo, setMedicalInfo] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [image, setImage] = useState(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert(
            'Désolé, nous avons besoin de permissions pour accéder à la bibliothèque de photos!',
          );
        }
      }
    })();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      onDogAdded: () => {
        // Logique pour rafraîchir la liste des chiens
        fetchDogs(); // Assurez-vous que fetchDogs est défini dans le composant parent
      },
    });
  }, [navigation]);


  const handleAddDog = async () => {
    if (!user || !user.id) {
      console.error('Erreur: Utilisateur ou ID utilisateur manquant');
      Alert.alert(
        'Erreur',
        'Informations utilisateur manquantes. Veuillez vous reconnecter.',
      );
      return;
    }

    if (!token) {
      console.error('Erreur: Token manquant ou invalide');
      Alert.alert(
        'Erreur',
        "Token d'authentification manquant ou invalide. Veuillez vous reconnecter.",
      );
      navigation.navigate('Login'); // Redirige vers la page de connexion
      return;
    }

    try {
      const dogData = {
        name_dog: name,
        breed: breed,
        birth_date: birthDate.toISOString().slice(0, 10),
        weight: parseFloat(weight),
        sex: sex,
        medical_info: medicalInfo,
        qr_code: "",
        user_id: user.id,
      };

      const response = await api.post('/dogs', dogData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (image !== null) {
        const formData = new FormData();
        formData.append('photo_name_dog', {
          uri: image,
          type: getMimeType(image),
          name: 'dog_photo' + getMimeType(image).split('/')[1],
        });
        formData.append('dog_id', response.data.id);

        try {
          const photoAddResponse = await api.post('/dogs-photos', formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          });
          console.log('Réponse de l\'ajout de la photo:', photoAddResponse.data);
        } catch (photoError) {
          console.error(
            "Erreur lors de l'ajout de la photo du nouveau chien:",
            photoError,
          );
        }
      }

      Alert.alert('Succès', 'Le chien a été ajouté avec succès.');
      navigation.goBack();
      navigation.getParent()?.setOptions({ onDogAdded: () => fetchDogs() }); // Définir l'option après l'ajout
    } catch (error) {
      console.error("Erreur détaillée lors de l'ajout du chien:", error);
      if (error.response) {
        if (error.response.status === 401) {
          Alert.alert(
            'Erreur',
            'Token expiré ou invalide. Veuillez vous reconnecter.',
          );
          navigation.navigate('Login');
        }
      } else {
        Alert.alert(
          'Erreur',
          "Impossible d'ajouter le chien. Veuillez réessayer.",
        );
      }
    }
  };

  const handleImagePicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    } else {
      Alert.alert(
        'Aucune image sélectionnée',
        'Veuillez sélectionner une image pour continuer.',
      );
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Ajouter un nouveau chien</Text>
      <View style={styles.addDogForm}>
        <TextInput
          style={styles.input}
          placeholder="Nom du chien"
          value={name}
          onChangeText={setName}
          placeholderTextColor={colors.lightGray}
        />
        <TextInput
          style={styles.input}
          placeholder="Race"
          value={breed}
          onChangeText={setBreed}
          placeholderTextColor={colors.lightGray}
        />
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <Text style={styles.input}>{birthDate.toLocaleDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={birthDate}
            mode="date"
            onChange={(event, selectedDate) => {
              if (selectedDate) {
                setBirthDate(selectedDate);
              }
              setShowDatePicker(false);
            }}
          />
        )}
        <TextInput
          style={styles.input}
          placeholder="Poids (kg)"
          value={weight}
          onChangeText={setWeight}
          keyboardType="numeric"
          placeholderTextColor={colors.lightGray}
        />
        <RNPickerSelect
          style={pickerSelectStyles}
          value={sex}
          onValueChange={setSex}
          items={[
            { label: 'Mâle', value: 'Male' },
            { label: 'Femelle', value: 'Female' },
          ]}
          placeholder={{ label: 'Sélectionnez le sexe', value: null }}
        />
        <TextInput
          style={styles.input}
          placeholder="Info médicale"
          value={medicalInfo}
          onChangeText={setMedicalInfo}
          placeholderTextColor={colors.lightGray}
        />
        
        <TouchableOpacity
          style={styles.imageButton}
          onPress={handleImagePicker}
        >
          <FontAwesome5 name="image" size={24} color={colors.white} />
          <Text style={styles.imageButtonText}>Choisir une image</Text>
        </TouchableOpacity>
        {image && <Image source={{ uri: image }} style={styles.image} />}
        <TouchableOpacity style={styles.addButton} onPress={handleAddDog}>
          <Text style={styles.buttonText}>Ajouter le chien</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};


const colors = {
  primary: '#ff4b2b',
  secondary: '#121212',
  white: '#ffffff',
  lightGray: '#E0E0E0',
  darkGray: '#484848',
  yellow: '#ffc333',
  gray: '#808080',
  error: '#CF6679',
  black: '#000000',
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 15,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 5,
    color: colors.white,
    paddingRight: 30,
    backgroundColor: colors.gray,
    marginBottom: 10,
  },
  inputAndroid: {
    fontSize: 15,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 5,
    color: colors.white,
    paddingRight: 30,
    backgroundColor: colors.gray,
    marginBottom: 10,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondary,
    padding: 20,
  },
  content: {
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.yellow,
    marginTop: 20,
    marginBottom: 20,
  },
  addDogForm: {
    backgroundColor: colors.darkGray,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  input: {
    backgroundColor: colors.gray,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    color: colors.white,
    fontSize: 15,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: colors.primary,
    marginVertical: 5,
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  imageButtonText: {
    fontSize: 16,
    color: colors.white,
    marginLeft: 10,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default AddDog;
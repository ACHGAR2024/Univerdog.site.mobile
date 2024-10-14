import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import PropTypes from 'prop-types';


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

const UpdateDog = ({ route, navigation }) => {
  const { token } = useContext(AuthContext);

  const dog = route.params?.dog;

  if (!dog) {
    Alert.alert('Erreur', 'Aucun chien sélectionné pour la mise à jour.');
    navigation.goBack();
    return null;
  }

  const [name, setName] = useState(dog.name_dog || '');
  const [breed, setBreed] = useState(dog.breed || '');
  const [birthDate, setBirthDate] = useState(
    new Date(dog.birth_date || Date.now()),
  );
  const [weight, setWeight] = useState(dog.weight ? dog.weight.toString() : '');
  const [sex, setSex] = useState(dog.sex || '');
  const [medicalInfo, setMedicalInfo] = useState(dog.medical_info || '');
  const [image, setImage] = useState(dog.photo_url || null);
  const [photoId, setPhotoId] = useState(null);
  const [dogPhoto, setDogPhoto] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false); // Ajoutez cette ligne

  useEffect(() => {
    fetchDogPhoto();
  }, []);

  const fetchDogPhoto = async () => {
    try {
      const response = await axios.get(
        'https://api.univerdog.site/api/dogs-photos',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const photos = response.data;
      const dogPhoto = photos.find(photo => photo.dog_id === dog.id);
      if (dogPhoto) {
        setDogPhoto(
          `https://api.univerdog.site/storage/dogs_photos/${dogPhoto.photo_name_dog}`
        );
        setPhotoId(dogPhoto.id);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de la photo du chien:', error);
    }
  };

  const handleUpdateDog = async () => {
    try {
      const dogData = {
        name_dog: name,
        breed: breed,
        birth_date: birthDate.toISOString().slice(0, 10),
        weight: parseFloat(weight),
        sex: sex,
        medical_info: medicalInfo,
        qr_code: "",
      };

      const response = await api.put(`/dogs/${dog.id}`, dogData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Dog update response:', response.data); // Utilisation de response

      if (image) {
        const formData = new FormData();
        formData.append('photo_name_dog', {
          uri: image,
          type: getMimeType(image),
          name: 'dog_photo.' + getMimeType(image).split('/')[1],
        });
        formData.append('dog_id', dog.id);
        formData.append('_method', 'PUT');

        const photoUrl = photoId 
          ? `https://api.univerdog.site/api/dogs-photos/${photoId}`
          : 'https://api.univerdog.site/api/dogs-photos';

        const photoResponse = await api.post(photoUrl, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        console.log('Photo update response:', photoResponse.data); // Utilisation de photoResponse
      }

      Alert.alert('Succès', 'Le chien a été mis à jour avec succès.');
      navigation.goBack();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du chien:', error);
      if (error.response) {
        console.error('Erreur réponse:', error.response.data);
        console.error('Erreur statut:', error.response.status);
      }
      Alert.alert('Erreur', 'Échec de la mise à jour du chien.');
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
      <Text style={styles.title}>Mettre à jour le chien</Text>
      
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
        {dogPhoto && (
            
          <View style={styles.imageContainer}>
             <Text style={styles.imageImageText}>Photo Actuelle</Text>
            <Image 
              source={{ uri: dogPhoto }} 
              style={styles.image} 
              resizeMode="cover"
            />
           
          </View>
          
        )}
        {image && image !== dogPhoto && (
          <Image 
            source={{ uri: image }} 
            style={styles.image} 
            resizeMode="cover"
          />
        )}
        
        <TouchableOpacity style={styles.addButton} onPress={handleUpdateDog}>
          <Text style={styles.buttonText}>Mettre à jour le chien</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

UpdateDog.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      dog: PropTypes.object.isRequired,
    }).isRequired,
  }).isRequired,
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
  }).isRequired,
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
  blue: '#0000FF',
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
  imageImageText: {
    fontSize: 16,
    color: colors.white,
    marginLeft: 0,
    marginBottom: 5,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default UpdateDog;

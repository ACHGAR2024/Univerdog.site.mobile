import React, { useState, useEffect, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { UserContext } from '../context/UserContext';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import colors from '../dashboard/DashboardUser';
import { FontAwesome5 } from '@expo/vector-icons';
import logo from '../../assets/logo.png';

const UserUpdate = () => {
  const navigation = useNavigation();
  const { token } = useContext(AuthContext);
  const user = useContext(UserContext);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    image: null,
    first_name: '',
    address: '',
    postal_code: '',
    phone: '',
    google_id: null,
  });

  const fetchUser = async () => {
    try {
      const response = await axios.get('https://api.univerdog.site/api/user', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      if (response.data && response.data.data && response.data.data.user) {
        setUserData({
          name: response.data.data.user.name || '',
          email: response.data.data.user.email || '',
          password: '',
          image: null,
          first_name: response.data.data.user.first_name || '',
          address: response.data.data.user.address || '',
          postal_code: response.data.data.user.postal_code || '',
          phone: response.data.data.user.phone || '',
          google_id: response.data.data.user.google_id || null,
        });
      } else {
        console.error('User data not found or incorrect');
      }
    } catch (error) {
      console.error('Error fetching user information', error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [token]);

  const handleChange = (name, value) => {
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('name', userData.name);
      formData.append('email', userData.email);
      formData.append('first_name', userData.first_name);
      formData.append('address', userData.address);
      formData.append('postal_code', userData.postal_code);
      formData.append('phone', userData.phone);

      if (userData.password) {
        formData.append('password', userData.password);
      }
      if (userData.image) {
        const uriParts = userData.image.split('.');
        const fileType = uriParts[uriParts.length - 1];
        formData.append('image', {
          uri: userData.image,
          name: `photo.${fileType}`,
          type: `image/${fileType}`,
        });
      }
      formData.append('_method', 'PUT');

      const userId = String(user.id);

      if (!token) {
        throw new Error('Authentication token not defined');
      }

      const response = await axios.post(
        `https://api.univerdog.site/api/update/${userId}`,
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
        Alert.alert('Succès', 'Compte modifié avec succès !', [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ]);
        // Naviguer vers DashboardUser et forcer le rafraîchissement des données
        navigation.navigate('DashboardUser', { refreshData: true });
      } else {
        throw new Error('Failed to update user profile');
      }
    } catch (error) {
      console.error('Error updating user profile', error);
    }
  };

  if (!user) {
    return <Text style={styles.errorText}>User not found</Text>;
  }

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
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nom</Text>
          <TextInput
            style={styles.input}
            value={userData.name}
            onChangeText={value => handleChange('name', value)}
            editable={!userData.google_id}
            placeholderTextColor={colors.gray}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={userData.email}
            onChangeText={value => handleChange('email', value)}
            editable={false}
            keyboardType="email-address"
            placeholderTextColor={colors.gray}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Mot de passe</Text>
          <TextInput
            style={styles.input}
            value={userData.password}
            onChangeText={value => handleChange('password', value)}
            editable={false}
            secureTextEntry
            placeholderTextColor={colors.gray}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Prénom</Text>
          <TextInput
            style={styles.input}
            value={userData.first_name}
            onChangeText={value => handleChange('first_name', value)}
            editable={!userData.google_id}
            placeholderTextColor={colors.gray}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Adresse</Text>
          <TextInput
            style={styles.input}
            value={userData.address}
            onChangeText={value => handleChange('address', value)}
            editable={!userData.google_id}
            placeholderTextColor={colors.gray}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Code Postal</Text>
          <TextInput
            style={styles.input}
            value={userData.postal_code}
            onChangeText={value => handleChange('postal_code', value)}
            editable={!userData.google_id}
            placeholderTextColor={colors.gray}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Numéro de téléphone</Text>
          <TextInput
            style={styles.input}
            value={userData.phone}
            onChangeText={value => handleChange('phone', value)}
            keyboardType="phone-pad"
            editable={!userData.google_id}
            placeholderTextColor={colors.gray}
          />
        </View>

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
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: colorsupdate.lightYellow,
  },
  input: {
    height: 40,
    borderColor: colorsupdate.darkGray,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: colorsupdate.darkGray,
    color: colorsupdate.white,
  },
  uploadButton: {
    backgroundColor: colorsupdate.darkGray,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: colorsupdate.primary,
    fontWeight: 'bold',
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
  errorText: {
    color: colors.error,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default UserUpdate;

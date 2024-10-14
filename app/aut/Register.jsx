import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert, // Assurez-vous d'importer Alert depuis react-native
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { colors, fontSizes, spacing } from '../styles/theme';
import logo from '../../assets/logo.png';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigation = useNavigation();
  const { login } = useContext(AuthContext);

  const handleRegister = async () => {
    // Réinitialiser le message d'erreur
    setErrorMessage('');

    // Validation des emails
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Veuillez entrer une adresse email valide.');
      return;
    }

    // Validation du mot de passe
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    if (!passwordRegex.test(password)) {
      setErrorMessage(
        'Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial.',
      );
      return;
    }

    // Vérification de la correspondance des mots de passe
    if (password !== confirmPassword) {
      setErrorMessage('Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      const response = await axios.post(
        'https://api.univerdog.site/api/register',
        {
          name,
          email,
          password,
          role: 'user',
        },
      );
      // console.log("Inscription réussie :", response.data);

      // Utiliser la méthode login du contexte si l'inscription connecte automatiquement
      if (response.data.access_token) {
        await login(response.data.access_token);
      }
      Alert.alert('Succès', 'Inscription réussie !'); // Utilisation de Alert au lieu de alert
      navigation.navigate('Login');
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
      setErrorMessage("Une erreur est survenue lors de l'inscription.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.container}>
        <View style={styles.logo}>
          <Image source={logo} style={styles.logoImage} />
        </View>
        <Text style={styles.title}>Inscription</Text>
        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}
        <View style={styles.form}>
          <View style={styles.formGroup}>
            <FontAwesome5
              name="user"
              size={16}
              color={colors.text.secondary}
              style={styles.formIcon}
            />
            <TextInput
              style={styles.formInput}
              placeholder="Nom"
              placeholderTextColor={colors.text.secondary}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.formGroup}>
            <FontAwesome5
              name="envelope"
              size={16}
              color={colors.text.secondary}
              style={styles.formIcon}
            />
            <TextInput
              style={styles.formInput}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              placeholderTextColor={colors.text.secondary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          <View style={styles.formGroup}>
            <FontAwesome5
              name="lock"
              size={16}
              color={colors.text.secondary}
              style={styles.formIcon}
            />
            <TextInput
              style={styles.formInput}
              placeholder="Mot de passe"
              value={password}
              placeholderTextColor={colors.text.secondary}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
          <View style={styles.formGroup}>
            <FontAwesome5
              name="lock"
              size={16}
              color={colors.text.secondary}
              style={styles.formIcon}
            />
            <TextInput
              style={styles.formInput}
              placeholder="Confirmer le mot de passe"
              secureTextEntry={true}
              placeholderTextColor={colors.text.secondary}
              onChangeText={setConfirmPassword}
              value={confirmPassword}
            />
          </View>
        </View>
        <TouchableOpacity style={styles.signInBtn} onPress={handleRegister}>
          <FontAwesome5
            name="user-plus"
            size={16}
            color={colors.text.primary}
            style={styles.signInBtnIcon}
          />
          <Text style={styles.signInBtnText}>S&apos;inscrire</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.small,
    paddingVertical: spacing.medium,

    width: '100%',
  },
  errorText: {
    color: colors.error,
    marginBottom: spacing.medium,
  },
  form: {
    backgroundColor: colors.cardBackground,
    borderRadius: 10,
    padding: spacing.medium,
    width: 300,
    marginBottom: spacing.large,
  },
  formGroup: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: spacing.small,
    width: '90%',
  },
  formIcon: {
    color: colors.text.secondary,
    marginRight: spacing.small,
    fontSize: fontSizes.medium,
    fontWeight: 'bold',
  },
  formInput: {
    backgroundColor: colors.inputBackground,
    borderRadius: 5,
    color: colors.text.primary,
    fontSize: fontSizes.medium,
    fontWeight: 'bold',
    padding: spacing.small,
    width: '100%',
  },

  logo: {
    marginBottom: spacing.medium,
  },
  logoImage: {
    height: 100,
    width: 100,
  },
  scrollView: {
    flexGrow: 1,
  },
  signInBtn: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: spacing.small,
    width: '90%',
  },
  signInBtnIcon: {
    marginRight: spacing.small,
  },
  signInBtnText: {
    color: colors.text.primary,
    fontWeight: 'bold',
  },
  title: {
    color: colors.text.primary,
    fontSize: fontSizes.large,
    marginBottom: spacing.medium,
  },
});

export default Register;

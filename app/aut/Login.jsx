import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { colors, fontSizes, spacing } from '../styles/theme';
import logo from '../../assets/logo.png';
import googleLogo from '../../assets/logo_google_48.png';
import appleLogo from '../../assets/apple_logo-min.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigation = useNavigation();

  const validateInputs = () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert('Erreur', 'Veuillez entrer une adresse email valide.');
      return false;
    }
    if (password.length < 8) {
      Alert.alert(
        'Erreur',
        'Le mot de passe doit contenir au moins 8 caractères.',
      );
      return false;
    }
    return true;
  };

  const handleSignIn = async () => {
    if (!validateInputs()) return;

    try {
      const response = await axios.post(
        'https://api.univerdog.site/api/login',
        {
          email,
          password,
        },
      );
      // console.log("Connexion réussie :", response.data);

      if (response.data.access_token) {
        await login(
          response.data.access_token,
          response.data.refresh_token || '',
        );
        navigation.reset({
          index: 0,
          routes: [{ name: 'DashboardUser' }],
        });
      } else {
        throw new Error('Token non reçu');
      }
    } catch (error) {
      console.error('Erreur lors de la connexion :', error);
      Alert.alert(
        'Erreur',
        'Une erreur est survenue lors de la connexion. Veuillez réessayer.',
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.container}>
        <View style={styles.logo}>
          <Image source={logo} style={styles.logoImage} />
        </View>
        <View style={styles.socialLogin}>
          <Pressable style={styles.socialBtn}>
            <Image source={googleLogo} style={styles.socialBtnImage} />
            <Text style={styles.socialBtnText}>Se connecter avec Google</Text>
          </Pressable>
          <Pressable style={styles.socialBtn}>
            <Image source={appleLogo} style={styles.socialBtnImage} />
            <Text style={styles.socialBtnText}>Se connecter avec Apple</Text>
          </Pressable>
        </View>
        <Text style={styles.divider}>OU</Text>
        <View style={styles.form}>
          <View style={styles.formGroup}>
            <FontAwesome5
              name="envelope"
              size={16}
              color={colors.text.secondary}
              style={styles.formIcon}
            />
            <TextInput
              style={styles.formInput}
              placeholder="name@host.com"
              placeholderTextColor={colors.text.secondary}
              onChangeText={setEmail}
              value={email}
              inputMode="text"
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
              placeholderTextColor={colors.text.secondary}
              secureTextEntry={true}
              onChangeText={setPassword}
              value={password}
            />
          </View>
          <Pressable
            style={styles.forgotPassword}
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
          </Pressable>
          <Pressable style={styles.signInBtn} onPress={handleSignIn}>
            <FontAwesome5
              name="sign-in-alt"
              size={16}
              color={colors.text.primary}
              style={styles.signInBtnIcon}
            />
            <Text style={styles.signInBtnText}>Se connecter</Text>
          </Pressable>
        </View>
        <View style={styles.signUp}>
          <Text style={styles.signUpText}>Besoin d&apos;un compte ? </Text>
          <Pressable onPress={() => navigation.navigate('Register')}>
            <Text style={styles.signUpLink}>S&apos;inscrire</Text>
          </Pressable>
        </View>
        <View style={styles.footer}>
          <Pressable onPress={() => navigation.navigate('PrivacyPolicy')}>
            <Text style={styles.footerText}>
              <FontAwesome5
                name="shield-alt"
                size={12}
                color={colors.text.secondary}
                style={styles.footerIcon}
              />
              {' Politique de confidentialité'}
            </Text>
          </Pressable>
        </View>
        <View>
          <Pressable onPress={() => navigation.navigate('TermsOfService')}>
            <Text style={styles.footerText}>
              <FontAwesome5
                name="file-contract"
                size={12}
                color={colors.text.secondary}
                style={styles.footerIcon}
              />
              {" Conditions d'utilisation"}
            </Text>
          </Pressable>
        </View>
        <Text style={styles.text}>
          {' '}
          Nous sommes disponibles sur Android et IOS
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.background,
    boxSizing: 'border-box',
    justifyContent: 'center',
    paddingBottom: spacing.large,
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.medium,

    width: '100%',
  },
  divider: {
    color: colors.text.secondary,
    marginBottom: spacing.medium,
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    color: colors.text.secondary,
    flexDirection: 'row',
    fontSize: fontSizes.small,
    justifyContent: 'center',
    marginTop: spacing.small,
    textAlign: 'center',
  },
  footerIcon: {
    marginRight: spacing.tiny,
  },
  footerText: {
    color: colors.text.secondary,
  },
  forgotPassword: {
    fontSize: fontSizes.small,
    marginBottom: spacing.small,
    textAlign: 'right',
  },
  forgotPasswordText: {
    color: colors.link,
    textDecorationLine: 'underline',
  },
  form: {
    backgroundColor: colors.cardBackground,
    borderRadius: 10,
    padding: spacing.medium,
    width: 300,
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
  },
  formInput: {
    backgroundColor: colors.inputBackground,
    borderRadius: 5,
    color: colors.text.primary,
    padding: spacing.small,
    width: '100%',
  },
  logo: {
    marginBottom: spacing.medium,
    marginTop: spacing.medium,
  },
  logoImage: {
    height: 100,
    marginTop: spacing.medium,
    width: 100,
  },
  scrollView: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    margin: 0,
    overflowY: 'auto',
    padding: 0,
  },
  signInBtn: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 5,
    flexDirection: 'row',
    fontWeight: 'bold',
    justifyContent: 'center',
    padding: spacing.small,
    width: '100%',
  },
  signInBtnIcon: {
    marginRight: spacing.small,
  },
  signInBtnText: {
    color: colors.text.primary,
  },
  signUp: {
    alignItems: 'center',
    flexDirection: 'row',
    fontSize: fontSizes.medium,
    justifyContent: 'center',
    marginTop: spacing.medium,
    textAlign: 'center',
  },
  signUpLink: {
    color: colors.link,
    textDecorationLine: 'underline',
  },
  signUpText: {
    color: colors.text.primary,
  },
  socialBtn: {
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: 5,
    color: colors.text.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: spacing.small,
  },
  socialBtnImage: {
    height: 30,
    marginRight: spacing.small,
    width: 24,
  },
  socialBtnText: {
    color: colors.text.primary,
  },
  socialLogin: {
    flexDirection: 'column',
    gap: 10,
  },
  text: {
    color: colors.text.primary,
    marginBottom: spacing.small,
    marginTop: spacing.small,
  },
});

export default Login;

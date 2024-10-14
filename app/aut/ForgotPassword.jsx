import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import axios from "axios";
import { useNavigation } from '@react-navigation/native';
import { colors, fontSizes, spacing } from '../styles/theme';

const ForgotPassword = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async () => {
    setIsLoading(true); // Afficher l'indicateur de chargement

    try {
      const response = await axios.post(
        "https://api.univerdog.site/api/forgotpw/" + email
      );

      setMessage(
        response.data.message ||
          "Un e-mail pour réinitialiser votre mot de passe a été envoyé. Valable pendant 60 minutes."
      );
      setErrorMessage("");
      // Naviguer vers DashboardUser après une action réussie
      navigation.navigate('DashboardUser');
    } catch (error) {
      if (error.response) {
        // Gérer les erreurs spécifiques du serveur
        switch (error.response.status) {
          case 422: // Erreur de validation (ex: email invalide)
            setErrorMessage(error.response.data.errors.email[0]);
            console.error(error);
            break;
          case 404: // Email non trouvé
            setErrorMessage(
              "Aucun compte n'a été associé avec cette adresse e-mail."
            );
            console.error(error);
            break;
          default:
            setErrorMessage(
              "Une erreur est survenue. Veuillez réessayer plus tard."
            );
        }
      } else {
        setErrorMessage(
          "Une erreur est survenue. Veuillez réessayer plus tard."
        );
      }
      console.error(error);
    } finally {
      setIsLoading(false); // Masquer l'indicateur de chargement
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.title}>Mot de passe oublié</Text>
        <Text style={styles.description}>
          Entrez votre adresse e-mail pour recevoir les instructions de
          réinitialisation de votre mot de passe.
        </Text>
        <View style={styles.form}>
          <View style={styles.formGroup}>
            <FontAwesome5
              name="envelope"
              size={16}
              color="#aaa"
              style={styles.formIcon}
            />
            <TextInput
              style={styles.formInput}
              placeholder="name@host.com"
              onChangeText={setEmail}
              value={email}
            />
          </View>
          <Pressable
            style={styles.resetBtn}
            onPress={handleResetPassword}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.resetBtnText}>
                Réinitialiser le mot de passe
              </Text>
            )}
          </Pressable>
          {message ? (
            <Text style={styles.successMessage}>{message}</Text>
          ) : null}
          {errorMessage ? (
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          ) : null}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: colors.background,
    flex: 1,
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.large,
    
  },
  description: {
    color: colors.text.primary,
    fontSize: fontSizes.medium,
    marginBottom: spacing.large,
    textAlign: "center",
  },
  errorMessage: {
    color: colors.error,
    marginTop: spacing.small,
    textAlign: "center",
  },
  form: {
    maxWidth: 300,
    width: "100%",
  },
  formGroup: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: spacing.medium,
  },
  formIcon: {
    marginRight: spacing.small,
  },
  formInput: {
    backgroundColor: colors.inputBackground,
    borderRadius: 5,
    color: colors.text.primary,
    flex: 1,
    height: 40,
    paddingHorizontal: spacing.small,
  },
  resetBtn: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 5,
    paddingVertical: spacing.medium,
  },
  resetBtnText: {
    color: colors.text.primary,
    fontSize: fontSizes.medium,
    fontWeight: "bold",
  },
  scrollView: {
    flexGrow: 1,
  },
  successMessage: {
    color: colors.success,
    marginTop: spacing.small,
    textAlign: "center",
  },
  title: {
    color: colors.text.primary,
    fontSize: fontSizes.large,
    fontWeight: "bold",
    marginBottom: spacing.medium,
  },
});

export default ForgotPassword;

import React, { useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome5 } from "@expo/vector-icons";
import { AuthContext } from '../context/AuthContext';
import { colors, fontSizes, spacing } from '../styles/theme';

const Logout = () => {
  const navigation = useNavigation();
  const { logout } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await logout();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
      alert("Erreur", "Une erreur est survenue lors de la déconnexion. Veuillez réessayer.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.title}>Déconnexion</Text>
        <TouchableOpacity style={styles.signInBtn} onPress={handleLogout}>
          <FontAwesome5
            name="sign-out-alt"
            size={16}
            color={colors.text.primary}
            style={styles.signInBtnIcon}
          />
          <Text style={styles.signInBtnText}>Se déconnecter</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.small,
    paddingVertical: spacing.medium,
    width: "100%",
  },
  scrollView: {
    flexGrow: 1,
  },
  signInBtn: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "center",
    padding: spacing.small,
    width: "90%",
  },
  signInBtnIcon: {
    marginRight: spacing.small,
  },
  signInBtnText: {
    color: colors.text.primary,
    fontWeight: "bold",
  },
  title: {
    color: colors.text.primary,
    fontSize: fontSizes.large,
    marginBottom: spacing.medium,
  },
});

export default Logout;

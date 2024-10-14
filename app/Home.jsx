import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native'; // Ajout de ScrollView
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons'; // Importer FontAwesome5
import { colors } from './styles/theme'; // Supprimer fontSizes et spacing
import welcomeImage from '../assets/welcom.png';

const Home = () => {
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.container}>
        <Image
          source={welcomeImage}
          style={styles.image} // Utilisation de styles.image
        />
        <View style={styles.cadre}>
          <Text style={styles.title}>UniverDog</Text>
          <Text style={styles.subtitle}>Au service des chiens</Text>
          <Pressable
            style={styles.button}
            onPress={() => navigation.navigate('Register')}
          >
            <View style={styles.buttonContent}>
              <FontAwesome5
                name="user-plus"
                size={16}
                color="#fff"
                style={styles.buttonIcon}
              />
              <Text style={styles.buttonText}>Inscription</Text>
            </View>
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={() => navigation.navigate('Login')}
          >
            <View style={styles.buttonContent}>
              <FontAwesome5
                name="sign-in-alt"
                size={16}
                color="#fff"
                style={styles.buttonIcon}
              />
              <Text style={styles.buttonText}>Connexion</Text>
            </View>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: colors.primary, // Remplacer le littéral de couleur
    borderRadius: 8,
    boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.5)', // Remplacez shadow* par boxShadow
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
    padding: 16,
    userSelect: 'none',
    width: '80%',
  },
  buttonContent: {
    alignItems: 'center', // Réorganiser les propriétés
    flexDirection: 'row',
    justifyContent: 'center', // Centrer le contenu horizontalement
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: colors.text.primary, // Remplacer le littéral de couleur
    fontSize: 16,
  },
  cadre: {
    alignItems: 'center', // Centrer le contenu horizontalement
    backgroundColor: colors.cardBackground, // Remplacer le littéral de couleur
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    bottom: 0, // Réorganiser les propriétés
    height: '50%',
    justifyContent: 'center', // Centrer le contenu verticalement
    padding: 16, // Ajouter du padding pour l'espacement
    position: 'absolute',
    width: '100%',
  },
  container: {
    alignItems: 'center', // Réorganiser les propriétés
    flex: 1,
    justifyContent: 'top',
    marginTop: 16,
    padding: 16,
  },
  image: {
    height: '60%', // Réorganiser les propriétés
    position: 'absolute', // Ajout du style pour l'image
    // Positionner l'image en haut
    width: '100%', // Faire en sorte que l'image prenne toute la largeur
  },
  scrollView: {
    flexGrow: 1, // Utiliser flexGrow pour permettre le défilement
  },
  subtitle: {
    color: colors.text.secondary, // Remplacer le littéral de couleur
    fontSize: 18,
    marginBottom: 16,
  },
  title: {
    color: colors.text.primary, // Remplacer le littéral de couleur
    fontSize: 52,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default Home;

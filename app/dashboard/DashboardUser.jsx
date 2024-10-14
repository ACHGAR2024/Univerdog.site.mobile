import React, { useContext, useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  SafeAreaView,
  TouchableOpacity,
  // Alert, // Supprimé car non utilisé
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import PropTypes from 'prop-types';
import api from '../services/api'; // Importer le service API

import { UserContext } from '../context/UserContext';
import DogProfile from '../components/DogProfile';
import logo from '../../assets/logo.png'; // Ajouté en haut du fichier

const base64UrlDecode = str => {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  // Ajout de padding si nécessaire
  while (base64.length % 4 !== 0) {
    base64 += '=';
  }
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join(''),
  );
  return JSON.parse(jsonPayload);
};

const calculateRemainingTime = token => {
  if (!token) {
    console.error('Token is null or undefined');
    return 0;
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    console.error('Token format incorrect');
    return 0;
  }

  const payload = base64UrlDecode(parts[1]);
  const expirationTime = payload.exp;
  if (isNaN(expirationTime)) {
    console.error('Expiration time is not a number');
    return 0;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  const remainingTime = expirationTime - currentTime;
  return Math.max(0, Math.floor(remainingTime / 60)); // Convertir en minutes et s'assurer que le temps restant n'est pas négatif
};

const DashboardUser = ({ route }) => {
  const navigation = useNavigation();
  const { isAuthenticated, logout, token } = useContext(AuthContext);
  const user = useContext(UserContext);

  const [pendingAppointments, setPendingAppointments] = useState(0);
  const [dogsData, setDogsData] = useState([]);
  const [avatarUri, setAvatarUri] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Réinitialiser les données des chiens lorsque l'utilisateur change
    setDogsData([]);
    fetchAvatar();
    fetchTotalDogUsers();
    fetchDogsData();

    if (token) {
      const remainingTime = calculateRemainingTime(token);
      if (remainingTime <= 0) {
        handleLogout();
      }
    }
  }, [user, token]); // Ajout de 'user' dans les dépendances pour réagir au changement de compte

  // Mettre à jour l'avatar lorsque l'écran est focalisé
  useFocusEffect(
    useCallback(() => {
      if (route.params?.refreshAvatar) {
        fetchAvatar();
        navigation.setParams({ refreshAvatar: false });
      }
    }, [route.params?.refreshAvatar]),
  );

  const fetchTotalDogUsers = async () => {
    if (!user || !user.id) return;
    try {
      const response = await api.get(`/dogs_user/${user.id}`);
      const dogsList = response.data
        .filter(dog => dog.user_id === user.id)
        .map(dog => ({ id: dog.id, name: dog.name_dog }));
      fetchAppointments(dogsList);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des chiens de l'utilisateur",
        error,
      );
    }
  };

  const fetchAppointments = async dogsList => {
    try {
      const response = await api.get(`/appointments`);
      const appointmentsData = response.data;
      const awaitingAppointments = appointmentsData.filter(
        appointment =>
          appointment.status === 'En attente' &&
          dogsList.some(dog => dog.id === appointment.dog_id),
      );
      setPendingAppointments(awaitingAppointments.length);
    } catch (error) {
      console.error('Erreur lors de la récupération des rendez-vous:', error);
    }
  };

  const fetchDogsData = async () => {
    // Vider la liste des chiens avant de commencer la requête
    setDogsData([]);
    await fetchAvatar(); // Appel de fetchAvatar avant de récupérer les données des chiens
    if (!user || !user.id) return;
    try {
      const response = await api.get(`/dogs_user/${user.id}`);
      if (response.data && response.data.length > 0) {
        setDogsData(response.data);
      }
    } catch (error) {
      console.error(
        'Erreur lors de la récupération des données des chiens',
        error,
      );
    }
  };

  const fetchAvatar = async () => {
    if (!user || !user.id) return;

    try {
      const response = await fetch(
        `https://api.univerdog.site/api/user/${user.id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          },
        },
      );
      const fetchedUserData = await response.json();
      // console.log('Données reçues:', fetchedUserData);

      if (fetchedUserData && fetchedUserData.image) {
        setAvatarUri(fetchedUserData.image);
      }

      setUserData(fetchedUserData);
    } catch (error) {
      console.error("Erreur lors de la récupération de l'avatar", error);
    }
  };

  const ServiceCard = ({ icon, title, description, route }) => {
    return (
      <Pressable
        style={styles.serviceCard}
        onPress={() => navigation.navigate(route)}
      >
        <FontAwesome5 name={icon} size={24} color={colors.primary} />
        <Text style={styles.serviceTitle}>{title}</Text>
        <Text style={styles.serviceDescription}>{description}</Text>
      </Pressable>
    );
  };

  ServiceCard.propTypes = {
    icon: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    route: PropTypes.string.isRequired,
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Erreur lors de la déconnexion :', error);
      alert(
        'Une erreur est survenue lors de la déconnexion. Veuillez réessayer.',
      );
    }
  };

  if (!isAuthenticated || !user || !userData) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Chargement...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.header}>
          <Image source={logo} style={styles.logo} />
          <Text style={styles.logotext}>UniverDog</Text>

          <View style={styles.userProfile}>
            <Pressable
              onPress={() => navigation.navigate('AppointmentsManagerUser')}
              style={styles.notificationIcon}
            >
              <FontAwesome5 name="bell" size={30} color={colors.primary} />
              {pendingAppointments > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>
                    {pendingAppointments}
                  </Text>
                </View>
              )}
            </Pressable>

            {/* <Text style={styles.userName}>{user.name || 'Utilisateur'}</Text> */}

            <TouchableOpacity
              onPress={() => navigation.navigate('AvatarUpdate')}
            >
              {avatarUri ? (
                <Image
                  source={{
                    uri: `https://api.univerdog.site${avatarUri}`,
                  }}
                  style={styles.userAvatarImage}
                />
              ) : (
                <View style={styles.userAvatar}>
                  <Text style={styles.userInitials}>
                    {user.name ? user.name.slice(0, 2).toUpperCase() : 'UN'}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('UserUpdate')}>
              <FontAwesome5
                name="cog"
                size={30}
                color={colors.white}
                style={styles.settingsIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
        {/* <View style={styles.aiContent}>
          <Text style={styles.aiTitle}>
            Période de validité du token :{' '}
            {token ? 'Token actif' : 'Token expiré'}
          </Text>
          {token && (
            <Text style={styles.aiDescription}>
              Temps restant : {calculateRemainingTime(token)} minutes
            </Text>
          )}
        </View>*/}
        <Pressable
          style={styles.aiAdvisor}
          onPress={() => navigation.navigate('AIAdvisor')}
        >
          <FontAwesome5
            name="robot"
            size={36}
            color={colors.primary}
            style={styles.aiIcon}
          />

          <View style={styles.aiContent}>
            <Text style={styles.aiTitle}>Conseil IA pour Chiens</Text>
            <Text style={styles.aiDescription}>
              Posez vos questions à l&apos;IA et recevez des réponses
              personnalisées
            </Text>
          </View>
        </Pressable>

        <View style={styles.servicesGrid}>
          <ServiceCard
            icon="cut"
            title="Toilettage"
            description="Réservez un toilettage"
            route="Grooming"
          />
          <ServiceCard
            icon="shopping-cart"
            title="Boutique"
            description="Achetez des produits"
            route="Shop"
          />
          <ServiceCard
            icon="stethoscope"
            title="Vétérinaire"
            description="Prenez rendez-vous"
            route="Veterinary"
          />
          <ServiceCard
            icon="map-marker-alt"
            title="Services locaux"
            description="Trouvez des services près de chez vous"
            route="LocalServices"
          />
        </View>

        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Actions rapides</Text>
          <View style={styles.actionButtons}>
            <Pressable
              style={styles.actionButton}
              onPress={() => navigation.navigate('Emergency')}
            >
              <Text style={styles.actionButtonText}>Urgence 24/7</Text>
            </Pressable>
            <Pressable
              style={styles.actionButton}
              onPress={() => navigation.navigate('DogSitting')}
            >
              <Text style={styles.actionButtonText}>Réservez garde</Text>
            </Pressable>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Mes chiens</Text>
        {dogsData.length > 0 ? (
          dogsData.map(dog => (
            <DogProfile
              key={dog.id}
              dogData={{ ...dog, qr_code: dog.qr_code || '' }}
              navigation={navigation}
            />
          ))
        ) : (
          <Text style={styles.loadingText}>Aucun chien trouvé...</Text>
        )}
        {/* Bouton de rafraîchissement manuel */}
        <TouchableOpacity style={styles.refreshButton} onPress={fetchDogsData}>
          <FontAwesome5 name="sync" size={24} color={colors.white} />
          <Text style={styles.refreshButtonText}>Rafraîchir</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.manageDogButton}
          onPress={() =>
            navigation.navigate('AddDog', { onDogAdded: fetchDogsData })
          }
        >
          <Text style={styles.manageDogButtonText}>Ajouter un chien</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.manageDogButton}
          onPress={() => navigation.navigate('DogManagement')}
        >
          <Text style={styles.manageDogButtonText}>Gérer mes chiens</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <FontAwesome5
            name="sign-out-alt"
            size={24}
            color={colors.white}
            style={styles.logoutBtnIcon}
          />
          <Text style={styles.logoutBtnText}>Déconnexion</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

DashboardUser.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      refreshAvatar: PropTypes.bool,
    }),
  }),
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
  actionButton: {
    backgroundColor: colors.primary,
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  actionButtonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  aiAdvisor: {
    alignItems: 'center',
    backgroundColor: colors.darkGray,
    borderRadius: 10,
    flexDirection: 'row',
    marginBottom: 20,
    padding: 15,
  },
  aiContent: {
    flex: 1,
  },
  aiDescription: {
    color: colors.gray,
    fontSize: 14,
  },
  aiIcon: {
    marginRight: 15,
  },
  aiTitle: {
    color: colors.yellow,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  container: {
    backgroundColor: colors.secondary,
    boxSizing: 'border-box',
    flex: 1,
    paddingBottom: 30,
        width: '100%',
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
  dogInfo: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  notificationBadge: {
    backgroundColor: colors.white,
    borderRadius: 10,
    opacity: 0.8,
    paddingHorizontal: 3,
    paddingVertical: 3,
    position: 'absolute',
    right: 15,
    top: 10,
    width: 40,
  },
  notificationBadgeText: {
    color: colors.black,
    fontSize: 15,
    fontWeight: 'bold',
    paddingHorizontal: 5,
    textAlign: 'center',
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
  errorText: {
    color: colors.error,
    fontSize: 16,
    textAlign: 'center',
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  healthItem: {
    alignItems: 'center',
  },
  healthLabel: {
    color: colors.gray,
    fontSize: 14,
  },
  healthStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  healthValue: {
    color: colors.lightYellow,
    fontSize: 14,
    fontWeight: 'bold',
  },
  loadingText: {
    color: colors.lightGray,
    fontSize: 16,
    textAlign: 'center',
  },
  logo: {
    height: 60,
    width: 60,
  },
  logotext: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutBtn: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    padding: 5,
  },
  logoutBtnIcon: {
    marginRight: 10,
  },
  logoutBtnText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
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
  quickActions: {
    backgroundColor: colors.darkGray,
    borderRadius: 10,
    marginBottom: 20,
    padding: 15,
  },
  scrollViewContent: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    margin: 0,
    overflowY: 'auto',
    padding: 0,
    paddingBottom: 200,
    paddingHorizontal: 30,
    paddingVertical: 30,
  },
  settingsIcon: {
    marginLeft: 10,
  },
  sectionTitle: {
    color: colors.yellow,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  serviceCard: {
    alignItems: 'center',
    backgroundColor: colors.darkGray,
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
    width: '48%',
  },
  serviceDescription: {
    color: colors.gray,
    fontSize: 12,
    textAlign: 'center',
  },
  serviceTitle: {
    color: colors.lightGray,
    fontSize: 14,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  userAvatar: {
    alignItems: 'center',
    backgroundColor: colors.orange,
    borderRadius: 25, // Augmenté pour un cercle parfait
    borderWidth: 2, // Ajout d'une bordure
    borderColor: colors.white, // Couleur de la bordure
    height: 40, // Augmenté pour un meilleur effet visuel
    justifyContent: 'center',
    marginRight: 10,
    overflow: 'hidden',
    width: 40, // Augmenté pour correspondre à la hauteur
    shadowColor: colors.black, // Couleur de l'ombre
    shadowOffset: { width: 0, height: 2 }, // Décalage de l'ombre
    shadowOpacity: 0.25, // Opacité de l'ombre
    shadowRadius: 3.84, // Rayon de l'ombre
    elevation: 5, // Élévation pour Android
  },
  userAvatarImage: {
    height: 50, // Ajusté pour correspondre à la taille du conteneur
    width: 50, // Ajusté pour correspondre à la taille du conteneur
    borderRadius: 25,
    borderWidth: 0,
    borderColor: colors.white,
  },
  userInitials: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  notificationIcon: {
    marginRight: 10,
  },
  userProfile: {
    marginLeft: 55,
    alignItems: 'center',
    flexDirection: 'row',
  },
  manageDogButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  manageDogButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  refreshButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  refreshButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default DashboardUser;
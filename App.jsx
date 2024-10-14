// Importations de base React et React Native
import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'react-native';

// Importations de React Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { navigationRef } from './app/navigation/RootNavigation';

// Importations des écrans principaux
import Home from './app/Home';
import PrivacyPolicy from './app/PrivacyPolicy';
import TermsOfService from './app/TermsOfService';

// Importations des écrans d'authentification
import Login from './app/aut/Login';
import Register from './app/aut/Register';
import Logout from './app/aut/Logout';
import ForgotPassword from './app/aut/ForgotPassword';

// Importations des écrans du tableau de bord
import DashboardUser from './app/dashboard/DashboardUser';

// Importations des providers de contexte
import { AuthProvider, AuthContext } from './app/context/AuthContext';
import { UserProvider } from './app/context/UserContext';

// Importations des écrans de fonctionnalités
import AIAdvisor from './app/screens/AIAdvisor';
import Grooming from './app/screens/Grooming';
import Shop from './app/screens/Shop';
import Veterinary from './app/screens/Veterinary';
import LocalServices from './app/screens/LocalServices';
import Emergency from './app/screens/Emergency';
import DogSitting from './app/screens/DogSitting';
import QRCode from './app/screens/QRCode';
import Rdv from './app/screens/Rdv';
import UserUpdate from './app/screens/UserUpdate';
import DogManagement from './app/screens/DogManagement';
import AvatarUpdate from './app/screens/AvatarUpdate';
import RdvVet from './app/screens/RdvVet';
import ReservationGard from './app/screens/ReservationGard';
import AppointmentsManagerUser from './app/screens/AppointmentsManagerUser';

// Importations des composants
import AddDog from './app/components/AddDog';
import UpdateDog from './app/components/UpdateDog';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated } = React.useContext(AuthContext);

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={isAuthenticated ? 'DashboardUser' : 'Home'}
    >
      {isAuthenticated ? (
        <>
          <Stack.Screen name="DashboardUser" component={DashboardUser} />
          <Stack.Screen name="Logout" component={Logout} />
          <Stack.Screen name="AIAdvisor" component={AIAdvisor} />
          <Stack.Screen name="Grooming" component={Grooming} />
          <Stack.Screen name="Shop" component={Shop} />
          <Stack.Screen name="Veterinary" component={Veterinary} />
          <Stack.Screen name="LocalServices" component={LocalServices} />
          <Stack.Screen name="Emergency" component={Emergency} />
          <Stack.Screen name="DogSitting" component={DogSitting} />
          <Stack.Screen name="QRCode" component={QRCode} />
          <Stack.Screen name="Rdv" component={Rdv} />
          <Stack.Screen name="UserUpdate" component={UserUpdate} />
          <Stack.Screen name="DogManagement" component={DogManagement} />
          <Stack.Screen name="AddDog" component={AddDog} />
          <Stack.Screen name="AvatarUpdate" component={AvatarUpdate} />
          <Stack.Screen name="UpdateDog" component={UpdateDog} />
          <Stack.Screen name="RdvVet" component={RdvVet} />
          <Stack.Screen name="ReservationGard" component={ReservationGard} />
          <Stack.Screen name="AppointmentsManagerUser" component={AppointmentsManagerUser} />
        </>
      ) : (
        <>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        </>
      )}
      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicy}
        options={{ title: 'Politique de confidentialité' }}
      />
      <Stack.Screen
        name="TermsOfService"
        component={TermsOfService}
        options={{ title: "Conditions d'utilisation" }}
      />
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <UserProvider>
        <NavigationContainer ref={navigationRef}>
          <AppNavigator />
        </NavigationContainer>
        <StatusBar style="auto" />
      </UserProvider>
    </AuthProvider>
  );
};

export default App;

import React from 'react';
import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        if (!token) {
          return;
        }

        const response = await axios.get(
          'https://api.univerdog.site/api/user',
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
              Accept: 'application/json',
              'X-Requested-With': 'XMLHttpRequest',
            },
          },
        );

        const userData = response.data.data.user;
        setUser(userData);
        await AsyncStorage.setItem('user', JSON.stringify(userData));
      } catch (error) {
        console.error(
          'Erreur lors de la récupération des informations utilisateur',
          error,
        );
      }
    };

    fetchUser();
  }, [token]);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { UserContext, UserProvider };

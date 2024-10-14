import React from 'react';
import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);

  // Récupérer le token depuis AsyncStorage
  useEffect(() => {
    const getToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          setToken(token);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du token:', error);
      }
    };
    getToken();
  }, []);

  // Fonctions de connexion et déconnexion
  const login = async token => {
    try {
      await AsyncStorage.setItem('token', token);
      setToken(token);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du token:', error);
    }
  };

  const logout = async navigate => {
    try {
      await AsyncStorage.removeItem('token');
      setToken(null);
      setIsAuthenticated(false);
      if (navigate) {
        navigate('/');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du token:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

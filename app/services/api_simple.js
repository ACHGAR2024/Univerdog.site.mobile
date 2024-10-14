import { useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const useAxios = () => {
  const { token } = useContext(AuthContext);

  const api = axios.create({
    baseURL: 'https://api.univerdog.site/api',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return api;
};

export default useAxios;

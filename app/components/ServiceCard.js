// components/ServiceCard.js
import React from 'react';
import { Pressable, Text } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { globalStyles } from '../styles/styles';
import PropTypes from 'prop-types';

const ServiceCard = ({ icon, title, description, onPress }) => {
  return (
    <Pressable style={globalStyles.button} onPress={onPress}>
      <FontAwesome5 name={icon} size={24} color="#ff4b2b" />
      <Text style={globalStyles.title}>{title}</Text>
      <Text>{description}</Text>
    </Pressable>
  );
};
// Validation des props avec PropTypes
ServiceCard.propTypes = {
    icon: PropTypes.any.isRequired, // Vous pouvez spécifier un type plus spécifique comme PropTypes.string ou PropTypes.number si applicable.
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired
  };

export default ServiceCard;

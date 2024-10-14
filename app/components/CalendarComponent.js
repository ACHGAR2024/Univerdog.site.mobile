import React from 'react';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { colors } from '../styles/theme';

// Configuration de la langue française pour le calendrier
LocaleConfig.locales['fr'] = {
  monthNames: [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ],
  monthNamesShort: [
    'Janv.', 'Févr.', 'Mars', 'Avr.', 'Mai', 'Juin',
    'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'
  ],
  dayNames: [
    'Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'
  ],
  dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
  today: "Aujourd'hui"
};
LocaleConfig.defaultLocale = 'fr';

const CalendarComponent = ({ onDateSelect, appointments, isDayFullyBooked }) => {
  const markedDates = appointments.reduce((acc, appointment) => {
    if (appointment && appointment.date) {
      const date = appointment.date;
      if (!acc[date]) {
        acc[date] = { marked: true };
      }
      if (isDayFullyBooked(date)) {
        acc[date].disabled = true;
      }
    }
    return acc;
  }, {});

  // Marquer les journées complètement réservées avec un cercle rouge
  Object.keys(markedDates).forEach(date => {
    if (isDayFullyBooked(date)) {
      markedDates[date] = { ...markedDates[date], selected: true, selectedColor: 'red' };
    }
  });

  return (
    <View style={localStyles.container}>
      <Calendar
        onDayPress={(day) => {
          console.log('selected day', day);
          onDateSelect(day.dateString);
        // Ajouter un style pour le jour sélectionné
        const today = new Date().toISOString().split('T')[0];
        const selectedDate = day.dateString;
        if (selectedDate === today) {
          markedDates[selectedDate] = { ...markedDates[selectedDate], selected: true, selectedColor: colors.primary };
        } else {
          markedDates[selectedDate] = { ...markedDates[selectedDate], selected: true, selectedColor: colors.secondary };
        }
        }}
        markedDates={markedDates}
        style={localStyles.calendar} // Ajouté pour s'assurer que le calendrier a suffisamment d'espace
      />
    </View>
  );
};

const localStyles = StyleSheet.create({
  calendar: {
    height: 350, // Ajouté pour s'assurer que le calendrier a suffisamment d'espace
  },
  container: {
    alignItems: 'center',
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: 'center',
    width: '100%', // Assurez-vous que le calendrier prend toute la largeur disponible
  },
});

CalendarComponent.propTypes = {
  onDateSelect: PropTypes.func.isRequired,
  appointments: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string,
      time: PropTypes.string,
      service: PropTypes.string,
      status: PropTypes.string,
      id: PropTypes.number,
    })
  ).isRequired,
  isDayFullyBooked: PropTypes.func.isRequired,
};

export default CalendarComponent;
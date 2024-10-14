import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { colors } from '../styles/theme';

const availableTimes = [
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
];

const TimePicker = ({ onTimeSelect, selectedDate, appointments = [] }) => {
  const [selectedTime, setSelectedTime] = useState(null);

  const handleTimePress = time => {
    setSelectedTime(time);
    onTimeSelect(time);
  };

  const isTimeTaken = time => {
    return appointments.some(
      appointment =>
        appointment &&
        appointment.date &&
        appointment.time &&
        appointment.date === selectedDate &&
        appointment.time === time
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Sélectionnez une heure</Text>
      <View style={styles.timesContainer}>
        {availableTimes.map(time => (
          <View key={time} style={styles.buttonWrapper}>
            <Button
              style={styles.timeButton}
              title={time}
              onPress={() => handleTimePress(time)}
              color={
                selectedTime === time
                  ? 'green'
                  : isTimeTaken(time)
                  ? 'red'
                  : 'gray'
              }
              disabled={isTimeTaken(time)}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

TimePicker.propTypes = {
  onTimeSelect: PropTypes.func.isRequired,
  selectedDate: PropTypes.string.isRequired,
  appointments: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string,
      time: PropTypes.string,
      service: PropTypes.string,
    })
  ),
};

const styles = StyleSheet.create({
  buttonWrapper: {
    margin: 5,
  },
  container: {
    alignItems: 'center',
  },
  text: {
    color: colors.link,
    fontSize: 16,
    marginBottom: 10,
  },
  timeButton: {
    marginRight: 5,
    padding: 5,
  },
  timesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
});

export default TimePicker;

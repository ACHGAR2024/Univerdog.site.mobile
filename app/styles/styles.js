// styles.js
import { StyleSheet } from 'react-native';
import { colors, fontSizes, spacing } from './theme';

export const globalStyles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 5,
    padding: spacing.medium,
  },
  buttonText: {
    color: colors.text.secondary,
    fontSize: fontSizes.medium,
    fontWeight: 'bold',
  },
  buttonTextReserve: {
    color: colors.text.primary,
    fontSize: fontSizes.medium,
    fontWeight: 'bold',
    padding: 5,
    textAlign: 'center',
    textShadowColor: colors.shadow,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  container: {
    backgroundColor: colors.background,
    flex: 1,
    
  },
  title: {
    color: colors.text.primary,
    fontSize: fontSizes.large,
    fontWeight: 'bold',
    marginBottom: spacing.large,
  },

  // Ajoutez d'autres styles globaux ici
});

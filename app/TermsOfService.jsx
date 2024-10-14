import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors, fontSizes, spacing } from './styles/theme';

const TermsOfService = () => {
  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.title}>Conditions d&apos;utilisation</Text>
        <Text style={styles.content}>
          Bienvenue sur Univerdog ! En utilisant notre application, vous
          acceptez les présentes conditions d&apos;utilisation. Veuillez les
          lire attentivement.
        </Text>
        <Text style={styles.sectionTitle}>
          1. Utilisation de l&apos;application
        </Text>
        <Text style={styles.content}>
          Vous vous engagez à utiliser Univerdog de manière responsable et
          conformément à toutes les lois applicables.
        </Text>
        <Text style={styles.sectionTitle}>
          2. Contenu de l&apos;utilisateur
        </Text>
        <Text style={styles.content}>
          Vous êtes responsable de tout contenu que vous publiez sur Univerdog.
          Nous nous réservons le droit de supprimer tout contenu inapproprié.
        </Text>
        <Text style={styles.sectionTitle}>3. Propriété intellectuelle</Text>
        <Text style={styles.content}>
          Tout le contenu présent sur Univerdog, sauf indication contraire, est
          la propriété d&apos;Univerdog ou de ses partenaires.
        </Text>
        <Text style={styles.sectionTitle}>4. Confidentialité</Text>
        <Text style={styles.content}>
          Votre utilisation d&apos;Univerdog est également soumise à notre
          politique de confidentialité.
        </Text>
        <Text style={styles.sectionTitle}>5. Modifications des conditions</Text>
        <Text style={styles.content}>
          Nous nous réservons le droit de modifier ces conditions à tout moment.
          Les modifications prendront effet dès leur publication sur
          l&apos;application.
        </Text>
        <Text style={styles.sectionTitle}>6. Résiliation</Text>
        <Text style={styles.content}>
          Nous nous réservons le droit de suspendre ou de résilier votre accès à
          Univerdog en cas de violation de ces conditions.
        </Text>
        <Text style={styles.sectionTitle}>7. Limitation de responsabilité</Text>
        <Text style={styles.content}>
          Univerdog n&apos;est pas responsable des dommages directs ou indirects
          résultant de l&apos;utilisation de l&apos;application.
        </Text>
        <Text style={styles.sectionTitle}>8. Loi applicable</Text>
        <Text style={styles.content}>
          Ces conditions sont régies par les lois en vigueur dans votre pays de
          résidence.
        </Text>
        <Text style={styles.content}>
          En utilisant Univerdog, vous acceptez ces conditions
          d&apos;utilisation. Si vous avez des questions, n&apos;hésitez pas à
          nous contacter.
        </Text>
        <Text style={styles.content}>
          Dernière mise à jour : 1er Octobre 2024
        </Text>
        <View style={styles.spacer} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.background,
    boxSizing: 'border-box',
    justifyContent: 'center',
    paddingBottom: spacing.large,
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.medium,

    width: '100%',
  },
  content: {
    color: colors.text.primary,
    fontSize: fontSizes.medium,
    lineHeight: 24,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    
  },
  sectionTitle: {
    color: colors.text.primary,
    fontSize: fontSizes.large,
    fontWeight: 'bold',
    marginBottom: spacing.small,
    marginTop: spacing.medium,
  },
  spacer: {
    height: spacing.extraLarge,
  },
  title: {
    color: colors.text.primary,
    fontSize: fontSizes.extraLarge,
    fontWeight: 'bold',
    marginBottom: spacing.medium,
  },
});

export default TermsOfService;

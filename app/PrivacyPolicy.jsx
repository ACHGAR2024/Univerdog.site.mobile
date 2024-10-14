import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { colors, fontSizes, spacing } from "./styles/theme";

const PrivacyPolicy = () => {
  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.title}>Politique de confidentialité</Text>
        <Text style={styles.paragraph}>
          Chez Univerdog, nous accordons une grande importance à la protection
          de vos données personnelles. Cette politique de confidentialité
          explique comment nous collectons, utilisons et protégeons vos
          informations.
        </Text>

        <Text style={styles.sectionTitle}>1. Collecte d&apos;informations</Text>
        <Text style={styles.content}>
          Nous collectons les informations que vous nous fournissez directement,
          telles que votre nom, adresse e-mail et informations de profil.
        </Text>

        <Text style={styles.sectionTitle}>2. Utilisation des informations</Text>
        <Text style={styles.content}>
          Nous utilisons vos informations pour :
        </Text>
        <Text style={styles.listItem}>
          • Personnaliser votre expérience sur l&apos;application
        </Text>
        <Text style={styles.listItem}>• Améliorer nos services</Text>
        <Text style={styles.listItem}>
          • Communiquer avec vous concernant votre compte ou nos services
        </Text>

        <Text style={styles.sectionTitle}>3. Protection des données</Text>
        <Text style={styles.content}>
          Nous mettons en place des mesures de sécurité pour protéger vos
          informations contre tout accès non autorisé ou toute divulgation.
        </Text>

        <Text style={styles.sectionTitle}>4. Partage d&apos;informations</Text>
        <Text style={styles.content}>
          Nous ne vendons pas vos informations personnelles. Nous pouvons
          partager vos informations avec des tiers uniquement dans les cas
          suivants :
        </Text>
        <Text style={styles.listItem}>• Avec votre consentement</Text>
        <Text style={styles.listItem}>• Pour des raisons légales</Text>
        <Text style={styles.listItem}>
          • Avec nos fournisseurs de services qui nous aident à exploiter
          l&apos;application
        </Text>

        <Text style={styles.sectionTitle}>5. Vos droits</Text>
        <Text style={styles.content}>
          Vous avez le droit d&apos;accéder à vos données personnelles, de les
          corriger ou de les supprimer. Vous pouvez également vous opposer au
          traitement de vos données ou demander leur portabilité.
        </Text>

        <Text style={styles.sectionTitle}>
          6. Cookies et technologies similaires
        </Text>
        <Text style={styles.content}>
          Nous utilisons des cookies et des technologies similaires pour
          améliorer votre expérience sur notre application et analyser son
          utilisation.
        </Text>

        <Text style={styles.sectionTitle}>
          7. Modifications de la politique de confidentialité
        </Text>
        <Text style={styles.content}>
          Nous nous réservons le droit de modifier cette politique à tout
          moment. Les modifications prendront effet dès leur publication sur
          l&apos;application.
        </Text>

        <Text style={styles.sectionTitle}>8. Contact</Text>
        <Text style={styles.content}>
          Si vous avez des questions concernant cette politique de
          confidentialité, veuillez nous contacter à contact@univerdog.com.
        </Text>

        <Text style={styles.footer}>
          Dernière mise à jour : 1er Octobre 2024
        </Text>
        <View style={styles.spacer} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: colors.background,
    boxSizing: "border-box",
    height: "100%",
    justifyContent: "center",
    paddingBottom: spacing.extraLarge * 8,
    paddingHorizontal: spacing.medium,
    paddingTop: spacing.large,
    width: "100%",
  },
  content: {
    color: colors.text.secondary,
    fontSize: fontSizes.medium,
    lineHeight: 24,
    
  },
  footer: {
    color: colors.text.secondary,
    fontSize: fontSizes.small,
    marginBottom: spacing.medium,
    marginTop: spacing.large,
    textAlign: "center",
  },
  listItem: {
    color: colors.text.secondary,
    fontSize: fontSizes.medium,
    lineHeight: 24,
    marginBottom: spacing.small,
    marginLeft: spacing.medium,
  },
  paragraph: {
    color: colors.text.secondary,
    fontSize: fontSizes.medium,
    lineHeight: 24,
    marginBottom: spacing.medium,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
    
  },
  sectionTitle: {
    color: colors.text.primary,
    fontSize: fontSizes.large,
    fontWeight: "bold",
    marginBottom: spacing.small,
    marginTop: spacing.medium,
  },
  spacer: {
    height: spacing.extraLarge,
  },
  title: {
    color: colors.text.primary,
    fontSize: fontSizes.extraLarge,
    fontWeight: "bold",
    marginBottom: spacing.medium,
    textAlign: "center",
  },
});

export default PrivacyPolicy;
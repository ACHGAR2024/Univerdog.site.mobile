import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
  Linking,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import PropTypes from 'prop-types';

const QRCodeScreen = ({ route }) => {
  const { qrCode } = route.params;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Voici le QR code de mon chien: ${qrCode}`,
      });
    } catch (error) {
      console.error('Erreur lors du partage:', error);
    }
  };

  const handleOpenLink = () => {
    const url = `${qrCode}`;
    Linking.openURL(url).catch(err =>
      console.error("Erreur lors de l'ouverture du lien:", err),
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>QR Code</Text>
      <QRCode value={qrCode} size={200} color="black" backgroundColor="white" />
      <TouchableOpacity style={styles.button} onPress={handleShare}>
        <Text style={styles.buttonText}>Partager</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleOpenLink}>
        <Text style={styles.buttonText}>Ouvrir le lien</Text>
      </TouchableOpacity>
    </View>
  );
};

QRCodeScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      qrCode: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#ff4b2b',
    borderRadius: 10,
    padding: 15,
    width: '80%',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default QRCodeScreen;

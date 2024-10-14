import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Platform, Text, Linking } from 'react-native';
import { WebView } from 'react-native-webview';
import axios from 'axios';
import { colors, fontSizes, spacing } from '../styles/theme';

const LocalServices = () => {
  const [marqueurs, setMarqueurs] = useState([]);

  const leManRegion = {
    lat: 47.9960325,
    lng: 0.1918995,
  };

  useEffect(() => {
    const fetchLieux = async () => {
      try {
        const response = await axios.get(
          'https://api.univerdog.site/api/places',
        );
        const lieuxData = response.data.places || [];

        const marqueursFormates = lieuxData.map(lieu => ({
          id: lieu.id.toString(),
          position: {
            lat: parseFloat(lieu.latitude),
            lng: parseFloat(lieu.longitude),
          },
          icon: getMarkerIcon(lieu.type),
          title: lieu.title,
          description: `${lieu.description}`,
          type: lieu.type,
        }));
        //console.log('marqueursFormates', marqueursFormates);
        setMarqueurs(marqueursFormates);
      } catch (error) {
        console.error('Erreur lors de la récupération des lieux', error);
      }
    };

    fetchLieux();
  }, []);

  const handleMarkerPress = (latitude, longitude) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          console.log("L'application Google Maps n'est pas installée");
          // Vous pouvez ajouter ici une logique pour ouvrir une autre application de cartes ou afficher un message à l'utilisateur
        }
      })
      .catch(err => console.error("Une erreur s'est produite", err));
  };

  const getMarkerIcon = type => {
    switch (type) {
      case 'medkit':
        return '🏥';
      case 'graduation-cap':
        return '🎓';
      case 'square-h':
        return '🏠';
      case 'shopping-bag':
        return '🛍️';
      case 'tree':
        return '🌳';
      case 'park':
        return '🌳';
      case 'paw':
        return '🌳';
      case 'vet':
        return '🩺';
      case 'stethoscope':
        return '🩺';
      case 'hospital':
        return '🏥';
      case 'shop':
        return '🛍️';
      case 'utensils':
        return '🍽️';
      case 'bed':
        return '🏠';
      case 'umbrella-beach':
        return '🏖️';
      case 'hiking':
        return '🐾';
      case 'campground':
        return '⛺';
      case 'store':
        return '🏪';
      case 'trophy':
        return '🏆';
      case 'bone':
        return '🦴';
      case 'spa':
        return '💆';
      case 'gas-pump':
        return '⛽';
      default:
        return '📍';
    }
  };

  const handlePlaceDetails = (latitude, longitude) => {
    const url = Platform.select({
      ios: `maps://app?daddr=${latitude},${longitude}`,
      android: `google.navigation:q=${latitude},${longitude}`,
    });

    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          console.log("L'application Maps n'est pas installée");
          // Fallback vers Google Maps dans le navigateur
          const browserUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
          return Linking.openURL(browserUrl);
        }
      })
      .catch(err => console.error("Une erreur s'est produite", err));
  };

  const generateMapHTML = () => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
          <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
          <style>
            #map { height: 100vh; width: 100vw; }
            .popup-title { font-weight: bold; font-size: 1.2em; margin-bottom: 5px; }
            .popup-description { margin-bottom: 10px; }
            .popup-link { color: blue; text-decoration: underline; cursor: pointer; }
          </style>
        </head>
        <body>
          <div id="map"></div>
          <script>
            var map = L.map('map').setView([${leManRegion.lat}, ${
      leManRegion.lng
    }], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '&copy; OpenStreetMap contributors'
            }).addTo(map);
            
            var markers = ${JSON.stringify(marqueurs)};
            markers.forEach(function(marker) {
              var customIcon = L.divIcon({
                html: \`<div style="font-size: 24px;">\${marker.icon}</div>\`,
                iconSize: [30, 30],
                iconAnchor: [15, 30],
                popupAnchor: [0, -30]
              });

              L.marker([marker.position.lat, marker.position.lng], { icon: customIcon })
                .addTo(map)
                .bindPopup(
                  '<div class="popup-title">' + marker.title + '</div>' +
                  '<div class="popup-description">' + marker.description + '</div>' +
                  '<a class="popup-link" onclick="openPlaceDetails(' + marker.position.lat + ', ' + marker.position.lng + ')">Itinéraire vers ce lieu</a>'
                )
                
            });

            function openPlaceDetails(lat, lng) {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                event: 'openPlaceDetails',
                lat: lat,
                lng: lng
              }));
            }
          </script>
        </body>
      </html>
    `;
  };

  const onMessage = event => {
    const data = JSON.parse(event.nativeEvent.data);
    if (data.event === 'markerClicked') {
      handleMarkerPress(data.lat, data.lng);
    } else if (data.event === 'openPlaceDetails') {
      handlePlaceDetails(data.lat, data.lng);
    }
  };

  return (
    <GestureHandlerRootView style={styles.gestureHandler}>
      <View style={styles.container}>
        {Platform.OS !== 'web' ? (
          <View style={styles.mapContainer}>
            <WebView
              source={{ html: generateMapHTML() }}
              style={styles.map}
              onMessage={onMessage}
            />
          </View>
        ) : (
          <Text style={styles.webMessage}>Map non disponible sur web</Text>
        )}
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  calloutContainer: {
    backgroundColor: colors.cardBackground,
    borderColor: colors.border,
    borderRadius: 10,
    borderWidth: 1,
    padding: spacing.small,
    width: 200,
  },
  calloutDescription: {
    color: colors.text.secondary,
    fontSize: fontSizes.small,
    marginBottom: spacing.tiny,
  },
  calloutLink: {
    color: colors.link,
    fontSize: fontSizes.small,
    marginLeft: spacing.tiny,
    textDecorationLine: 'underline',
  },
  calloutTitle: {
    color: colors.text.primary,
    fontSize: fontSizes.medium,
    fontWeight: 'bold',
    marginBottom: spacing.tiny,
  },
  container: {
    alignItems: 'center',
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: 'center',
  },
  gestureHandler: {
    flex: 1,
  },
  map: {
    height: '100%',
    width: '100%',
  },
  mapContainer: {
    backgroundColor: colors.cardBackground,
    borderRadius: 15,
    elevation: 5,
    height: '90%',
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    width: '90%',
  },
  markerContainer: {
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderColor: colors.markerBorder,
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: 'center',
    padding: spacing.tiny,
  },
  markerIcon: {
    fontSize: fontSizes.large,
  },
  navigationLinkContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  webMessage: {
    color: colors.text.primary,
    fontSize: fontSizes.medium,
  },
});

export default LocalServices;

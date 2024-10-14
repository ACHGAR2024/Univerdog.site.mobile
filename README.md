<p align="center">
  <a href="https://univerdog.site" target="_blank">
    <img src="https://univerdog.site/src/images/logo.png" width="150" alt="UniversDog Logo">
  </a>
</p>

<h1 align="center">🐾 UniversDog Mobile React Native</h1>

<p align="center">
  <strong>Une application mobile moderne pour les amoureux des chiens</strong>
</p>

<p align="center">
  <a href="#-à-propos">À propos</a> •
  <a href="#-fonctionnalités">Fonctionnalités</a> •
  <a href="#-spécifications-techniques">Spécifications</a> •
  <a href="#-installation">Installation</a> •
  <a href="#-démarrage">Démarrage</a> •
  <a href="#-contribution">Contribution</a> •
  <a href="#-licence">Licence</a>
</p>

<hr>

## 📘 À propos du projet

UniversDog Mobile est une application React Native conçue pour offrir une expérience utilisateur optimale aux amoureux des chiens. Cette application mobile est le complément parfait de notre API backend, permettant aux utilisateurs d'accéder à nos services canins de manière pratique et intuitive.

## 🌟 Fonctionnalités

- 🔐 Authentification sécurisée
- 📅 Gestion avancée des rendez-vous
- 🗺️ Intégration de cartes pour localiser les services
- 📸 Prise et gestion de photos
- 🔔 Notifications push
- 📱 Interface utilisateur responsive et intuitive

## 🛠 Spécifications techniques

| Technologie          | Description                                  |
| -------------------- | -------------------------------------------- |
| **Framework**        | React Native avec Expo                       |
| **Version React**    | 18.2.0                                       |
| **Navigation**       | React Navigation                             |
| **Gestion d'état**   | React Hooks                                  |
| **Requêtes réseau**  | Axios                                        |
| **Cartes**           | react-native-maps, react-native-leaflet-maps |
| **Authentification** | Jwt-decode, Bearer token                     |
| **Stockage local**   | @react-native-async-storage/async-storage    |
| **UI Components**    | React Native Elements                        |

## 🚀 Installation

Project créer avec : [Expo](https://expo.dev) [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/) sous Android Studio
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/) sous Xcode
- [Expo Go](https://expo.dev/go)

Vous pouvez commencer à développer en modifiant les fichiers dans le dossier **app**. Ce projet utilise [file-based routing](https://docs.expo.dev/router/introduction).

1. Clonez le dépôt :

   ```bash
   git clone https://github.com/ACHGAR2024/Univerdog.site.mobile.git
   cd univerdog-mobile
   ```

2. Installez les dépendances :

   ```bash
   npm install
   ```

3. Configurez les variables d'environnement :
   Créez un fichier `.env` à la racine du projet et ajoutez les variables nécessaires.

## 🏁 Démarrage

Pour lancer l'application en mode développement :

```bash
npx expo start --android
```

Vous pouvez alors ouvrir l'application sur :

- Un émulateur Android
- Un simulateur iOS
- Votre appareil physique via l'application Expo Go

## 🧪 Tests

Lancez les tests avec :

```bash
npm run lint
```

Pour lancer la build APK:

```bash
eas build -p android --profile preview
```

Pour lancer la build IPA:

```bash
eas build -p ios --profile preview
```

## 🤝 Contribution

Nous accueillons chaleureusement les contributions ! Voici comment vous pouvez participer :

1. Forkez le projet
2. Créez votre branche de fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Poussez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence. Voir le fichier `LICENSE` pour plus de détails.

---

<p align="center">Fait avec ❤️ par l'équipe UniversDog</p>

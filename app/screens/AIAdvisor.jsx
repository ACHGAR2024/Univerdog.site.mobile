import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Pressable,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, fontSizes, spacing } from '../styles/theme';
import { FontAwesome5 } from '@expo/vector-icons'; // Ajoutez cette ligne

const AIAdvisor = () => {
  const navigation = useNavigation();
  const [messages, setMessages] = useState([
    {
      text: "Bonjour ! Je suis votre assistant IA pour le bien-être de votre chien. Comment puis-je vous aider aujourd'hui ?",
      isUser: false,
    },
  ]);
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef();
  const [loading, setLoading] = useState(false);

  const addMessage = (text, isUser = false) => {
    setMessages(prevMessages => [...prevMessages, { text, isUser }]);
  };

  const handleSend = async () => {
    if (inputText.trim()) {
      addMessage(inputText.trim(), true);
      setInputText('');
      setLoading(true);

      const apiKey = '';
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

      const contextAndPrompt = `
        Vous êtes un assistant IA spécialisé dans le bien-être des chiens. 
        Votre rôle est de fournir des informations et des conseils uniquement sur les sujets liés aux chiens, 
        tels que la santé canine, l'alimentation, le comportement, l'exercice, le toilettage et les soins généraux. 
        Si une question ne concerne pas les chiens, veuillez poliment rediriger la conversation vers des sujets canins.

        Question de l'utilisateur : ${inputText}

        Répondez de manière concise et pertinente, en vous concentrant exclusivement sur les aspects liés aux chiens.
      `;

      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: contextAndPrompt,
                },
              ],
            },
          ],
          safetySettings: [
            // ... vos paramètres de sécurité ...
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      };

      try {
        const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
        await delay(1000); // Attendre 1 seconde avant d'envoyer la requête
        const apiResponse = await fetch(apiUrl, requestOptions);
        const data = await apiResponse.json();

        if (data && data.candidates && data.candidates.length > 0) {
          const textResponse = data.candidates[0].content.parts[0].text;
          addMessage(textResponse);
        } else {
          console.error('Réponse API inattendue:', JSON.stringify(data));
          addMessage(
            "La réponse de l'IA n'a pas pu être traitée. Veuillez réessayer.",
          );
        }
      } catch (error) {
        console.error("Erreur lors de la requête à l'API :", error);
        addMessage('Une erreur est survenue. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false); // Désactiver l'état de chargement, que la requête réussisse ou échoue
      }
    }
  };

  const resetChat = () => {
    setMessages([
      {
        text: "Bonjour ! Je suis votre assistant IA pour le bien-être de votre chien. Comment puis-je vous aider aujourd'hui ?",
        isUser: false,
      },
    ]);
    setInputText('');
  };

  useEffect(() => {
    // Défilement automatique vers le bas après l'ajout du message
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  useEffect(() => {
    // Ce useEffect se déclenchera chaque fois que l'état 'loading' change
    // console.log("État de chargement:", loading);
  }, [loading]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={styles.header}>
          <FontAwesome5 name="robot" size={24} color={colors.primary} />
          <Text style={styles.title}>UniverDog IA Assistant</Text>
        </View>

        <ScrollView
          style={styles.chatContainer}
          ref={scrollViewRef}
          contentContainerStyle={styles.chatContent}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          decelerationRate="fast"
          overScrollMode="never"
        >
          {messages.map((msg, index) => (
            <View
              key={index}
              style={[
                styles.message,
                msg.isUser ? styles.userMessage : styles.aiMessage,
              ]}
            >
              <Text
                style={
                  msg.isUser ? styles.userMessageText : styles.aiMessageText
                }
              >
                {msg.text}
              </Text>
            </View>
          ))}
          {loading && (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Chargement...</Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.chatInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Posez votre question ici..."
            placeholderTextColor={colors.text.secondary}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <FontAwesome
              name="paper-plane"
              size={20}
              color={colors.text.primary}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Pressable
            style={styles.footerButton}
            onPress={() => navigation.navigate('DashboardUser')}
          >
            <FontAwesome name="home" size={24} color={colors.primary} />
          </Pressable>
          <Pressable style={styles.footerButton} onPress={resetChat}>
            <FontAwesome name="history" size={24} color={colors.primary} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: colors.cardBackground,
  },
  aiMessageText: {
    color: colors.text.secondary,
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: spacing.medium,
  },
  chatContent: {
    paddingBottom: spacing.medium,
  },
  chatInput: {
    backgroundColor: colors.inputBackground,
    borderRadius: 20,
    color: colors.text.primary,
    flex: 1,
    fontSize: fontSizes.medium,
    padding: spacing.small,
    paddingLeft: spacing.medium,
  },
  container: {
    backgroundColor: colors.background,
    flex: 1,
    paddingTop: spacing.large,
    paddingBottom: spacing.large,
  },
  footer: {
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: spacing.small,
  },
  footerButton: {
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: spacing.small,
    paddingHorizontal: spacing.medium,
    paddingTop: spacing.xlarge,
  },
  inputContainer: {
    backgroundColor: colors.background,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    padding: spacing.small,
    paddingHorizontal: spacing.medium,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.small,
  },
  loadingText: {
    color: colors.text.secondary,
    fontSize: fontSizes.medium,
  },
  message: {
    borderRadius: 10,
    marginBottom: spacing.small,
    maxWidth: '80%',
    padding: spacing.small,
  },
  sendButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    marginLeft: spacing.small,
    width: 40,
  },
  title: {
    color: colors.white,
    fontSize: fontSizes.large,
    fontWeight: 'bold',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
  },
  userMessageText: {
    color: colors.text.primary,
  },
});

export default AIAdvisor;

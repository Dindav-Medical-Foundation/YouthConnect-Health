import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { theme } from '../theme/theme';
import { SyncEngine } from '../services/SyncEngine';
import NetInfo from '@react-native-community/netinfo';

export default function ChatbotScreen() {
  const [messages, setMessages] = useState([
    { id: '1', text: 'Hi David! 👋 I am your Health Assistant. How can I help you today?', isAI: true }
  ]);
  const [inputText, setInputText] = useState('');
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const offline = !(state.isConnected && state.isInternetReachable !== false);
      setIsOffline(offline);
      if (!offline) {
        SyncEngine.syncQueue();
      }
    });
    return unsubscribe;
  }, []);

  const sendMessage = async () => {
    if (!inputText.trim()) return;
    
    const userText = inputText;
    setInputText('');
    
    // Add user message to UI immediately
    const userMsg = { id: Date.now().toString(), text: userText, isAI: false };
    setMessages(prev => [...prev, userMsg]);

    if (isOffline) {
      Alert.alert('Offline Mode', 'Your message has been queued and will be sent to the AI when you reconnect to the internet.');
      await SyncEngine.enqueueAction('chatbot_message', { text: userText });
    } else {
      // Online: Simulate AI response (In reality, call backend /api/chatbot/ask)
      setTimeout(() => {
        const aiMsg = { 
          id: (Date.now() + 1).toString(), 
          text: `I am your AI health assistant powered by an open-source model. You asked: "${userText}". Please consult a doctor for a formal diagnosis.`, 
          isAI: true 
        };
        setMessages(prev => [...prev, aiMsg]);
      }, 1000);
    }
  };

  const renderMessage = ({ item }) => (
    <View style={[styles.messageBubble, item.isAI ? styles.aiBubble : styles.userBubble]}>
      <Text style={[styles.messageText, item.isAI ? styles.aiText : styles.userText]}>{item.text}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
      {isOffline && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>You are offline. Messages will sync later.</Text>
        </View>
      )}
      <FlatList data={messages} keyExtractor={item => item.id} renderItem={renderMessage} contentContainerStyle={styles.chatList} />
      <View style={styles.inputContainer}>
        <TextInput style={styles.input} placeholder="Type your medical question here..." value={inputText} onChangeText={setInputText} />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  offlineBanner: { backgroundColor: theme.colors.danger, padding: 5, alignItems: 'center' },
  offlineText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  chatList: { padding: 20 },
  messageBubble: { maxWidth: '80%', padding: 15, borderRadius: 20, marginBottom: 15, ...theme.shadows.soft },
  aiBubble: { backgroundColor: theme.colors.surface, alignSelf: 'flex-start', borderBottomLeftRadius: 5 },
  userBubble: { backgroundColor: theme.colors.primary, alignSelf: 'flex-end', borderBottomRightRadius: 5 },
  messageText: { ...theme.typography.body },
  aiText: { color: theme.colors.text },
  userText: { color: '#FFF' },
  inputContainer: { flexDirection: 'row', padding: 15, backgroundColor: theme.colors.surface, borderTopWidth: 1, borderColor: '#EEE' },
  input: { flex: 1, backgroundColor: theme.colors.background, borderRadius: 20, paddingHorizontal: 15, paddingVertical: 10, marginRight: 10 },
  sendButton: { backgroundColor: theme.colors.primary, justifyContent: 'center', paddingHorizontal: 20, borderRadius: 20 },
  sendButtonText: { color: '#FFF', fontWeight: 'bold' }
});

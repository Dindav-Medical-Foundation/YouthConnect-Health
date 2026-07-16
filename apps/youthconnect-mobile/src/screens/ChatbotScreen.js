import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator, Switch } from 'react-native';
import { theme } from '../theme/theme';
import { aiService } from '../services/aiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAT_STORAGE_KEY = '@youthconnect_chat_history';

export default function ChatbotScreen() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [rememberHistory, setRememberHistory] = useState(false);
  const flatListRef = useRef();

  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem(CHAT_STORAGE_KEY);
      if (stored) {
        setMessages(JSON.parse(stored));
      } else {
        setMessages([{ id: '1', text: 'Hi! 👋 I am Keren, your Health Assistant. How can I help you today?', isAI: true }]);
      }
    } catch (e) {
      console.error('Failed to load chat history', e);
    }
  };

  const saveChatHistory = async (newMessages) => {
    try {
      await AsyncStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(newMessages));
    } catch (e) {
      console.error('Failed to save chat history', e);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;
    
    const userText = inputText.trim();
    setInputText('');
    
    const userMsg = { id: Date.now().toString(), text: userText, isAI: false };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    saveChatHistory(updatedMessages);
    
    setIsTyping(true);
    
    // Call the AI Service
    const messagesToPass = rememberHistory ? updatedMessages : [userMsg];
    const aiResponseText = await aiService.sendMessage(userText, messagesToPass);
    
    const aiMsg = { id: (Date.now() + 1).toString(), text: aiResponseText, isAI: true };
    const finalMessages = [...updatedMessages, aiMsg];
    
    setMessages(finalMessages);
    saveChatHistory(finalMessages);
    setIsTyping(false);
  };

  const renderMessage = ({ item }) => (
    <View style={[styles.messageBubble, item.isAI ? styles.aiBubble : styles.userBubble]}>
      <Text style={[styles.messageText, item.isAI ? styles.aiText : styles.userText]}>{item.text}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
      <FlatList 
        ref={flatListRef}
        data={messages} 
        keyExtractor={item => item.id} 
        renderItem={renderMessage} 
        contentContainerStyle={styles.chatList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />
      <View style={styles.toggleContainer}>
        <Text style={styles.toggleText}>Remember Conversation History</Text>
        <Switch 
          value={rememberHistory} 
          onValueChange={setRememberHistory} 
          trackColor={{ false: '#CBD5E1', true: theme.colors.primary }}
          thumbColor={'#FFFFFF'}
        />
      </View>
      {isTyping && (
        <View style={styles.typingIndicator}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
          <Text style={styles.typingText}>AI is typing...</Text>
        </View>
      )}
      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.input} 
          placeholder="Ask a health question..." 
          value={inputText} 
          onChangeText={setInputText} 
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  chatList: { padding: 20 },
  messageBubble: { maxWidth: '80%', padding: 15, borderRadius: 20, marginBottom: 15, ...theme.shadows.soft },
  aiBubble: { backgroundColor: theme.colors.surface, alignSelf: 'flex-start', borderBottomLeftRadius: 5 },
  userBubble: { backgroundColor: theme.colors.primary, alignSelf: 'flex-end', borderBottomRightRadius: 5 },
  messageText: { ...theme.typography.body },
  aiText: { color: theme.colors.text },
  userText: { color: '#FFF' },
  typingIndicator: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 10 },
  typingText: { marginLeft: 10, color: theme.colors.textLight, fontStyle: 'italic' },
  inputContainer: { flexDirection: 'row', padding: 15, backgroundColor: theme.colors.surface, borderTopWidth: 1, borderColor: '#E2E8F0' },
  input: { flex: 1, backgroundColor: theme.colors.background, borderRadius: 20, paddingHorizontal: 15, paddingVertical: 10, marginRight: 10, fontFamily: 'Outfit_400Regular' },
  sendButton: { backgroundColor: theme.colors.primary, justifyContent: 'center', paddingHorizontal: 20, borderRadius: 20 },
  sendButtonText: { color: '#FFF', fontFamily: 'Outfit_700Bold' },
  toggleContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 10, borderTopWidth: 1, borderColor: '#E2E8F0' },
  toggleText: { ...theme.typography.body, color: theme.colors.textLight, fontSize: 13 }
});

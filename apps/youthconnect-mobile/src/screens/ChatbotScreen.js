import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { theme } from '../theme/theme';

export default function ChatbotScreen() {
  const [messages, setMessages] = useState([
    { id: '1', text: 'Hi David! 👋 I am your Health Assistant. How can I help you today?', isAI: true }
  ]);
  const [inputText, setInputText] = useState('');

  const sendMessage = () => {
    if (!inputText.trim()) return;
    
    // Add user message
    const userMsg = { id: Date.now().toString(), text: inputText, isAI: false };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    // Simulate AI response
    setTimeout(() => {
      const aiMsg = { 
        id: (Date.now() + 1).toString(), 
        text: 'Thank you for sharing. I am a prototype AI, but in the future, I will provide medical guidance here. Please book a consultation with a human doctor if you feel unwell.', 
        isAI: true 
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 1000);
  };

  const renderMessage = ({ item }) => (
    <View style={[styles.messageBubble, item.isAI ? styles.aiBubble : styles.userBubble]}>
      <Text style={[styles.messageText, item.isAI ? styles.aiText : styles.userText]}>{item.text}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.chatList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your medical question here..."
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  chatList: {
    padding: 20,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 15,
    borderRadius: 20,
    marginBottom: 15,
    ...theme.shadows.soft,
  },
  aiBubble: {
    backgroundColor: theme.colors.surface,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 5,
  },
  userBubble: {
    backgroundColor: theme.colors.primary,
    alignSelf: 'flex-end',
    borderBottomRightRadius: 5,
  },
  messageText: {
    ...theme.typography.body,
  },
  aiText: {
    color: theme.colors.text,
  },
  userText: {
    color: '#FFF',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderColor: '#EEE',
  },
  input: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  }
});

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator, Switch, SafeAreaView, Animated } from 'react-native';
import { theme } from '../theme/theme';
import { aiService } from '../services/aiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const CHAT_STORAGE_KEY = '@youthconnect_chat_history';

export default function ChatbotScreen() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [rememberHistory, setRememberHistory] = useState(false);
  const flatListRef = useRef();

  const suggestedPrompts = [
    { icon: 'shield', text: 'Is my health consultation confidential?' },
    { icon: 'help-circle', text: 'How to book a private doctor chat?' },
    { icon: 'heart', text: 'What are safe family planning options?' },
    { icon: 'map-pin', text: 'Where can I find nearby youth clinics?' },
  ];

  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem(CHAT_STORAGE_KEY);
      if (stored) {
        setMessages(JSON.parse(stored));
      } else {
        setMessages([{ id: '1', text: 'Hi! 👋 I am Keren, your YouthConnect Health Assistant. Ask me any health, reproductive, or wellness question — completely private and confidential.', isAI: true }]);
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

  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem(CHAT_STORAGE_KEY);
      setMessages([{ id: '1', text: 'Hi! 👋 I am Keren, your YouthConnect Health Assistant. Ask me any health, reproductive, or wellness question — completely private and confidential.', isAI: true }]);
    } catch (e) {
      console.error('Failed to clear chat history', e);
    }
  };

  const sendMessage = async (textToSend) => {
    const query = typeof textToSend === 'string' ? textToSend : inputText.trim();
    if (!query || isTyping) return;
    
    setInputText('');
    
    const userMsg = { id: Date.now().toString(), text: query, isAI: false };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    saveChatHistory(updatedMessages);
    
    setIsTyping(true);
    
    const contextMessages = rememberHistory ? updatedMessages.slice(-5) : [userMsg];
    const aiResponseText = await aiService.sendMessage(query, contextMessages);
    
    const aiMsg = { id: (Date.now() + 1).toString(), text: aiResponseText, isAI: true };
    const finalMessages = [...updatedMessages, aiMsg];
    
    setMessages(finalMessages);
    saveChatHistory(finalMessages);
    setIsTyping(false);
  };

  const renderFormattedText = (text, isAI) => {
    if (!text) return null;
    
    let cleanText = text;
    try {
      if (text.includes('%20') || text.includes('%26')) {
        cleanText = decodeURIComponent(text);
      }
    } catch (e) {
      console.warn("URI decode failed", e);
    }

    const lines = cleanText.split('\n');
    return lines.map((line, index) => {
      if (line.trim().startsWith('|')) {
        const columns = line.split('|').map(col => col.trim()).filter(col => col !== '');
        if (columns.every(col => col.startsWith(':') || col.startsWith('-') || col.endsWith('-'))) {
          return null;
        }
        
        const isTableHeader = index === 0 || (lines[index - 1] && !lines[index - 1].trim().startsWith('|'));
        
        return (
          <View key={index} style={styles.tableRow}>
            {columns.map((col, colIndex) => {
              const colParts = col.split('**');
              const colTextNodes = colParts.map((part, partIdx) => {
                const isBold = partIdx % 2 === 1;
                return (
                  <Text key={partIdx} style={isBold ? styles.boldText : null}>
                    {part}
                  </Text>
                );
              });
              return (
                <View key={colIndex} style={[styles.tableCell, isTableHeader && styles.tableHeaderCell]}>
                  <Text style={[styles.tableCellText, isTableHeader && styles.tableHeaderCellText, isAI ? styles.aiText : styles.userText]}>
                    {colTextNodes}
                  </Text>
                </View>
              );
            })}
          </View>
        );
      }

      let isBullet = false;
      let lineText = line;
      if (line.trim().startsWith('- ')) {
        isBullet = true;
        lineText = line.trim().substring(2);
      } else if (line.trim().startsWith('* ')) {
        isBullet = true;
        lineText = line.trim().substring(2);
      }
      
      const parts = lineText.split('**');
      const textNodes = parts.map((part, partIndex) => {
        const isBold = partIndex % 2 === 1;
        return (
          <Text key={partIndex} style={isBold ? styles.boldText : null}>
            {part}
          </Text>
        );
      });

      return (
        <View key={index} style={[styles.lineWrapper, isBullet && styles.bulletLine]}>
          {isBullet && <Text style={[styles.bulletPoint, isAI ? styles.aiText : styles.userText]}>• </Text>}
          <Text style={[styles.messageText, isAI ? styles.aiText : styles.userText]}>
            {textNodes}
          </Text>
        </View>
      );
    });
  };

  const renderMessage = ({ item }) => (
    <View style={[styles.messageBubbleWrapper, item.isAI ? styles.aiBubbleWrapper : styles.userBubbleWrapper]}>
      {item.isAI && (
        <View style={styles.aiAvatar}>
          <LinearGradient colors={['#EC4899', '#8B5CF6']} style={styles.aiAvatarGradient} start={{x:0, y:0}} end={{x:1, y:1}}>
            <FontAwesome5 name="user-nurse" size={14} color="#FFF" />
          </LinearGradient>
        </View>
      )}
      <View style={[styles.messageBubble, item.isAI ? styles.aiBubble : styles.userBubble]}>
        {renderFormattedText(item.text, item.isAI)}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.keyboardAvoid} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
        
        <View style={styles.mainWrapper}>
          
          {/* Top Assistant Profile Header */}
          <View style={styles.assistantHeader}>
            <View style={styles.assistantProfileRow}>
              <View style={styles.profileAvatarContainer}>
                <LinearGradient colors={['#EC4899', '#8B5CF6']} style={styles.profileAvatarGradient} start={{x:0, y:0}} end={{x:1, y:1}}>
                  <FontAwesome5 name="user-nurse" size={18} color="#FFF" />
                </LinearGradient>
                <View style={styles.onlineBadgeDot} />
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>Keren AI</Text>
                <Text style={styles.profileSub}>24/7 Confidential Assistant</Text>
              </View>
            </View>

            <View style={styles.headerRightActions}>
              <View style={styles.switchContainer}>
                <Text style={styles.toggleText}>Memory</Text>
                <Switch 
                  value={rememberHistory} 
                  onValueChange={setRememberHistory} 
                  trackColor={{ false: '#E2E8F0', true: '#2563EB' }}
                  thumbColor={'#FFFFFF'}
                  style={{ marginLeft: 4, transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }] }}
                />
              </View>
              <TouchableOpacity style={styles.clearButton} onPress={clearHistory} activeOpacity={0.7}>
                <Feather name="trash-2" size={15} color={theme.colors.danger} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Chat Messages */}
          <FlatList 
            ref={flatListRef}
            data={messages} 
            keyExtractor={item => item.id} 
            renderItem={renderMessage} 
            contentContainerStyle={styles.chatList}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            ListFooterComponent={
              messages.length <= 2 ? (
                <View style={styles.suggestedContainer}>
                  <Text style={styles.suggestedTitle}>Suggested questions to ask Keren:</Text>
                  <View style={styles.suggestedList}>
                    {suggestedPrompts.map((prompt, idx) => (
                      <TouchableOpacity 
                        key={idx} 
                        style={styles.promptCard} 
                        onPress={() => sendMessage(prompt.text)}
                        activeOpacity={0.7}
                      >
                        <Feather name={prompt.icon} size={15} color="#2563EB" style={{ marginRight: 8 }} />
                        <Text style={styles.promptCardText}>{prompt.text}</Text>
                        <Feather name="chevron-right" size={14} color="#94A3B8" />
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ) : null
            }
          />
          
          {isTyping && (
            <View style={styles.typingIndicator}>
              <ActivityIndicator size="small" color="#2563EB" />
              <Text style={styles.typingText}>Keren is typing...</Text>
            </View>
          )}

          {/* Input Bar */}
          <View style={styles.inputWrapper}>
            <View style={styles.inputContainer}>
              <TextInput 
                style={styles.input} 
                placeholder="Ask Keren anything confidential..." 
                placeholderTextColor={theme.colors.textLight}
                value={inputText} 
                onChangeText={setInputText} 
                onSubmitEditing={() => sendMessage()}
                multiline
              />
              <TouchableOpacity 
                style={[styles.sendButton, (!inputText.trim() || isTyping) && styles.sendButtonDisabled]} 
                onPress={() => sendMessage()}
                disabled={!inputText.trim() || isTyping}
              >
                <LinearGradient 
                  colors={inputText.trim() && !isTyping ? ['#2563EB', '#1D4ED8'] : ['#CBD5E1', '#94A3B8']} 
                  style={styles.sendGradient}
                >
                  <Feather name="send" size={18} color="#FFF" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

        </View>
        
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  keyboardAvoid: { flex: 1 },
  mainWrapper: {
    flex: 1,
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
    backgroundColor: theme.colors.background,
  },
  assistantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(226, 232, 240, 0.8)',
    ...theme.shadows.card,
  },
  assistantProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAvatarContainer: {
    position: 'relative',
    marginRight: 10,
  },
  profileAvatarGradient: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineBadgeDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  profileInfo: {},
  profileName: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: theme.colors.text,
  },
  profileSub: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: '#059669',
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
  },
  toggleText: { fontSize: 11, fontFamily: 'Inter_600SemiBold', color: theme.colors.textLight },
  clearButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  chatList: { padding: 16, paddingBottom: 10 },
  suggestedContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  suggestedTitle: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: theme.colors.textLight,
    marginBottom: 10,
  },
  suggestedList: {
    gap: 8,
  },
  promptCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...theme.shadows.card,
  },
  promptCardText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: theme.colors.text,
  },
  messageBubbleWrapper: { flexDirection: 'row', marginBottom: 16, maxWidth: '85%' },
  aiBubbleWrapper: { alignSelf: 'flex-start' },
  userBubbleWrapper: { alignSelf: 'flex-end', flexDirection: 'row-reverse' },
  aiAvatar: { marginRight: 10, justifyContent: 'flex-end' },
  aiAvatarGradient: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageBubble: {
    padding: 14,
    borderRadius: 18,
    ...theme.shadows.card,
  },
  aiBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.9)',
  },
  userBubble: {
    backgroundColor: '#0F172A',
    borderBottomRightRadius: 4,
  },
  messageText: { fontSize: 14, fontFamily: 'Inter_400Regular', flexWrap: 'wrap', lineHeight: 22 },
  aiText: { color: theme.colors.text },
  userText: { color: '#F8FAFC' },
  typingIndicator: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 12 },
  typingText: { marginLeft: 10, color: theme.colors.textLight, fontFamily: 'Inter_500Medium', fontSize: 13 },
  inputWrapper: {
    padding: 12,
    paddingBottom: Platform.OS === 'ios' ? 8 : 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: 'rgba(226, 232, 240, 0.8)',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 24,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    paddingHorizontal: 12,
    paddingTop: Platform.OS === 'ios' ? 8 : 6,
    paddingBottom: Platform.OS === 'ios' ? 8 : 6,
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: theme.colors.text,
  },
  sendButton: {
    marginLeft: 6,
  },
  sendGradient: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  lineWrapper: { flexDirection: 'row', alignItems: 'flex-start', flexWrap: 'wrap', marginVertical: 3, width: '100%' },
  bulletLine: { paddingLeft: 8 },
  bulletPoint: { marginRight: 6, fontSize: 15, fontFamily: 'Inter_700Bold' },
  boldText: { fontFamily: 'Inter_700Bold' },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderColor: theme.colors.border, paddingVertical: 6 },
  tableCell: { flex: 1, paddingHorizontal: 6 },
  tableHeaderCell: { backgroundColor: '#F1F5F9', borderTopWidth: 1, borderBottomWidth: 2, borderColor: '#CBD5E1' },
  tableCellText: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  tableHeaderCellText: { fontFamily: 'Inter_600SemiBold' }
});


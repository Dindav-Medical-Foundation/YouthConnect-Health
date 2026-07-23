import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../theme/theme';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const REMINDERS_KEY = '@youthconnect_reminders';

export default function RemindersScreen() {
  const [reminders, setReminders] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    try {
      const stored = await AsyncStorage.getItem(REMINDERS_KEY);
      if (stored) {
        setReminders(JSON.parse(stored));
      } else {
        // Default mock reminder for empty state demonstration
        setReminders([{ title: 'Daily Vitamin', time: '08:00 AM', type: 'Custom', id: '1' }]);
      }
    } catch (e) {
      console.error('Failed to load reminders', e);
    }
  };

  const saveReminders = async (updatedReminders) => {
    try {
      await AsyncStorage.setItem(REMINDERS_KEY, JSON.stringify(updatedReminders));
    } catch (e) {
      console.error('Failed to save reminders', e);
    }
  };

  const addReminder = () => {
    if (!newTitle.trim() || !newTime.trim()) return;
    const newReminder = { id: Date.now().toString(), title: newTitle, time: newTime, type: 'Custom' };
    const updated = [...reminders, newReminder];
    setReminders(updated);
    saveReminders(updated);
    setNewTitle('');
    setNewTime('');
    setIsAdding(false);
  };

  const removeReminder = (id) => {
    const updated = reminders.filter(r => r.id !== id);
    setReminders(updated);
    saveReminders(updated);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Reminders</Text>
          <Text style={styles.headerSubtitle}>Never miss a pill or appointment. Keep track of your daily health routines.</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Add New Section */}
          {isAdding ? (
            <View style={styles.inputCard}>
              <View style={styles.inputHeader}>
                <Text style={styles.inputCardTitle}>New Reminder</Text>
                <TouchableOpacity onPress={() => setIsAdding(false)}>
                  <Feather name="x" size={20} color={theme.colors.textLight} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Reminder Name</Text>
                <View style={styles.textInputWrapper}>
                  <Feather name="edit-2" size={16} color={theme.colors.textLight} style={styles.inputIcon} />
                  <TextInput 
                    style={styles.input} 
                    placeholder="e.g., Daily Contraceptive Pill" 
                    placeholderTextColor={theme.colors.textLight}
                    value={newTitle} 
                    onChangeText={setNewTitle} 
                  />
                </View>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Time</Text>
                <View style={styles.textInputWrapper}>
                  <Feather name="clock" size={16} color={theme.colors.textLight} style={styles.inputIcon} />
                  <TextInput 
                    style={styles.input} 
                    placeholder="e.g., 8:00 PM" 
                    placeholderTextColor={theme.colors.textLight}
                    value={newTime} 
                    onChangeText={setNewTime} 
                  />
                </View>
              </View>
              
              <TouchableOpacity style={styles.saveBtn} onPress={addReminder}>
                <LinearGradient colors={['#3B82F6', '#2563EB']} style={styles.saveBtnGradient} start={{x:0, y:0}} end={{x:1, y:1}}>
                  <Feather name="save" size={18} color="#FFF" />
                  <Text style={styles.saveBtnText}>Save Reminder</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.addNewBtn} onPress={() => setIsAdding(true)}>
              <Feather name="plus-circle" size={20} color={theme.colors.primary} />
              <Text style={styles.addNewText}>Add New Reminder</Text>
            </TouchableOpacity>
          )}

          <Text style={styles.sectionTitle}>Your Schedule</Text>
          
          {reminders.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconBg}>
                <Feather name="calendar" size={32} color={theme.colors.textLight} />
              </View>
              <Text style={styles.emptyText}>No reminders set yet</Text>
            </View>
          ) : (
            <View style={styles.list}>
              {reminders.map((item) => (
                <View key={item.id} style={styles.reminderCard}>
                  <View style={styles.iconCol}>
                    <View style={styles.reminderIconBg}>
                      <MaterialCommunityIcons name="pill" size={24} color={theme.colors.primary} />
                    </View>
                  </View>
                  
                  <View style={styles.contentCol}>
                    <Text style={styles.reminderTitle}>{item.title}</Text>
                    <View style={styles.timeWrapper}>
                      <Feather name="clock" size={12} color={theme.colors.textLight} />
                      <Text style={styles.reminderTime}>{item.time}</Text>
                    </View>
                  </View>
                  
                  <TouchableOpacity onPress={() => removeReminder(item.id)} style={styles.checkBtn}>
                    <Feather name="check" size={20} color={theme.colors.success} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    ...theme.typography.header,
    color: theme.colors.text,
    marginBottom: 8,
  },
  headerSubtitle: {
    ...theme.typography.body,
    color: theme.colors.textLight,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  addNewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
    padding: 16,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
    marginBottom: 32,
  },
  addNewText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: theme.colors.primary,
    marginLeft: 8,
  },
  inputCard: {
    backgroundColor: theme.colors.surface,
    padding: 24,
    borderRadius: theme.borderRadius.xl,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.card,
  },
  inputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  inputCardTitle: {
    ...theme.typography.title,
    fontSize: 18,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: theme.colors.text,
    marginBottom: 8,
  },
  textInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 48,
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: theme.colors.text,
  },
  saveBtn: {
    borderRadius: theme.borderRadius.round,
    overflow: 'hidden',
    marginTop: 8,
    ...theme.shadows.glow,
  },
  saveBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  saveBtnText: {
    color: '#FFF',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    marginLeft: 8,
  },
  sectionTitle: {
    ...theme.typography.title,
    fontSize: 20,
    color: theme.colors.text,
    marginBottom: 16,
  },
  list: {
    gap: 12,
  },
  reminderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: 16,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.card,
  },
  iconCol: {
    marginRight: 16,
  },
  reminderIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentCol: {
    flex: 1,
  },
  reminderTitle: {
    ...theme.typography.title,
    fontSize: 16,
    marginBottom: 4,
  },
  timeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reminderTime: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: theme.colors.textLight,
    marginLeft: 4,
  },
  checkBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIconBg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  emptyText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 15,
    color: theme.colors.textLight,
  }
});

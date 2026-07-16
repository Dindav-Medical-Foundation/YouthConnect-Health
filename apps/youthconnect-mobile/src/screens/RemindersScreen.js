import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../theme/theme';

const REMINDERS_KEY = '@youthconnect_reminders';

export default function RemindersScreen() {
  const [reminders, setReminders] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('');

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    try {
      const stored = await AsyncStorage.getItem(REMINDERS_KEY);
      if (stored) setReminders(JSON.parse(stored));
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
    const newReminder = { title: newTitle, time: newTime, type: 'Custom' };
    const updated = [...reminders, newReminder];
    setReminders(updated);
    saveReminders(updated);
    setNewTitle('');
    setNewTime('');
  };

  const removeReminder = (index) => {
    const updated = reminders.filter((_, i) => i !== index);
    setReminders(updated);
    saveReminders(updated);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Medication Reminders</Text>
      
      <View style={styles.inputCard}>
        <Text style={styles.inputTitle}>Add New Reminder</Text>
        <TextInput style={styles.input} placeholder="e.g. Daily Pill" value={newTitle} onChangeText={setNewTitle} />
        <TextInput style={styles.input} placeholder="e.g. 8:00 PM" value={newTime} onChangeText={setNewTime} />
        <TouchableOpacity style={styles.addButton} onPress={addReminder}>
          <Text style={styles.addButtonText}>Save to Device</Text>
        </TouchableOpacity>
      </View>

      {reminders.map((item, index) => (
        <View key={index} style={styles.card}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.timeText}>Time: {item.time}</Text>
          </View>
          <TouchableOpacity onPress={() => removeReminder(index)} style={styles.deleteBtn}>
            <Text style={styles.deleteBtnText}>Done</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, padding: 20 },
  header: { fontFamily: 'Outfit_700Bold', fontSize: 24, color: theme.colors.text, marginBottom: 20 },
  inputCard: { backgroundColor: theme.colors.surface, padding: 20, borderRadius: 15, marginBottom: 30, ...theme.shadows.soft },
  inputTitle: { fontFamily: 'Outfit_600SemiBold', fontSize: 16, color: theme.colors.text, marginBottom: 10 },
  input: { backgroundColor: theme.colors.background, borderWidth: 1, borderColor: '#E2E8F0', padding: 12, borderRadius: 8, marginBottom: 10, fontFamily: 'Outfit_400Regular' },
  addButton: { backgroundColor: theme.colors.primary, padding: 12, borderRadius: 8, alignItems: 'center' },
  addButtonText: { color: '#FFF', fontFamily: 'Outfit_700Bold' },
  card: { backgroundColor: theme.colors.surface, padding: 20, borderRadius: 12, marginBottom: 15, flexDirection: 'row', alignItems: 'center', ...theme.shadows.soft },
  title: { color: theme.colors.primary, fontSize: 18, fontFamily: 'Outfit_700Bold', marginBottom: 5 },
  timeText: { fontFamily: 'Outfit_400Regular', fontSize: 15, color: theme.colors.text },
  deleteBtn: { backgroundColor: theme.colors.secondary, paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  deleteBtnText: { color: '#FFF', fontFamily: 'Outfit_600SemiBold' }
});

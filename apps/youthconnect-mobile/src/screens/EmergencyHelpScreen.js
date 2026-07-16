import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { theme } from '../theme/theme';

export default function EmergencyHelpScreen() {
  const emergencies = [
    { name: 'Emergency contacts', phone: '911' },
    { name: 'Ambulance', phone: '911' },
    { name: 'Post-rape care', phone: '116' },
    { name: 'HIV Post-Exposure Prophylaxis (PEP)', phone: '0800 100 100' },
    { name: 'Mental health support', phone: '0800 200 200' },
  ];

  return (
    <View style={styles.container}>
      <Text style={theme.typography.header}>Emergency Help</Text>
      <Text style={styles.subtitle}>Quick access to urgent services.</Text>
      
      {emergencies.map((item, index) => (
        <TouchableOpacity key={index} style={styles.card} onPress={() => Linking.openURL(`tel:${item.phone}`)}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.phoneText}>Tap to call: {item.phone}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 20,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textLight,
    marginBottom: 20,
    marginTop: 5,
  },
  card: {
    backgroundColor: '#ffebee',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    borderLeftWidth: 5,
    borderLeftColor: '#d32f2f',
    ...theme.shadows.soft,
  },
  title: {
    color: '#d32f2f',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  phoneText: {
    color: '#000',
    fontSize: 16,
  }
});

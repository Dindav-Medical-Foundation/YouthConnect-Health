import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme/theme';

export default function MyRecordsScreen() {
  return (
    <View style={styles.container}>
      <Text style={theme.typography.header}>My Records</Text>
      <Text style={styles.subtitle}>Your personal health history.</Text>
      
      <View style={styles.card}>
        <Text style={styles.title}>Past Consultations</Text>
        <Text style={theme.typography.body}>Oct 15 - Dr. Sarah (Live Chat)</Text>
        <Text style={theme.typography.body}>Sep 02 - Dr. Benjamin (Video Call)</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Test Results</Text>
        <Text style={theme.typography.body}>No recent test results available.</Text>
      </View>
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
    backgroundColor: theme.colors.surface,
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    ...theme.shadows.soft,
  },
  title: {
    color: theme.colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  }
});

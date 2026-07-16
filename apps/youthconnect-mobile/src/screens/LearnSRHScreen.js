import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { theme } from '../theme/theme';

export default function LearnSRHScreen() {
  const modules = [
    'Puberty',
    'HIV prevention',
    'STI prevention',
    'Family planning methods',
    'Menstrual health',
    'Healthy relationships',
    'Gender-based violence',
    'Mental health'
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={theme.typography.header}>Digital SRH Education</Text>
      <Text style={styles.subtitle}>Interactive learning modules</Text>

      {modules.map((mod, index) => (
        <TouchableOpacity key={index} style={styles.moduleCard}>
          <Text style={styles.moduleText}>{mod}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
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
  moduleCard: {
    backgroundColor: theme.colors.surface,
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    ...theme.shadows.soft,
  },
  moduleText: {
    ...theme.typography.body,
    color: theme.colors.primary,
    fontWeight: '600',
  }
});

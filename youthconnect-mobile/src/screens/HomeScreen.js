import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { theme } from '../theme/theme';

export default function HomeScreen({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={theme.typography.h1}>Hello, David! 👋</Text>
        <Text style={styles.subtitle}>Welcome back to YouthConnect.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Upcoming Appointment</Text>
        <Text style={theme.typography.body}>Dr. Emily Chen - Psychologist</Text>
        <Text style={theme.typography.caption}>Tomorrow, Oct 27, 2:30 PM</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Book')}>
          <Text style={styles.buttonText}>View Details</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionBox} onPress={() => navigation.navigate('Book')}>
          <Text style={styles.actionText}>Book Consultation</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBox} onPress={() => navigation.navigate('Chat')}>
          <Text style={styles.actionText}>Chat with AI</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBox}>
          <Text style={styles.actionText}>Learn SRH</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 20,
  },
  header: {
    marginTop: 20,
    marginBottom: 30,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textLight,
    marginTop: 5,
  },
  card: {
    backgroundColor: theme.colors.primary,
    padding: 20,
    borderRadius: 15,
    marginBottom: 30,
    ...theme.shadows.soft,
  },
  cardTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#FFF',
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 15,
  },
  buttonText: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  sectionTitle: {
    ...theme.typography.h2,
    marginBottom: 15,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionBox: {
    backgroundColor: theme.colors.surface,
    padding: 15,
    borderRadius: 15,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
    ...theme.shadows.soft,
  },
  actionText: {
    ...theme.typography.body,
    fontWeight: '600',
    textAlign: 'center',
    color: theme.colors.primary,
  }
});

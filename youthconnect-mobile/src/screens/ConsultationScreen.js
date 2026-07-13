import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { theme } from '../theme/theme';

export default function ConsultationScreen() {
  const doctors = [
    { id: '1', name: 'Dr. Anya Sharma', specialty: 'Pediatrician', time: '10:00 AM' },
    { id: '2', name: 'Dr. Benjamin Lee', specialty: 'Adolescent Medicine', time: '1:45 PM' },
    { id: '3', name: 'Dr. Chloe Garcia', specialty: 'Child Psychologist', time: '2:00 PM' },
  ];

  const renderDoctor = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.doctorName}>{item.name}</Text>
        <Text style={styles.specialty}>{item.specialty}</Text>
      </View>
      <View style={styles.timeSlotContainer}>
        <Text style={styles.timeText}>Next available: {item.time}</Text>
        <TouchableOpacity style={styles.bookButton}>
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={theme.typography.h2}>Book a Teleconsultation</Text>
      <Text style={styles.subtitle}>Find an available doctor and book your virtual appointment today.</Text>
      
      <FlatList
        data={doctors}
        keyExtractor={item => item.id}
        renderItem={renderDoctor}
        contentContainerStyle={styles.list}
      />
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
    marginTop: 10,
    marginBottom: 20,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    ...theme.shadows.soft,
  },
  cardHeader: {
    marginBottom: 15,
  },
  doctorName: {
    ...theme.typography.h3,
    color: theme.colors.primary,
  },
  specialty: {
    ...theme.typography.caption,
  },
  timeSlotContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: 10,
    borderRadius: 10,
  },
  timeText: {
    ...theme.typography.body,
    fontWeight: '500',
  },
  bookButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  bookButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  }
});

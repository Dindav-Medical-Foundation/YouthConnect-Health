import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { theme } from '../theme/theme';
import { SyncEngine } from '../services/SyncEngine';
import NetInfo from '@react-native-community/netinfo';

export default function ConsultationScreen({ navigation }) {
  const [doctors, setDoctors] = useState([
    { id: '1', name: 'Dr. Anya Sharma', specialty: 'Pediatrician', nextAvailable: '10:00 AM' },
    { id: '2', name: 'Dr. Benjamin Lee', specialty: 'Adolescent Medicine', nextAvailable: '1:45 PM' }
  ]);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOffline(!(state?.isConnected && state?.isInternetReachable !== false));
    });
    return unsubscribe;
  }, []);

  const bookAppointment = async (doctorId, doctorName) => {
    if (isOffline) {
      Alert.alert(
        'Offline Mode', 
        `Your booking request for ${doctorName} has been saved offline. It will be sent automatically when you have an internet connection.`
      );
      await SyncEngine.enqueueAction('book_appointment', { doctorId, date: new Date().toISOString() });
    } else {
      Alert.alert('Success', `Appointment booked! Joining video consultation room...`);
      // Simulate calling backend /api/video/room
      const mockRoomUrl = `https://meet.jit.si/youthconnect-${doctorId}-${Date.now().toString().slice(-6)}`;
      navigation.navigate('VideoCall', { roomUrl: mockRoomUrl });
    }
  };

  const renderDoctor = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.doctorInfo}>
        <Text style={styles.doctorName}>{item.name}</Text>
        <Text style={styles.specialty}>{item.specialty}</Text>
        <Text style={styles.availability}>Next Available: {item.nextAvailable}</Text>
      </View>
      <TouchableOpacity style={styles.bookButton} onPress={() => bookAppointment(item.id, item.name)}>
        <Text style={styles.bookButtonText}>Book</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {isOffline && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>Offline Mode: Booking requests will be queued.</Text>
        </View>
      )}
      <Text style={styles.header}>Available Doctors</Text>
      <FlatList data={doctors} keyExtractor={item => item.id} renderItem={renderDoctor} contentContainerStyle={styles.listContainer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  offlineBanner: { backgroundColor: theme.colors.warning, padding: 5, alignItems: 'center' },
  offlineText: { color: theme.colors.text, fontSize: 12, fontWeight: 'bold' },
  header: { fontSize: 24, fontWeight: 'bold', margin: 20, color: theme.colors.text },
  listContainer: { paddingHorizontal: 20 },
  card: { backgroundColor: theme.colors.surface, borderRadius: 15, padding: 20, marginBottom: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', ...theme.shadows.soft },
  doctorInfo: { flex: 1 },
  doctorName: { fontSize: 18, fontWeight: 'bold', color: theme.colors.text },
  specialty: { color: theme.colors.primary, marginVertical: 5 },
  availability: { fontSize: 12, color: '#666' },
  bookButton: { backgroundColor: theme.colors.primary, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
  bookButtonText: { color: '#FFF', fontWeight: 'bold' }
});

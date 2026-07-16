import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { theme } from '../theme/theme';

export default function FindClinicScreen() {
  const mapRegion = {
    latitude: 0.32,
    longitude: 32.58,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.header}>Find a Clinic</Text>
      <Text style={styles.subtitle}>Locate youth-friendly health centers near you.</Text>
      
      <View style={styles.mapContainer}>
        {Platform.OS === 'web' ? (
          <iframe 
            width="100%" 
            height="100%" 
            frameBorder="0" 
            scrolling="no" 
            marginHeight="0" 
            marginWidth="0" 
            src="https://www.openstreetmap.org/export/embed.html?bbox=32.55%2C0.29%2C32.61%2C0.35&amp;layer=mapnik&amp;marker=0.32%2C32.58" 
            style={{ border: 'none', borderRadius: 15 }}
          />
        ) : Platform.OS === 'android' ? (
          <View style={[styles.map, { alignItems: 'center', justifyContent: 'center', backgroundColor: '#CBD5E1' }]}>
            <Text style={{ fontFamily: 'Outfit_600SemiBold', color: '#475569', textAlign: 'center', padding: 20 }}>
              Interactive Map temporarily disabled on Android (Google Maps API Key required).
            </Text>
          </View>
        ) : (
          <MapView 
            style={styles.map}
            initialRegion={mapRegion}
          >
            <Marker coordinate={{ latitude: 0.32, longitude: 32.58 }} title="Youth Friendly Center" description="Central" />
          </MapView>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.clinicName}>Youth Friendly Center (Central)</Text>
        <Text style={styles.bodyText}>Services: Family Planning, STI Testing</Text>
        <Text style={styles.captionText}>Open: 8:00 AM - 5:00 PM</Text>
      </View>
      
      <View style={styles.card}>
        <Text style={styles.clinicName}>Lango Health Clinic</Text>
        <Text style={styles.bodyText}>Services: Teleconsultation, HIV Care</Text>
        <Text style={styles.captionText}>Open: 24/7</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, padding: 20 },
  header: { fontFamily: 'Outfit_700Bold', fontSize: 24, color: theme.colors.text },
  subtitle: { fontFamily: 'Outfit_400Regular', fontSize: 16, color: theme.colors.textLight, marginBottom: 20, marginTop: 5 },
  mapContainer: { width: '100%', height: 300, backgroundColor: '#E2E8F0', borderRadius: 15, marginBottom: 20, overflow: 'hidden', ...theme.shadows.soft },
  map: { width: '100%', height: '100%' },
  card: { backgroundColor: theme.colors.surface, padding: 20, borderRadius: 12, marginBottom: 15, ...theme.shadows.soft },
  clinicName: { color: theme.colors.primary, fontSize: 18, fontFamily: 'Outfit_700Bold', marginBottom: 5 },
  bodyText: { fontFamily: 'Outfit_400Regular', fontSize: 15, color: theme.colors.text },
  captionText: { fontFamily: 'Outfit_400Regular', fontSize: 13, color: theme.colors.textLight, marginTop: 5 }
});

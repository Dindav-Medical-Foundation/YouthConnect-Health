import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { MapView, Marker } from '../components/Map';
import { theme } from '../theme/theme';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function FindClinicScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const mapRegion = {
    latitude: 0.32,
    longitude: 32.58,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  const clinics = [
    {
      id: 1,
      name: 'Youth Friendly Center (Central)',
      services: 'Family Planning, STI Testing',
      open: '8:00 AM - 5:00 PM',
      distance: '1.2 km',
      isOpen: true,
      rating: '4.8',
    },
    {
      id: 2,
      name: 'Lango Health Clinic',
      services: 'Teleconsultation, HIV Care',
      open: '24/7',
      distance: '3.5 km',
      isOpen: true,
      rating: '4.5',
    },
    {
      id: 3,
      name: 'Northside Wellness Hub',
      services: 'Counseling, General Checkup',
      open: 'Closed ⋅ Opens 8:00 AM',
      distance: '5.0 km',
      isOpen: false,
      rating: '4.9',
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Find a Clinic</Text>
        <Text style={styles.headerSubtitle}>Locate certified youth-friendly health centers near you.</Text>
        
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color={theme.colors.textLight} style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput} 
            placeholder="Search clinics, services..." 
            placeholderTextColor={theme.colors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.filterBtn}>
            <Feather name="sliders" size={20} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Map Container */}
        <View style={styles.mapCard}>
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
                style={{ border: 'none' }}
              />
            ) : Platform.OS === 'android' ? (
              <View style={[styles.mapPlaceholder]}>
                <Feather name="map" size={48} color={theme.colors.textLight} />
                <Text style={styles.mapPlaceholderText}>Map preview available in production</Text>
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
          <TouchableOpacity style={styles.mapOverlayBtn}>
            <LinearGradient colors={['#10B981', '#059669']} style={styles.mapBtnGradient} start={{x:0, y:0}} end={{x:1, y:1}}>
              <Feather name="navigation" size={16} color="#FFF" />
              <Text style={styles.mapBtnText}>Use My Location</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Clinic List */}
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Nearby Clinics</Text>
          <Text style={styles.listCount}>{clinics.length} found</Text>
        </View>

        <View style={styles.clinicList}>
          {clinics.map((clinic) => (
            <TouchableOpacity key={clinic.id} style={styles.clinicCard} activeOpacity={0.7}>
              <View style={styles.clinicHeader}>
                <Text style={styles.clinicName}>{clinic.name}</Text>
                <View style={styles.distanceBadge}>
                  <Feather name="map-pin" size={12} color={theme.colors.primary} />
                  <Text style={styles.distanceText}>{clinic.distance}</Text>
                </View>
              </View>
              
              <Text style={styles.servicesText}>{clinic.services}</Text>
              
              <View style={styles.clinicFooter}>
                <View style={styles.statusContainer}>
                  <View style={[styles.statusDot, { backgroundColor: clinic.isOpen ? theme.colors.success : theme.colors.danger }]} />
                  <Text style={[styles.openText, { color: clinic.isOpen ? theme.colors.success : theme.colors.danger }]}>{clinic.open}</Text>
                </View>
                
                <View style={styles.ratingBadge}>
                  <FontAwesome5 name="star" size={12} color={theme.colors.warning} solid />
                  <Text style={styles.ratingText}>{clinic.rating}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
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
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: theme.colors.text,
  },
  filterBtn: {
    padding: 8,
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  mapCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: 8,
    marginBottom: 32,
    ...theme.shadows.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  mapContainer: {
    width: '100%',
    height: 200,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: '#E2E8F0',
  },
  map: { width: '100%', height: '100%' },
  mapPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
  },
  mapPlaceholderText: {
    marginTop: 12,
    fontFamily: 'Inter_500Medium',
    color: theme.colors.textLight,
  },
  mapOverlayBtn: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    borderRadius: 20,
    overflow: 'hidden',
    ...theme.shadows.glow,
  },
  mapBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  mapBtnText: {
    color: '#FFF',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    marginLeft: 8,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  listTitle: {
    ...theme.typography.title,
    fontSize: 20,
  },
  listCount: {
    ...theme.typography.bodyMedium,
    color: theme.colors.textLight,
    fontSize: 14,
  },
  clinicList: {
    gap: 16,
  },
  clinicCard: {
    backgroundColor: theme.colors.surface,
    padding: 20,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.card,
  },
  clinicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  clinicName: {
    ...theme.typography.title,
    fontSize: 17,
    flex: 1,
    paddingRight: 12,
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  distanceText: {
    marginLeft: 4,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: theme.colors.primary,
  },
  servicesText: {
    ...theme.typography.body,
    fontSize: 14,
    color: theme.colors.textLight,
    marginBottom: 16,
  },
  clinicFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  openText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  ratingText: {
    marginLeft: 4,
    fontFamily: 'Inter_700Bold',
    fontSize: 12,
    color: '#B45309',
  }
});

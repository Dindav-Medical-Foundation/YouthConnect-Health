import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, SafeAreaView, ScrollView, Animated } from 'react-native';
import { theme } from '../theme/theme';
import { SyncEngine } from '../services/SyncEngine';
import NetInfo from '@react-native-community/netinfo';
import { Feather, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function ConsultationScreen({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isOffline, setIsOffline] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOffline(!(state?.isConnected && state?.isInternetReachable !== false));
    });

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 45,
        useNativeDriver: true,
      }),
    ]).start();

    return unsubscribe;
  }, []);

  const categories = ['All', 'SRH & Family', 'Mental Health', 'Adolescent Care', 'General Health'];

  const doctorList = [
    { 
      id: '1', 
      name: 'Dr. Anya Sharma', 
      specialty: 'SRH & Adolescent Specialist', 
      category: 'SRH & Family',
      nextAvailable: 'Available Now', 
      isOnline: true,
      rating: '4.9', 
      reviews: 128,
      languages: 'English, Swahili',
      experience: '8+ yrs exp',
      color: '#EC4899', 
      icon: 'user-nurse'
    },
    { 
      id: '2', 
      name: 'Dr. Benjamin Lee', 
      specialty: 'Adolescent Medicine Practitioner', 
      category: 'Adolescent Care',
      nextAvailable: '1:45 PM Today', 
      isOnline: false,
      rating: '4.8', 
      reviews: 94,
      languages: 'English, Luganda',
      experience: '6+ yrs exp',
      color: '#2563EB', 
      icon: 'user-md'
    },
    { 
      id: '3', 
      name: 'Dr. Grace Vance', 
      specialty: 'Youth Counseling & Mental Health', 
      category: 'Mental Health',
      nextAvailable: 'Available Now', 
      isOnline: true,
      rating: '5.0', 
      reviews: 156,
      languages: 'English, French',
      experience: '10+ yrs exp',
      color: '#7C3AED', 
      icon: 'user-nurse'
    },
    { 
      id: '4', 
      name: 'Dr. Samuel Kiptoo', 
      specialty: 'General Youth Healthcare', 
      category: 'General Health',
      nextAvailable: '3:30 PM Today', 
      isOnline: false,
      rating: '4.9', 
      reviews: 82,
      languages: 'English, Swahili',
      experience: '7+ yrs exp',
      color: '#059669', 
      icon: 'user-md'
    }
  ];

  const filteredDoctors = selectedCategory === 'All' 
    ? doctorList 
    : doctorList.filter(doc => doc.category === selectedCategory);

  const bookAppointment = async (doctorId, doctorName) => {
    if (isOffline) {
      Alert.alert(
        'Offline Mode', 
        `Your consultation request for ${doctorName} has been saved offline. It will connect automatically when network restores.`
      );
      await SyncEngine.enqueueAction('book_appointment', { doctorId, date: new Date().toISOString() });
    } else {
      Alert.alert(
        'Connecting Consultation', 
        `Launching end-to-end encrypted video room with ${doctorName}...`,
        [
          {
            text: 'Join Room',
            onPress: () => {
              const mockRoomUrl = `https://meet.jit.si/youthconnect-${doctorId}-${Date.now().toString().slice(-6)}`;
              navigation.navigate('VideoCall', { roomUrl: mockRoomUrl, doctorName });
            }
          }
        ]
      );
    }
  };

  const renderDoctor = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.avatarContainer}>
          <LinearGradient colors={[item.color, '#0F172A']} style={styles.avatarGradient} start={{x:0, y:0}} end={{x:1, y:1}}>
            <FontAwesome5 name={item.icon} size={22} color="#FFF" />
          </LinearGradient>
          {item.isOnline && <View style={styles.onlineStatusDot} />}
        </View>
        
        <View style={styles.doctorInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.doctorName}>{item.name}</Text>
            <View style={styles.ratingBadge}>
              <Feather name="star" size={12} color="#D97706" />
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
          </View>
          <Text style={styles.specialty}>{item.specialty}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaBadge}>{item.experience}</Text>
            <Text style={styles.metaBullet}>•</Text>
            <Text style={styles.metaText}>{item.languages}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.cardFooter}>
        <View style={styles.availabilityContainer}>
          <View style={[styles.statusPill, item.isOnline ? styles.onlinePill : styles.offlinePill]}>
            <View style={[styles.statusDot, item.isOnline ? styles.onlineDot : styles.offlineDot]} />
            <Text style={[styles.statusPillText, item.isOnline ? styles.onlinePillText : styles.offlinePillText]}>
              {item.nextAvailable}
            </Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.bookButton} 
          onPress={() => bookAppointment(item.id, item.name)}
          activeOpacity={0.8}
        >
          <LinearGradient colors={['#2563EB', '#1D4ED8']} style={styles.bookButtonGradient} start={{x:0, y:0}} end={{x:1, y:1}}>
            <Feather name="video" size={15} color="#FFF" style={{ marginRight: 6 }} />
            <Text style={styles.bookButtonText}>Start Consultation</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {isOffline && (
        <View style={styles.offlineBanner}>
          <Feather name="wifi-off" size={16} color="#78350F" style={styles.offlineIcon} />
          <Text style={styles.offlineText}>Offline Mode: Booking requests will be queued.</Text>
        </View>
      )}

      <View style={styles.mainWrapper}>
        <Animated.View style={{ flex: 1, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          
          {/* Guarantee Header Banner */}
          <View style={styles.bannerCard}>
            <View style={styles.bannerIconBadge}>
              <Ionicons name="shield-checkmark" size={20} color="#059669" />
            </View>
            <View style={styles.bannerTextWrapper}>
              <Text style={styles.bannerTitle}>100% Free & Confidential</Text>
              <Text style={styles.bannerSub}>Encrypted video & voice chats with certified youth specialists.</Text>
            </View>
          </View>

          {/* Category Filter Chips */}
          <View style={styles.categoryWrapper}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
              {categories.map((cat, idx) => {
                const isSelected = selectedCategory === cat;
                return (
                  <TouchableOpacity
                    key={idx}
                    style={[styles.categoryChip, isSelected && styles.categoryChipSelected]}
                    onPress={() => setSelectedCategory(cat)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.categoryChipText, isSelected && styles.categoryChipTextSelected]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
          
          <FlatList 
            data={filteredDoctors} 
            keyExtractor={item => item.id} 
            renderItem={renderDoctor} 
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />

        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  mainWrapper: {
    flex: 1,
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  offlineBanner: { 
    flexDirection: 'row', 
    backgroundColor: '#FEF3C7', 
    padding: 10, 
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#FDE68A'
  },
  offlineIcon: { marginRight: 8 },
  offlineText: { color: '#78350F', fontSize: 12, fontFamily: 'Inter_500Medium' },
  bannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
    padding: 14,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  bannerIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  bannerTextWrapper: { flex: 1 },
  bannerTitle: { fontSize: 14, fontFamily: 'Inter_700Bold', color: '#065F46', marginBottom: 2 },
  bannerSub: { fontSize: 12, fontFamily: 'Inter_400Regular', color: '#047857', lineHeight: 16 },
  categoryWrapper: { marginBottom: 12 },
  categoryScroll: { paddingHorizontal: 16, gap: 8 },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryChipSelected: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  categoryChipText: { fontSize: 13, fontFamily: 'Inter_500Medium', color: theme.colors.textLight },
  categoryChipTextSelected: { color: '#FFFFFF', fontFamily: 'Inter_700Bold' },
  listContainer: { paddingHorizontal: 16, paddingBottom: 30 },
  card: { 
    backgroundColor: theme.colors.surface, 
    borderRadius: theme.borderRadius.lg, 
    padding: 16, 
    marginBottom: 14, 
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.8)',
    ...theme.shadows.card 
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatarGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineStatusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  doctorInfo: { flex: 1 },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  doctorName: { fontSize: 16, fontFamily: 'Inter_700Bold', color: theme.colors.text },
  specialty: { fontSize: 13, fontFamily: 'Inter_500Medium', color: '#2563EB', marginBottom: 4 },
  metaRow: { flexDirection: 'row', alignItems: 'center' },
  metaBadge: { fontSize: 11, fontFamily: 'Inter_600SemiBold', color: '#64748B', backgroundColor: '#F1F5F9', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  metaBullet: { marginHorizontal: 6, color: '#94A3B8', fontSize: 12 },
  metaText: { fontSize: 11, fontFamily: 'Inter_400Regular', color: '#64748B' },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 10,
  },
  ratingText: { marginLeft: 3, fontFamily: 'Inter_700Bold', fontSize: 11, color: '#92400E' },
  divider: {
    height: 1,
    backgroundColor: 'rgba(226, 232, 240, 0.7)',
    marginVertical: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  availabilityContainer: {},
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  onlinePill: { backgroundColor: '#ECFDF5' },
  offlinePill: { backgroundColor: '#F1F5F9' },
  statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  onlineDot: { backgroundColor: '#10B981' },
  offlineDot: { backgroundColor: '#94A3B8' },
  statusPillText: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  onlinePillText: { color: '#047857' },
  offlinePillText: { color: '#64748B' },
  bookButton: {
    borderRadius: 20,
    overflow: 'hidden',
    ...theme.shadows.glow,
  },
  bookButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  bookButtonText: { color: '#FFF', fontFamily: 'Inter_700Bold', fontSize: 12 }
});


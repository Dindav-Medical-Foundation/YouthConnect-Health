import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView, Animated, SafeAreaView } from 'react-native';
import { theme } from '../theme/theme';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function EmergencyHelpScreen({ navigation }) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      ])
    ).start();
  }, [pulseAnim]);

  const emergencies = [
    { id: 1, name: 'General Emergency', desc: 'Police, Fire, and Ambulance services', phone: '911', icon: 'alert-triangle' },
    { id: 2, name: 'Ambulance & Medical', desc: 'Urgent medical assistance and transport', phone: '911', icon: 'ambulance' },
    { id: 3, name: 'Post-rape Care', desc: 'Immediate confidential support and care', phone: '116', icon: 'shield-account' },
    { id: 4, name: 'HIV PEP Hotline', desc: 'Post-Exposure Prophylaxis guidance', phone: '0800 100 100', icon: 'pill' },
    { id: 5, name: 'Mental Health Crisis', desc: '24/7 counseling and support', phone: '0800 200 200', icon: 'brain' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Feather name="x" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Emergency Help</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Warning Banner */}
        <Animated.View style={[styles.warningBanner, { transform: [{ scale: pulseAnim }] }]}>
          <LinearGradient colors={['#EF4444', '#B91C1C']} style={styles.warningGradient} start={{x:0, y:0}} end={{x:1, y:1}}>
            <Feather name="alert-octagon" size={32} color="#FFF" style={styles.warningIcon} />
            <View style={styles.warningTextContainer}>
              <Text style={styles.warningTitle}>Immediate Assistance</Text>
              <Text style={styles.warningText}>If you or someone else is in immediate danger, do not wait. Call for help right away.</Text>
            </View>
          </LinearGradient>
        </Animated.View>

        <Text style={styles.sectionTitle}>Hotlines & Services</Text>

        <View style={styles.hotlineList}>
          {emergencies.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.card} 
              onPress={() => Linking.openURL(`tel:${item.phone}`)}
              activeOpacity={0.7}
            >
              <View style={styles.cardIconContainer}>
                <MaterialCommunityIcons name={item.icon} size={28} color="#EF4444" />
              </View>
              
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardDesc}>{item.desc}</Text>
              </View>
              
              <View style={styles.callAction}>
                <View style={styles.callBtn}>
                  <Feather name="phone" size={16} color="#FFF" />
                </View>
                <Text style={styles.phoneText}>{item.phone}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoBox}>
          <Feather name="info" size={20} color={theme.colors.textLight} style={styles.infoIcon} />
          <Text style={styles.infoText}>All calls to these hotlines are strictly confidential and toll-free.</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
    ...theme.shadows.card,
  },
  headerTitle: {
    ...theme.typography.title,
    fontSize: 18,
  },
  placeholder: { width: 40 },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  warningBanner: {
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    marginBottom: 32,
    ...theme.shadows.glow,
    shadowColor: '#EF4444',
  },
  warningGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
  },
  warningIcon: {
    marginRight: 16,
  },
  warningTextContainer: {
    flex: 1,
  },
  warningTitle: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 18,
    color: '#FFF',
    marginBottom: 4,
  },
  warningText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: '#FEE2E2',
    lineHeight: 20,
  },
  sectionTitle: {
    ...theme.typography.title,
    fontSize: 20,
    color: theme.colors.text,
    marginBottom: 16,
  },
  hotlineList: {
    gap: 16,
    marginBottom: 32,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: 16,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
    ...theme.shadows.card,
  },
  cardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    ...theme.typography.title,
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 4,
  },
  cardDesc: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: theme.colors.textLight,
  },
  callAction: {
    alignItems: 'center',
    marginLeft: 12,
  },
  callBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    ...theme.shadows.glow,
    shadowColor: '#EF4444',
  },
  phoneText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
    color: '#EF4444',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  infoIcon: {
    marginTop: 2,
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: theme.colors.textLight,
    lineHeight: 20,
  }
});

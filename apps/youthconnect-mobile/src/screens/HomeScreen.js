import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import AnimatedPressable from '../components/AnimatedPressable';

export default function HomeScreen({ navigation }) {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning! ☀️');
    else if (hour < 18) setGreeting('Good afternoon! 🌤️');
    else setGreeting('Good evening! 🌙');
  }, []);

  const menuItems = [
    { title: 'Consultation', route: 'Consult', icon: 'calendar', color: '#2563EB' },
    { title: 'Learn SRH', route: 'LearnSRH', icon: 'sun', color: '#3B82F6' },
    { title: 'Family Quiz', route: 'FamilyPlanning', icon: 'heart', color: '#60A5FA' },
    { title: 'Find Clinic', route: 'FindClinic', icon: 'map-pin', color: '#0891B2' },
    { title: 'Reminders', route: 'Reminders', icon: 'clock', color: '#0284C7' },
    { title: 'Emergency', route: 'EmergencyHelp', icon: 'shield', color: '#0369A1' },
    { title: 'My Records', route: 'MyRecords', icon: 'folder', color: '#4F46E5' },
  ];

  return (
    <ScrollView style={styles.container} bounces={false}>
      {/* Top App Bar Header */}
      <View style={styles.appBar}>
        <View>
          <Text style={styles.greetingText}>{greeting}</Text>
          <Text style={styles.appNameText}>YouthConnect Health</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Feather name="bell" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.avatarButton}>
            <Feather name="user" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        {/* Hero Card for Keren */}
        <AnimatedPressable 
          style={styles.heroCardContainer}
          onPress={() => navigation.navigate('Chatbot')}
        >
          <LinearGradient 
            colors={['#06B6D4', '#2563EB']} 
            start={{ x: 0, y: 0 }} 
            end={{ x: 1, y: 1 }} 
            style={styles.heroCard}
          >
            <View style={styles.heroTextContainer}>
              <Text style={styles.heroTitle}>Chat with Keren</Text>
              <Text style={styles.heroSubtitle}>Have a health question? I'm here 24/7 to help.</Text>
            </View>
            <View style={styles.heroIconContainer}>
              <FontAwesome5 name="robot" size={32} color="#FFF" />
            </View>
          </LinearGradient>
        </AnimatedPressable>

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        {/* Modern Grid Layout */}
        <View style={styles.gridContainer}>
          {menuItems.map((item, index) => (
            <AnimatedPressable 
              key={index} 
              style={styles.gridCard} 
              onPress={() => navigation.navigate(item.route)}
            >
              <View style={[styles.cardIconContainer, { backgroundColor: item.color + '1A' }]}>
                <Feather name={item.icon} size={22} color={item.color} />
              </View>
              <Text style={styles.cardTitle} numberOfLines={1} adjustsFontSizeToFit>{item.title}</Text>
            </AnimatedPressable>
          ))}
        </View>

        {/* Insights / Upcoming */}
        <Text style={styles.sectionTitle}>Upcoming</Text>
        <View style={styles.insightsCard}>
          <Feather name="calendar" size={24} color={theme.colors.textLight} style={{marginBottom: 10}} />
          <Text style={styles.insightsText}>No upcoming consultations today.</Text>
          <Text style={styles.insightsSubtext}>You're all caught up!</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  appBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: theme.colors.background,
  },
  greetingText: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 16,
    color: theme.colors.textLight,
  },
  appNameText: {
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 22,
    color: theme.colors.text,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginRight: 15,
  },
  avatarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 20,
    paddingTop: 5,
  },
  heroCardContainer: {
    marginBottom: 30,
    ...theme.shadows.glow,
  },
  heroCard: {
    flexDirection: 'row',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroTextContainer: {
    flex: 1,
    paddingRight: 15,
  },
  heroTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 22,
    color: '#FFFFFF',
    marginBottom: 5,
  },
  heroSubtitle: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 14,
    color: '#E0E7FF',
    lineHeight: 20,
  },
  heroIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 20,
    color: theme.colors.text,
    marginBottom: 15,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  gridCard: {
    backgroundColor: theme.colors.surface,
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 16,
    marginBottom: 15,
    ...theme.shadows.soft,
  },
  cardIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardTitle: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 14,
    color: theme.colors.text,
    flex: 1,
  },
  insightsCard: {
    backgroundColor: theme.colors.surface,
    padding: 25,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.soft,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
  },
  insightsText: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 5,
  },
  insightsSubtext: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 14,
    color: theme.colors.textLight,
  }
});

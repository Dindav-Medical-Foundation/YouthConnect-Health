import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import AnimatedPressable from '../components/AnimatedPressable';

export default function HomeScreen({ navigation }) {
  const menuItems = [
    { title: 'Consultation', route: 'Consult', icon: 'calendar', color: '#2563EB' },
    { title: 'Learn SRH', route: 'LearnSRH', icon: 'sun', color: '#3B82F6' },
    { title: 'Family Quiz', route: 'FamilyPlanning', icon: 'heart', color: '#60A5FA' },
    { title: 'Chat Nurse', route: 'Chatbot', icon: 'message-circle', color: '#06B6D4' },
    { title: 'Find Clinic', route: 'FindClinic', icon: 'map-pin', color: '#0891B2' },
    { title: 'Reminders', route: 'Reminders', icon: 'clock', color: '#0284C7' },
    { title: 'Emergency', route: 'EmergencyHelp', icon: 'shield', color: '#0369A1' },
    { title: 'My Records', route: 'MyRecords', icon: 'folder', color: '#4F46E5' },
  ];

  return (
    <ScrollView style={styles.container} bounces={false}>
      <LinearGradient 
        colors={['#2563EB', '#06B6D4']} 
        start={{ x: 0, y: 0 }} 
        end={{ x: 1, y: 1 }} 
        style={styles.headerGradient}
      >
        <Text style={styles.headerTitle}>YouthConnect</Text>
        <Text style={styles.headerSubtitle}>Your Safe Space for Health 🤍</Text>
      </LinearGradient>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <View style={styles.gridContainer}>
          {menuItems.map((item, index) => (
            <AnimatedPressable 
              key={index} 
              style={styles.gridItem} 
              onPress={() => navigation.navigate(item.route)}
            >
              <View style={[styles.iconContainer, { backgroundColor: item.color + '1A' }]}>
                <Feather name={item.icon} size={28} color={item.color} />
              </View>
              <Text style={styles.itemTitle}>{item.title}</Text>
            </AnimatedPressable>
          ))}
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
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    ...theme.shadows.glow,
  },
  headerTitle: {
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 28,
    color: '#FFFFFF',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 18,
    color: '#E0E7FF',
  },
  content: {
    padding: 20,
    marginTop: 10,
  },
  sectionTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 20,
    color: theme.colors.text,
    marginBottom: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    backgroundColor: theme.colors.surface,
    width: '47%',
    aspectRatio: 1,
    borderRadius: 20,
    padding: 15,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.soft,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  itemTitle: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 15,
    textAlign: 'center',
    color: theme.colors.text,
  }
});

import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { theme } from '../theme/theme';

import HomeScreen from '../screens/HomeScreen';
import ChatbotScreen from '../screens/ChatbotScreen';
import ConsultationScreen from '../screens/ConsultationScreen';
import VideoCallScreen from '../screens/VideoCallScreen';
import FamilyPlanningScreen from '../screens/FamilyPlanningScreen';
import LearnSRHScreen from '../screens/LearnSRHScreen';
import FindClinicScreen from '../screens/FindClinicScreen';
import RemindersScreen from '../screens/RemindersScreen';
import EmergencyHelpScreen from '../screens/EmergencyHelpScreen';
import MyRecordsScreen from '../screens/MyRecordsScreen';
import ModuleDetailScreen from '../screens/ModuleDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontFamily: 'Inter_600SemiBold',
          fontSize: 11,
          marginTop: -2,
          marginBottom: 4,
        },
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: 'rgba(226, 232, 240, 0.8)',
          height: Platform.OS === 'ios' ? 84 : 68,
          paddingBottom: Platform.OS === 'ios' ? 24 : 10,
          paddingTop: 8,
          maxWidth: 600,
          alignSelf: 'center',
          width: '100%',
          ...Platform.select({
            web: {
              boxShadow: '0px -4px 20px rgba(15, 23, 42, 0.08)'
            },
            default: {
              elevation: 12,
              shadowColor: '#0F172A',
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.08,
              shadowRadius: 12,
            }
          })
        },
        tabBarIcon: ({ color, focused }) => {
          let iconName;
          if (route.name === 'HomeTab') {
            iconName = 'home';
          } else if (route.name === 'ChatbotTab') {
            iconName = 'message-square';
          } else if (route.name === 'ConsultTab') {
            iconName = 'video';
          } else if (route.name === 'LearnTab') {
            iconName = 'book-open';
          } else if (route.name === 'RecordsTab') {
            iconName = 'file-text';
          }

          return (
            <View style={[styles.tabIconWrapper, focused && styles.tabIconFocused]}>
              <Feather name={iconName} size={20} color={focused ? '#2563EB' : '#94A3B8'} />
            </View>
          );
        },
      })}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeScreen} 
        options={{ tabBarLabel: 'Home' }} 
      />
      <Tab.Screen 
        name="ChatbotTab" 
        component={ChatbotScreen} 
        options={{ tabBarLabel: 'AI Keren' }} 
      />
      <Tab.Screen 
        name="ConsultTab" 
        component={ConsultationScreen} 
        options={{ tabBarLabel: 'Consult' }} 
      />
      <Tab.Screen 
        name="LearnTab" 
        component={LearnSRHScreen} 
        options={{ tabBarLabel: 'Learn' }} 
      />
      <Tab.Screen 
        name="RecordsTab" 
        component={MyRecordsScreen} 
        options={{ tabBarLabel: 'Records' }} 
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: true, 
        headerStyle: { backgroundColor: '#0F172A' }, 
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontFamily: 'Inter_700Bold',
          fontSize: 17,
        },
        headerBackTitleVisible: false,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="MainTabs" component={TabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="Chatbot" component={ChatbotScreen} options={{ title: 'AI Assistant (Keren)' }} />
      <Stack.Screen name="Consult" component={ConsultationScreen} options={{ title: 'Private Consultation' }} />
      <Stack.Screen name="VideoCall" component={VideoCallScreen} options={{ title: 'Live Teleconsultation' }} />
      <Stack.Screen name="FamilyPlanning" component={FamilyPlanningScreen} options={{ title: 'Family Planning Guide' }} />
      <Stack.Screen name="LearnSRH" component={LearnSRHScreen} options={{ title: 'Digital SRH Education' }} />
      <Stack.Screen name="ModuleDetail" component={ModuleDetailScreen} options={{ headerShown: false }} />
      <Stack.Screen name="FindClinic" component={FindClinicScreen} options={{ title: 'Youth Clinic Finder' }} />
      <Stack.Screen name="Reminders" component={RemindersScreen} options={{ title: 'Pills & Cycle Reminders' }} />
      <Stack.Screen name="EmergencyHelp" component={EmergencyHelpScreen} options={{ title: 'Emergency Support' }} />
      <Stack.Screen name="MyRecords" component={MyRecordsScreen} options={{ title: 'My Health Records' }} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  tabIconWrapper: {
    width: 38,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconFocused: {
    backgroundColor: '#EFF6FF',
  },
});


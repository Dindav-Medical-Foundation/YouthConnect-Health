import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ChatbotScreen from '../screens/ChatbotScreen';
import ConsultationScreen from '../screens/ConsultationScreen';
import { theme } from '../theme/theme';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTintColor: theme.colors.primary,
        headerTitleStyle: { fontWeight: 'bold' },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textLight,
        tabBarStyle: { 
          backgroundColor: theme.colors.surface, 
          borderTopWidth: 0, 
          elevation: 10,
          shadowColor: theme.colors.primary,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
        },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="Chat" component={ChatbotScreen} options={{ title: 'AI Assistant' }} />
      <Tab.Screen name="Book" component={ConsultationScreen} options={{ title: 'Consultation' }} />
    </Tab.Navigator>
  );
}

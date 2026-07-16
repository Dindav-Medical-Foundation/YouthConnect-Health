import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
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
import { theme } from '../theme/theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

import { Feather } from '@expo/vector-icons';

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: theme.colors.primary },
        headerTintColor: '#fff',
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 10,
          height: 60,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Chatbot') {
            iconName = 'message-square';
          } else if (route.name === 'Consult') {
            iconName = 'video';
          }
          return <Feather name={iconName} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Chatbot" component={ChatbotScreen} />
      <Tab.Screen name="Consult" component={ConsultationScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true, headerStyle: { backgroundColor: theme.colors.primary }, headerTintColor: '#fff' }}>
      <Stack.Screen name="MainTabs" component={TabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="VideoCall" component={VideoCallScreen} options={{ title: 'Teleconsultation' }} />
      <Stack.Screen name="FamilyPlanning" component={FamilyPlanningScreen} options={{ title: 'Family Planning Quiz' }} />
      <Stack.Screen name="LearnSRH" component={LearnSRHScreen} options={{ title: 'Digital SRH Education' }} />
      <Stack.Screen name="FindClinic" component={FindClinicScreen} options={{ title: 'Find Clinic' }} />
      <Stack.Screen name="Reminders" component={RemindersScreen} options={{ title: 'Medication Reminders' }} />
      <Stack.Screen name="EmergencyHelp" component={EmergencyHelpScreen} options={{ title: 'Emergency Help' }} />
      <Stack.Screen name="MyRecords" component={MyRecordsScreen} options={{ title: 'My Records' }} />
    </Stack.Navigator>
  );
}

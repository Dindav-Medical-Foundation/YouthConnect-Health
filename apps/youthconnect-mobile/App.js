import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { theme } from './src/theme/theme';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useFonts, Outfit_400Regular, Outfit_600SemiBold, Outfit_700Bold } from '@expo-google-fonts/outfit';
import { ActivityIndicator, View } from 'react-native';

export default function App() {
  let [fontsLoaded] = useFonts({
    Outfit_400Regular,
    Outfit_600SemiBold,
    Outfit_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AppNavigator />
        <StatusBar style="dark" backgroundColor={theme.colors.surface} />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

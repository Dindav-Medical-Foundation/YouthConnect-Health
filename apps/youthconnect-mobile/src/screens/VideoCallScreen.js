import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Platform, TouchableOpacity, Text, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import { theme } from '../theme/theme';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function VideoCallScreen({ route, navigation }) {
  const { roomUrl } = route.params || { roomUrl: 'https://meet.jit.si/YouthConnectDemoRoom' };
  const [isLoading, setIsLoading] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Feather name="x" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Secure Video Consultation</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.webviewContainer}>
        {Platform.OS === 'web' ? (
          <iframe 
            src={roomUrl} 
            style={{ width: '100%', height: '100%', border: 'none' }}
            allow="camera; microphone; fullscreen"
            onLoad={() => setIsLoading(false)}
          />
        ) : (
          <WebView
            source={{ uri: roomUrl }}
            style={styles.webview}
            onLoadEnd={() => setIsLoading(false)}
            mediaPlaybackRequiresUserAction={false}
            allowsInlineMediaPlayback={true}
            javaScriptEnabled={true}
            domStorageEnabled={true}
          />
        )}
        
        {isLoading && (
          <View style={styles.loaderContainer}>
            <LinearGradient colors={['rgba(15,23,42,0.9)', 'rgba(30,41,59,0.9)']} style={styles.loaderBackground} />
            <ActivityIndicator size="large" color={theme.colors.secondary} />
            <Text style={styles.loaderText}>Establishing secure connection...</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A', // Slate 900
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#0F172A',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#FFF',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
  },
  placeholder: {
    width: 40,
  },
  webviewContainer: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  webview: {
    flex: 1,
    backgroundColor: '#000',
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  loaderBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  loaderText: {
    marginTop: 16,
    color: '#CBD5E1',
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
  }
});

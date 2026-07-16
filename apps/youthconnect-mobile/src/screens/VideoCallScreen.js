import React from 'react';
import { View, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

export default function VideoCallScreen({ route, navigation }) {
  // Room URL passed from the Consultation screen after booking
  const { roomUrl } = route.params || { roomUrl: 'https://meet.jit.si/YouthConnectDemoRoom' };

  return (
    <View style={styles.container}>
      {Platform.OS === 'web' ? (
        <iframe 
          src={roomUrl} 
          style={{ width: '100%', height: '100%', border: 'none' }}
          allow="camera; microphone; fullscreen"
        />
      ) : (
        <WebView
          source={{ uri: roomUrl }}
          style={styles.webview}
          startInLoadingState={true}
          renderLoading={() => <ActivityIndicator size="large" color="#0052cc" style={styles.loader} />}
          mediaPlaybackRequiresUserAction={false}
          allowsInlineMediaPlayback={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  webview: {
    flex: 1,
  },
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -20,
    marginTop: -20,
  }
});

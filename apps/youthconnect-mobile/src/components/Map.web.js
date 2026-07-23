import React from 'react';
import { View, Text } from 'react-native';

export const MapView = ({ style, children }) => (
  <View style={[style, { backgroundColor: '#e2e8f0', alignItems: 'center', justifyContent: 'center', padding: 20 }]}>
    <Text style={{ fontFamily: 'Outfit_600SemiBold', fontSize: 16, color: '#475569', textAlign: 'center' }}>
      Interactive Maps are currently only available on the mobile app.
    </Text>
    <Text style={{ fontFamily: 'Outfit_400Regular', fontSize: 14, color: '#64748b', textAlign: 'center', marginTop: 10 }}>
      Please download the Android APK to find nearby clinics.
    </Text>
    {children}
  </View>
);

export const Marker = () => null;

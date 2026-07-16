export const theme = {
  colors: {
    primary: '#2563EB', // Azure Blue
    secondary: '#06B6D4', // Cyan
    background: '#F0F9FF', // Ice White
    surface: '#FFFFFF', // Pure White
    text: '#1E293B', // Slate 800
    textLight: '#64748B', // Slate 500
    danger: '#EF4444', // Red
    warning: '#F59E0B', // Amber
    success: '#10B981'  // Emerald
  },
  typography: {
    header: { fontSize: 26, fontWeight: '800', fontFamily: 'Outfit_700Bold' },
    body: { fontSize: 16, lineHeight: 24, fontFamily: 'Outfit_400Regular' },
    caption: { fontSize: 13, color: '#64748B', fontFamily: 'Outfit_400Regular' },
    button: { fontSize: 16, fontWeight: '700', fontFamily: 'Outfit_600SemiBold' }
  },
  shadows: {
    soft: {
      shadowColor: '#64748B',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.1,
      shadowRadius: 15,
      elevation: 6
    },
    glow: {
      shadowColor: '#2563EB',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 8
    }
  }
};

import { Platform } from 'react-native';

export const theme = {
  colors: {
    primary: '#0F172A', // Slate 900 for a sophisticated, premium dark feel
    secondary: '#3B82F6', // Vibrant Blue
    accent: '#8B5CF6', // Purple for subtle gradients and highlights
    background: '#F8FAFC', // Slate 50 - very light gray/blue
    surface: '#FFFFFF', // Pure White
    text: '#0F172A', // Slate 900
    textLight: '#64748B', // Slate 500
    danger: '#EF4444',
    warning: '#F59E0B',
    success: '#10B981',
    border: '#E2E8F0',
  },
  typography: {
    header: { fontSize: 28, fontWeight: '800', fontFamily: 'Inter_800ExtraBold', letterSpacing: -0.5 },
    title: { fontSize: 22, fontWeight: '700', fontFamily: 'Inter_700Bold', letterSpacing: -0.3 },
    body: { fontSize: 16, lineHeight: 24, fontFamily: 'Inter_400Regular' },
    bodyMedium: { fontSize: 16, lineHeight: 24, fontFamily: 'Inter_500Medium' },
    caption: { fontSize: 13, color: '#64748B', fontFamily: 'Inter_400Regular' },
    button: { fontSize: 16, fontWeight: '600', fontFamily: 'Inter_600SemiBold' }
  },
  shadows: {
    soft: Platform.select({
      web: {
        boxShadow: '0px 8px 24px rgba(148, 163, 184, 0.15)'
      },
      default: {
        shadowColor: '#94A3B8',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 8
      }
    }),
    glow: Platform.select({
      web: {
        boxShadow: '0px 10px 30px rgba(59, 130, 246, 0.3)'
      },
      default: {
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.3,
        shadowRadius: 24,
        elevation: 12
      }
    }),
    card: Platform.select({
      web: {
        boxShadow: '0px 4px 12px rgba(15, 23, 42, 0.05)'
      },
      default: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 4
      }
    })
  },
  borderRadius: {
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    round: 9999
  }
};

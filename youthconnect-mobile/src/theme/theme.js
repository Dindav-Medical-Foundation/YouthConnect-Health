export const theme = {
  colors: {
    primary: '#1E90FF', // Vibrant Blue
    secondary: '#87CEFA', // Light Blue
    background: '#F0F8FF', // Alice Blue (very light white-blue)
    surface: '#FFFFFF', // Clean White
    text: '#333333', // Dark text for readability
    textLight: '#888888',
    accent: '#00BFFF',
    danger: '#FF6347',
    success: '#32CD32',
  },
  typography: {
    fontFamily: 'System', // Uses native font
    h1: { fontSize: 32, fontWeight: 'bold', color: '#333' },
    h2: { fontSize: 24, fontWeight: 'bold', color: '#333' },
    h3: { fontSize: 18, fontWeight: '600', color: '#333' },
    body: { fontSize: 16, color: '#333' },
    caption: { fontSize: 14, color: '#888' },
  },
  shadows: {
    soft: {
      shadowColor: '#1E90FF',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 5,
    }
  }
};

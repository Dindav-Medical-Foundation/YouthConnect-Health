import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import AnimatedPressable from '../components/AnimatedPressable';

export default function HomeScreen({ navigation }) {
  const [greeting, setGreeting] = useState('');
  const [selectedMood, setSelectedMood] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const moodScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning, Alex 👋');
    else if (hour < 18) setGreeting('Good afternoon, Alex 👋');
    else setGreeting('Good evening, Alex 👋');

    // 1. Entrance animation (Fade & Slide Up)
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 45,
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Pulse loop for live status dot
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.4,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // 3. Gentle float motion for Hero Avatar
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -6,
          duration: 1600,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleMoodSelect = (index) => {
    setSelectedMood(index);
    moodScale.setValue(0.85);
    Animated.spring(moodScale, {
      toValue: 1,
      friction: 4,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  const moodOptions = [
    { label: 'Great', emoji: '😊', color: '#10B981' },
    { label: 'Okay', emoji: '😐', color: '#3B82F6' },
    { label: 'Anxious', emoji: '😰', color: '#F59E0B' },
    { label: 'Questions', emoji: '🤔', color: '#8B5CF6' },
  ];

  const menuItems = [
    { title: 'Consultation', subtitle: 'Private doctor chats', route: 'Consult', icon: 'video', color: '#2563EB', badge: 'Popular' },
    { title: 'Learn SRH', subtitle: 'Interactive modules', route: 'LearnSRH', icon: 'book-open', color: '#7C3AED' },
    { title: 'Family Planning', subtitle: 'Personalized quiz', route: 'FamilyPlanning', icon: 'heart', color: '#E11D48' },
    { title: 'Find Clinic', subtitle: 'Youth health centers', route: 'FindClinic', icon: 'map-pin', color: '#059669' },
    { title: 'Reminders', subtitle: 'Pill & cycle tracker', route: 'Reminders', icon: 'clock', color: '#D97706' },
    { title: 'Emergency Help', subtitle: '24/7 Crisis hotline', route: 'EmergencyHelp', icon: 'shield', color: '#DC2626', badge: 'Hotline' },
  ];

  const quickPrompts = [
    "Is emergency contraception safe?",
    "How to book a private test?",
    "Youth clinic locations"
  ];

  return (
    <View style={styles.container}>
      <ScrollView bounces={true} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          
          {/* Top Header Bar */}
          <View style={styles.appBar}>
            <View>
              <View style={styles.privacyBadge}>
                <View style={styles.greenDot} />
                <Text style={styles.privacyText}>Private & Confidential</Text>
              </View>
              <Text style={styles.greetingText}>{greeting}</Text>
              <Text style={styles.appNameText}>YouthConnect <Text style={styles.appSubName}>Health</Text></Text>
            </View>
            <View style={styles.headerIcons}>
              <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
                <View style={styles.badge} />
                <Feather name="bell" size={20} color={theme.colors.text} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.avatarButton} 
                activeOpacity={0.7}
                onPress={() => navigation.navigate('MyRecords')}
              >
                <Text style={styles.avatarText}>A</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Daily Wellness Check-In Card */}
          <View style={styles.checkInCard}>
            <Text style={styles.checkInTitle}>How are you feeling today?</Text>
            <Text style={styles.checkInSubtitle}>Select an option for quick tailored support</Text>
            <View style={styles.moodRow}>
              {moodOptions.map((item, index) => {
                const isSelected = selectedMood === index;
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.moodPill,
                      isSelected && { backgroundColor: item.color + '20', borderColor: item.color }
                    ]}
                    onPress={() => handleMoodSelect(index)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.moodEmoji}>{item.emoji}</Text>
                    <Text style={[styles.moodLabel, isSelected && { color: item.color, fontFamily: 'Inter_700Bold' }]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            {selectedMood !== null && (
              <Animated.View style={[styles.moodFeedbackBox, { transform: [{ scale: moodScale }] }]}>
                <Feather name="info" size={16} color={theme.colors.secondary} style={{ marginRight: 6 }} />
                <Text style={styles.moodFeedbackText}>
                  {selectedMood === 2 
                    ? "We're here for you. Chat with Keren or tap Emergency if you need fast advice." 
                    : selectedMood === 3
                    ? "Explore our SRH Learning hub or ask Keren anything safely!"
                    : "Glad to hear that! Keep exploring health modules or set daily reminders."}
                </Text>
              </Animated.View>
            )}
          </View>

          {/* Hero Card for AI Chatbot */}
          <AnimatedPressable 
            style={styles.heroCardContainer}
            onPress={() => navigation.navigate('Chatbot')}
          >
            <LinearGradient 
              colors={['#0F172A', '#1E1B4B', '#312E81']} 
              start={{ x: 0, y: 0 }} 
              end={{ x: 1, y: 1 }} 
              style={styles.heroCard}
            >
              <View style={styles.heroGlow} />
              <View style={styles.heroHeaderRow}>
                <View style={styles.aiBadge}>
                  <Animated.View style={[styles.livePulse, { transform: [{ scale: pulseAnim }] }]} />
                  <Text style={styles.aiBadgeText}>AI HEALTH ASSISTANT</Text>
                </View>
                <Text style={styles.availabilityText}>24/7 Online</Text>
              </View>

              <View style={styles.heroBodyRow}>
                <View style={styles.heroTextContainer}>
                  <Text style={styles.heroTitle}>Chat with Keren</Text>
                  <Text style={styles.heroSubtitle}>Instant, private, and judgment-free answers to your health questions.</Text>
                </View>
                <Animated.View style={{ transform: [{ translateY: floatAnim }] }}>
                  <LinearGradient colors={['#EC4899', '#8B5CF6']} style={styles.heroIconGradient} start={{x:0, y:0}} end={{x:1, y:1}}>
                    <FontAwesome5 name="user-nurse" size={26} color="#FFF" />
                  </LinearGradient>
                </Animated.View>
              </View>

              {/* Quick Prompt Chips */}
              <View style={styles.promptChipsContainer}>
                <Text style={styles.promptChipsLabel}>Popular questions:</Text>
                <View style={styles.chipsRow}>
                  {quickPrompts.map((prompt, idx) => (
                    <View key={idx} style={styles.promptChip}>
                      <Text style={styles.promptChipText}>"{prompt}"</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.chatNowBar}>
                <Text style={styles.chatNowText}>Start Confidential Conversation</Text>
                <Feather name="arrow-right" size={18} color="#FFF" />
              </View>
            </LinearGradient>
          </AnimatedPressable>

          {/* Section Header */}
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Healthcare Services</Text>
              <Text style={styles.sectionSubtitle}>Select a service to get started</Text>
            </View>
          </View>
          
          {/* Grid Layout */}
          <View style={styles.gridContainer}>
            {menuItems.map((item, index) => (
              <AnimatedPressable 
                key={index} 
                style={styles.gridCard} 
                onPress={() => navigation.navigate(item.route)}
              >
                <View style={styles.cardHeader}>
                  <View style={[styles.cardIconContainer, { backgroundColor: item.color + '15' }]}>
                    <Feather name={item.icon} size={22} color={item.color} />
                  </View>
                  {item.badge && (
                    <View style={[styles.cardTag, { backgroundColor: item.color + '18', borderColor: item.color + '40' }]}>
                      <Text style={[styles.cardTagText, { color: item.color }]}>{item.badge}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.cardSubtitle} numberOfLines={2}>{item.subtitle}</Text>
              </AnimatedPressable>
            ))}
          </View>

          {/* Daily SRH Spotlight / MythBuster */}
          <View style={styles.spotlightCard}>
            <View style={styles.spotlightHeader}>
              <View style={styles.spotlightIconBadge}>
                <Ionicons name="sparkles" size={18} color="#8B5CF6" />
              </View>
              <Text style={styles.spotlightTag}>DAILY SRH MYTHBUSTER</Text>
            </View>
            <Text style={styles.spotlightQuestion}>
              "Myth or Fact: Are youth health consultations confidential without parent consent?"
            </Text>
            {showAnswer ? (
              <View style={styles.answerBox}>
                <Text style={styles.answerTitle}>✅ FACT!</Text>
                <Text style={styles.answerBody}>
                  YouthConnect consultations are 100% confidential. Your medical records and chats are protected by healthcare privacy laws.
                </Text>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.revealButton} 
                onPress={() => setShowAnswer(true)}
                activeOpacity={0.8}
              >
                <Text style={styles.revealButtonText}>Reveal Answer</Text>
                <Feather name="eye" size={16} color="#3B82F6" />
              </TouchableOpacity>
            )}
          </View>

          {/* Upcoming Schedule / Records Quick Access */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Health Hub</Text>
          </View>
          <AnimatedPressable style={styles.insightsCard} onPress={() => navigation.navigate('MyRecords')}>
            <View style={styles.insightIconWrapper}>
              <Feather name="calendar" size={22} color={theme.colors.secondary} />
            </View>
            <View style={styles.insightTextWrapper}>
              <Text style={styles.insightsText}>My Health Records & Schedule</Text>
              <Text style={styles.insightsSubtext}>View past consultations, prescriptions & notes</Text>
            </View>
            <Feather name="chevron-right" size={20} color={theme.colors.textLight} />
          </AnimatedPressable>

        </Animated.View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 50,
    paddingBottom: 40,
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  appBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  privacyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  privacyText: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    color: '#047857',
  },
  greetingText: {
    ...theme.typography.bodyMedium,
    color: theme.colors.textLight,
    fontSize: 14,
    marginBottom: 2,
  },
  appNameText: {
    fontSize: 26,
    fontFamily: 'Inter_800ExtraBold',
    color: theme.colors.text,
    letterSpacing: -0.5,
  },
  appSubName: {
    color: theme.colors.secondary,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  badge: {
    position: 'absolute',
    top: 9,
    right: 11,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.danger,
    zIndex: 1,
  },
  avatarButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.card,
  },
  avatarText: {
    color: '#FFF',
    fontFamily: 'Inter_700Bold',
    fontSize: 15,
  },
  checkInCard: {
    backgroundColor: theme.colors.surface,
    padding: 16,
    borderRadius: theme.borderRadius.lg,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.8)',
    ...theme.shadows.card,
  },
  checkInTitle: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: theme.colors.text,
    marginBottom: 2,
  },
  checkInSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: theme.colors.textLight,
    marginBottom: 12,
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  moodPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  moodEmoji: {
    fontSize: 14,
    marginRight: 4,
  },
  moodLabel: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: theme.colors.text,
  },
  moodFeedbackBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    padding: 10,
    borderRadius: 12,
    marginTop: 12,
  },
  moodFeedbackText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#0369A1',
    flex: 1,
  },
  heroCardContainer: {
    marginBottom: 28,
    ...theme.shadows.glow,
  },
  heroCard: {
    borderRadius: theme.borderRadius.xl,
    padding: 22,
    overflow: 'hidden',
  },
  heroGlow: {
    position: 'absolute',
    top: -60,
    right: -60,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#8B5CF6',
    opacity: 0.2,
  },
  heroHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  livePulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  aiBadgeText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    color: '#CBD5E1',
    letterSpacing: 0.8,
  },
  availabilityText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#94A3B8',
  },
  heroBodyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  heroTextContainer: {
    flex: 1,
    paddingRight: 16,
  },
  heroTitle: {
    fontSize: 22,
    fontFamily: 'Inter_800ExtraBold',
    color: '#F8FAFC',
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: '#94A3B8',
    lineHeight: 19,
  },
  heroIconContainer: {},
  heroIconGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  promptChipsContainer: {
    marginBottom: 16,
  },
  promptChipsLabel: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    color: '#64748B',
    marginBottom: 6,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  promptChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  promptChipText: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: '#E2E8F0',
  },
  chatNowBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  chatNowText: {
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 19,
    fontFamily: 'Inter_700Bold',
    color: theme.colors.text,
  },
  sectionSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: theme.colors.textLight,
    marginTop: 2,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
    rowGap: 14,
  },
  gridCard: {
    backgroundColor: theme.colors.surface,
    width: '48%',
    minWidth: 150,
    flexShrink: 0,
    flexGrow: 0,
    padding: 16,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.8)',
    ...theme.shadows.card,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
  },
  cardTagText: {
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
  },
  cardIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: theme.colors.text,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: theme.colors.textLight,
    lineHeight: 16,
  },
  spotlightCard: {
    backgroundColor: '#F5F3FF',
    padding: 18,
    borderRadius: theme.borderRadius.lg,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#DDD6FE',
  },
  spotlightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  spotlightIconBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  spotlightTag: {
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    color: '#7C3AED',
    letterSpacing: 0.8,
  },
  spotlightQuestion: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#4C1D95',
    lineHeight: 20,
    marginBottom: 12,
  },
  revealButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  revealButtonText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: '#3B82F6',
    marginRight: 6,
  },
  answerBox: {
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  answerTitle: {
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
    color: '#059669',
    marginBottom: 4,
  },
  answerBody: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#334155',
    lineHeight: 18,
  },
  insightsCard: {
    backgroundColor: theme.colors.surface,
    padding: 16,
    borderRadius: theme.borderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.card,
  },
  insightIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.secondary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  insightTextWrapper: {
    flex: 1,
  },
  insightsText: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: theme.colors.text,
    marginBottom: 2,
  },
  insightsSubtext: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: theme.colors.textLight,
  }
});


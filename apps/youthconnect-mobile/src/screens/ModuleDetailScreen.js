import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Share, Animated, Platform } from 'react-native';
import { Feather, MaterialCommunityIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { LinearGradient } from 'expo-linear-gradient';

export default function ModuleDetailScreen({ route, navigation }) {
  const { module } = route.params || {};
  const [isCompleted, setIsCompleted] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  if (!module) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Module content not found.</Text>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out "${module.title}" on YouthConnect Health: ${module.summary || 'Empowering youth health education.'}`,
      });
    } catch (error) {
      console.warn('Share failed', error);
    }
  };

  const handleSelectOption = (idx) => {
    setSelectedOption(idx);
    setShowExplanation(true);
  };

  const quizObj = typeof module.quiz === 'object' ? module.quiz : {
    question: module.quiz || 'Knowledge Check',
    options: ['True', 'False'],
    correctIndex: 1,
    explanation: module.answer || 'Seek guidance if needed.'
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainWrapper}>
        
        {/* Custom Header Bar (No duplicate top header!) */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <Feather name="arrow-left" size={20} color={theme.colors.text} />
          </TouchableOpacity>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{module.category || 'Health Education'}</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={[styles.headerBtn, isBookmarked && styles.bookmarkedBtn]} 
              onPress={() => setIsBookmarked(!isBookmarked)}
              activeOpacity={0.7}
            >
              <Feather name="bookmark" size={18} color={isBookmarked ? '#2563EB' : theme.colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerBtn} onPress={handleShare} activeOpacity={0.7}>
              <Feather name="share-2" size={18} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Title Banner Header */}
          <View style={styles.titleContainer}>
            <View style={[styles.iconContainer, { backgroundColor: (module.color || '#2563EB') + '15' }]}>
              <MaterialCommunityIcons name={module.icon || 'book-open-outline'} size={32} color={module.color || '#2563EB'} />
            </View>
            <Text style={styles.title}>{module.title}</Text>
            <View style={styles.metaInfo}>
              <View style={styles.readBadge}>
                <Feather name="clock" size={12} color="#2563EB" style={{ marginRight: 4 }} />
                <Text style={styles.readBadgeText}>{module.readTime || '5 min'} read</Text>
              </View>
              <Text style={styles.metaBullet}>•</Text>
              <Text style={styles.metaText}>{module.summary || 'Interactive health guide'}</Text>
            </View>
          </View>

          {/* Key Takeaways Card */}
          {module.takeaways && module.takeaways.length > 0 && (
            <View style={styles.takeawaysCard}>
              <View style={styles.takeawaysHeader}>
                <Ionicons name="sparkles" size={18} color="#7C3AED" style={{ marginRight: 8 }} />
                <Text style={styles.takeawaysTitle}>Key Takeaways</Text>
              </View>
              <View style={styles.takeawaysList}>
                {module.takeaways.map((point, idx) => (
                  <View key={idx} style={styles.takeawayItem}>
                    <View style={styles.takeawayDot} />
                    <Text style={styles.takeawayText}>{point}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          
          {/* Multi-Section Article Content */}
          <View style={styles.sectionsContainer}>
            {module.sections && module.sections.length > 0 ? (
              module.sections.map((sec, idx) => (
                <View key={idx} style={styles.sectionBlock}>
                  <Text style={styles.sectionHeading}>{sec.heading}</Text>
                  <Text style={styles.sectionBody}>{sec.body}</Text>
                </View>
              ))
            ) : (
              <View style={styles.contentCard}>
                <Text style={styles.sectionBody}>{module.content}</Text>
              </View>
            )}
          </View>

          {/* Ask Keren AI Topic Banner */}
          <TouchableOpacity 
            style={styles.askKerenCard}
            onPress={() => navigation.navigate('ChatbotTab')}
            activeOpacity={0.8}
          >
            <LinearGradient colors={['#0F172A', '#1E1B4B']} style={styles.askKerenGradient} start={{x:0, y:0}} end={{x:1, y:1}}>
              <View style={styles.askKerenAvatar}>
                <FontAwesome5 name="user-nurse" size={16} color="#FFF" />
              </View>
              <View style={styles.askKerenInfo}>
                <Text style={styles.askKerenTitle}>Have questions about {module.title}?</Text>
                <Text style={styles.askKerenSub}>Chat confidentially with Keren AI anytime.</Text>
              </View>
              <Feather name="arrow-right" size={18} color="#FFF" />
            </LinearGradient>
          </TouchableOpacity>
          
          {/* Interactive Knowledge Check Quiz Box */}
          <View style={styles.quizBox}>
            <View style={styles.quizHeader}>
              <View style={styles.quizIconBg}>
                <Ionicons name="help-buoy" size={16} color="#FFF" />
              </View>
              <Text style={styles.quizTitle}>Quick Knowledge Check</Text>
            </View>
            
            <Text style={styles.quizQuestion}>{quizObj.question}</Text>

            <View style={styles.optionsList}>
              {quizObj.options && quizObj.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === quizObj.correctIndex;
                let optStyle = styles.optionBtn;
                let optTextStyle = styles.optionText;

                if (showExplanation) {
                  if (isCorrect) {
                    optStyle = [styles.optionBtn, styles.optionCorrect];
                    optTextStyle = [styles.optionText, styles.optionCorrectText];
                  } else if (isSelected && !isCorrect) {
                    optStyle = [styles.optionBtn, styles.optionIncorrect];
                    optTextStyle = [styles.optionText, styles.optionIncorrectText];
                  }
                }

                return (
                  <TouchableOpacity
                    key={idx}
                    style={optStyle}
                    onPress={() => handleSelectOption(idx)}
                    activeOpacity={0.7}
                  >
                    <Text style={optTextStyle}>{opt}</Text>
                    {showExplanation && isCorrect && (
                      <Ionicons name="checkmark-circle" size={18} color="#059669" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
            
            {showExplanation && (
              <View style={styles.explanationBox}>
                <View style={styles.explanationHeader}>
                  <Ionicons name="information-circle" size={18} color="#059669" style={{ marginRight: 6 }} />
                  <Text style={styles.explanationTitle}>Explanation</Text>
                </View>
                <Text style={styles.explanationText}>{quizObj.explanation}</Text>
              </View>
            )}
          </View>

        </ScrollView>

        {/* Floating Bottom Action Bar */}
        <View style={styles.bottomBar}>
          <TouchableOpacity 
            style={[styles.completeButton, isCompleted && styles.completedButton]} 
            onPress={() => setIsCompleted(!isCompleted)}
            activeOpacity={0.8}
          >
            {isCompleted ? (
              <Feather name="check-circle" size={18} color="#FFF" style={styles.btnIcon} />
            ) : (
              <View style={styles.circleIcon} />
            )}
            <Text style={[styles.completeButtonText, isCompleted && styles.completedButtonText]}>
              {isCompleted ? "Module Completed 🎉" : "Mark Module as Completed"}
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  mainWrapper: {
    flex: 1,
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  errorText: { fontSize: 16, fontFamily: 'Inter_600SemiBold', color: theme.colors.text, marginBottom: 16 },
  backBtn: { backgroundColor: '#2563EB', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
  backBtnText: { color: '#FFF', fontFamily: 'Inter_700Bold' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(226, 232, 240, 0.8)',
    ...theme.shadows.card,
  },
  headerBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  bookmarkedBtn: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  categoryBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryBadgeText: { fontSize: 11, fontFamily: 'Inter_600SemiBold', color: theme.colors.textLight },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 110,
  },
  titleContainer: {
    marginBottom: 20,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter_800ExtraBold',
    color: theme.colors.text,
    marginBottom: 8,
    lineHeight: 32,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  readBadgeText: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    color: '#2563EB',
  },
  metaBullet: { marginHorizontal: 6, color: '#94A3B8' },
  metaText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: theme.colors.textLight,
  },
  takeawaysCard: {
    backgroundColor: '#F5F3FF',
    padding: 16,
    borderRadius: theme.borderRadius.lg,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#DDD6FE',
  },
  takeawaysHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  takeawaysTitle: { fontSize: 14, fontFamily: 'Inter_700Bold', color: '#6D28D9' },
  takeawaysList: { gap: 8 },
  takeawayItem: { flexDirection: 'row', alignItems: 'flex-start' },
  takeawayDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#7C3AED', marginTop: 6, marginRight: 8 },
  takeawayText: { flex: 1, fontSize: 13, fontFamily: 'Inter_400Regular', color: '#4C1D95', lineHeight: 19 },
  sectionsContainer: { marginBottom: 20, gap: 16 },
  sectionBlock: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.8)',
    ...theme.shadows.card,
  },
  sectionHeading: { fontSize: 16, fontFamily: 'Inter_700Bold', color: theme.colors.text, marginBottom: 8 },
  sectionBody: { fontSize: 14, fontFamily: 'Inter_400Regular', lineHeight: 22, color: '#334155' },
  askKerenCard: { marginBottom: 20, borderRadius: theme.borderRadius.lg, overflow: 'hidden' },
  askKerenGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  askKerenAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  askKerenInfo: { flex: 1 },
  askKerenTitle: { fontSize: 13, fontFamily: 'Inter_700Bold', color: '#FFFFFF' },
  askKerenSub: { fontSize: 11, fontFamily: 'Inter_400Regular', color: '#94A3B8' },
  quizBox: {
    backgroundColor: '#FFFBEB',
    padding: 18,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  quizHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  quizIconBg: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#D97706',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  quizTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    color: '#92400E',
  },
  quizQuestion: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: '#78350F',
    marginBottom: 14,
    lineHeight: 20,
  },
  optionsList: { gap: 8, marginBottom: 12 },
  optionBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  optionCorrect: { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' },
  optionIncorrect: { backgroundColor: '#FEF2F2', borderColor: '#FECACA' },
  optionText: { fontSize: 13, fontFamily: 'Inter_500Medium', color: '#78350F', flex: 1 },
  optionCorrectText: { color: '#065F46', fontFamily: 'Inter_700Bold' },
  optionIncorrectText: { color: '#991B1B' },
  explanationBox: {
    backgroundColor: '#ECFDF5',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    marginTop: 4,
  },
  explanationHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  explanationTitle: { fontSize: 12, fontFamily: 'Inter_700Bold', color: '#065F46' },
  explanationText: { fontSize: 12, fontFamily: 'Inter_400Regular', color: '#047857', lineHeight: 18 },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(226, 232, 240, 0.8)',
    ...theme.shadows.glow,
  },
  completeButton: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingVertical: 12,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedButton: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  circleIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#64748B',
    marginRight: 8,
  },
  btnIcon: {
    marginRight: 8,
  },
  completeButtonText: {
    fontFamily: 'Inter_700Bold',
    color: theme.colors.text,
    fontSize: 14,
  },
  completedButtonText: {
    color: '#FFF',
  }
});



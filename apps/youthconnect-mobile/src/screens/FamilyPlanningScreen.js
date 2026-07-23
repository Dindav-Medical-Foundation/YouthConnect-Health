import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, SafeAreaView } from 'react-native';
import { theme } from '../theme/theme';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const questions = [
  {
    id: 1,
    question: "Are you looking for a method you don't have to remember every day?",
    options: [{ text: "Yes", score: { implant: 2, iud: 2, injection: 1, pill: 0 } }, { text: "No, daily is fine", score: { pill: 2, condom: 1 } }]
  },
  {
    id: 2,
    question: "Is it important for you to protect against STIs?",
    options: [{ text: "Yes, very important", score: { condom: 3 } }, { text: "Not my main concern right now", score: {} }]
  },
  {
    id: 3,
    question: "Do you want to get pregnant within the next year?",
    options: [{ text: "Yes", score: { pill: 2, condom: 2 } }, { text: "No", score: { implant: 2, iud: 2 } }]
  }
];

export default function FamilyPlanningScreen({ navigation }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({ pill: 0, condom: 0, implant: 0, iud: 0, injection: 0 });
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (scoreModifiers) => {
    const newScores = { ...scores };
    Object.keys(scoreModifiers).forEach(key => {
      newScores[key] += scoreModifiers[key];
    });
    setScores(newScores);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const getTopRecommendation = () => {
    return Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
  };

  const methodNames = {
    pill: "Birth Control Pills",
    condom: "Condoms (Male/Female)",
    implant: "Contraceptive Implant",
    iud: "Intrauterine Device (IUD)",
    injection: "Injectable Contraceptives"
  };

  const methodIcons = {
    pill: "pill",
    condom: "shield-check",
    implant: "needle",
    iud: "alpha-t",
    injection: "needle"
  };

  if (showResult) {
    const topMethod = getTopRecommendation();
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.resultScroll}>
          <View style={styles.resultHeader}>
            <LinearGradient colors={['#10B981', '#059669']} style={styles.successIconBg} start={{x:0, y:0}} end={{x:1, y:1}}>
              <Feather name="check" size={32} color="#FFF" />
            </LinearGradient>
            <Text style={styles.resultTitle}>Quiz Complete!</Text>
            <Text style={styles.resultSubtitle}>Based on your answers, here is your personalized recommendation.</Text>
          </View>
          
          <View style={styles.resultCard}>
            <View style={styles.resultMethodHeader}>
              <View style={styles.methodIconWrapper}>
                <MaterialCommunityIcons name={methodIcons[topMethod]} size={32} color={theme.colors.primary} />
              </View>
              <Text style={styles.resultHighlight}>{methodNames[topMethod]}</Text>
            </View>
            <View style={styles.divider} />
            <Text style={styles.resultText}>This method best matches your preferences. Everyone's body is different, so please consult a specialist to confirm if this is the right choice for you.</Text>
          </View>

          <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('Consult')}>
              <LinearGradient colors={['#3B82F6', '#2563EB']} style={styles.btnGradient} start={{x:0, y:0}} end={{x:1, y:1}}>
                <Text style={styles.primaryButtonText}>Book Consultation</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.secondaryButton} onPress={() => { setShowResult(false); setCurrentQuestion(0); setScores({ pill: 0, condom: 0, implant: 0, iud: 0, injection: 0 }); }}>
              <Text style={styles.secondaryButtonText}>Retake Quiz</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const q = questions[currentQuestion];
  const progressPercent = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.quizAppBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Feather name="x" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Family Planning</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.quizScroll}>
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressText}>Question {currentQuestion + 1} of {questions.length}</Text>
            <Text style={styles.progressPercentText}>{Math.round(progressPercent)}%</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
          </View>
        </View>
        
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>{q.question}</Text>
          <View style={styles.optionsWrapper}>
            {q.options.map((opt, idx) => (
              <TouchableOpacity key={idx} style={styles.optionCard} onPress={() => handleAnswer(opt.score)} activeOpacity={0.7}>
                <View style={styles.optionRow}>
                  <Text style={styles.optionText}>{opt.text}</Text>
                  <View style={styles.radioOutline}>
                    <View style={styles.radioInner} />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  quizAppBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
    ...theme.shadows.card,
  },
  appBarTitle: {
    ...theme.typography.title,
    fontSize: 16,
  },
  placeholder: { width: 40 },
  quizScroll: {
    padding: 24,
  },
  progressSection: {
    marginBottom: 40,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: theme.colors.textLight,
  },
  progressPercentText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    color: theme.colors.secondary,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: theme.colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: theme.colors.secondary,
    borderRadius: 4,
  },
  questionContainer: { 
    marginBottom: 20 
  },
  questionText: { 
    ...theme.typography.header,
    fontSize: 24,
    color: theme.colors.text, 
    marginBottom: 32,
    lineHeight: 34,
  },
  optionsWrapper: {
    gap: 16,
  },
  optionCard: { 
    backgroundColor: theme.colors.surface, 
    padding: 20, 
    borderRadius: theme.borderRadius.lg, 
    borderWidth: 2, 
    borderColor: 'transparent',
    ...theme.shadows.card,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionText: { 
    fontFamily: 'Inter_500Medium', 
    fontSize: 16, 
    color: theme.colors.text,
    flex: 1,
    paddingRight: 16,
  },
  radioOutline: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.textLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'transparent',
  },
  resultScroll: {
    padding: 24,
    alignItems: 'center',
  },
  resultHeader: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  successIconBg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    ...theme.shadows.glow,
  },
  resultTitle: { 
    ...theme.typography.header, 
    color: theme.colors.text, 
    marginBottom: 12,
  },
  resultSubtitle: {
    ...theme.typography.body,
    color: theme.colors.textLight,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  resultCard: { 
    backgroundColor: theme.colors.surface, 
    padding: 24, 
    borderRadius: theme.borderRadius.xl, 
    width: '100%',
    ...theme.shadows.card, 
    marginBottom: 40,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  resultMethodHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  methodIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  resultHighlight: { 
    fontFamily: 'Inter_800ExtraBold', 
    fontSize: 24, 
    color: theme.colors.text, 
    textAlign: 'center' 
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginBottom: 20,
  },
  resultText: { 
    fontFamily: 'Inter_400Regular', 
    fontSize: 15, 
    color: theme.colors.textLight, 
    textAlign: 'center', 
    lineHeight: 24 
  },
  actionContainer: {
    width: '100%',
    gap: 16,
  },
  primaryButton: { 
    borderRadius: theme.borderRadius.round, 
    overflow: 'hidden',
    ...theme.shadows.glow,
  },
  btnGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  primaryButtonText: { 
    color: '#FFF', 
    fontFamily: 'Inter_700Bold', 
    fontSize: 16 
  },
  secondaryButton: {
    paddingVertical: 18,
    alignItems: 'center',
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  secondaryButtonText: {
    color: theme.colors.text,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
  }
});

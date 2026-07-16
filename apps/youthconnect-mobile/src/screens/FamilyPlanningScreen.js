import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { theme } from '../theme/theme';

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

  if (showResult) {
    const topMethod = getTopRecommendation();
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Your Result</Text>
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>Recommended Method:</Text>
          <Text style={styles.resultHighlight}>{methodNames[topMethod]}</Text>
          <Text style={styles.resultText}>This method best matches your preferences based on the quiz. Please consult a nurse to confirm.</Text>
        </View>
        <TouchableOpacity style={styles.bookButton} onPress={() => navigation.navigate('Consult')}>
          <Text style={styles.bookButtonText}>Book a Consultation</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.bookButton, { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.primary, marginTop: 15 }]} onPress={() => { setShowResult(false); setCurrentQuestion(0); setScores({ pill: 0, condom: 0, implant: 0, iud: 0, injection: 0 }); }}>
          <Text style={[styles.bookButtonText, { color: theme.colors.primary }]}>Retake Quiz</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const q = questions[currentQuestion];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Family Planning Quiz</Text>
      <Text style={styles.progress}>Question {currentQuestion + 1} of {questions.length}</Text>
      
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{q.question}</Text>
        {q.options.map((opt, idx) => (
          <TouchableOpacity key={idx} style={styles.optionButton} onPress={() => handleAnswer(opt.score)}>
            <Text style={styles.optionText}>{opt.text}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, padding: 20 },
  header: { fontFamily: 'Outfit_700Bold', fontSize: 24, color: theme.colors.text, marginBottom: 10 },
  progress: { fontFamily: 'Outfit_400Regular', fontSize: 14, color: theme.colors.textLight, marginBottom: 20 },
  questionContainer: { backgroundColor: theme.colors.surface, padding: 20, borderRadius: 15, ...theme.shadows.soft },
  questionText: { fontFamily: 'Outfit_600SemiBold', fontSize: 18, color: theme.colors.text, marginBottom: 20 },
  optionButton: { backgroundColor: theme.colors.background, padding: 15, borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: '#E2E8F0' },
  optionText: { fontFamily: 'Outfit_600SemiBold', fontSize: 16, color: theme.colors.primary },
  resultCard: { backgroundColor: theme.colors.surface, padding: 25, borderRadius: 15, alignItems: 'center', ...theme.shadows.soft, marginBottom: 30 },
  resultTitle: { fontFamily: 'Outfit_400Regular', fontSize: 16, color: theme.colors.textLight, marginBottom: 10 },
  resultHighlight: { fontFamily: 'Outfit_800ExtraBold', fontSize: 22, color: theme.colors.primary, marginBottom: 15, textAlign: 'center' },
  resultText: { fontFamily: 'Outfit_400Regular', fontSize: 15, color: theme.colors.text, textAlign: 'center', lineHeight: 22 },
  bookButton: { backgroundColor: theme.colors.primary, padding: 15, borderRadius: 25, alignItems: 'center' },
  bookButtonText: { color: '#FFF', fontFamily: 'Outfit_700Bold', fontSize: 16 }
});

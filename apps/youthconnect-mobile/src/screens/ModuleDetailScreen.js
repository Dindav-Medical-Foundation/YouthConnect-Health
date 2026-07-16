import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../theme/theme';

export default function ModuleDetailScreen({ route }) {
  const { module } = route.params;
  const [isCompleted, setIsCompleted] = useState(false);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={theme.typography.header}>{module.title}</Text>
      
      <View style={styles.contentCard}>
        <Text style={styles.contentText}>{module.content}</Text>
      </View>
      
      <View style={styles.quizBox}>
        <Text style={styles.quizTitle}>Quick Knowledge Check 🧠</Text>
        <Text style={styles.quizQuestion}>{module.quiz}</Text>
        <Text style={styles.quizAnswer}><Text style={{fontWeight: 'bold'}}>Answer: </Text>{module.answer}</Text>
      </View>

      <TouchableOpacity 
        style={[styles.completeButton, isCompleted && styles.completedButton]} 
        onPress={() => setIsCompleted(!isCompleted)}
      >
        <Feather name={isCompleted ? "check-circle" : "circle"} size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
        <Text style={styles.completeButtonText}>
          {isCompleted ? "Completed" : "Mark as Completed"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, padding: 20 },
  contentCard: { backgroundColor: theme.colors.surface, padding: 20, borderRadius: 12, marginBottom: 20, ...theme.shadows.soft },
  contentText: { ...theme.typography.body, color: theme.colors.text, lineHeight: 24 },
  quizBox: { backgroundColor: '#F8FAFC', padding: 20, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: '#E2E8F0' },
  quizTitle: { fontFamily: 'Outfit_700Bold', fontSize: 16, color: theme.colors.primary, marginBottom: 10 },
  quizQuestion: { fontFamily: 'Outfit_600SemiBold', fontSize: 15, color: theme.colors.text, marginBottom: 10 },
  quizAnswer: { fontFamily: 'Outfit_400Regular', fontSize: 15, color: '#475569' },
  completeButton: { backgroundColor: theme.colors.primary, padding: 15, borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  completedButton: { backgroundColor: '#10B981' },
  completeButtonText: { fontFamily: 'Outfit_600SemiBold', color: '#FFFFFF', fontSize: 16 }
});

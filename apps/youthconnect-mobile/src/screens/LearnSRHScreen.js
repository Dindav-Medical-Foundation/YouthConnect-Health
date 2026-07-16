import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { theme } from '../theme/theme';

export default function LearnSRHScreen({ navigation }) {
  const modules = [
    {
      title: 'Puberty',
      content: 'Puberty is the time in life when a boy or girl becomes sexually mature. It is a process that usually happens between ages 10 and 14 for girls and ages 12 and 16 for boys. It causes physical changes, and affects boys and girls differently.',
      quiz: 'True or False: Puberty happens at the exact same age for everyone?',
      answer: 'False. Everyone develops at their own pace!'
    },
    {
      title: 'HIV prevention',
      content: 'HIV is a virus that attacks the body’s immune system. Prevention includes using condoms, getting tested regularly, and pre-exposure prophylaxis (PrEP).',
      quiz: 'What is the most effective way to prevent HIV transmission during sex?',
      answer: 'Using condoms consistently and correctly.'
    },
    {
      title: 'STI prevention',
      content: 'Sexually Transmitted Infections (STIs) are passed from one person to another through sexual contact. Condoms are highly effective at preventing most STIs.',
      quiz: 'True or False: You can always tell if someone has an STI by looking at them?',
      answer: 'False. Many STIs have no visible symptoms.'
    },
    {
      title: 'Family planning methods',
      content: 'Family planning allows individuals and couples to anticipate and attain their desired number of children and the spacing and timing of their births. Methods include pills, injectables, implants, and condoms.',
      quiz: 'Do all family planning methods protect against STIs?',
      answer: 'No, only barrier methods like condoms protect against STIs.'
    },
    {
      title: 'Menstrual health',
      content: 'Menstruation is a normal biological process. Maintaining good hygiene, using clean materials, and understanding your cycle are key parts of menstrual health.',
      quiz: 'How often should you typically change your sanitary pad?',
      answer: 'Every 4 to 6 hours, depending on flow.'
    },
    {
      title: 'Healthy relationships',
      content: 'Healthy relationships are based on respect, trust, open communication, and consent. Both partners should feel valued and safe.',
      quiz: 'What is the most important foundation of a healthy relationship?',
      answer: 'Mutual respect and clear consent.'
    },
    {
      title: 'Gender-based violence',
      content: 'Gender-based violence (GBV) refers to harmful acts directed at an individual based on their gender. It can include physical, sexual, and psychological abuse. There is help available if you or someone you know is experiencing this.',
      quiz: 'What should you do if you experience or witness GBV?',
      answer: 'Seek help immediately from a trusted adult, counselor, or emergency hotline.'
    },
    {
      title: 'Mental health',
      content: 'Mental health is just as important as physical health. It includes our emotional, psychological, and social well-being. It is normal to feel stressed or anxious, and it is okay to ask for help.',
      quiz: 'True or False: Talking to someone about your feelings is a sign of weakness.',
      answer: 'False. Seeking support is a strong and healthy step.'
    }
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={theme.typography.header}>Digital SRH</Text>
      <Text style={styles.subtitle}>Interactive learning modules</Text>

      {modules.map((mod, index) => (
        <TouchableOpacity 
          key={index} 
          style={styles.moduleCard} 
          onPress={() => navigation.navigate('ModuleDetail', { module: mod })}
        >
          <Text style={styles.moduleText}>{mod.title}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 20,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textLight,
    marginBottom: 20,
    marginTop: 5,
  },
  moduleCard: {
    backgroundColor: theme.colors.surface,
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    ...theme.shadows.soft,
  },
  moduleText: {
    ...theme.typography.body,
    color: theme.colors.primary,
    fontWeight: '600',
  }
});

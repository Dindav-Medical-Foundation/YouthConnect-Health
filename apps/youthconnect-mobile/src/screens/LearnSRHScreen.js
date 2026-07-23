import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Animated } from 'react-native';
import { theme } from '../theme/theme';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function LearnSRHScreen({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [completedModules, setCompletedModules] = useState(['1', '3']); // Mock completed IDs

  const categories = ['All', 'Essentials', 'Prevention', 'Relationships', 'Wellness'];

  const modules = [
    {
      id: '1',
      title: 'Puberty & Body Changes',
      category: 'Essentials',
      summary: 'Understand physical, emotional, and biological growth during adolescent years.',
      readTime: '4 min',
      icon: 'flower-outline',
      color: '#EC4899',
      takeaways: [
        'Puberty starts between ages 9–14 for girls and 10–16 for boys.',
        'Hormonal changes trigger physical growth spurts, skin changes, and voice shifts.',
        'Mood fluctuations are completely normal as your body balances hormones.'
      ],
      sections: [
        {
          heading: '1. What Happens During Puberty?',
          body: 'Puberty is a natural biological process where your pituitary gland signals your body to produce hormones (estrogen & progesterone for girls, testosterone for boys). This brings about growth spurts, body hair development, and changes in body shape.'
        },
        {
          heading: '2. Emotional & Mood Changes',
          body: 'As hormone levels fluctuate, it is common to experience sudden shifts in emotions, heightened sensitivity, or feelings of confusion. Developing healthy coping habits like journaling, sports, and talking with trusted allies helps navigate these shifts smoothly.'
        },
        {
          heading: '3. Hygiene & Daily Self-Care',
          body: 'Increased sweat gland activity requires daily hygiene practices. Washing daily with mild soap, wearing clean cotton underwear, and using deodorant or antiperspirant keeps your skin healthy and comfortable.'
        }
      ],
      quiz: {
        question: 'True or False: Puberty happens at the exact same age and speed for everyone?',
        options: ['A. True — Everyone matures on a fixed timeline', 'B. False — Development varies widely by individual genetics'],
        correctIndex: 1,
        explanation: 'Development is unique to every person! Factors like genetics, nutrition, and environment influence when puberty starts and finishes.'
      }
    },
    {
      id: '2',
      title: 'HIV Prevention & Testing',
      category: 'Prevention',
      summary: 'Key facts on HIV transmission, safe barrier protection, and PrEP medication.',
      readTime: '6 min',
      icon: 'shield-check-outline',
      color: '#EF4444',
      takeaways: [
        'Consistent latex condom use reduces HIV transmission risk by over 98%.',
        'PrEP (Pre-Exposure Prophylaxis) is a daily pill that prevents HIV infection.',
        'Routine confidential testing is free and essential for peace of mind.'
      ],
      sections: [
        {
          heading: '1. How HIV Transmits',
          body: 'HIV (Human Immunodeficiency Virus) is transmitted through specific bodily fluids during unprotected intercourse, shared needles, or from mother to child. It CANNOT be spread through hugging, sharing utensils, saliva, or toilet seats.'
        },
        {
          heading: '2. Modern Prevention Methods (PrEP & PEP)',
          body: 'PrEP (Pre-Exposure Prophylaxis) is a medication taken by HIV-negative individuals to prevent contracting HIV. PEP (Post-Exposure Prophylaxis) is an emergency 28-day regimen taken within 72 hours of potential exposure.'
        },
        {
          heading: '3. Confidential Screening & Care',
          body: 'HIV testing is quick, painless, and 100% confidential. Modern Antiretroviral Therapy (ART) allows people living with HIV to live long, healthy, and fulfilling lives with Undetectable = Untransmittable (U=U) status.'
        }
      ],
      quiz: {
        question: 'What is the maximum timeframe to start PEP (Post-Exposure Prophylaxis) after potential HIV exposure?',
        options: ['A. Within 24 hours only', 'B. Within 72 hours', 'C. Within 1 week', 'D. Anytime within 1 month'],
        correctIndex: 1,
        explanation: 'PEP must be started as soon as possible, and strictly within 72 hours of potential HIV exposure to be effective.'
      }
    },
    {
      id: '3',
      title: 'STI Prevention & Care',
      category: 'Prevention',
      summary: 'How to protect yourself against common STIs, symptoms, and treatment.',
      readTime: '5 min',
      icon: 'bacteria-outline',
      color: '#F59E0B',
      takeaways: [
        'Many Sexually Transmitted Infections (STIs) present zero visible symptoms.',
        'Bacterial STIs (Chlamydia, Gonorrhea, Syphilis) are curable with antibiotics.',
        'Routine health screenings ensure early detection and prevent long-term complications.'
      ],
      sections: [
        {
          heading: '1. Asymptomatic Nature of STIs',
          body: 'Over 70% of women and 50% of men with Chlamydia show no symptoms at all. This makes regular screening vital for anyone who is sexually active, even if you feel completely healthy.'
        },
        {
          heading: '2. Barrier Protection & Safe Habits',
          body: 'External (male) and internal (female) condoms are the only contraceptive methods that protect against both unintended pregnancy and STIs. Dental dams provide safe protection during oral contact.'
        },
        {
          heading: '3. Seeking Care Without Fear',
          body: 'YouthConnect partner clinics offer judgment-free, confidential screening and free antibiotic treatments. Never hesitate to get tested or ask your healthcare provider questions.'
        }
      ],
      quiz: {
        question: 'True or False: You can always tell if a partner has an STI by physical symptoms?',
        options: ['A. True — STIs always cause visible rash or discomfort', 'B. False — Most STIs show no outward symptoms'],
        correctIndex: 1,
        explanation: 'False! Most STIs are completely silent. Regular STI testing is the only reliable way to verify your health status.'
      }
    },
    {
      id: '4',
      title: 'Family Planning Options',
      category: 'Essentials',
      summary: 'Personalized guidance on modern contraceptive methods and reproductive health.',
      readTime: '8 min',
      icon: 'account-group-outline',
      color: '#2563EB',
      takeaways: [
        'Contraception gives you full autonomy over when and if you choose to have children.',
        'LARCs (Implants & IUDs) offer over 99% effectiveness for 3 to 10 years.',
        'Emergency contraception pills work up to 120 hours after unprotected intercourse.'
      ],
      sections: [
        {
          heading: '1. Short-Acting vs. Long-Acting Methods',
          body: 'Short-acting methods include oral contraceptive pills (taken daily), injectables (every 3 months), and condoms. Long-acting methods (LARCs) like sub-dermal arm implants and IUDs require no daily attention.'
        },
        {
          heading: '2. Dual Protection Concept',
          body: 'Dual protection means using a barrier method (condoms) alongside a hormonal method (pill/implant). This provides maximum dual security against both STIs and unintended pregnancy.'
        },
        {
          heading: '3. Emergency Contraception Pills (ECPs)',
          body: 'ECPs (often called the morning-after pill) prevent ovulation after unprotected intercourse. They are most effective when taken within 24–72 hours, but can work up to 120 hours (5 days).'
        }
      ],
      quiz: {
        question: 'Which contraceptive method provides protection against BOTH unintended pregnancy and STIs?',
        options: ['A. Contraceptive Pill', 'B. Arm Implant', 'C. Condoms', 'D. Intrauterine Device (IUD)'],
        correctIndex: 2,
        explanation: 'Condoms are the only contraceptive method that provides dual protection against both pregnancy and STIs!'
      }
    },
    {
      id: '5',
      title: 'Menstrual Health & Cycle',
      category: 'Wellness',
      summary: 'Tracking cycles, menstrual hygiene products, and managing cramps safely.',
      readTime: '4 min',
      icon: 'water-outline',
      color: '#7C3AED',
      takeaways: [
        'A normal menstrual cycle ranges between 21 and 35 days.',
        'Sanitary pads or tampons should be changed every 4 to 6 hours for hygiene.',
        'Cramps can be managed with hydration, warm compresses, and light stretching.'
      ],
      sections: [
        {
          heading: '1. Understanding Your Cycle',
          body: 'The menstrual cycle is counted from Day 1 of bleeding until Day 1 of the next period. Hormones cause the lining of the uterus to thicken, preparing for possible pregnancy; if unfertilized, the lining sheds as menstruation.'
        },
        {
          heading: '2. Hygiene Product Options',
          body: 'Options include reusable cloth pads, disposable sanitary pads, tampons, and silicone menstrual cups. Choose what feels most comfortable and hygienic for your lifestyle.'
        },
        {
          heading: '3. Managing Period Pain (Dysmenorrhea)',
          body: 'Mild to moderate cramping is common. Applying a heating pad to your lower abdomen, staying hydrated, eating magnesium-rich foods, and taking mild over-the-counter pain relief helps alleviate pain.'
        }
      ],
      quiz: {
        question: 'How often should a disposable sanitary pad ideally be changed during heavy flow days?',
        options: ['A. Every 12 hours', 'B. Every 4 to 6 hours', 'C. Once per day', 'D. Every 24 hours'],
        correctIndex: 1,
        explanation: 'Changing sanitary pads every 4 to 6 hours prevents bacterial growth, odor, and skin irritation.'
      }
    },
    {
      id: '6',
      title: 'Healthy Relationships & Consent',
      category: 'Relationships',
      summary: 'Building trust, open communication, mutual respect, and clear boundaries.',
      readTime: '5 min',
      icon: 'heart-outline',
      color: '#F43F5E',
      takeaways: [
        'Consent must be Freely given, Reversible, Informed, Enthusiastic, and Specific (FRIES).',
        'Healthy relationships encourage individual growth and personal boundaries.',
        'Communication should feel safe, honest, and free of intimidation.'
      ],
      sections: [
        {
          heading: '1. What Does Real Consent Look Like?',
          body: 'Consent is an active, ongoing agreement. Silence or lack of resistance is NOT consent. Anyone can change their mind at any point, and that decision must be respected without guilt or pressure.'
        },
        {
          heading: '2. Green Flags vs. Red Flags',
          body: 'Green flags include active listening, respecting personal space, and supporting your goals. Red flags include excessive jealousy, controlling who you speak to, demanding passwords, or emotional guilt-tripping.'
        },
        {
          heading: '3. Establishing Boundaries',
          body: 'Clear boundaries define what you are comfortable with physically, emotionally, and digitally. A healthy partner will honor your boundaries without questioning your worth.'
        }
      ],
      quiz: {
        question: 'What does the "R" stand for in the FRIES model of consent?',
        options: ['A. Required', 'B. Reversible (Can be withdrawn anytime)', 'C. Rigid', 'D. Recommended'],
        correctIndex: 1,
        explanation: 'Reversible! Anyone has the full right to change their mind and withdraw consent at any moment.'
      }
    },
    {
      id: '7',
      title: 'Gender-Based Violence Support',
      category: 'Protection',
      summary: 'Recognizing abuse, emergency helplines, and safe reporting resources.',
      readTime: '7 min',
      icon: 'alert-octagon-outline',
      color: '#DC2626',
      takeaways: [
        'Gender-based violence includes physical, emotional, sexual, and financial abuse.',
        'Abuse is NEVER the survivor’s fault.',
        'YouthConnect provides 24/7 confidential crisis hotlines and safe shelter links.'
      ],
      sections: [
        {
          heading: '1. Forms of Abuse',
          body: 'Violence isn’t only physical. Emotional abuse (gaslighting, verbal put-downs), digital harassment (non-consensual sharing of private photos), and sexual coercion are serious forms of GBV.'
        },
        {
          heading: '2. Immediate Emergency Action Plan',
          body: 'If you are in immediate danger, reach out to a trusted adult, access YouthConnect emergency help, or go to the nearest health facility for medical care and PEP within 72 hours.'
        },
        {
          heading: '3. Confidential Helplines',
          body: 'Our emergency crisis team operates 24/7. Calls and chats are encrypted, anonymous, and connect you with certified social workers and legal advocates.'
        }
      ],
      quiz: {
        question: 'True or False: Psychological coercion and controlling behavior count as gender-based violence?',
        options: ['A. True — Non-physical emotional abuse is a recognized form of GBV', 'B. False — GBV only applies to physical harm'],
        correctIndex: 0,
        explanation: 'True! GBV includes emotional, psychological, financial, and digital coercion alongside physical harm.'
      }
    },
    {
      id: '8',
      title: 'Youth Mental Health & Stress',
      category: 'Wellness',
      summary: 'Coping strategies for anxiety, school stress, and mental well-being.',
      readTime: '5 min',
      icon: 'brain',
      color: '#059669',
      takeaways: [
        'Mental health affects how we think, feel, act, and handle daily stress.',
        'Asking for help from counselors or therapists is a sign of self-awareness.',
        'Deep breathing (4-7-8 method) helps reset your nervous system during panic.'
      ],
      sections: [
        {
          heading: '1. Managing Stress & Anxiety',
          body: 'School deadlines, social dynamics, and family expectations can cause stress. Physical signs include rapid heart rate, shallow breathing, and trouble sleeping. Identifying triggers is the first step.'
        },
        {
          heading: '2. Mindfulness & Grounding Techniques',
          body: 'Try the 5-4-3-2-1 technique when overwhelmed: notice 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste to bring your focus back to the present moment.'
        },
        {
          heading: '3. Breaking the Stigma',
          body: 'Mental health struggles are as real as physical illnesses. Reaching out to a counselor, friend, or Keren AI creates a supportive space for healing.'
        }
      ],
      quiz: {
        question: 'What is the primary benefit of grounding techniques like the 5-4-3-2-1 method?',
        options: ['A. Memory retention', 'B. Bringing your focus back to the present to reduce panic', 'C. Muscle building', 'D. Eye strength'],
        correctIndex: 1,
        explanation: 'Grounding techniques reconnect your senses to the present moment, calming acute anxiety and panic symptoms.'
      }
    }
  ];

  const filteredModules = selectedCategory === 'All' 
    ? modules 
    : modules.filter(m => m.category === selectedCategory || (selectedCategory === 'Protection' && m.title.includes('Violence')));

  const completedCount = completedModules.length;
  const progressPercent = Math.round((completedCount / modules.length) * 100);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainWrapper}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Header Section */}
          <View style={styles.header}>
            <Text style={styles.title}>Digital SRH Hub</Text>
            <Text style={styles.subtitle}>Empower yourself with interactive education modules on health and wellness.</Text>

            {/* Progress Card */}
            <LinearGradient colors={['#0F172A', '#1E1B4B']} style={styles.progressCard} start={{x:0, y:0}} end={{x:1, y:1}}>
              <View style={styles.progressHeaderRow}>
                <View style={styles.progressBadge}>
                  <Ionicons name="sparkles" size={14} color="#8B5CF6" />
                  <Text style={styles.progressBadgeText}>LEARNING JOURNEY</Text>
                </View>
                <Text style={styles.progressPercentText}>{progressPercent}%</Text>
              </View>
              <Text style={styles.progressTitle}>SRH Mastery Progress</Text>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
              </View>
              <Text style={styles.progressText}>{completedCount} of {modules.length} Modules Completed</Text>
            </LinearGradient>
          </View>

          {/* Category Filter Chips */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
            {categories.map((cat, idx) => {
              const isSelected = selectedCategory === cat;
              return (
                <TouchableOpacity
                  key={idx}
                  style={[styles.categoryChip, isSelected && styles.categoryChipSelected]}
                  onPress={() => setSelectedCategory(cat)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.categoryChipText, isSelected && styles.categoryChipTextSelected]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Modules List */}
          <View style={styles.moduleList}>
            {filteredModules.map((mod, index) => {
              const isDone = completedModules.includes(mod.id);
              return (
                <TouchableOpacity 
                  key={index} 
                  style={styles.moduleCard} 
                  onPress={() => navigation.navigate('ModuleDetail', { module: mod })}
                  activeOpacity={0.7}
                >
                  <View style={[styles.iconContainer, { backgroundColor: mod.color + '15' }]}>
                    <MaterialCommunityIcons name={mod.icon} size={26} color={mod.color} />
                  </View>
                  <View style={styles.moduleInfo}>
                    <View style={styles.moduleHeaderRow}>
                      <Text style={styles.moduleTitle}>{mod.title}</Text>
                      {isDone && (
                        <View style={styles.completedBadge}>
                          <Feather name="check" size={12} color="#059669" />
                        </View>
                      )}
                    </View>
                    <Text style={styles.moduleSummary} numberOfLines={2}>{mod.summary}</Text>
                    <View style={styles.moduleMeta}>
                      <Feather name="clock" size={12} color={theme.colors.textLight} />
                      <Text style={styles.readTimeText}>{mod.readTime} read</Text>
                      <Text style={styles.metaBullet}>•</Text>
                      <Text style={styles.categoryTagText}>{mod.category}</Text>
                    </View>
                  </View>
                  <View style={styles.chevronContainer}>
                    <Feather name="chevron-right" size={18} color={theme.colors.textLight} />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

        </ScrollView>
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
  scrollContent: { padding: 16, paddingBottom: 40 },
  header: { marginBottom: 20 },
  title: { fontSize: 24, fontFamily: 'Inter_800ExtraBold', color: theme.colors.text, marginBottom: 4 },
  subtitle: { fontSize: 13, fontFamily: 'Inter_400Regular', color: theme.colors.textLight, marginBottom: 16, lineHeight: 19 },
  progressCard: {
    padding: 18,
    borderRadius: theme.borderRadius.xl,
    ...theme.shadows.glow,
  },
  progressHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  progressBadgeText: { fontSize: 10, fontFamily: 'Inter_700Bold', color: '#CBD5E1', marginLeft: 4, letterSpacing: 0.8 },
  progressPercentText: { fontSize: 16, fontFamily: 'Inter_800ExtraBold', color: '#2563EB' },
  progressTitle: { fontSize: 17, fontFamily: 'Inter_700Bold', color: '#FFFFFF', marginBottom: 10 },
  progressBarBg: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 4,
  },
  progressText: { fontSize: 12, fontFamily: 'Inter_400Regular', color: '#94A3B8' },
  categoryScroll: { gap: 8, marginBottom: 16 },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryChipSelected: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  categoryChipText: { fontSize: 12, fontFamily: 'Inter_500Medium', color: theme.colors.textLight },
  categoryChipTextSelected: { color: '#FFFFFF', fontFamily: 'Inter_700Bold' },
  moduleList: { gap: 12 },
  moduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: 14,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.8)',
    ...theme.shadows.card,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  moduleInfo: { flex: 1 },
  moduleHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  moduleTitle: { fontSize: 15, fontFamily: 'Inter_700Bold', color: theme.colors.text, flex: 1, marginRight: 6 },
  completedBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moduleSummary: { fontSize: 12, fontFamily: 'Inter_400Regular', color: theme.colors.textLight, lineHeight: 17, marginBottom: 6 },
  moduleMeta: { flexDirection: 'row', alignItems: 'center' },
  readTimeText: { fontSize: 11, fontFamily: 'Inter_500Medium', color: theme.colors.textLight, marginLeft: 4 },
  metaBullet: { marginHorizontal: 6, color: '#CBD5E1', fontSize: 12 },
  categoryTagText: { fontSize: 11, fontFamily: 'Inter_500Medium', color: '#2563EB' },
  chevronContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  }
});


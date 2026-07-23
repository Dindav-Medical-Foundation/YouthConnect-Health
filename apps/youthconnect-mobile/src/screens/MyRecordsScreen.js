import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Modal, Platform, Animated } from 'react-native';
import { theme } from '../theme/theme';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function MyRecordsScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeModalRecord, setActiveModalRecord] = useState(null);

  const categories = ['All', 'Consultations', 'Lab Results', 'Prescriptions'];

  const records = [
    {
      id: 'rec-1',
      category: 'Consultations',
      date: 'Oct 15, 2026',
      title: 'Youth SRH & Wellness Consult',
      doctor: 'Dr. Sarah Johnson',
      type: 'Live Encrypted Chat',
      topic: 'General Health & Reproductive Guidance',
      status: 'Completed',
      notes: 'Patient inquired about menstrual cycle regularity and stress management. Advised tracking cycle using YouthConnect Reminders and maintaining hydration. Recommended follow-up in 3 months.',
      actionLabel: 'View Consultation Notes',
      icon: 'message-square',
      color: '#2563EB',
    },
    {
      id: 'rec-2',
      category: 'Lab Results',
      date: 'Oct 10, 2026',
      title: 'Rapid Comprehensive SRH Screening',
      doctor: 'YouthConnect Partner Lab',
      type: 'Laboratory Panel',
      topic: 'HIV & STI Screening',
      status: 'Verified',
      resultText: 'Non-Reactive (Negative)',
      notes: 'All rapid tests for HIV-1/2, Syphilis, and Hepatitis B returned Non-Reactive (Negative). Routine screening recommended every 6 months.',
      actionLabel: 'View Official Lab Report',
      icon: 'activity',
      color: '#059669',
    },
    {
      id: 'rec-3',
      category: 'Prescriptions',
      date: 'Sep 28, 2026',
      title: 'Combined Oral Contraceptive Pack',
      doctor: 'Dr. Benjamin Lee',
      type: 'Digital Prescription',
      topic: 'Family Planning Care',
      status: 'Active Refill',
      notes: 'Prescribed Microgynon 30 (21-day cycle pack). Take 1 pill daily at the same time. 3 refill cycles authorized at any YouthConnect partner pharmacy.',
      actionLabel: 'View Refill QR Code',
      icon: 'file-text',
      color: '#7C3AED',
    },
    {
      id: 'rec-4',
      category: 'Consultations',
      date: 'Sep 02, 2026',
      title: 'Family Planning Options Review',
      doctor: 'Dr. Benjamin Lee',
      type: 'Video Teleconsultation',
      topic: 'Contraceptive Counseling',
      status: 'Completed',
      notes: 'Evaluated sub-dermal implants vs. oral contraceptives. Patient chose oral pills. Provided full guidance on proper usage and dual protection with condoms.',
      actionLabel: 'View Summary Notes',
      icon: 'video',
      color: '#2563EB',
    }
  ];

  const filteredRecords = selectedCategory === 'All' 
    ? records 
    : records.filter(r => r.category === selectedCategory);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainWrapper}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Header Banner */}
          <View style={styles.header}>
            <View style={styles.securityBadge}>
              <Ionicons name="shield-checkmark" size={14} color="#059669" />
              <Text style={styles.securityBadgeText}>256-BIT ENCRYPTED HEALTH VAULT</Text>
            </View>
            <Text style={styles.headerTitle}>My Health Records</Text>
            <Text style={styles.headerSubtitle}>
              Your confidential consultations, lab screening results, and prescriptions stored securely.
            </Text>
          </View>

          {/* Quick Metrics Bar */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <View style={[styles.statIconWrapper, { backgroundColor: '#EFF6FF' }]}>
                <Feather name="folder" size={20} color="#2563EB" />
              </View>
              <Text style={styles.statValue}>4</Text>
              <Text style={styles.statLabel}>Total Records</Text>
            </View>
            <View style={styles.statCard}>
              <View style={[styles.statIconWrapper, { backgroundColor: '#ECFDF5' }]}>
                <Feather name="check-circle" size={20} color="#059669" />
              </View>
              <Text style={styles.statValue}>1</Text>
              <Text style={styles.statLabel}>Lab Test</Text>
            </View>
            <View style={styles.statCard}>
              <View style={[styles.statIconWrapper, { backgroundColor: '#F5F3FF' }]}>
                <Feather name="shield" size={20} color="#7C3AED" />
              </View>
              <Text style={styles.statValue}>1</Text>
              <Text style={styles.statLabel}>Prescription</Text>
            </View>
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

          {/* Timeline & Records List */}
          <Text style={styles.sectionTitle}>
            {selectedCategory === 'All' ? 'Medical Timeline' : `${selectedCategory} (${filteredRecords.length})`}
          </Text>

          <View style={styles.timeline}>
            {filteredRecords.map((item, index) => (
              <View key={item.id} style={styles.timelineItem}>
                <View style={styles.timelineLine}>
                  <View style={[styles.timelineDot, { backgroundColor: item.color }]} />
                  {index !== filteredRecords.length - 1 && <View style={styles.timelineLineConnector} />}
                </View>
                <View style={styles.timelineContent}>
                  <TouchableOpacity 
                    style={styles.recordCard}
                    onPress={() => setActiveModalRecord(item)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.recordHeader}>
                      <Text style={styles.recordDate}>{item.date}</Text>
                      <View style={[styles.statusBadge, item.category === 'Lab Results' && { backgroundColor: '#D1FAE5' }]}>
                        <Text style={[styles.statusText, item.category === 'Lab Results' && { color: '#065F46' }]}>
                          {item.status}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.recordTitle}>{item.title}</Text>
                    <Text style={styles.recordDoctor}>{item.doctor}</Text>

                    {item.resultText && (
                      <View style={styles.resultContainer}>
                        <Ionicons name="checkmark-circle" size={16} color="#059669" style={{ marginRight: 6 }} />
                        <Text style={styles.resultText}>{item.resultText}</Text>
                      </View>
                    )}

                    <View style={styles.recordMetaRow}>
                      <View style={styles.recordTypeTag}>
                        <Feather name={item.icon} size={12} color={theme.colors.textLight} />
                        <Text style={styles.recordTypeTagText}>{item.type}</Text>
                      </View>
                      <View style={styles.topicBadge}>
                        <Text style={styles.topicBadgeText}>{item.topic}</Text>
                      </View>
                    </View>

                    <View style={styles.viewDetailsBtn}>
                      <Text style={styles.viewDetailsText}>{item.actionLabel}</Text>
                      <Feather name="chevron-right" size={16} color="#2563EB" />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          {/* Upload New Record Callout */}
          <View style={styles.uploadCard}>
            <View style={styles.uploadIconBg}>
              <Feather name="upload-cloud" size={24} color="#2563EB" />
            </View>
            <View style={styles.uploadInfo}>
              <Text style={styles.uploadTitle}>Need to add external lab results?</Text>
              <Text style={styles.uploadSub}>Securely upload your document or clinic slip for doctor review.</Text>
            </View>
            <TouchableOpacity style={styles.uploadBtn} activeOpacity={0.8}>
              <Text style={styles.uploadBtnText}>Upload Document</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>

        {/* Modal for Record Details */}
        {activeModalRecord && (
          <Modal
            visible={!!activeModalRecord}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setActiveModalRecord(null)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <View style={styles.modalHeaderTitleRow}>
                    <View style={[styles.modalIconBg, { backgroundColor: activeModalRecord.color + '15' }]}>
                      <Feather name={activeModalRecord.icon} size={20} color={activeModalRecord.color} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.modalCategoryText}>{activeModalRecord.category}</Text>
                      <Text style={styles.modalTitleText}>{activeModalRecord.title}</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.closeBtn} onPress={() => setActiveModalRecord(null)}>
                    <Feather name="x" size={20} color={theme.colors.text} />
                  </TouchableOpacity>
                </View>

                <View style={styles.modalBody}>
                  <View style={styles.modalMetaRow}>
                    <Text style={styles.modalMetaLabel}>Issued By:</Text>
                    <Text style={styles.modalMetaVal}>{activeModalRecord.doctor}</Text>
                  </View>
                  <View style={styles.modalMetaRow}>
                    <Text style={styles.modalMetaLabel}>Date & Time:</Text>
                    <Text style={styles.modalMetaVal}>{activeModalRecord.date}</Text>
                  </View>
                  <View style={styles.modalMetaRow}>
                    <Text style={styles.modalMetaLabel}>Service Type:</Text>
                    <Text style={styles.modalMetaVal}>{activeModalRecord.type}</Text>
                  </View>

                  <View style={styles.notesBox}>
                    <Text style={styles.notesTitle}>Clinical Notes & Summary:</Text>
                    <Text style={styles.notesBody}>{activeModalRecord.notes}</Text>
                  </View>
                </View>

                <View style={styles.modalFooter}>
                  <TouchableOpacity style={styles.downloadPdfBtn} onPress={() => setActiveModalRecord(null)}>
                    <Feather name="download" size={16} color="#FFF" style={{ marginRight: 8 }} />
                    <Text style={styles.downloadPdfBtnText}>Export Encrypted PDF</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        )}

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
  header: { marginBottom: 16 },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  securityBadgeText: { fontSize: 10, fontFamily: 'Inter_700Bold', color: '#065F46', marginLeft: 6, letterSpacing: 0.5 },
  headerTitle: { fontSize: 24, fontFamily: 'Inter_800ExtraBold', color: theme.colors.text, marginBottom: 4 },
  headerSubtitle: { fontSize: 13, fontFamily: 'Inter_400Regular', color: theme.colors.textLight, lineHeight: 19 },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.lg,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.8)',
    ...theme.shadows.card,
  },
  statIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  statValue: { fontSize: 20, fontFamily: 'Inter_800ExtraBold', color: theme.colors.text },
  statLabel: { fontSize: 11, fontFamily: 'Inter_500Medium', color: theme.colors.textLight },
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
  sectionTitle: { fontSize: 16, fontFamily: 'Inter_700Bold', color: theme.colors.text, marginBottom: 14 },
  timeline: { marginBottom: 20 },
  timelineItem: { flexDirection: 'row' },
  timelineLine: { width: 20, alignItems: 'center' },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 6,
    zIndex: 1,
  },
  timelineLineConnector: {
    width: 2,
    flex: 1,
    backgroundColor: '#E2E8F0',
    marginTop: 0,
    marginBottom: -4,
  },
  timelineContent: { flex: 1, paddingLeft: 12, paddingBottom: 16 },
  recordCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.8)',
    ...theme.shadows.card,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  recordDate: { fontSize: 12, fontFamily: 'Inter_600SemiBold', color: '#2563EB' },
  statusBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusText: { fontSize: 11, fontFamily: 'Inter_600SemiBold', color: '#2563EB' },
  recordTitle: { fontSize: 15, fontFamily: 'Inter_700Bold', color: theme.colors.text, marginBottom: 2 },
  recordDoctor: { fontSize: 12, fontFamily: 'Inter_400Regular', color: theme.colors.textLight, marginBottom: 8 },
  resultContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  resultText: { fontSize: 12, fontFamily: 'Inter_700Bold', color: '#065F46' },
  recordMetaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 8 },
  recordTypeTag: { flexDirection: 'row', alignItems: 'center' },
  recordTypeTagText: { fontSize: 11, fontFamily: 'Inter_400Regular', color: theme.colors.textLight, marginLeft: 4 },
  topicBadge: { backgroundColor: '#F1F5F9', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  topicBadgeText: { fontSize: 11, fontFamily: 'Inter_500Medium', color: theme.colors.text },
  viewDetailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  viewDetailsText: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: '#2563EB' },
  uploadCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  uploadIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadInfo: { flex: 1 },
  uploadTitle: { fontSize: 13, fontFamily: 'Inter_700Bold', color: theme.colors.text },
  uploadSub: { fontSize: 11, fontFamily: 'Inter_400Regular', color: theme.colors.textLight },
  uploadBtn: { backgroundColor: '#2563EB', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16 },
  uploadBtnText: { color: '#FFF', fontSize: 11, fontFamily: 'Inter_700Bold' },

  /* Modal Styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '85%',
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalHeaderTitleRow: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 12 },
  modalIconBg: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  modalCategoryText: { fontSize: 11, fontFamily: 'Inter_600SemiBold', color: '#2563EB' },
  modalTitleText: { fontSize: 16, fontFamily: 'Inter_800ExtraBold', color: theme.colors.text },
  closeBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center' },
  modalBody: { gap: 10, marginBottom: 20 },
  modalMetaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalMetaLabel: { fontSize: 13, fontFamily: 'Inter_500Medium', color: theme.colors.textLight },
  modalMetaVal: { fontSize: 13, fontFamily: 'Inter_700Bold', color: theme.colors.text },
  notesBox: {
    backgroundColor: '#F8FAFC',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 8,
  },
  notesTitle: { fontSize: 12, fontFamily: 'Inter_700Bold', color: theme.colors.text, marginBottom: 4 },
  notesBody: { fontSize: 13, fontFamily: 'Inter_400Regular', color: '#334155', lineHeight: 20 },
  modalFooter: { paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  downloadPdfBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadPdfBtnText: { color: '#FFF', fontSize: 14, fontFamily: 'Inter_700Bold' }
});


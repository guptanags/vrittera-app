import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SkillGapScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Skill Gap Analyzer</Text>
      <Text style={styles.desc}>Compare your resume vs 10,000+ job descriptions</Text>
      <View style={styles.gap}>
        <Text>Missing: AWS, Docker</Text>
        <Text>Recommended: AWS Certified Developer (Coursera)</Text>
      </View>
      <Text style={styles.premium}>Premium Feature</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F8FDFF' },
  title: { fontSize: 22, fontWeight: '700', color: '#001F3F' },
  desc: { marginVertical: 16, color: '#666' },
  gap: { backgroundColor: 'white', padding: 16, borderRadius: 12, marginVertical: 16 },
  premium: { color: '#FFD700', fontWeight: '600', textAlign: 'center' },
});
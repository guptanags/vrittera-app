import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

type DashboardStackParamList = {
  Resume: undefined;
  Interview: undefined;
  Jobs: undefined;
  SkillGap: undefined;
  LinkedIn: undefined;
  Salary: undefined;
};

export default function Dashboard() {
  const navigation = useNavigation<StackNavigationProp<DashboardStackParamList>>();

  const modules = [
    { title: 'Resume Optimizer', limit: '2/3 used', free: true, screen: 'Resume' },
    { title: 'Interview Coach', limit: '1/2 used', free: true, screen: 'Interview' },
    { title: 'Job Tracker', limit: '8/10 matches', free: true, screen: 'Jobs' },
    { title: 'Skill Gap Analyzer', limit: 'Premium', free: false, screen: 'SkillGap' },
    { title: 'LinkedIn Booster', limit: 'Premium', free: false, screen: 'LinkedIn' },
    { title: 'Salary Negotiator', limit: 'Premium', free: false, screen: 'Salary' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Vrittera AI</Text>
      <Text style={styles.subtitle}>Your Career, AI-Orbiting Success</Text>

      <View style={styles.grid}>
        {modules.map((m, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.card, !m.free && styles.premium]}
            onPress={() => navigation.navigate({ name: m.screen as keyof DashboardStackParamList, params: undefined })}
          >
            <Text style={styles.cardTitle}>{m.title}</Text>
            <Text style={styles.limit}>{m.limit}</Text>
            {!m.free && <Text style={styles.premiumTag}>Premium</Text>}
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.upgradeBtn}>
        <Text style={styles.upgradeText}>Upgrade to Premium ₹799/mo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FDFF', padding: 16, verticalAlign:'middle' },
  title: { fontSize: 24, fontWeight: '700', color: '#001F3F', textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#00BFFF', textAlign: 'center', marginVertical: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 24 },
  card: { width: '48%', backgroundColor: 'white', padding: 16, borderRadius: 12, marginBottom: 16, elevation: 3 },
  premium: { borderWidth: 2, borderColor: '#00BFFF' },
  cardTitle: { fontWeight: '600', color: '#001F3F' },
  limit: { fontSize: 12, color: '#666', marginTop: 4 },
  premiumTag: { position: 'absolute', top: 8, right: 8, backgroundColor: '#FFD700', color: '#001F3F', fontSize: 10, padding: 4, borderRadius: 12 },
  upgradeBtn: { backgroundColor: '#00BFFF', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 16 },
  upgradeText: { color: 'white', fontWeight: '600' },
});


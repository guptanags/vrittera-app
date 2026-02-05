// src/screens/ResumeResult.tsx
import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Share,
} from 'react-native';
import { AuthContext } from '../components/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import { useNavigation, useRoute } from '@react-navigation/native';

type Suggestion = {
  type: string;
  text: string;
};

type ResumeResult = {
  score: number;
  summary?: string;
  suggestions?: Suggestion[];
  optimizedResumeUrl?: string;
  raw?: any;
};

export default function ResumeResult() {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();
  const route = useRoute();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [result, setResult] = useState<ResumeResult | null>(null);

  // Expect route.params.result to contain backend response; fallback to param or fetch
  useEffect(() => {
    // @ts-ignore
    const r = route.params?.result;
    if (r) setResult(r);
    else {
      // If no param, try to fetch via job id (if provided)
      // @ts-ignore
      const jobId = route.params?.jobId;
      if (jobId) {
        // optional: fetch from backend /v1/resumes/:jobId or /v1/interviews/:jobId
        // implement if you have an endpoint; else show message
      }
    }
  }, [route.params]);

  if (!result) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>No result to show</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const onSave = async () => {
    if (!user) {
      Alert.alert('Sign in required', 'Please sign in to save your resume results.');
      return;
    }
    setSaving(true);
    try {
      const doc = {
        uid: user.uid,
        createdAt: firestore.FieldValue.serverTimestamp(),
        result,
      };
      await firestore().collection('resumes').add(doc);
      setSaved(true);
      Alert.alert('Saved', 'Your optimized resume and suggestions were saved to your profile.');
    } catch (err: any) {
      console.error('save error', err);
      Alert.alert('Save failed', err.message || 'Could not save result.');
    } finally {
      setSaving(false);
    }
  };

  const onShare = async () => {
    try {
      let shareText = `Resume Score: ${result.score}\n\n${result.summary || ''}\n\nSuggestions:\n`;
      (result.suggestions || []).forEach((s, i) => {
        shareText += `${i + 1}. ${s.text}\n`;
      });
      if (result.optimizedResumeUrl) shareText += `\nOptimized resume: ${result.optimizedResumeUrl}\n`;
      await Share.share({ message: shareText });
    } catch (err:any) {
      console.error('share error', err);
      Alert.alert('Share failed', err.message || String(err));
    }
  };

  const onDownload = async () => {
    if (!result.optimizedResumeUrl) {
      Alert.alert('No file', 'No optimized resume file is available to download.');
      return;
    }
    // If you want to implement direct download to device, add react-native-fs or blob util handling.
    // For now we'll open share dialog pointing to URL:
    try {
      await Share.share({ url: result.optimizedResumeUrl, message: 'Download optimized resume' });
    } catch (err:any) {
      console.error('download/share error', err);
      Alert.alert('Error', err.message || String(err));
    }
  };

  const score = Math.round(result.score ?? 0);
  const color = score >= 80 ? '#14b8a6' : score >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.link}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.h1}>Resume Result</Text>
        <View style={{ width: 48 }} />
      </View>

      <View style={styles.scoreCard}>
        <View style={[styles.scoreCircle, { borderColor: color }]}>
          <Text style={[styles.scoreText, { color }]}>{score}</Text>
          <Text style={styles.scoreSub}>/100</Text>
        </View>

        <View style={styles.scoreMeta}>
          <Text style={styles.summary}>{result.summary || 'AI assessment summary'}</Text>

          <View style={styles.metaRow}>
            <Text style={styles.metaKey}>Match</Text>
            <Text style={styles.metaVal}>{score >= 80 ? 'High' : score >= 60 ? 'Medium' : 'Low'}</Text>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaKey}>Optimized file</Text>
            <Text style={styles.metaVal}>{result.optimizedResumeUrl ? 'Available' : '—'}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Top Suggestions</Text>
      {(result.suggestions || []).length === 0 && <Text style={styles.helper}>No suggestions — great job!</Text>}
      {(result.suggestions || []).map((s, idx) => (
        <View key={idx} style={styles.suggestionCard}>
          <View style={styles.suggLeft}>
            <View style={[styles.badge, s.type === 'keyword' ? styles.badgeKeyword : s.type === 'tone' ? styles.badgeTone : styles.badgeFormat]}>
              <Text style={styles.badgeText}>{s.type.toUpperCase()}</Text>
            </View>
          </View>
          <View style={styles.suggBody}>
            <Text style={styles.suggText}>{s.text}</Text>
          </View>
        </View>
      ))}

      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.primaryBtn} onPress={onSave} disabled={saving || saved}>
          {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>{saved ? 'Saved' : 'Save'}</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.ghostBtn} onPress={onShare}>
          <Text style={styles.ghostBtnText}>Share</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.ghostBtn} onPress={onDownload}>
          <Text style={styles.ghostBtnText}>Download</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#071027', flex: 1 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  link: { color: '#9AAFD0' },
  h1: { color: '#E6EEF8', fontSize: 18, fontWeight: '700' },

  scoreCard: { flexDirection: 'row', backgroundColor: '#0F1724', padding: 14, borderRadius: 12, alignItems: 'center', marginBottom: 16 },
  scoreCircle: { width: 84, height: 84, borderRadius: 42, borderWidth: 4, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  scoreText: { fontSize: 28, fontWeight: '800' },
  scoreSub: { color: '#9AAFD0' },
  scoreMeta: { flex: 1 },
  summary: { color: '#fff', fontWeight: '600', marginBottom: 8 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between' },
  metaKey: { color: '#9AAFD0' },
  metaVal: { color: '#fff', fontWeight: '600' },

  sectionTitle: { color: '#9AAFD0', marginVertical: 10, fontWeight: '700' },
  helper: { color: '#9AAFD0' },

  suggestionCard: { flexDirection: 'row', backgroundColor: '#071b2b', padding: 10, marginBottom: 10, borderRadius: 10 },
  suggLeft: { marginRight: 8, justifyContent: 'center' },
  badge: { paddingHorizontal: 6, paddingVertical: 4, borderRadius: 6 },
  badgeText: { color: '#071027', fontWeight: '700', fontSize: 10 },
  badgeKeyword: { backgroundColor: '#FDE68A' },
  badgeTone: { backgroundColor: '#C7F9DD' },
  badgeFormat: { backgroundColor: '#BFDBFE' },
  suggBody: { flex: 1 },
  suggText: { color: '#E6EEF8' },

  actionsRow: { flexDirection: 'row', marginTop: 16, gap: 8, alignItems: 'center' },
  primaryBtn: { backgroundColor: '#06b6d4', paddingVertical: 12, paddingHorizontal: 18, borderRadius: 8, minWidth: 120, alignItems: 'center' },
  primaryBtnText: { color: '#04293a', fontWeight: '700' },
  ghostBtn: { borderWidth: 1, borderColor: '#244a5b', paddingVertical: 12, paddingHorizontal: 12, borderRadius: 8, marginLeft: 8 },
  ghostBtnText: { color: '#9AAFD0' },

  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#071027' },
  loadingText: { color: '#9AAFD0', marginBottom: 12 },
  backBtn: { marginTop: 8, padding: 8, backgroundColor: '#0F1724', borderRadius: 8 },
  backBtnText: { color: '#9AAFD0' },
});

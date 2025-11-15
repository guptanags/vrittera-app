// src/screens/InterviewScreen.tsx
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import AudioRecorder from '../components/AudioRecorder'; // your existing
import { presignUpload, createInterviewJob, getInterviewJob } from '../services/api';

export default function InterviewScreen() {
  const [uploading, setUploading] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const onRecorded = async (fileUri: string, filename = 'answer.m4a') => {
    try {
      setUploading(true);
      // ask backend for presign
      const contentType = 'audio/mp4' // or 'audio/m4a' depending on recorder
      const presign = await presignUpload(filename, contentType);
      // upload file — use RNFetchBlob or fetch with file read
      // Example with fetch + RN blob approach (you'll implement based on your recorder's file path)
      const uploadUrl = presign.uploadUrl;
      // Use RNFetchBlob or similar to PUT the file at uploadUrl
      // ... upload code omitted (same pattern as resume upload)
      // After upload, create interview job
      const jobResp = await createInterviewJob({ objectName: presign.objectName, fileUrl: presign.fileUrl });
      setJobId(jobResp.jobId);
      setStatus('queued');
      pollJobStatus(jobResp.jobId);
    } catch (err:any) {
      console.error(err);
      Alert.alert('Upload error', err.message || String(err));
    } finally {
      setUploading(false);
    }
  };

  const pollJobStatus = async (jid: string) => {
    // simple polling for demo — implement exponential backoff in production
    const poll = async () => {
      try {
        const resp = await getInterviewJob(jid);
        if (resp.job?.status === 'processing') setStatus('processing');
        if (resp.job?.status === 'success') {
          setStatus('done');
          setResult(resp.job);
          return;
        } else if (resp.job?.status === 'failed') {
          setStatus('failed');
          return;
        }
      } catch (e) {
        console.error('poll error', e);
      }
      setTimeout(poll, 3000);
    };
    poll();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Interview Coach</Text>
      <Text style={styles.p}>Record answers to practice questions and get AI feedback.</Text>

      <AudioRecorder onUploadFile={(fileUri: string) => onRecorded(fileUri)} />

      {uploading && <ActivityIndicator style={{ marginTop: 12 }} />}
      {jobId && <Text style={{ color: '#cfe' }}>Job: {jobId} — Status: {status}</Text>}
      {result && (
        <View style={styles.result}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>Feedback</Text>
          <Text style={{ color: '#cfd9e6' }}>{JSON.stringify(result.transcript || result.feedback || result, null, 2)}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  h1: { fontSize: 20, color: '#fff', marginBottom: 8 },
  p: { color: '#9aa', marginBottom: 12 },
  result: { marginTop: 12, backgroundColor: '#0F1724', padding: 12, borderRadius: 8 }
});

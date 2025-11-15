// src/screens/ResumeScreen.tsx
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { pick, types } from '@react-native-documents/picker'
import { presignUpload, resumeOptimize } from '../services/api';
import RNFetchBlob from 'rn-fetch-blob'; // optional, otherwise use fetch with blob
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Main: undefined;
  ResumeResult: { result: any };
  // Add other stack screens here if needed
};
export default function ResumeScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const pickAndUpload = async () => {
    try {
      setLoading(true);
      const [res] = await pick({ type: [types.pdf, types.doc, types.docx] });
      const filename = res.name ?? 'resume.pdf';
      const contentType = res.type ?? 'application/pdf';
      // request presign from backend
      const presign = await presignUpload(filename, contentType);
      // fetch file as blob and PUT to uploadUrl
      // On RN, use fetch with file path (res.uri) or RNFetchBlob
      const uploadUrl = presign.uploadUrl;
      // Use RNFetchBlob for file upload: (or implement fetch with fs read)
      const stat = await RNFetchBlob.fs.stat(res.uri.replace('file://',''));
      const data = await RNFetchBlob.fs.readFile(stat.path, 'base64');
      const uploadResp = await RNFetchBlob.fetch('PUT', uploadUrl, {
        'Content-Type': contentType
      }, RNFetchBlob.base64.decode(data));
      if (uploadResp.info().status >= 200 && uploadResp.info().status < 300) {
        // call backend optimize
        const optimizeResp = await resumeOptimize(presign.fileUrl || presign.objectName);
        setResult(optimizeResp);
        navigation.navigate('ResumeResult', { result: optimizeResp });
      } else {
        Alert.alert('Upload failed', String(uploadResp.info().status));
      }
    } catch (err: any) {
      
        console.error(err);
        Alert.alert('Error', err.message || String(err));
     
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Resume Optimizer</Text>
      <Text style={styles.p}>Upload your resume and get an AI-powered optimization.</Text>

      <Button title="Pick & Upload Resume" onPress={pickAndUpload} disabled={loading} />
      {loading && <ActivityIndicator style={{ marginTop: 12 }} />}
      {result && (
        <View style={styles.result}>
          <Text style={{ color: '#fff', fontWeight: '600' }}>Optimization Result</Text>
          <Text style={{ color: '#cfd9e6' }}>{JSON.stringify(result, null, 2)}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  h1: { fontSize: 20, fontWeight: '700', color: '#E6EEF8', marginBottom: 8 },
  p: { color: '#9AAFD0', marginBottom: 12 },
  result: { marginTop: 16, backgroundColor: '#0F1724', padding: 12, borderRadius: 8 }
});

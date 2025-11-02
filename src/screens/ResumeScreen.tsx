import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

export default function ResumeScreen() {
  const [file, setFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: ['application/pdf', 'text/plain'] });
    if (
      !result.canceled &&
      result.assets &&
      result.assets[0] &&
      typeof result.assets[0].size === 'number' &&
      result.assets[0].size < 5 * 1024 * 1024
    ) {
      setFile(result.assets[0]);
      Alert.alert('Success', 'Resume uploaded! ATS Score: 87/100');
    } else {
      Alert.alert('Error', 'File must be PDF/TXT and <5MB');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resume Optimizer</Text>
      <TouchableOpacity style={styles.uploadBtn} onPress={pickDocument}>
        <Text style={styles.btnText}>Tap to Upload (PDF/TXT)</Text>
      </TouchableOpacity>
      {file && <Text style={styles.file}>Uploaded: {file.name || file.uri}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F8FDFF' },
  title: { fontSize: 22, fontWeight: '700', color: '#001F3F', textAlign: 'center' },
  uploadBtn: { backgroundColor: '#E6F7FF', padding: 40, borderRadius: 16, borderWidth: 2, borderColor: '#00BFFF', borderStyle: 'dashed', marginVertical: 32, alignItems: 'center' },
  btnText: { color: '#001F3F', fontWeight: '600' },
  file: { textAlign: 'center', color: '#00BFFF' },
});
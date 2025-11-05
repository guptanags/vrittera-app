import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function JobTrackerScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Job Tracker</Text>
      <Text style={styles.desc}>10+ personalized matches</Text>
      <Text style={styles.limit}>8/10 used (Free)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F8FDFF' },
  title: { fontSize: 22, fontWeight: '700', color: '#001F3F', textAlign: 'center' },
  desc: { marginVertical: 16, color: '#666', textAlign: 'center' },
  limit: { color: '#00BFFF', textAlign: 'center' },
});
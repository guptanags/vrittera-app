import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function LinkedInScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>LinkedIn Booster</Text>
      <Text style={styles.desc}>AI-generated headline & summary</Text>
      <Text style={styles.premium}>Premium Feature</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F8FDFF' },
  title: { fontSize: 22, fontWeight: '700', color: '#001F3F', textAlign: 'center' },
  desc: { marginVertical: 16, color: '#666', textAlign: 'center' },
  premium: { color: '#FFD700', fontWeight: '600', textAlign: 'center' },
});
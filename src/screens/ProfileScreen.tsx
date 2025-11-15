// src/screens/ProfileScreen.tsx
import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { AuthContext } from '../components/AuthProvider';

export default function ProfileScreen() {
  const { user, signInAnonymously, signOut } = useContext(AuthContext);
  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Profile</Text>
      {user ? (
        <>
          <Text style={{ color: '#cfe' }}>User: {user.uid}</Text>
          <Button title="Sign out" onPress={() => signOut()} />
        </>
      ) : (
        <>
          <Text style={{ color: '#cfe' }}>Not signed in</Text>
          <Button title="Quick Start (Anonymous)" onPress={() => signInAnonymously()} />
        </>
      )}

      <View style={{ marginTop: 16 }}>
        <Button title="Upgrade to Pro" onPress={() => alert('Razorpay flow to be added in next PR')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  h1: { fontSize: 20, fontWeight: '700', color: '#fff' },
});

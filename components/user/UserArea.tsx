import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedView } from '@/components/ThemedView';
import { User } from '@/types/User';
import LoginForm from './LoginForm';
import Profile from './Profile';

export default function UserArea() {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    async function checkStatus() {
      try {
        const userStr = (await AsyncStorage.getItem('user')) || '';
        const user = JSON.parse(userStr);
        if (user?.bearer) {
          setUser(user);
        }
      } catch (e) {
        console.debug('Error checking status:', e);
        await AsyncStorage.removeItem('user');
      }
    }
    checkStatus();
  }, []);

  return (
    <ThemedView style={styles.container}>
      {user?.bearer ? <Profile user={user} /> : <LoginForm />}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
  },
  content: {
    paddingTop: 32,
  },
});

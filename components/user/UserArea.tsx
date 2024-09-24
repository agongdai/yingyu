import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePathname } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { User } from '@/types/User';
import LoginForm from './LoginForm';
import Profile from './Profile';

export default function UserArea() {
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    async function checkStatus() {
      try {
        const userStr = (await AsyncStorage.getItem('user')) || '""';
        const user = JSON.parse(userStr);
        if (user?.bearer) {
          setUser(user);
        } else {
          setUser(null);
        }
      } catch (e) {
        console.debug('Error checking status:', e);
        await AsyncStorage.removeItem('user');
      }
    }
    checkStatus();
  }, [pathname]);

  return (
    <ThemedView style={styles.container}>
      {user?.bearer ? <Profile user={user} /> : <LoginForm />}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 0,
  },
  content: {
    paddingTop: 20,
  },
});

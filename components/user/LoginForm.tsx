import React from 'react';
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Button, Colors, TextField } from 'react-native-ui-lib';
import Sha256 from 'sha256';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const login = async () => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_HOST}/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password: Sha256(password) }),
      });
      const res = await response.json();
      const user = res?.data;

      if (res.success && user?.bearer && user?.isActive) {
        await AsyncStorage.setItem('user', JSON.stringify(user));
        setError('');
        router.push('/explore');
      } else {
        setError('登录失败，请检查用户名和密码。');
      }
    } catch (error) {
      setError('登录失败，请检查网络连接或者重试登录。');
      await AsyncStorage.removeItem('user');
      console.error('ERROR: ' + JSON.stringify(error?.toString()));
    }
  };

  return (
    <ThemedView>
      <ThemedText type='title'>欢迎您</ThemedText>
      <ThemedView style={styles.content}>
        <TextField
          label='用户名'
          placeholder='用户名'
          preset='outline'
          onChangeText={(v) => setUsername(v)}
        />
        <TextField
          label='密码'
          placeholder='******'
          preset='outline'
          secureTextEntry
          onChangeText={(v) => setPassword(v)}
        />
        {error ? <ThemedText style={{ color: Colors.red30 }}>{error}</ThemedText> : null}
        <Button
          style={styles.submitButton}
          onPress={login}
          label={'登录'}
          size={Button.sizes.large}
          backgroundColor={Colors.orange30}
        />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 32,
  },
  submitButton: {
    marginTop: 20,
  },
});

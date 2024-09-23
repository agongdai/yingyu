import React from 'react';
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Button, Colors, TextField } from 'react-native-ui-lib';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const login = async () => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_HOST}/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      const user = await response.json();
      await AsyncStorage.setItem('user', JSON.stringify(user));
      router.push('/explore');
    } catch (error) {
      console.error('ERROR ' + JSON.stringify(error?.toString()));
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

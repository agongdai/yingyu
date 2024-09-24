import React from 'react';
import { StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Button, Colors } from 'react-native-ui-lib';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { User } from '@/types/User';

export default function Profile({ user }: { user: User }) {
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      router.push('/');
    } catch (error) {
      console.error('ERROR: ' + JSON.stringify(error?.toString()));
    }
  }

  return (
    <ThemedView>
      <ThemedText type='title'>{user?.username}</ThemedText>
      <ThemedView style={styles.content}>
        <Button
          style={styles.logoutButton}
          onPress={logout}
          label={'退出登录'}
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
  logoutButton: {
    marginTop: 20,
  },
});

import React from 'react';
import { StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Avatar, Button, Colors } from 'react-native-ui-lib';
import DebugPrint from '@/components/DebugPrint';
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
  };

  return (
    <ThemedView>
      <ThemedView style={styles.info}>
        <Avatar
          containerStyle={styles.avatar}
          source={{
            uri: `${process.env.EXPO_PUBLIC_AVATAR_BASE}/${user?.avatar || 'default.png'}`,
          }}
          animate
        />
        <ThemedView>
          <ThemedText type='title'>{user?.name || '无名'}</ThemedText>
          <ThemedText type='caption'>用户名: {user?.username || '未知'}</ThemedText>
        </ThemedView>
      </ThemedView>
      <ThemedView style={styles.content}>
        <Button
          style={styles.logoutButton}
          onPress={logout}
          label={'退出登录'}
          size={Button.sizes.large}
          backgroundColor={Colors.orange30}
        />
      </ThemedView>
      <DebugPrint>
        {`${process.env.EXPO_PUBLIC_AVATAR_BASE}/${user?.avatar || 'default.png'}`}
      </DebugPrint>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 20,
  },
  info: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    paddingTop: 10,
    marginRight: 16,
  },
  logoutButton: {
    marginTop: 20,
  },
});

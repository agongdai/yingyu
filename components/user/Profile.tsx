import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { User } from '@/types/User';

export default function Profile({ user }: { user: User }) {
  return (
    <ThemedView>
      <ThemedText type='title'>{user?.username}</ThemedText>
      <ThemedView style={styles.content}></ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 32,
  },
});

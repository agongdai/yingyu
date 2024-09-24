import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

export default function DebugPrint({ children }: { children: React.ReactNode }) {
  return process.env.NODE_ENV === 'development'
    ? (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.text}>--- Debugging info ---</ThemedText>
        <ThemedText style={styles.text}>{children}</ThemedText>
      </ThemedView>
    ) : null;
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: 'rgba(217, 22, 86, 0.1)',
    borderColor: 'rgba(217, 22, 86, 0.2)',
    borderWidth: 1,
  },
  text: {
    color: 'rgba(217, 22, 86, 0.85)',
  }
});

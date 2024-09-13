import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet } from 'react-native';
import { Button, Colors } from 'react-native-ui-lib';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useEffect } from 'react';

export default function TabTwoScreen() {
  useEffect(() => {
    async function fetchData() {
      const response = await fetch('https://reactnative.dev/movies.json');
      const data = await response.json();
      console.log(data);
    }

    fetchData();
  }, []);
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={<Ionicons size={250} name='library' style={styles.headerImage} />}
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type='title'>Login</ThemedText>
      </ThemedView>
      <Button label={'Press'} size={Button.sizes.large} backgroundColor={Colors.red30} />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});

import type { PropsWithChildren, ReactElement } from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePathname } from 'expo-router';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from 'react-native-reanimated';
import DebugPrint from '@/components/DebugPrint';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const HEADER_HEIGHT = 200;

type Props = PropsWithChildren<{
  headerImage: ReactElement;
  headerBackgroundColor: { dark: string; light: string };
}>;

export default function ParallaxScrollView({
  children,
  headerImage,
  headerBackgroundColor,
}: Props) {
  const colorScheme = useColorScheme() ?? 'light';
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const pathname = usePathname();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function checkStatus() {
      try {
        const userStr = (await AsyncStorage.getItem('user')) || '""';
        const user = JSON.parse(userStr);
        setUser(user?.bearer && user?.isActive ? user : null);
        setCheckingStatus(false);
      } catch (e) {
        console.debug('Error checking status:', e);
        await AsyncStorage.removeItem('user');
      }
    }

    checkStatus();
  }, [pathname]);

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75],
          ),
        },
        {
          scale: interpolate(scrollOffset.value, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [2, 1, 1]),
        },
      ],
    };
  });

  return (
    <ThemedView style={styles.container}>
      <Animated.ScrollView ref={scrollRef} scrollEventThrottle={16}>
        <Animated.View
          style={[
            styles.header,
            { backgroundColor: headerBackgroundColor[colorScheme] },
            headerAnimatedStyle,
          ]}
        >
          {headerImage}
        </Animated.View>
        <ThemedView style={styles.content}>
          {checkingStatus && pathname !== '/user' ? (
            <ThemedText>
              Checking e {pathname} {checkingStatus} ...
            </ThemedText>
          ) : (
            children
          )}
          <DebugPrint>{user ? JSON.stringify(user) : 'Not logined'}</DebugPrint>
        </ThemedView>
      </Animated.ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 200,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    padding: 20,
    gap: 16,
    overflow: 'hidden',
  },
});

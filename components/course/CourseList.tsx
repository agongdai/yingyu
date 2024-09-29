import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePathname } from 'expo-router';
import { Colors, Image, Incubator } from 'react-native-ui-lib';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Course } from '@/types/Course';

const { Toast } = Incubator;

export default function CourseList() {
  const [apiMessage, setApiMessage] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    async function fetchCourses() {
      const userStr = (await AsyncStorage.getItem('user')) || '""';
      const user = JSON.parse(userStr);
      try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_HOST}/v1/course`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${user?.bearer}`,
          },
        });
        const res = await response.json();
        if (res.success) {
          setCourses(res.data);
        } else {
          setApiMessage('无法获取课程信息。可能您的登录状态已超时。');
        }
      } catch (error) {
        setApiMessage('无法获取课程信息。请检查网络或者重试。');
      }
    }

    fetchCourses();
  }, [pathname]);

  return (
    <ThemedView style={styles.container}>
      {courses.map((course) => (
        <ThemedView key={course.id} style={styles.course}>
          <ThemedText type='subtitle'>{course.name}</ThemedText>
          <Image
            source={{
              uri: `${process.env.EXPO_PUBLIC_IMAGE_BASE}/${course.image || 'course-banner.jpg'}`,
            }}
            style={styles.courseImage}
          />
          <ThemedText type='caption'>{course.description}</ThemedText>
        </ThemedView>
      ))}
      <Toast
        visible={!!apiMessage}
        autoDismiss={2000}
        onDismiss={() => setApiMessage('')}
        position='top'
        preset='failure'
        message={apiMessage}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 0,
  },
  course: {
    marginTop: 16,
    padding: 16,
    backgroundColor: Colors.green80,
  },
  courseImage: {
    marginTop: 8,
    marginBottom: 8,
    height: 150,
  },
  content: {
    paddingTop: 20,
  },
});

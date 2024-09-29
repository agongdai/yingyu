import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { ImagePickerResult } from 'expo-image-picker/src/ImagePicker.types';
import { router } from 'expo-router';
import { Avatar, Button, Colors, Incubator } from 'react-native-ui-lib';
import DebugPrint from '@/components/DebugPrint';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { User } from '@/types/User';

const { Toast } = Incubator;

export default function Profile({ user }: { user: User }) {
  const [apiMessage, setApiMessage] = useState('');
  const [avatar, setAvatar] = useState(user?.avatar);

  useEffect(() => {
    setAvatar(user?.avatar);
  }, [user?.avatar]);

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      router.push('/');
    } catch (error) {
      console.error('ERROR: ' + JSON.stringify(error?.toString()));
    }
  };

  const onChangeAvatar = async () => {
    try {
      const result: ImagePickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
        allowsMultipleSelection: false,
      });
      if (result.canceled || result.assets.length <= 0) {
        return;
      }

      const selectedImage = result.assets[0];
      // ImagePicker saves the taken photo to disk and returns a local URI to it
      const localUri = selectedImage.uri;
      const filename = localUri.split('/').pop() || 'default.png';

      // Infer the type of the image
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;

      // Upload the image using the fetch and FormData APIs
      const formData = new FormData();
      // @ts-ignore @todo not sure why ESLint warns here.
      formData.append('file', { uri: localUri, name: filename, type });

      const response = await fetch(`${process.env.EXPO_PUBLIC_API_HOST}/v2/user/avatar`, {
        method: 'POST',
        body: formData,
        headers: {
          'content-type': 'multipart/form-data',
          Authorization: `Bearer ${user?.bearer}`,
        },
      });
      const res = await response.json();
      if (res.success) {
        setApiMessage('头像修改成功');
        setAvatar(res.data.avatar);
        await AsyncStorage.setItem('user', JSON.stringify(res.data));
      } else {
        setApiMessage('头像修改失败。可能您的登录状态已超时。');
      }
    } catch (error) {
      setApiMessage('头像修改失败。请检查网络或者重试。');
    }
  };

  return (
    <ThemedView>
      <ThemedView style={styles.info}>
        <Avatar
          onPress={onChangeAvatar}
          containerStyle={styles.avatar}
          source={{
            uri: `${process.env.EXPO_PUBLIC_AVATAR_BASE}/${avatar || 'default.png'}`,
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

import { View } from 'react-native';
import { Link, router } from 'expo-router';
import { useEffect } from 'react';

const Post = () => {
  useEffect(() => {
    router.replace('/postcreation');
  }, []);

  return null;
};

export default Post;
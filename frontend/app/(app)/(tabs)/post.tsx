import { View } from 'react-native';
import PostCreation from '../post/components/post-creation-form';

const Post = () => {
  return (
    <View className="flex flex-1 justify-between items-center">
      <PostCreation />
    </View>
  );
};

export default Post;

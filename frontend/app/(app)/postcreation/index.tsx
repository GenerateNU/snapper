import { View } from 'react-native';
import PostCreation from './components/post-creation-form';

const CreatePost = () => {
  return (
    <View className="flex items-center">
      <PostCreation />
    </View>
  );
};

export default CreatePost;

import { SafeAreaView } from 'react-native';
import PostCreation from './components/post-creation-form';

const CreatePost = () => {
  return (
    <SafeAreaView className="flex items-center">
      <PostCreation />
    </SafeAreaView>
  );
};

export default CreatePost;

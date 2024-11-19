import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { useAuthStore } from '../../../auth/authStore';
import Button from '../../../components/button';

const Home = () => {
  const { logout, loading, error: authError } = useAuthStore();

  return (
    <View className="flex-1 justify-center items-center">
      {authError && (
        <Text className="text-red-500 mb-4">
          Failed to logout. Please try again.
        </Text>
      )}
      <Button
        textOnly
        text="Another user's profile"
        onPress={() => router.push('/user/673c1eb1ca933ec2f85deee6')}
      />
      <Button
        textOnly
        text="Divelog"
        onPress={() => router.push('/divelog/672fee642e921e76a8345fd1')}
      />
      <Button
        onPress={logout}
        textOnly
        text={loading ? 'Logging out' : 'Logout'}
      />
    </View>
  );
};

export default Home;

import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { useAuthStore } from '../../../auth/authStore';
import Button from '../../../components/button';

const Home = () => {
  const { logout, loading, error: authError } = useAuthStore();

  return (
    <View className="flex-1 justify-center items-center bg-slate-100">
      {authError && (
        <Text className="text-red-500 mb-4">
          Failed to logout. Please try again.
        </Text>
      )}
      <Button
        textOnly
        text="Another user's profile"
        onPress={() =>
          router.push('/user/9eb15c34-56ad-4673-8c5a-4243806fbd14')
        }
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

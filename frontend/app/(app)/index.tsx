import { View, Text, ScrollView } from 'react-native';
import Button from '../../components/button';
import { useAuthStore } from '../../auth/authStore';
import { router } from 'expo-router';

const Home = () => {
  const { logout, loading, error: authError, isAuthenticated } = useAuthStore();

  return (
    <View className="flex-1 justify-center items-center">
        {authError && (
          <Text className="text-red-500 mb-4">
            Failed to logout. Please try again.
          </Text>
        )}
        <Button textOnly text="Profile" onPress={() => router.push('/user/1')}
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

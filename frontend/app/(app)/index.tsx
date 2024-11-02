import { View, Text } from 'react-native';
import Button from '../../components/button';
import { useAuthStore } from '../../auth/authStore';
import Badge from '../../assets/fish badge.svg';
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
      <Button
        textOnly
        text="Another user's profile"
        onPress={() =>
          router.push('/user/9eb15c34-56ad-4673-8c5a-4243806fbd14')
        }
      />
      <Button
        textOnly
        text="My profile"
        onPress={() =>
          router.push('/user/3707e4ea-62ef-4aeb-b107-b5c80f2c7730')
        }
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

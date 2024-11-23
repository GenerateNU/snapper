import { router } from 'expo-router';
import { Text, View, Image, Dimensions } from 'react-native';
import { useAuthStore } from '../../../auth/authStore';
import Button from '../../../components/button';
import DiveLog from '../../../components/divelog/divelog';

const Home = () => {
  const { logout, loading, error: authError } = useAuthStore();

  return (
    <View className="flex-1 justify-center items-center px-[8%]">
      <Button
        textOnly
        text="Testing divelog"
        onPress={() => router.push('/divelog/673c226b31ce281ee6935b8b')}
      />

      {/* {authError && (
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
        onPress={logout}
        textOnly
        text={loading ? 'Logging out' : 'Logout'}
      /> */}
    </View>
  );
};

export default Home;
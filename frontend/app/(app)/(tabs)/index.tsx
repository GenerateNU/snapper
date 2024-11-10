import { View, Text } from 'react-native';
import { router } from 'expo-router';
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
        text="Empty user profile"
        onPress={() =>
          router.push('/user/9eb15c34-56ad-4673-8c5a-4243806fbd14')
        }
      />
      <Button
        textOnly
        text="Profile with data"
        onPress={() =>
          router.push('/user/ea5a57c1-f727-4a76-a4f4-ccbde58202b5')
        }
      />
      <Button
        textOnly
        text="Profile with data"
        onPress={() =>
          router.push('/user/cdecea90-2f3c-45f5-b534-da0f437c297f')
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

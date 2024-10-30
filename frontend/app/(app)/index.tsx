import { View, Text, ScrollView } from 'react-native';
import Button from '../../components/button';
import { useAuthStore } from '../../auth/authStore';
import Header from '../user/components/header';
import Badges from '../user/components/badges';
import DiveLog from '../user/components/divelog';
import { LinearGradient } from 'expo-linear-gradient';

const Home = () => {
  const { logout, loading, error: authError, isAuthenticated } = useAuthStore();
  const badges = ["First Catch", "Deep Diver", "Ocean Explorer"];

  return (
    <ScrollView 
      contentContainerStyle={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <View className="w-full justify-center items-center px-[8%]">
        <Header />
        <Badges badges={badges} />
        <DiveLog />
        {authError && (
          <Text className="text-red-500 mb-4">
            Failed to logout. Please try again.
          </Text>
        )}
        <Button
          onPress={logout}
          textOnly
          text={loading ? 'Logging out' : 'Logout'}
        />
      </View>
    </ScrollView>
  );
};

export default Home;

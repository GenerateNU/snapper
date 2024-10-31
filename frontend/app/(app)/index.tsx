import { View, Text, ScrollView } from 'react-native';
import Button from '../../components/button';
import { useAuthStore } from '../../auth/authStore';
import Header from '../user/components/header';
import Badges from '../user/components/badges';
import DiveLog from '../user/components/divelog';
import { LinearGradient } from 'expo-linear-gradient';
import Menu from '../user/components/menu';
import Species from '../user/components/species';

const Home = () => {
  const { logout, loading, error: authError, isAuthenticated } = useAuthStore();

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
        <Menu />
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

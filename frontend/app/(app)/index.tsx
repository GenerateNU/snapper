import { View, Text } from 'react-native';
import Button from '../../components/button';
import { useAuthStore } from '../../auth/authStore';
import Badge from '../../assets/fish badge.svg';
import InfoPopup from '../../components/info-popup';

const Home = () => {
  const { logout, loading, error: authError, isAuthenticated } = useAuthStore();

  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-3xl pb-[5%]">Home</Text>
      {authError && (
        <Text className="text-red-500">
          Failed to logout. Please try again.
        </Text>
      )}
      <Badge width={100} height={100} />
      <Button
        onPress={logout}
        textOnly
        text={loading ? 'Logging out' : 'Logout'}
      />
      <View className=' absolute flex flex-col justify-end h-screen'>
        <InfoPopup commonName='Red Snapper' scientificName='Lutjanus campechanus' />
      </View>
    </View>
  );
};

export default Home;

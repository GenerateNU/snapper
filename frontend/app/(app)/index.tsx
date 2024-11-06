import { View, Text } from 'react-native';
import Button from '../../components/button';
import { useAuthStore } from '../../auth/authStore';
import Badge from '../../assets/fish badge.svg';
import InfoPopup from '../../components/info-popup';
import PopulatedInfoPopupButton from '../../components/populated-info-popup';

const Home = () => {
  const { logout, loading, error: authError } = useAuthStore();

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
      <View className=' flex flex-col'>
        <PopulatedInfoPopupButton speciesId='Canthidermis maculata' />
        <PopulatedInfoPopupButton speciesId='Sufflamen bursa' />
        <PopulatedInfoPopupButton speciesId='Gaidropsarus mediterraneus' />
        <PopulatedInfoPopupButton speciesId='Gaidropsarus vulgaris' />
        <PopulatedInfoPopupButton speciesId='Spicara smaris' />
      </View>
      <InfoPopup />
    </View>
  );
};

export default Home;

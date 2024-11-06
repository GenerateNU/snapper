import { View, Text } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '../../../auth/authStore';
import Button from '../../../components/button';
import InfoPopup from '../../../components/info-popup';
import PopulatedInfoPopupButton from '../../../components/populated-info-popup';

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
        onPress={logout}
        textOnly
        text={loading ? 'Logging out' : 'Logout'}
      />
      <View className=" flex flex-col">
        <PopulatedInfoPopupButton speciesId="Canthidermis maculata">
          <Button />
        </PopulatedInfoPopupButton>
        <PopulatedInfoPopupButton speciesId="Sufflamen bursa">
          <Button />
        </PopulatedInfoPopupButton>
        <PopulatedInfoPopupButton speciesId="Gaidropsarus mediterraneus">
          <Button />
        </PopulatedInfoPopupButton>
        <PopulatedInfoPopupButton speciesId="Gaidropsarus vulgaris">
          <Button />
        </PopulatedInfoPopupButton>
        <PopulatedInfoPopupButton speciesId="Spicara smaris">
          <Button />
        </PopulatedInfoPopupButton>
      </View>
      <InfoPopup />
    </View>
  );
};

export default Home;

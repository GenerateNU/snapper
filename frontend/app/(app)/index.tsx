import { View, Text } from 'react-native';
import Button from '../../components/button';
import { useAuthStore } from '../../auth/authStore';
import Badge from '../../assets/fish badge.svg';
import { InfoPopupProvider, useInfoPopup } from '../../contexts/info-popup-context';
import InfoPopup from '../../components/info-popup';
import { cuttlefish, greatWhite, redSnapper } from '../../types/species';

const Home = () => {
  const { logout, loading, error: authError } = useAuthStore();
  const { setSpeciesContent, isOpen, setOpen } = useInfoPopup();

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
        <Button
          onPress={() => { setSpeciesContent(redSnapper); setOpen(); }}
          text="Open Red Snapper"
        />
        <Button
          onPress={() => { setSpeciesContent(cuttlefish); setOpen(); }}
          text="Open Cuttlefish"
        />
        <Button
          onPress={() => { setSpeciesContent(greatWhite); setOpen(); }}
          text="Open Great White Shark"
        />
      </View>
      <InfoPopup />
    </View>
  );
};

export default Home;

import { View, Text } from 'react-native';
import Button from '../../components/button';
import { useAuthStore } from '../../auth/authStore';
import Badge from '../../assets/fish badge.svg';
import { InfoPopupProvider, useInfoPopup } from '../../contexts/info-popup-context';
import InfoPopup from '../../components/info-popup';

const Home = () => {
  const { logout, loading, error: authError } = useAuthStore();
  const { isOpen, setOpen } = useInfoPopup();

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
      <Button
        onPress={setOpen}
        text={`Open info page, currently open: ${isOpen}`}
      />
      <InfoPopup />
    </View>
  );
};

export default Home;

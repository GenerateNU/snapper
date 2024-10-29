import { View, Text, Image } from 'react-native';
import Button from '../../components/button';
import { router } from 'expo-router';

const Redirection = () => {
  return (
    <View className="bg-white flex-1 justify-between items-center">
      <View>
        <View className="rounded-full pt-[30%] overflow-hidden items-center justify-center">
          <Image
            className="w-100 h-100 object-cover"
            source={require('../../assets/Logo.png')}
          />
        </View>
        <Text className="font-bold text-5xl ">Snapper</Text>
      </View>
      <View
        className="w-full pb-[50%] px-[8%]"
        style={{ gap: 20, flexDirection: 'column' }}
      >
        <Button text="Log In" onPress={() => router.push('/login')} />
        <Button
          color="ocean"
          outline
          text="Sign Up"
          onPress={() => router.push('/register')}
        />
      </View>
    </View>
  );
};

export default Redirection;

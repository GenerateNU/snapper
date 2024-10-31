import { View, Image, Text } from 'react-native';
import Profile from '../../../../components/profile';
import Button from '../../../../components/button';
import Divider from '../../../../components/divider';

interface HeaderProps {
  image?: string;
  follower?: number;
  following?: number;
  name?: string; // Adjusted from number to string
  username?: string; // Adjusted from number to string
  userId?: string;
}

const Header: React.FC<HeaderProps> = () => {
  return (
    <View className="flex flex-col w-full">
      <View className="flex flex-row w-full">
        <Profile image="https://www.stancsmith.com/uploads/4/8/9/6/48964465/76ce9ab1ca225c7ef0af8e63ace06da7d4cb5c56_orig.jpg" />
        <View className="flex flex-row ml-[5%] justify-around w-3/4">
          <View className="flex-col justify-center items-center flex-1">
            <Text className="font-bold text-darkblue">100K</Text>
            <Text className="text-darkblue">Followers</Text>
          </View>
          <View className="flex-col justify-center items-center flex-1">
            <Text className="font-bold text-darkblue">150K</Text>
            <Text className="text-darkblue">Following</Text>
          </View>
        </View>
      </View>
      <View className="flex flex-row justify-between py-[5%]">
        <View>
          <Text className="font-bold text-xl text-darkblue">Quokka</Text>
          <Text>@quokka</Text>
        </View>
        <Button text="Follow" small />
      </View>
      <Divider />
    </View>
  );
};

export default Header;

import { View, Image, Text, TouchableOpacity } from 'react-native';
import Profile from '../../../../components/profile';
import Button from '../../../../components/button';
import Divider from '../../../../components/divider';
import { useLocalSearchParams } from 'expo-router';
import { useAuthStore } from '../../../../auth/authStore';
import { useUserData } from '../../../../hooks/user';

interface HeaderProps {
  image?: string;
  follower?: number;
  following?: number;
  name?: string; // Adjusted from number to string
  username?: string; // Adjusted from number to string
  userId?: string;
}

const Header: React.FC<HeaderProps> = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { mongoDBId }  = useAuthStore();
  const { data, isError, isLoading } = useUserData();

  return (
    <View className="flex flex-col w-full">
      <View className="flex flex-row w-full">
        <Profile image={data?.user.profilePicture} />
        <View className="flex flex-row ml-[5%] justify-around w-3/4">
          <TouchableOpacity className="flex-col justify-center items-center flex-1">
            <Text className="font-bold text-darkblue">{data?.user.followers.length}</Text>
            <Text className="text-darkblue">Followers</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-col justify-center items-center flex-1">
            <Text className="font-bold text-darkblue">{data?.user.following.length}</Text>
            <Text className="text-darkblue">Following</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View className="flex flex-row justify-between py-[5%]">
        <View>
          <Text className="font-bold text-xl text-darkblue">First Last</Text>
          <Text className="text-ocean">{`@${data?.user.username}`}</Text>
        </View>
        {id !== mongoDBId && <Button text="Follow" small />}
      </View>
      <Divider />
    </View>
  );
};

export default Header;

import { TouchableOpacity, View, Text, Image } from 'react-native';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import Profile from '../../../../components/profile';
import IconButton from '../../../../components/icon-button';

interface DiveLogProps {
  username?: string;
  title?: string;
  image?: string;
  description?: string;
  profilePhoto?: string;
  date?: Date;
}

const DiveLog: React.FC<DiveLogProps> = ({
  username,
  title,
  image,
  description,
  profilePhoto,
}) => {
  return (
    <View className="w-full p-[5%] bg-white shadow-lg rounded-lg">
      <View className="flex-row justify-between items-start">
        <View className="flex flex-row items-center">
          <Profile
            small
            image="https://www.stancsmith.com/uploads/4/8/9/6/48964465/76ce9ab1ca225c7ef0af8e63ace06da7d4cb5c56_orig.jpg"
          />
          <View className="ml-[10%] flex flex-col">
            <Text className="font-bold">Quokka</Text>
            <Text>1h ago</Text>
          </View>
        </View>
        <IconButton icon={faEllipsisVertical} />
      </View>
      <View className="w-ful h-40 my-[5%]">
        <Image
          className="w-full h-full object-cover rounded-lg"
          source={{
            uri: 'https://images2.minutemediacdn.com/image/upload/c_crop,w_5692,h_3201,x_0,y_374/v1673978202/images/voltaxMediaLibrary/mmsport/mentalfloss/01gq0e0b6s2972198hmw.jpg',
          }}
        />
      </View>
      <Text>
        Went on this amazing dive! Made me forget about algo for a sec back to
        reality ig
      </Text>
    </View>
  );
};

export default DiveLog;

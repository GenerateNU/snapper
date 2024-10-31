import { View, Image } from 'react-native';

interface ProfileProps {
  small?: boolean;
  image: string;
}

const Profile: React.FC<ProfileProps> = ({ small = false, image }) => {
  return (
    <View className="bg-water rounded-full border border-2 overflow-hidden items-center justify-center">
      <Image
        className={`${small ? 'w-10 h-10' : 'w-20 h-20'} object-cover`}
        source={{
          uri: image,
        }}
      />
    </View>
  );
};

export default Profile;

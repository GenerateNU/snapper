import { View, Image } from 'react-native';

interface ProfileProps {
  image: string;
  outline?: boolean;
  size: 'sm' | 'md' | 'lg';
  borderColor?: string;
}

const Profile: React.FC<ProfileProps> = ({
  image,
  outline = false,
  size,
  borderColor = 'border-darkblue',
}) => {
  const sizeMap = {
    sm: 35,
    md: 50,
    lg: 70,
  };

  const dimension = sizeMap[size];

  return (
    <View
      className={`bg-water rounded-full ${outline ? 'border border-2' : ''} ${borderColor} overflow-hidden items-center justify-center`}
    >
      <Image
        style={{ width: dimension, height: dimension }}
        className="object-cover"
        source={{
          uri: image,
        }}
      />

    </View>
  );
};

export default Profile;

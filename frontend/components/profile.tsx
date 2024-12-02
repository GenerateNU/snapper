import { View, Image } from 'react-native';

interface ProfileProps {
  image: string;
  outline?: boolean;
  size: 'sm' | 'md' | 'lg' | 'xl';
  borderColor?: string;
  borderSize?: 0 | 2 | 4 | 8
}

const Profile: React.FC<ProfileProps> = ({
  image,
  outline = false,
  size,
  borderColor = 'darkblue',
  borderSize = 2
}) => {
  const sizeMap = {
    sm: 35,
    md: 50,
    lg: 70,
    xl: 80
  };

  const dimension = sizeMap[size];

  return (
    <View
      className={`bg-water rounded-full ${outline ? `border border-${borderSize}` : ''} border-${borderColor} overflow-hidden items-center justify-center`}
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

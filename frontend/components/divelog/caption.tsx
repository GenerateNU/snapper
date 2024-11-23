import { useState } from 'react';
import { View, Text, Pressable, TouchableOpacity } from 'react-native';

interface CaptionProps {
  description: string;
  username: string;
  onPress: () => void;
}

const Caption: React.FC<CaptionProps> = ({
  description,
  username,
  onPress,
}) => {
  const [viewMore, setViewMore] = useState<boolean>(false);

  return (
    <View>
      <View className="flex-row flex-wrap">
        <Text className="font-bold mr-2" onPress={onPress}>
          {username}
        </Text>
        <TouchableOpacity
          onPress={() => setViewMore(!viewMore)}
          activeOpacity={0.7}
        >
          <Text
            numberOfLines={viewMore ? undefined : 3}
            className="text-gray-700"
          >
            {description}
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={() => setViewMore(!viewMore)}
        activeOpacity={0.7}
      >
        <Text className="text-slate-400 mt-1">
          {viewMore ? 'see less' : 'see more'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Caption;
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Pressable } from 'react-native';

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
  const [isOverflowing, setIsOverflowing] = useState<boolean>(false);

  const [fullTextHeight, setFullTextHeight] = useState<number>(0);
  const [threeLineHeight, setThreeLineHeight] = useState<number>(0);

  useEffect(() => {
    if (fullTextHeight > 0 && threeLineHeight > 0) {
      setIsOverflowing(fullTextHeight > threeLineHeight);
    }
  }, [fullTextHeight, threeLineHeight]);

  return (
    <View>
      <View className="flex-row flex-wrap">
        <Pressable onPress={onPress}>
          <Text className="font-bold mr-2">{username}</Text>
        </Pressable>
        <Text
          className="text-gray-700"
          numberOfLines={viewMore ? undefined : 3}
          onLayout={(event) => {
            // Capture the height of the visible (3-line) text
            if (!threeLineHeight && !viewMore) {
              setThreeLineHeight(event.nativeEvent.layout.height);
            }
          }}
        >
          {description}
        </Text>
      </View>

      <Text
        className="absolute opacity-0"
        numberOfLines={0}
        onLayout={(event) => {
          // Capture the height of the full text
          if (!fullTextHeight) {
            setFullTextHeight(event.nativeEvent.layout.height);
          }
        }}
      >
        {description}
      </Text>

      {isOverflowing && (
        <TouchableOpacity
          onPress={() => setViewMore(!viewMore)}
          activeOpacity={0.7}
        >
          <Text className="text-slate-400 mt-1">
            {viewMore ? 'see less' : 'see more'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Caption;

import { useState } from 'react';
import { Image, TouchableOpacity, View, Text } from 'react-native';
import * as ExpoImagePicker from 'expo-image-picker';

export default function ImagePicker() {
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    let result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ExpoImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View className="h-96 w-96">
      <TouchableOpacity
        className="w-full h-full flex items-center justify-center rounded-lg bg-gray-200"
        onPress={pickImage}
      >
        <Image source={require('../assets/Frame.png')} />
        <Text className="text-center"> Upload an Image </Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} />}
    </View>
  );
}

import { useState } from 'react';
import { Image, TouchableOpacity, View, Text } from 'react-native';
import * as ExpoImagePicker from 'expo-image-picker';
import { useFormContext } from 'react-hook-form';

export default function ImagePicker() {
  const [image, setImage] = useState<string | null>(null);

  const context = useFormContext();

  if (!context)
    throw Error(
      'Please wrap the ImagePicker with a FormProvider from React Hook Form',
    );

  const setValue = context.setValue;

  const pickImage = async () => {
    let result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ExpoImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImageUri = result.assets[0].uri;
      setImage(selectedImageUri); // Update local state
      setValue('image', selectedImageUri); // Set the form value to the selected image URI
    } else {
      setImage(null); // Clear the image state if canceled
      setValue('image', undefined); // Clear the form value
    }
  };

  return (
    <View className="h-96 w-full">
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

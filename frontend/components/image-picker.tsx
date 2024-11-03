import { useState } from 'react';
import { Image, TouchableOpacity, View, Text } from 'react-native';
import * as ExpoImagePicker from 'expo-image-picker';
import { useFormContext } from 'react-hook-form';

export default function ImagePicker() {
  const [image, setImage] = useState<string[] | null>(null);

  const pickImage = async () => {
    let result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ExpoImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.canceled) {
      setImage(image ? [result.assets[0].uri, ...image] : [result.assets[0].uri]);
    }
  };

  /**
   * A smaller version of the other image adder. This is used when there is already 
   * an image preview displayed.
   */
  function SmallImageAdder(): JSX.Element {
    return (
      <View className='h-full w-[33%] rounded-md border border-gray-400 border-dashed relative flex justify-center items-center '>
        <TouchableOpacity
          className="w-full h-full flex items-center justify-center rounded-lg"
          onPress={pickImage}>
          <Image
            className="object-cover"
            source={require('../assets/Plus.png')} />
        </TouchableOpacity>
      </View>);
  }

  /**
   * Provides a preview of the images from the output of the image picker.
   */
  function DisplayImages() {
    if (!image) {
      throw new Error("Impropper use of DisplayImages. The prop `image` must be non-null!")
    }

    //Get the last two images in the list
    const limitedImages = image.slice(image.length - 2, image.length);
    return (
      <View className='w-full h-full flex flex-row justify-left items-center'>
        {limitedImages.map((item, index) => {
          return (
            <View key={index} className='w-[33%] pr-3 h-full aspect-square rounded-md'>
              {(index === 1 && image.length > 2) && (
                <View className='w-full h-full relative flex items-center justify-center'>
                  <Text className='text-black font-bold absolute z-20'>+{image.length - 2} more</Text>
                  <View className='top-0 left-0 w-full h-full bg-gray-200 opacity-60 rounded-md absolute z-10' />
                  <Image
                    className='absolute w-full h-full rounded-md z-0'
                    source={require('../assets/Logo.png')}
                  />
                </View>
              )}
              {((index == 1 && image.length <= 2) || index != 1) &&
                (<Image
                  className='w-full h-full rounded-md'
                  source={require('../assets/Logo.png')}
                />)}
            </View>);
        })}
        <SmallImageAdder />
      </View>);
  };

  /**
   * A smaller version of the other image adder. This is used when there is already 
   * an image preview displayed.
   */
  function SmallImageAdder(): JSX.Element {
    return (
      <View className='h-full w-[33%] rounded-md border border-gray-400 border-dashed relative flex justify-center items-center '>
        <TouchableOpacity
          className="w-full h-full flex items-center justify-center rounded-lg"
          onPress={pickImage}>
          <Image
            className="object-cover"
            source={require('../assets/Plus.png')} />
        </TouchableOpacity>
      </View>);
  }

  /**
   * Provides a preview of the images from the output of the image picker.
   */
  function DisplayImages() {
    if (!image) {
      throw new Error("Impropper use of DisplayImages. The prop `image` must be non-null!")
    }

    //Get the last two images in the list
    const limitedImages = image.slice(image.length - 2, image.length);
    return (
      <View className='w-full h-full flex flex-row justify-left items-center'>
        {limitedImages.map((item, index) => {
          return (
            <View key={index} className='w-[33%] pr-3 h-full aspect-square rounded-md'>
              {(index === 1 && image.length > 2) && (
                <View className='w-full h-full relative flex items-center justify-center'>
                  <Text className='text-black font-bold absolute z-20'>+{image.length - 2} more</Text>
                  <View className='top-0 left-0 w-full h-full bg-gray-200 opacity-60 rounded-md absolute z-10' />
                  <Image
                    className='absolute w-full h-full rounded-md z-0'
                    source={require('../assets/Logo.png')}
                  />
                </View>
              )}
              {((index == 1 && image.length <= 2) || index != 1) &&
                (<Image
                  className='w-full h-full rounded-md'
                  source={require('../assets/Logo.png')}
                />)}
            </View>);
        })}
        <SmallImageAdder />
      </View>);
  };

  return (
    <View
      className={`h-[15vh] w-full rounded-md relative flex justify-center items-center ${!image ? 'border border-gray-400 border-dashed' : ''
        }`}>
      <TouchableOpacity
        className="w-fit h-full flex items-center justify-center rounded-lg absolute"
        onPress={image ? undefined : pickImage}>
        {!image && (
          <Text className="text-[16px] absolute">
            <Text className="font-bold text-ocean">Choose an image</Text> to upload
          </Text>
        )}
      </TouchableOpacity>
      {image && <DisplayImages />}
    </View>
  );
}

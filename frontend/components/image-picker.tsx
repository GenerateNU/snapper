import { useEffect, useState } from 'react';
import {
  Image,
  TouchableOpacity,
  View,
  Text,
  InputAccessoryView,
} from 'react-native';
import * as ExpoImagePicker from 'expo-image-picker';
import { FormProvider, useFormContext } from 'react-hook-form';
import { Photo } from '../types/divelog';

export default function ImagePicker() {
  const { register, setValue, formState } = useFormContext();
  const { isSubmitted, isDirty } = formState;
  register('photos');
  const [image, setImage] = useState<string[]>([]);

  useEffect(() => {
    if (!isSubmitted && !isDirty) {
      setImage([]);
    }
  }, [isDirty]);

  const pickImage = async () => {
    let result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ExpoImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.canceled) {
      const copy = [result.assets[0].uri, ...image];
      setImage(copy);
      //Pretty messy, lets but for now its okay.
      const fetchImageFromURI = async (uri: string): Promise<Photo> => {
        const res = await fetch(uri);
        const blob = await res.blob();

        return new Promise((resolve, reject) => {
          const reader = new FileReader();

          reader.onloadend = () => {
            if (reader.result) {
              const result = reader.result as string;
              const photo: Photo = {
                base64: result,
                name: uri,
                fileType: 'image/jpeg',
              };
              resolve(photo);
            } else {
              reject(new Error('Failed to convert blob to base64.'));
            }
          };

          reader.onerror = () => {
            reject(new Error('Error reading the file.'));
          };

          reader.readAsDataURL(blob);
        });
      };

      const fs = copy.map(fetchImageFromURI);

      const base64s = await Promise.all(fs);

      setValue('photos', base64s);
    }
  };

  /**
   * A smaller version of the other image adder. This is used when there is already
   * an image preview displayed.
   */
  function SmallImageAdder(): JSX.Element {
    return (
      <View className="h-full w-[33%] rounded-md border border-gray-400 border-dashed relative flex justify-center items-center ">
        <TouchableOpacity
          className="w-full h-full flex items-center justify-center rounded-lg"
          onPress={pickImage}
        >
          <Image
            className="object-cover"
            source={require('../assets/Plus.png')}
          />
        </TouchableOpacity>
      </View>
    );
  }

  /**
   * Provides a preview of the images from the output of the image picker.
   */
  function DisplayImages() {
    //Get the last two images in the list
    const limitedImages = image.slice(0, 2);
    return (
      <View className="w-full h-full flex flex-row justify-left items-center">
        {limitedImages.map((item, index) => {
          return (
            <View
              key={index}
              className="w-[33%] pr-3 h-full aspect-square rounded-md"
            >
              {index === 1 && image.length > 2 && (
                <View className="w-full h-full relative flex items-center justify-center">
                  <Text className="text-black font-bold absolute z-20">
                    +{image.length - 2}{' '}
                  </Text>
                  <View className="top-0 left-0 w-full h-full bg-gray-200 opacity-60 rounded-md absolumorete z-10" />
                  <Image
                    className="absolute w-full h-full rounded-md z-0"
                    source={{ uri: item }}
                  />
                </View>
              )}
              {((index == 1 && image.length <= 2) || index != 1) && (
                <Image
                  className="w-full h-full rounded-md"
                  source={{ uri: item }}
                />
              )}
            </View>
          );
        })}
        <SmallImageAdder />
      </View>
    );
  }

  return (
    <View
      className={`h-[15vh] w-full rounded-md relative flex justify-center items-center ${
        image.length == 0 ? 'border border-gray-400 border-dashed' : ''
      }`}
    >
      <TouchableOpacity
        className="w-fit h-full flex items-center justify-center rounded-lg absolute"
        onPress={pickImage}
      >
        {image.length == 0 && (
          <Text className="text-[16px] absolute">
            <Text className="font-bold text-ocean">Choose an image</Text> to
            upload
          </Text>
        )}
      </TouchableOpacity>
      {image.length != 0 && <DisplayImages />}
    </View>
  );
}

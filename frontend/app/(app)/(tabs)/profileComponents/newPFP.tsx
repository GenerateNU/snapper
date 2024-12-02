import { useEffect, useState } from 'react';
import {
  Image,
  TouchableOpacity,
  View,
  Text,
  InputAccessoryView,
} from 'react-native';
import * as ExpoImagePicker from 'expo-image-picker';
import {
  FieldValues,
  useFormContext,
  UseFormSetValue,
  useFormState,
} from 'react-hook-form';
import { Photo } from '../../../../types/divelog';
import { useUserById } from '../../../../hooks/user';
import { UpdateProfileFields } from '../../../../types/userProfile';

export function NewPFP(id: any): JSX.Element {
  const { data, isError, isLoading } = useUserById(id);
  const { register, setValue, formState } =
    useFormContext<UpdateProfileFields>();
  const { isSubmitted, isDirty } = formState;
  const [image, setImage] = useState<string>();
  register('profilePicture');

  const PFPSelector = () => {
    return (
      <View className={`w-fit h-fit flex justify-center items-center pb-2`}>
        <TouchableOpacity
          className="h-[15vh] w-[15vh] rounded-full flex items-center justify-center rounded-full bg-gray border border-gray-400 border-dashed"
          onPress={async () => {
            const uri = await pickImage(setValue);
            setImage(uri);
          }}
        >
          {image && (
            <Image
              className="absolute w-full h-full rounded-full object-cover"
              source={{ uri: image }}
            />
          )}
          <Image
            className="object-cover"
            source={require('../../../../assets/Plus.png')}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return PFPSelector();
}

async function pickImage(setValue: UseFormSetValue<UpdateProfileFields>) {
  let result = await ExpoImagePicker.launchImageLibraryAsync({
    mediaTypes: ExpoImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    aspect: [4, 3],
  });

  if (!result.canceled) {
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

    const fs = fetchImageFromURI(result.assets[0].uri);

    const base64s = await Promise.all([fs]);

    //console.log(base64s[0].base64);

    setValue('profilePicture', base64s[0].base64);

    return result.assets[0].uri;
  }
}

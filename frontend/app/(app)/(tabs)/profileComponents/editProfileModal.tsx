import { Modal } from 'react-native';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { NewPFP } from './newPFP';
import { UpdateProfileFields } from '../../../../types/userProfile';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import Button from '../../../../components/button';
import { useAuthStore } from '../../../../auth/authStore';
import { updateProfilePhoto } from '../../../../api/user';
import { apiConfig } from '../../../../api/apiContext';

interface PFPProps {
  visible: boolean;
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ChangePFP({ visible, onClose }: PFPProps) {
  const API_BASE_URL = apiConfig;
  const { handleSubmit } = useFormContext<UpdateProfileFields>();

  const onSubmit = async (data: UpdateProfileFields) => {
    onClose(false);
    console.log('scum');
    const response = await fetch(`${API_BASE_URL}/user/actions/edit`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  };
  const currentUser = useAuthStore();

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white rounded-lg p-6 w-4/5">
          <View className={'flex flex-row justify-between'}>
            <Text className="text-lg font-medium mb-4">Edit Profile</Text>
            <TouchableOpacity
              onPress={() => onClose(false)}
              className="aspect-square h-[30px] h-[30px] rounded-full"
            >
              {/* X.png is fucked, off by like 1 px*/}
              <Image
                className="w-full h-full rounded-full object-cover"
                source={require('../../../../assets/x.png')}
              />
            </TouchableOpacity>
          </View>

          <NewPFP id={''} />
          <Button onPress={handleSubmit(onSubmit)} text="Update" />
        </View>
      </View>
    </Modal>
  );
}
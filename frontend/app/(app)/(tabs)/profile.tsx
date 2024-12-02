import { View, Text, TouchableHighlight, Pressable } from 'react-native';
import User from '../user/components/user-profile';
import { useAuthStore } from '../../../auth/authStore';
import { Stack, router} from 'expo-router';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import IconButton from '../../../components/icon-button';
import { useState, useEffect } from 'react';
import { ChangePFP } from './profileComponents/editProfileModal';
import { useForm, FormProvider } from 'react-hook-form';
import { UpdateUser } from '../../../types/userProfile';

const Profile = () => {
  const { mongoDBId, logout } = useAuthStore();
  const [isMenuOpen, setMenuOpened] = useState(false);
  const [isEditPFPOpen, setEditPFPOpen] = useState(false);
  const methods = useForm<UpdateUser>();

  useEffect(() => {
    if (isEditPFPOpen) {
      setMenuOpened(false);
    }
  }, [isEditPFPOpen]);

  const burgerClick = () => {
    setMenuOpened(!isMenuOpen);
  };

  if (!mongoDBId) {
    return (
      <View className="flex flex-1 justify-center items-center">
        <Text>Unable to load user</Text>
      </View>
    );
  }

  return (
    <FormProvider {...methods}>
      {/* <></> */}
      <Stack.Screen
        options={{
          headerTitle: '',
          headerTransparent: true,
          headerShown: true,
          headerRight: () => (
            <View className="relative">
              <View className="w-fit mr-3">
                <IconButton icon={faBars} onPress={burgerClick} />
              </View>
              {isMenuOpen && (
                <View
                  className="absolute bg-white rounded-md"
                  style={{
                    top: 0,
                    left: -65 - 50,
                    width: 110,
                    flexDirection: 'column',
                  }}
                >
                  <Text className='pl-2 pt-2 pb-1 font-semibold'>Settings</Text>
                  <TouchableHighlight
                    className="w-full p-2"
                    onPress={() => alert('Password')}
                    activeOpacity={0.6}
                    underlayColor="#DDDDDD"
                  >
                    <Text>Password</Text>
                  </TouchableHighlight>
                  <TouchableHighlight
                    className="w-full p-2 pb-1"
                    onPress={() => router.push("/profileComponents/edit-profile")}
                    activeOpacity={0.6}
                    underlayColor="#DDDDDD"
                  >
                    <Text>Edit Profile</Text>
                  </TouchableHighlight>
                  <TouchableHighlight
                    className="w-full p-2 pb-1"
                    onPress={logout}
                    activeOpacity={0.6}
                    underlayColor="#DDDDDD"
                  >
                    <Text>Log out</Text>
                  </TouchableHighlight>
                </View>
              )}
            </View>
          ),
        }}
      />
      <View className="relative flex flex-1 items-center">
        <User id={mongoDBId} />
      </View>
    </FormProvider>
  );
};

export default Profile;

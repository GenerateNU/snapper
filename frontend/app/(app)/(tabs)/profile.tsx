import { View, Text, TouchableHighlight } from 'react-native';
import User from '../user/components/user-profile';
import { useAuthStore } from '../../../auth/authStore';
import { Stack } from 'expo-router';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import IconButton from '../../../components/icon-button';
import { useState } from 'react';
import { ChangePFP } from './profileComponents/editProfileModal';
import { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { UpdateProfileFields } from '../../../types/userProfile';
import { logout } from '../../../api/auth';

const Profile = () => {
  const { mongoDBId, logout } = useAuthStore();
  const [isMenuOpen, setMenuOpened] = useState(false);
  const [isEditPFPOpen, setEditPFPOpen] = useState(false);
  const methods = useForm<UpdateProfileFields>();
  if (!mongoDBId) {
    return (
      <View className="flex flex-1 justify-center items-center">
        <Text>Unable to load user</Text>
      </View>
    );
  }

  const burgerClick = () => {
    setMenuOpened(!isMenuOpen);
  };

  useEffect(() => {
    if (isEditPFPOpen) {
      setMenuOpened(false);
    }
  }, [isEditPFPOpen]);

  return (
    <FormProvider {...methods}>
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
                  <TouchableHighlight
                    className="w-full p-2"
                    onPress={() => alert('Settings')}
                    activeOpacity={0.6}
                    underlayColor="#DDDDDD"
                  >
                    <Text>Settings</Text>
                  </TouchableHighlight>
                  <TouchableHighlight
                    className="w-full p-2"
                    onPress={() => alert('Password')}
                    activeOpacity={0.6}
                    underlayColor="#DDDDDD"
                  >
                    <Text>Password</Text>
                  </TouchableHighlight>
                  <TouchableHighlight
                    className="w-full p-2"
                    onPress={() => setEditPFPOpen(true)}
                    activeOpacity={0.6}
                    underlayColor="#DDDDDD"
                  >
                    <Text>Edit Profile</Text>
                  </TouchableHighlight>
                  <TouchableHighlight
                    className="w-full p-2"
                    onPress={logout}
                    activeOpacity={0.6}
                    underlayColor="#DDDDDD"
                  >
                    <Text>Log out, scum.</Text>
                  </TouchableHighlight>

                </View>
              )}
            </View>
          ),
        }}
      />
      <View className="relative flex flex-1 items-center">
        <User id={mongoDBId || ''} />
        <ChangePFP visible={isEditPFPOpen} onClose={setEditPFPOpen} />
      </View>
    </FormProvider>

  );
};

export default Profile;

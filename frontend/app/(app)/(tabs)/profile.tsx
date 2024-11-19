import { faBars } from '@fortawesome/free-solid-svg-icons';
import { Stack } from 'expo-router';
import { Text, View } from 'react-native';
import { useAuthStore } from '../../../auth/authStore';
import IconButton from '../../../components/icon-button';
import User from '../user/components/user-profile';

const Profile = () => {
  const { supabaseId } = useAuthStore();

  if (!supabaseId) {
    <View className="flex flex-1 justify-center items-center">
      <Text>Unable to load user</Text>
    </View>;
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: '',
          headerTransparent: true,
          headerShown: true,
          headerRight: () => (
            <View style={{ marginRight: 30 }}>
              <IconButton icon={faBars} />
            </View>
          ),
        }}
      />
      <View className="flex flex-1">
        <User id={supabaseId || ''} />
      </View>
    </>
  );
};

export default Profile;

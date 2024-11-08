import React from 'react';
import { View, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '.././components/header';
import Badges from '.././components/badges';
import Menu from '.././components/menu';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Stack } from 'expo-router';
import { useAuthStore } from '../../../../auth/authStore';
import Arrow from '../../../../components/arrow';
import InfoPopup from '../../../../components/info-popup';

const User = ({ id }: { id: string }) => {
  const { supabaseId } = useAuthStore();
  const isViewingOwnProfile = supabaseId === id;

  const data = [
    { id: 'header', component: <Header id={id} /> },
    { id: 'badges', component: <Badges id={id} /> },
    { id: 'menu', component: <Menu id={id} /> },
  ];

  const renderItem = ({ item }: { item: any }) => {
    return <View className="px-[7%]">{item.component}</View>;
  };

  return (
    <LinearGradient
      colors={['#549ac7', '#ffffff', '#ffffff', '#ffffff']}
      style={{ flex: 1 }}
    >
      <Stack.Screen
        options={{
          headerTitle: '',
          headerTransparent: true,
          headerShown: true,
          headerLeft: () =>
            !isViewingOwnProfile ? (
              <Arrow direction="left" onPress={() => router.back()} />
            ) : null,
        }}
      />
      <SafeAreaView
        edges={['top', 'left', 'right']}
        className="flex flex-1 mt-[10%]"
      >
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: 10,
          }}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
      <InfoPopup />
    </LinearGradient>
  );
};

export default User;

import { LinearGradient } from 'expo-linear-gradient';
import { router, Stack } from 'expo-router';
import React from 'react';
import { FlatList, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../../../auth/authStore';
import Arrow from '../../../../components/arrow';
import InfoPopup from '../../../../components/info-popup';
import Badges from '.././components/badges';
import Header from '.././components/header';
import Menu from '.././components/menu';

const User = ({ id }: { id: string }) => {
  const { mongoDBId } = useAuthStore();
  const isViewingOwnProfile = mongoDBId === id;

  const data = [
    { id: 'header', component: <Header id={id} /> },
    { id: 'badges', component: <Badges id={id} /> },
    { id: 'menu', component: <Menu id={id} /> },
  ];

  const renderItem = ({ item }: { item: any }) => (
    <View className="px-[7%]">{item.component}</View>
  );

  return (
    <LinearGradient
      colors={['#549ac7', '#ffffff', '#ffffff', '#ffffff']}
      style={{ flex: 1 }}
    >
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

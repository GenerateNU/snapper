import React from 'react';
import { View, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Header from './components/header';
import Badges from './components/badges';
import Menu from './components/menu';
import { SafeAreaView } from 'react-native-safe-area-context';

const Profile = () => {
  const data = [
    { id: 'header', component: <Header /> },
    { id: 'badges', component: <Badges /> },
    { id: 'menu', component: <Menu /> },
  ];

  const renderItem = ({ item }: { item: any }) => {
    return <View className="px-[8%]">{item.component}</View>;
  };

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
    </LinearGradient>
  );
};

export default Profile;

import React from 'react';
import { View, ScrollView, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Header from './components/header';
import Badges from './components/badges';
import Menu from './components/menu';
import { useLocalSearchParams } from 'expo-router';

const Profile = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <LinearGradient
      colors={['#549ac7', '#ffffff', '#ffffff', '#ffffff']}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'flex-start',
            alignItems: 'center',
            paddingTop: 0,
          }}
        >
          <View style={{gap: 15}} className='w-full px-[8%]'>
            <Header />
            <Badges badges={["Diver", "First Catcher", "Ocean Explorer"]} />
            <Menu />
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default Profile;

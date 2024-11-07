import React from 'react';
import Home from '../../../assets/house.svg';
import Search from '../../../assets/search.svg';
import Plus from '../../../assets/plus.svg';
import Star from '../../../assets/Star.svg';
import Profile from '../../../assets/profile.svg';
import {
  faHouse,
  faSearch,
  faStar,
  faCircleUser,
  faPlusSquare,
} from '@fortawesome/free-solid-svg-icons';
import { Tabs } from 'expo-router';
import IconButton from '../../../components/icon-button';

const Layout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarStyle: {
            borderTopColor: 'gray',
            height: 80,
          },
        }}
        sceneContainerStyle={{
          backgroundColor: 'white',
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            headerShown: false,
            headerTransparent: true,
            tabBarIcon: ({ focused }) => {
              return focused ? (
                <IconButton icon={faHouse} />
              ) : (
                <Home width={20} height={20} />
              );
            },
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Explore',
            headerShown: false,
            headerTransparent: true,
            tabBarIcon: ({ focused }) => {
              return focused ? (
                <IconButton icon={faSearch} />
              ) : (
                <Search width={20} height={20} />
              );
            },
          }}
        />
        <Tabs.Screen
          name="post"
          options={{
            title: 'Post',
            headerShown: false,
            headerTransparent: true,
            tabBarIcon: ({ focused }) => {
              return focused ? (
                <IconButton icon={faPlusSquare} />
              ) : (
                <Plus width={20} height={20} />
              );
            },
          }}
        />
        <Tabs.Screen
          name="notification"
          options={{
            title: 'Notification',
            headerShown: false,
            headerTransparent: true,
            tabBarIcon: ({ focused }) => {
              return focused ? (
                <IconButton icon={faStar} />
              ) : (
                <Star width={20} height={20} />
              );
            },
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            headerShown: false,
            headerTransparent: true,
            tabBarIcon: ({ focused }) => {
              return focused ? (
                <IconButton icon={faCircleUser} />
              ) : (
                <Profile width={20} height={20} />
              );
            },
          }}
        />
      </Tabs>
    </>
  );
};

export default Layout;

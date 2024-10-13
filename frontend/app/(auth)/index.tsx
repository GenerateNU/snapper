import React, { useRef, useState } from 'react';
import { View, Text, ImageBackground, ScrollView, Dimensions } from 'react-native';
import Button from '../../components/button';
import { router } from 'expo-router';
import Arrow from '../../components/arrow';

const ONBOARDING_DATA = [
  {
    title: 'Track and enhance your dives',
    image: require('../../assets/Onboarding.png'),
  },
  {
    title: 'Log your dives',
    description: 'Track your dive locations, conditions, and more—so you can relive every adventure.',
    image: require('../../assets/Onboarding - v2.png'),
  },
  {
    title: 'Spot a fish?',
    description: 'Explore our database and tag species from your dives.',
    image: require('../../assets/Onboarding - v3.png'),
  },
  {
    title: "Let's dive in!",
    description: 'Explore our database and tag species from your dives.',
    image: require('../../assets/Onboarding - v4.png'),
  },
];

const Welcome = () => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { width } = Dimensions.get('window');
  
  const handleNext = () => {
    if (currentIndex < ONBOARDING_DATA.length - 1) {
      const nextIndex = currentIndex + 1;
      scrollViewRef.current?.scrollTo({ x: width * nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    }
  };

  const progressWidth = ((currentIndex + 1) / ONBOARDING_DATA.length) * 100;

  return (
    <View className='flex-1 justify-center'>
      

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        contentContainerStyle={{ width: width * ONBOARDING_DATA.length }}
      >
        {ONBOARDING_DATA.map((item, index) => (
          <ImageBackground
            key={index}
            source={item.image}
            style={{ width, height: '100%' }}
            resizeMode="cover"
          >
            <View className="w-full mt-[100%] flex-1 flex-col justify-start items-center px-[8%]">
              <View className="w-full items-center pb-[8%] flex-gap">
                <Text className="text-center text-2xl font-bold text-black">{item.title}</Text>
                {item.description && (
                  <Text className="text-center text-base text-black">{item.description}</Text>
                )}
              </View>
              {index === ONBOARDING_DATA.length - 1 && (
                <View className="w-full" style={{ gap: 20, flexDirection: 'column' }}>
                  <Button
                    color="black"
                    backgroundColor="white"
                    text="Sign Up"
                    onPress={() => router.push('/register')}
                  />
                  <Button text="Sign In" onPress={() => router.push('/login')} />
                </View>
              )}
            </View>
          </ImageBackground>
        ))}
      </ScrollView>
      <View className="absolute bottom-40 right-10">
        {currentIndex < ONBOARDING_DATA.length - 1 && (
          <Arrow direction="right" onPress={handleNext} />
        )}
      </View>
    </View>
  );
};

export default Welcome;
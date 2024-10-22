import React, { useRef, useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  Dimensions,
} from 'react-native';
import Button from '../../components/button';
import { router } from 'expo-router';
import Arrow from '../../components/arrow';
import { ProgressContext } from './_layout';
import { ONBOARDING_DATA } from '../../consts/onboarding';

const Welcome = () => {
  const scrollViewRef = useRef<ScrollView>(null);
  const { width } = Dimensions.get('window');
  // keep track of which page is on
  const [currentIndex, setCurrentIndex] = useState(0);
  // set the progress bar in the layout
  const { setProgress } = useContext(ProgressContext);

  // if user clicks arrow, update to next index and scroll view position
  const handleNext = () => {
    if (currentIndex < ONBOARDING_DATA.length - 1) {
      const nextIndex = currentIndex + 1;
      // scroll to a specific position
      scrollViewRef.current?.scrollTo({ x: width * nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    }
  };

  // when currentIndex is updated, will set the progress
  useEffect(() => {
    const newProgress = ((currentIndex + 1) / ONBOARDING_DATA.length) * 100;
    setProgress(newProgress);
  }, [currentIndex]);

  return (
    <View className="flex-1 justify-center">
      <ScrollView
        ref={scrollViewRef}
        horizontal
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
                <Text className="text-center text-3xl pb-[4%] font-bold text-black px-10">
                  {item.title}
                </Text>
                {item.description && (
                  <Text className="text-center px-[10%] text-base text-black">
                    {item.description}
                  </Text>
                )}
              </View>
              {index === ONBOARDING_DATA.length - 1 && (
                <View
                  className="w-full"
                  style={{ gap: 20, flexDirection: 'column' }}
                >
                  <Button
                    color="black"
                    backgroundColor="white"
                    text="Sign Up"
                    onPress={() => router.push('/register')}
                  />
                  <Button
                    text="Sign In"
                    onPress={() => router.push('/login')}
                  />
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

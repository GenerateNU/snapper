import { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  PanResponder,
  ScrollView,
  View,
} from 'react-native';
import SpeciesInfo from './species-info';
import { useInfoPopup } from '../contexts/info-popup-context';

const InfoPopup = () => {
  const { speciesContent, isOpen, setClose } = useInfoPopup();
  const screenHeight = Dimensions.get('window').height;
  const translateY = useRef(new Animated.Value(screenHeight)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: false });
    }
  }, [isOpen]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dy > 100) {
          Animated.timing(translateY, {
            toValue: screenHeight,
            duration: 300,
            useNativeDriver: true,
          }).start(() => setClose());
        } else {
          Animated.timing(translateY, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: isOpen ? 0 : screenHeight,
      duration: 400,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  return (
    <Animated.View
      className="absolute flex flex-col justify-end h-full"
      style={{
        transform: [{ translateY }],
      }}
    >
      <View className="w-screen h-2/3">
        <View
          {...panResponder.panHandlers}
          className="shadow-xl h-7 rounded-t-2xl bg-white flex flex-row justify-center items-center"
        >
          <View className="bg-slate-400 opacity-60 h-[6px] w-12 rounded-lg" />
        </View>
        <SpeciesInfo
          speciesContent={speciesContent}
          scrollViewRef={scrollViewRef}
          panResponder={panResponder}
        />
      </View>
    </Animated.View>
  );
};

export default InfoPopup;

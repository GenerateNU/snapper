import { router, useLocalSearchParams } from 'expo-router';
import {
  Dimensions,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LikeAndShare from '../../../components/divelog/like-share';
import InfoPopup from '../../../components/info-popup';
import PopulatedInfoPopupButton from '../../../components/populated-info-popup';
import Profile from '../../../components/profile';
import { PROFILE_PHOTO } from '../../../consts/profile';
import { useDiveLog } from '../../../hooks/divelog';
import useLike from '../../../hooks/like';
import React, { useState, useCallback } from 'react';
import ImageCarousel from '../../../components/divelog/carousel';
import Caption from '../../../components/divelog/caption';
import DiveLogSkeleton from './components/skeleton';

const DiveLog = () => {
  const { id: diveLogId } = useLocalSearchParams<{ id: string }>();
  const { width, height } = Dimensions.get('window');
  const [contentHeight, setContentHeight] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  const { data, isLoading, error } = useDiveLog(diveLogId);
  const { isLiking, handleLikeToggle } = useLike(diveLogId);

  const navigateUserProfile = () => router.push(`/user/${data?.user._id}`);

  const onContentSizeChange = useCallback(
    (_: any, h: number) => {
      setContentHeight(h);
      setScrollEnabled(h > containerHeight);
    },
    [containerHeight],
  );

  const onLayout = useCallback(
    (event: any) => {
      const { height } = event.nativeEvent.layout;
      setContainerHeight(height);
      setScrollEnabled(contentHeight > height);
    },
    [contentHeight],
  );

  const renderTag = (item: any) => {
    return (
      <PopulatedInfoPopupButton
        key={`${item._id}`}
        speciesId={item.scientificName}
      >
        <TouchableOpacity className="p-2 rounded-full border border-1">
          <Text>{item.commonNames[0]}</Text>
        </TouchableOpacity>
      </PopulatedInfoPopupButton>
    );
  };

  const [lastTap, setLastTap] = React.useState(0);

  const handleDoubleTap = () => {
    const currentTime = Date.now();
    const timeDifference = currentTime - lastTap;

    if (timeDifference < 300 && !isLiking) {
      handleLikeToggle();
    }
    setLastTap(currentTime);
  };

  if (isLoading) {
    return (
      <SafeAreaView>
        <DiveLogSkeleton />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex justify-center items-center">
        <Text className="text-xs text-slate-500">
          Error loading dive log. Please try again later.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <Pressable onPress={handleDoubleTap}>
      <View onLayout={onLayout} style={{ height }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          scrollEnabled={scrollEnabled}
          onContentSizeChange={onContentSizeChange}
          className="flex"
        >
          <SafeAreaView style={{ gap: 12 }} className="justify-center mx-[8%]">
            <View style={{ gap: 12 }} className="w-full flex-row items-center">
              <Pressable
                style={{ gap: 12 }}
                className="flex-row items-center"
                onPress={navigateUserProfile}
              >
                <Profile
                  size="md"
                  image={data?.user.profilePicture || PROFILE_PHOTO}
                />
                <View className="flex flex-col items-start">
                  <Text className="font-bold text-md">
                    {data?.user.username}
                  </Text>
                  <Text className="text-gray-700">Western Reefs</Text>
                </View>
              </Pressable>
            </View>

            <ImageCarousel data={data?.photos} width={width * 0.95} />

            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 8,
              }}
            >
              {data?.speciesTags?.map((item: any) => renderTag(item))}
            </View>

            <LikeAndShare diveLogId={diveLogId} />

            <Caption
              onPress={navigateUserProfile}
              description={data.description}
              username={data?.user.username}
            />
          </SafeAreaView>
        </ScrollView>
      </View>
      <InfoPopup />
    </Pressable>
  );
};

export default DiveLog;
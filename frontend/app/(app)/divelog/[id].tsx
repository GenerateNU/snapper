import { useLocalSearchParams } from 'expo-router';
import { Dimensions, SafeAreaView, ScrollView, Text, View } from 'react-native';
import InfoPopup from '../../../components/info-popup';
import { useDiveLog } from '../../../hooks/divelog';
import React, { useState, useCallback } from 'react';
import DiveLogSkeleton from './components/skeleton';
import BigDiveLog from '../../../components/divelog/divelog';
import { PROFILE_PHOTO } from '../../../consts/profile';

const DiveLog = () => {
  const { id: diveLogId } = useLocalSearchParams<{ id: string }>();
  const { height } = Dimensions.get('window');
  const [contentHeight, setContentHeight] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  const { data, isLoading, error } = useDiveLog(diveLogId);

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

  if (isLoading) {
    return (
      <SafeAreaView className="mx-[8%]">
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
    <View className="bg-white">
      <SafeAreaView className="mx-[6%]" onLayout={onLayout} style={{ height }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          scrollEnabled={scrollEnabled}
          onContentSizeChange={onContentSizeChange}
          className="flex"
        >
          <BigDiveLog
            date={data?.date}
            id={diveLogId}
            profilePicture={data?.user.profilePicture || PROFILE_PHOTO}
            photos={data?.photos}
            description={data?.description}
            username={data?.user.username}
            userId={data?.user._id}
            speciesTags={data?.speciesTags}
          />
        </ScrollView>
      </SafeAreaView>
      <InfoPopup />
    </View>
  );
};

export default DiveLog;

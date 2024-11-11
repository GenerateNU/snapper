import { useState, useEffect } from 'react';
import { SafeAreaView, SectionList, FlatList, Text, View } from 'react-native';
import { useAuthStore } from '../../../auth/authStore';
import { categorizeTime } from '../../../utils/profile';
import { useUserNotification } from '../../../hooks/user';
import { useFocusEffect } from 'expo-router';
import React from 'react';
import NotificationSkeleton from '../../../components/notification/skeleton';
import NotificationEntry from '../../../components/notification/notification';
import Divider from '../../../components/divider';

const Notification = () => {
  const { supabaseId } = useAuthStore();
  const [sections, setSections] = useState<{ title: string; data: any[] }[]>(
    [],
  );

  const {
    data,
    isLoading,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useUserNotification(supabaseId || '');

  const groupNotificationsAndSetSections = (pages: any) => {
    if (!pages) return;

    const allNotifications = pages.pages.flat();

    const groupedNotifications = allNotifications.reduce(
      (acc: any, item: any) => {
        const timeCategory = categorizeTime(item.time);
        if (!acc[timeCategory]) {
          acc[timeCategory] = [];
        }
        acc[timeCategory].push(item);
        return acc;
      },
      {},
    );

    const sectionsData = Object.keys(groupedNotifications).map((key) => ({
      title: key,
      data: groupedNotifications[key],
    }));

    setSections(sectionsData);
  };

  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch]),
  );

  useEffect(() => {
    groupNotificationsAndSetSections(data);
  }, [data]);

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View className="py-4">
        <NotificationSkeleton />
      </View>
    );
  };

  const renderNotification = ({ item }: { item: any }) => {
    return (
      <NotificationEntry
        username={item.actor.username}
        message={item.message}
        actorId={item.actor.supabaseId}
        targetId={item.target._id}
        type={item.type}
        postImage={item.target.photos ? item.target.photos[0] : ''}
        time={item.time}
        profilePicture={item.actor.profilePicture}
      />
    );
  };

  const renderSectionHeader = ({ section: { title, index } }: any) => (
    <View>
      {index > 0 && (
        <View className="mb-4">
          <Divider />
        </View>
      )}
      <Text className="text-xl pb-[2%]">{title}</Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 mt-[10%] justify-start mx-[8%]">
      {isLoading ? (
        <FlatList
          data={[1, 2, 3, 4, 5]}
          renderItem={() => <NotificationSkeleton />}
          keyExtractor={(item) => item.toString()}
        />
      ) : error ? (
        <Text className="text-gray-500 text-md">
          Error loading notifications. Please try again later.
        </Text>
      ) : (
        <SectionList
          showsVerticalScrollIndicator={false}
          sections={sections}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.9}
          stickySectionHeadersEnabled={false}
          renderItem={renderNotification}
          renderSectionHeader={renderSectionHeader}
          ListFooterComponent={renderFooter}
          ItemSeparatorComponent={() => <View className="h-5" />}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'flex-start',
            paddingBottom: 30,
          }}
          keyExtractor={(_, index) => index.toString()}
        />
      )}
    </SafeAreaView>
  );
};

export default Notification;

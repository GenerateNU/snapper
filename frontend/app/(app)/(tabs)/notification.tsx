import { useState, useEffect } from 'react';
import { SafeAreaView, SectionList, FlatList, Text, View } from 'react-native';
import NotificationEntry from '../../../components/notification/notification';
import { useUserNotifications } from '../../../hooks/user';
import { useAuthStore } from '../../../auth/authStore';
import { categorizeTime } from '../../../utils/profile';
import Divider from '../../../components/divider';
import NotificationSkeleton from '../../../components/notification/skeleton';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect
import React from 'react';

const Notification = () => {
  const { supabaseId } = useAuthStore();
  const [sections, setSections] = useState<{ title: string; data: any[] }[]>(
    [],
  );

  const { data, isLoading, error, refetch } = useUserNotifications(
    supabaseId || '',
  );

  const groupNotificationsAndSetSections = (data: any) => {
    if (Array.isArray(data)) {
      const groupedNotifications = data.reduce((acc: any, item: any) => {
        const timeCategory = categorizeTime(item.time);
        if (!acc[timeCategory]) {
          acc[timeCategory] = [];
        }
        acc[timeCategory].push(item);
        return acc;
      }, {});

      const sectionsData = Object.keys(groupedNotifications).map((key) => ({
        title: key,
        data: groupedNotifications[key],
      }));

      setSections(sectionsData);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      refetch();
      groupNotificationsAndSetSections(data);
    }, [data, refetch]),
  );

  useEffect(() => {
    groupNotificationsAndSetSections(data);
  }, [data]);

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
          sections={sections} // Use the state here
          stickySectionHeadersEnabled={false}
          renderItem={renderNotification}
          renderSectionHeader={renderSectionHeader}
          ItemSeparatorComponent={() => <View className="h-5"></View>}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'flex-start',
          }}
          keyExtractor={(_, index) => index.toString()}
        />
      )}
    </SafeAreaView>
  );
};

export default Notification;

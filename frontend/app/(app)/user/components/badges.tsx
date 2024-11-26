import { View, Text, FlatList } from 'react-native';
import Badge from '../../../../assets/badge.svg';
import { useUserById } from '../../../../hooks/user';
import BadgeSkeleton from './skeleton/badge-skeleton';

const Badges = ({ id }: { id: string }) => {
  const { data, isError, isLoading } = useUserById(id);
  const badges = data?.user.badges;

  if (isLoading) {
    return <BadgeSkeleton />;
  }

  if (isError) {
    return (
      <View className="flex flex-col w-full items-center">
        <Text className="text-red-500 text-sm sm:text-base md:text-lg">
          Failed to load badges.
        </Text>
      </View>
    );
  }

  if (!badges || badges.length === 0) {
    return null;
  }

  const renderItem = ({ item }: { item: any }) => (
    <View className="flex-col items-center ml-5">
      <Badge width={60} height={60} />
      <Text className="text-center text-xs sm:text-sm md:text-base line-break pt-[2%] font-bold">
        {item}
      </Text>
    </View>
  );

  return (
    <View>
      <Text className="font-bold text-base sm:text-lg md:text-xl pb-[2%] text-darkblue">
        Badges
      </Text>
      <View className="flex flex-row w-full">
        <View className="flex flex-row items-start w-full bg-water rounded-xl justify-between shadow-md p-[4%] flex-wrap">
          {badges.length <= 3 ? (
            badges.map((badge: string, key: number) => (
              <View
                className="flex flex-col items-center justify-center"
                key={key}
                style={{ flex: 1 }}
              >
                <Badge width={60} height={60} />
                <Text className="text-center text-xs sm:text-sm md:text-base line-break font-bold">
                  {badge}
                </Text>
              </View>
            ))
          ) : (
            <FlatList
              showsHorizontalScrollIndicator={false}
              horizontal
              data={badges}
              contentContainerStyle={{
                paddingLeft: 10,
                paddingRight: 20,
              }}
              renderItem={renderItem}
              keyExtractor={(item, index) => `badge-${index}`}
            />
          )}
        </View>
      </View>
    </View>
  );
};

export default Badges;

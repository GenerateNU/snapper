import { View, Text } from 'react-native';
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
        <Text className="text-red-500 text-sm sm:text-base md:text-lg">Failed to load badges.</Text>
      </View>
    );
  }

  if (!badges || badges.length === 0) {
    return null;
  }

  return (
    <View className="flex flex-col w-full">
      <Text className="font-bold text-base sm:text-lg md:text-xl pb-[2%] text-darkblue">Badges</Text>
      <View className="flex flex-row items-start w-full bg-water rounded-xl justify-between p-[5%] shadow-md flex-wrap">
        {badges.map((badge: any, key: number) => (
          <View
            className="flex flex-col items-center justify-center"
            key={key}
            style={{ flex: 1 }}
          >
            <Badge width={60} height={60} />
            <Text className="text-center text-xs sm:text-sm md:text-base line-break pt-[2%] font-bold">
              {badge}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default Badges;

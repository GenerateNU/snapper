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
        <Text className="text-red-500">Failed to load badges.</Text>
      </View>
    );
  }

  if (!badges || badges.length === 0) {
    return;
  }

  return (
    <View className="flex flex-col w-full">
      <Text className="font-bold text-lg pb-[2%] text-darkblue">Badges</Text>
      <View className="flex flex-row w-full bg-water rounded-xl justify-between p-[5%] shadow-md flex-wrap">
        {badges.map((badge: any, key: number) => (
          <View
            className="flex flex-col items-center justify-center"
            key={key}
            style={{ flex: 1 }}
          >
            <Badge width={60} height={60} />
            <Text className="line-break pt-[2%] font-bold">{badge}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default Badges;

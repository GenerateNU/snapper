import { View, Text, Image } from 'react-native';
import Badge from '../../../../assets/badge.svg';
import { useLocalSearchParams } from 'expo-router';
import { useUserBadges } from '../../../../hooks/user';

const Badges = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isError, isLoading } = useUserBadges();

  return (
    <View className="flex flex-col w-full">
      <Text className="font-bold text-lg pb-[2%] text-darkblue">Badges</Text>
      <View className="flex flex-row w-full bg-water rounded-xl justify-around p-[5%] shadow-md">
        {data?.map((badge: any, key: number) => (
          <View className="flex flex-col items-center justify-center" key={key}>
            <Badge width={60} height={60} />
            <Text className="line-break pt-[2%] font-bold">{badge}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default Badges;

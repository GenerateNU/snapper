import { View, Text, Image } from 'react-native';

interface BadgeProps {
  badges: string[];
}

const Badges: React.FC<BadgeProps> = ({ badges }) => {
  return (
    <View className="flex flex-col w-full">
      <Text className="font-bold text-lg pb-[2%]">Badges</Text>
      <View className="flex flex-row w-full bg-water rounded-xl justify-around p-[5%] shadow-md">
        {badges.map((badge, key) => (
          <View className="flex flex-col items-center justify-center" key={key}>
            <View className="w-16 h-16 rounded-full bg-black"></View>
            <Text className="line-break pt-[2%] font-bold">{badge}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default Badges;

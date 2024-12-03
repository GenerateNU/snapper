import { View, Text, FlatList } from 'react-native';
import { useUserById } from '../../../../hooks/user';
import BadgeSkeleton from './skeleton/badge-skeleton';
import DefaultBage from '../../../../assets/BadgeIcons/badge.svg';
import FishCaught100 from '../../../../assets/BadgeIcons/100-fishes-badge.svg';
import OceanExplorer from '../../../../assets/BadgeIcons/ocean-explorer-badge.svg';
import RareFishCaught from '../../../../assets/BadgeIcons/rare-fishes-badge.svg';
import FirstCatch from '../../../../assets/BadgeIcons/first-catch-badge.svg';
import ReefGuardian from '../../../../assets/BadgeIcons/reef-gaurdian-badge.svg';

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
      <RenderBagdeImage name={item} width={60} height={60} />
      <Text className="text-center text-xs sm:text-sm md:text-base line-break pt-[2%] font-bold">
        {item}
      </Text>
    </View>
  );

  type RenderBadge = {
    name: string;
    width: number;
    height: number;
  };

  const RenderBagdeImage = ({ name, width, height }: RenderBadge) => {
    switch (name) {
      case '100 Dives Logged':
        return <FishCaught100 width={width} height={height} />;
      case 'Rare Fish Find':
        return <RareFishCaught width={width} height={height} />;
      case 'Ocean Explorer':
        return <OceanExplorer width={width} height={height} />;
      case 'Reef Guardian':
        return <ReefGuardian width={width} height={height} />;
      case 'First Catch':
        return <FirstCatch width={width} height={height} />;
      default:
        return <DefaultBage width={width} height={height} />;
    }
  };

  return (
    <View>
      <Text className="font-bold text-base sm:text-lg md:text-xl pb-[2%] text-darkblue">
        Badges
      </Text>
      <View className="flex flex-row w-full">
        <View className="flex flex-row items-start w-full bg-water rounded-xl justify-between shadow-md py-[4%] flex-wrap">
          {badges.length <= 3 ? (
            badges.map((badge: string, key: number) => (
              <View
                className="flex flex-col items-center justify-center"
                key={key}
                style={{ flex: 1 }}
              >
                <RenderBagdeImage name={badge} width={60} height={60} />
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
                paddingLeft: 0,
                paddingRight: 20,
                paddingBottom: 5,
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

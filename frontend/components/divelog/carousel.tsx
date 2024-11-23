import { useState } from 'react';
import { View, Text, Image } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';

interface CarouselProps {
  data: string[];
  width: number;
}

const ImageCarousel: React.FC<CarouselProps> = ({ data, width }) => {
  const [page, setPage] = useState<number>(0);
  const scrollOffsetValue = useSharedValue<number>(0);
  const carouselWidth = width * 0.9;

  const renderItem = ({ item }: { item: string }) => (
    <View>
      <Image
        className="rounded-lg w-full"
        style={{ aspectRatio: 1 }}
        source={{
          uri: item,
        }}
      />
    </View>
  );

  if (data.length === 0) {
    return;
  }

  return (
    <View style={{ height: carouselWidth }}>
      {data.length !== 1 && (
        <View className="rounded-full absolute z-10 top-5 right-5 px-3 py-2 bg-gray-500 opacity-90">
          <Text className="text-white text-xs">{`${page + 1} / ${data.length}`}</Text>
        </View>
      )}
      <Carousel
        loop={false}
        overscrollEnabled={false}
        height={carouselWidth}
        width={carouselWidth}
        snapEnabled={true}
        enabled={data.length !== 1}
        defaultIndex={0}
        style={{ position: 'relative' }}
        onScrollEnd={() => null}
        onProgressChange={(_, index) => setPage(Math.ceil(index))}
        data={data}
        defaultScrollOffsetValue={scrollOffsetValue}
        onSnapToItem={(index) => setPage(index)}
        renderItem={renderItem}
      />
    </View>
  );
};

export default ImageCarousel;
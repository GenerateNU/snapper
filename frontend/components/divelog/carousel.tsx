import { useState } from 'react';
import { View, Text, Image, LayoutChangeEvent } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';

interface CarouselProps {
  data: string[];
}

const ImageCarousel: React.FC<CarouselProps> = ({ data }) => {
  const [page, setPage] = useState<number>(0);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const scrollOffsetValue = useSharedValue<number>(0);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
  };

  const renderItem = ({ item }: { item: string }) => (
    <View style={{ width: '100%' }}>
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
    return null;
  }

  return (
    <View onLayout={handleLayout} className="w-full">
      {containerWidth > 0 && (
        <>
          {data.length !== 1 && (
            <View className="rounded-full absolute z-10 top-5 right-5 px-3 py-2 bg-gray-500 opacity-90">
              <Text className="text-white text-xs">{`${page + 1} / ${data.length}`}</Text>
            </View>
          )}

          <Carousel
            loop={false}
            overscrollEnabled={false}
            height={containerWidth}
            width={containerWidth}
            snapEnabled={true}
            enabled={data.length !== 1}
            defaultIndex={0}
            style={{ position: 'relative', borderRadius: 10 }}
            onProgressChange={(_, index) => setPage(Math.round(index))}
            data={data}
            defaultScrollOffsetValue={scrollOffsetValue}
            renderItem={renderItem}
          />
        </>
      )}
    </View>
  );
};

export default ImageCarousel;

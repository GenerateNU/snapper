import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { fetchData } from '../../../api/base';
import { useState } from 'react';
import SearchResult from '../../../components/search-result';
import InfoPopup from '../../../components/info-popup';
import HomeMenu from '../../../components/home/menu-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import Map from '../../../components/map';
import SearchIcon from '../../../assets/search.svg';
import { MasonryFlashList } from '@shopify/flash-list';

type Toggle = 'Fish' | 'Users' | 'Posts';
type Category = 'Map' | 'Search';

export default function Explore() {
  const options: Toggle[] = ['Users', 'Fish', 'Posts'];
  const categories: Category[] = ['Map', 'Search'];
  const [search, setSearch] = useState('');
  const [toggle, setToggle] = useState<Toggle>(options[0]);
  const [selected, setSelected] = useState<Toggle>(options[0]);
  const [selectedCategory, setSelectedCategory] = useState<Category>(
    categories[0],
  );
  const [coordinate, setCoordinate] = useState<number[]>([200, 200]);
  const [mapSearch, setMapSearch] = useState('');

  const changeMapText = () => {
    const delimeter = ' ';
    const strings = mapSearch.split(delimeter);
    const coordinates = strings.map((s) => parseFloat(s));
    setCoordinate(coordinates);
  };

  /**
   * Depending on what data comes from the endpoint, it could be formatted differently.
   * This method ensures that no matter what data comes through, it will be an array.
   * @param data
   * @returns an Array of the data
   */
  const matchOnData = (data: any): any[] => {
    if (!data) {
      return [];
    } else if (Array.isArray(data)) {
      return data as any[];
    } else if (Array.isArray(data.results)) {
      return data.results as any[];
    } else if (Array.isArray(data.moreResults)) {
      return data.moreResults as any[];
    } else {
      throw new Error('Malformed Data');
    }
  };

  //These should be hooks but oh well.

  /**
   * On Query, will pattern match against the toggle options which will
   * trigger different endpoints
   * @returns the corresponding data from the endpoint
   */
  const onQueryFunction = async () => {
    if (!search) return null;
    let endpoint;
    switch (toggle) {
      case 'Fish':
        endpoint = `/species/paginated?text=${search}`;
        break;
      case 'Posts':
        endpoint = `/divelogs/search?text=${search}`;
        break;
      default:
        endpoint = `/users?text=${search}`;
    }
    const res = await fetchData(endpoint, 'Failed to fetch data');
    return res;
  };

  const { isPending, error, data } = useQuery({
    queryKey: ['search', search, toggle],
    queryFn: () => onQueryFunction(),
    enabled: search.length > 0,
  });

  const values = matchOnData(data);

  /**
   * Renders the buttons that are toggleable and switches against the particular selection
   * based off which button is pressed.
   * @returns A button component
   */
  const ToggleButtons = () => {
    const onSelected = (selection: Toggle) => {
      setToggle(selection);
      setSelected(selection);
      setSearch('');
    };
    return (
      <View className="w-full flex justify-between flex-row w-full">
        {options.map((option, key) => (
          <TouchableOpacity
            key={key}
            onPress={() => onSelected(option)}
            className="flex items-center"
          >
            <Text
              className={`text-xl ${selected === option ? 'underline' : ''}`}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  if (error) {
    return (
      <View className="h-screen w-screen">
        <Text>Error occurred {error.message}</Text>
      </View>
    );
  }

  const renderSearchResults = () => {
    if (isPending && search.length > 0) {
      return (
        <View className="flex-1 justify-center items-center mb-48">
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }

    if (toggle === 'Users' || toggle === 'Fish') {
      return (
        <ScrollView className="w-96">
          {values.map((d: any) => (
            <View className="mb-4" key={d._id}>
              <SearchResult {...d} />
            </View>
          ))}
        </ScrollView>
      );
    }

    return (
      <ScrollView className="h-[100%]" showsVerticalScrollIndicator={false}>
        <MasonryFlashList
          data={values}
          numColumns={2}
          renderItem={(e) => SearchResult(e.item)}
          estimatedItemSize={200}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 100,
          }}
        />
      </ScrollView>
    );
  };

  const renderSearchPage = () => {
    return (
      <View className="w-full h-full">
        <View className="mb-2">{renderCustomInput(setSearch, search)}</View>
        <View className="mb-2">
          <ToggleButtons />
        </View>
        {renderSearchResults()}
      </View>
    );
  };

  const renderCustomInput = (
    changeText: (s: string) => any,
    search: string,
    onSubmit?: () => void,
    placeholder?: string,
  ) => {
    return (
      <View
        className="flex-row items-center bg-[#FFFFFF] rounded-full h-12 px-[5%] shadow-lg"
        style={{
          elevation: 4,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
        }}
      >
        <SearchIcon width={20} height={20} className="text-gray-400" />
        <TextInput
          className="flex-1 h-full py-[3%] ml-2"
          onChangeText={changeText}
          value={search}
          placeholder={placeholder ? placeholder : ''}
          onSubmitEditing={onSubmit}
        />
      </View>
    );
  };

  const renderMapPage = () => {
    return (
      <View className="absolute inset-0 z-0 w-screen h-screen">
        <Map coordinate={coordinate} setCoordinate={setCoordinate} />
      </View>
    );
  };

  return (
    <SafeAreaView className="h-screen w-screen bg-white">
      {selectedCategory === 'Map' && renderMapPage()}
      <View className="w-full px-[5%] z-10">
        <View className="mb-2 bg-[#FFFFFF] rounded-full">
          <HomeMenu
            categories={categories}
            selected={selectedCategory}
            setSelected={(s) => {
              setMapSearch('');
              setSearch('');
              setToggle(options[0]);
              setSelected(options[0]);
              data;
              setSelectedCategory(s);
            }}
          />
        </View>
        {selectedCategory === 'Map' &&
          renderCustomInput(
            setMapSearch,
            mapSearch,
            changeMapText,
            'Enter a coordinate i.e. "20 20"',
          )}
        {selectedCategory === 'Search' && renderSearchPage()}
        <InfoPopup />
      </View>
    </SafeAreaView>
  );
}

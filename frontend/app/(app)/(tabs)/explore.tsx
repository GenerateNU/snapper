import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import Input from '../../../components/input';
import { useQuery } from '@tanstack/react-query';
import { fetchData } from '../../../api/base';
import { useState } from 'react';
import SearchResult from '../../../components/search-result';
import InfoPopup from '../../../components/info-popup';

type Toggle = 'Fish' | 'Users' | 'Posts';

export default function Explore() {
  const options: Toggle[] = ['Users', 'Fish', 'Posts'];
  const [search, setSearch] = useState('');
  const [toggle, setToggle] = useState<Toggle>(options[0]);
  const [selected, setSelected] = useState<Toggle>(options[0]);

  const changeText = (input: string) => {
    setSearch(input);
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
    } else {
      throw new Error('Malformed Data');
    }
  };

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
        endpoint = `/species/search/${search}`;
        break;
      default:
        endpoint = `/users?text=${search}`;
    }
    const res = await fetchData(endpoint, 'Failed to fetch users');
    return res;
  };

  const { isPending, error, data } = useQuery({
    queryKey: ['search', search],
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
      <View className="w-full flex justify-between flex-row w-96">
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

  return (
    <View className="h-screen w-screen flex items-center">
      <View className="w-96 pt-20 pb-4">
        <Input border="black" onChangeText={changeText} value={search} />
        <ToggleButtons />
      </View>
      {isPending ? (
        <Text> Nothing to see here... </Text>
      ) : (
        values.length > 0 && (
          <ScrollView className="w-96">
            {values.map((d: any) => (
              <View className="mb-4" key={d._id}>
                <SearchResult {...d} />
              </View>
            ))}
          </ScrollView>
        )
      )}
      <InfoPopup />
    </View>
  );
}

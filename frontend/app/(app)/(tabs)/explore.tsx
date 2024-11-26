import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import Input from '../../../components/input';
import { useQuery } from '@tanstack/react-query';
import { fetchData } from '../../../api/base';
import { useState } from 'react';
import SearchResult from '../../../components/search-result';

type Toggle = "Fish" | "Users" | "Posts"

export default function Explore() {
  const options : Toggle[] = ["Users", "Fish", "Posts"]
  const [search, setSearch] = useState("");
  const [toggle, setToggle] = useState<Toggle>(options[0]);
  const [selected, setSelected] = useState<Toggle>(options[0]);

  const changeText = (input: string) => {
    setSearch(input);
  }

  const matchOnData = (data: any): any[] => {
    if (!data) {
      return [];
    } else if (Array.isArray(data)) {
      return data as any[];
    } else if (Array.isArray(data.results)) {
      return data.results as any[];
    } else {
      throw new Error("Malformed Data")
    }
  }

  const onQueryFunction = async () => {
    if (!search) return null;
    let endpoint;
    switch (toggle) {
      case 'Fish': endpoint = `/species/search/${search}`; break;
      default: endpoint = `/users?text=${search}`;
    }
    const res = await fetchData(
      endpoint,
      'Failed to fetch users',
    );
    return res;
  }

  const { isPending, error, data } = useQuery({
    queryKey: ["search", search],
    queryFn: () => onQueryFunction(),
    enabled: search.length > 0
  });

  if (error) {
    return (
      <View className='h-screen w-screen'>
        <Text>
          Error occurred {error.message}
        </Text>
      </View>
    )
  }

  const values = matchOnData(data);

  const ToggleButtons = () => {
    const onSelected = (selection : Toggle) => {
      setToggle(selection)
      setSelected(selection)
    }
    return (
      <View className="w-full flex justify-between flex-row w-96">
        {options.map((option, key) => (
          <TouchableOpacity
            key={key}
            onPress={() => onSelected(option)}
            className="flex items-center"
          >
            <Text
              className={`text-xl ${
                selected === option ? "underline" : ""
              }`}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };
  

  return (
    <View className="h-screen w-screen flex items-center">
      <View className='w-96 pt-20 pb-4'>
        <Input border='black' onChangeText={changeText}></Input>
      </View>
      <ToggleButtons />
      {!isPending && (values.length > 0) &&
        <ScrollView className="w-96">
          {values.map((d: any) =>
            <View className='mb-4' key={d._id}>
              <SearchResult {...d} />
            </View>)}
        </ScrollView>
      }
    </View>
  );
};


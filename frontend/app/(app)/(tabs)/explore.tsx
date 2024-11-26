import { View, Text, ScrollView } from 'react-native';
import Input from '../../../components/input';
import { useQuery } from '@tanstack/react-query';
import { fetchData } from '../../../api/base';
import { useState } from 'react';
import SearchResult from '../../../components/search-result';

type Toggle = "fish" | "users" | "divelogs"

export default function Explore() {

  const [search, setSearch] = useState("");
  const [toggle, setToggle] = useState<Toggle>("fish");

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
      case 'fish': endpoint = `/species/search/${search}`; break;
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

  return (
    <View className="h-screen w-screen flex items-center">
      <View className='w-96 pt-20 pb-4'>
        <Input border='black' onChangeText={changeText}></Input>
      </View>
      {!isPending && (values.length > 0) &&
        <ScrollView className="w-96">
          {data.map((d: any) =>
            <View className='mb-4' key={d._id}>
              <SearchResult {...d} />
            </View>)}
        </ScrollView>
      }
    </View>
  );
};


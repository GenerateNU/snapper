import { View, Text, ScrollView } from 'react-native';
import Input from '../../../components/input';
import { useQuery } from '@tanstack/react-query';
import { fetchData } from '../../../api/base';
import { useState } from 'react';
import SearchResult from '../../../components/search-result';

export default function Explore() {

  const [search, setSearch] = useState("");

  const changeText = (input: string) => {
    setSearch(input);
  }

  const onQueryFunction = async () => {
    if (!search) return null;
    const endpoint = `/users?text=${search}`;
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

  return (
    <View className="h-screen w-screen flex items-center">
      <View className='w-96 pt-20 pb-4'>
        <Input border='black' onChangeText={changeText}></Input>
      </View>
      {!isPending && data && data.results.length > 0 &&
        <ScrollView className="w-96">
          {data.results.map((d: any) => 
          <View className='mb-4' key={d.supabaseId}>
            <SearchResult {...d}  />
          </View>)}
        </ScrollView>
      }
    </View>
  );
};


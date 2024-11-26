import { FlatList, Text, TouchableOpacity } from 'react-native';
import { Filter, FILTERS } from '../../consts/home-menu';

interface FilterProps {
  selected: Filter[];
  setSelected: (selected: Filter[]) => void;
}

const FilterMenu: React.FC<FilterProps> = ({ selected, setSelected }) => {
  const isSelected = (item: Filter) => {
    return selected.includes(item);
  };

  const updateSelectedFilters = (touchedFilter: Filter) => {
    let selectedFilters: Filter[];

    if (touchedFilter === Filter.ALL) {
      selectedFilters = [Filter.ALL];
    } else {
      selectedFilters = isSelected(touchedFilter)
        ? selected.filter((filter: Filter) => filter !== touchedFilter)
        : [
            ...selected.filter((filter: Filter) => filter !== Filter.ALL),
            touchedFilter,
          ];
    }

    if (selectedFilters.length === 0) {
      selectedFilters = [Filter.ALL];
    }

    setSelected(selectedFilters);
  };

  const renderFilter = ({ item }: { item: Filter }) => (
    <TouchableOpacity
      onPress={() => updateSelectedFilters(item)}
      className={`py-2 px-4 mr-2 rounded-full ${isSelected(item) ? 'bg-deep' : 'border-[1px] border-gray-300'}`}
    >
      <Text className={`${isSelected(item) ? 'text-white' : 'text-gray-500'}`}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={FILTERS}
      contentContainerStyle={{
        paddingLeft: 20,
        paddingRight: 10
      }}
      renderItem={renderFilter}
    />
  );
};

export default FilterMenu;

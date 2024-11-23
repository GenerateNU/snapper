import { View, FlatList, Text, TouchableOpacity } from "react-native";
import { Filter } from "../../consts/home-menu";

interface FilterProps {
    selected: Filter;
    setSelected: (selected: Filter) => void;
}

const FilterMenu: React.FC<FilterProps> = ({selected, setSelected}) => {
    const renderFilter = ({item}: {item: Filter}) => (
        <TouchableOpacity className={`p-2 rounded-full ${selected === item ? "" : ""}`}>
            <Text className={``}>{item}</Text>
        </TouchableOpacity>
    );

    return (
        <FlatList 
            horizontal
            showsHorizontalScrollIndicator={false}
            data={[Filter.ALL, Filter.CLAM, Filter.FISH, Filter.REEF, Filter.SHARK]}
            renderItem={renderFilter}
        />
    );
};

export default FilterMenu;
import { View, Text, TouchableOpacity } from 'react-native';
import { Category } from '../../consts/home-menu';

interface HomeMenuProps {
  selected: Category;
  setSelected: (category: Category) => void;
}

const HomeMenu: React.FC<HomeMenuProps> = ({ selected, setSelected }) => {
  const MenuTab = ({
    selected,
    text,
  }: {
    selected: boolean;
    text: Category;
  }) => {
    return (
      <TouchableOpacity
        onPress={() => setSelected(text)}
        activeOpacity={0.5}
        className={`py-3 w-[50%] items-center ${
          selected ? 'bg-deep rounded-full' : ''
        }`}
      >
        <Text className={`${selected ? 'text-white' : 'text-gray-500'}`}>
          {text}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View className="w-full flex-row justify-around items-center border-[1px] border-slate-300 shadow-sm rounded-full">
      <MenuTab
        selected={selected === Category.FOLLOWING}
        text={Category.FOLLOWING}
      />
      <MenuTab selected={selected === Category.NEARBY} text={Category.NEARBY} />
    </View>
  );
};

export default HomeMenu;

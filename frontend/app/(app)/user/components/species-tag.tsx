import { TouchableOpacity, Text } from 'react-native';

interface SpeciesTagProps {
  text?: string;
  onPress?: () => void;
}

const SpeciesTag: React.FC<SpeciesTagProps> = ({ text, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="rounded-md bg-slate-200 p-[3%]"
    >
      <Text>{text}</Text>
    </TouchableOpacity>
  );
};

export default SpeciesTag;

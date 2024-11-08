import { Text, TouchableOpacity } from 'react-native';
import Fish from '../../../../assets/species.svg';

interface SpeciesProps {
  text?: string;
  onPress?: () => void;
  image?: string;
}

const Species: React.FC<SpeciesProps> = ({ image, text, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-water mb-3 rounded-md flex flex-col w-[32%] justify-center items-center pt-[2%] pb-[5%]"
    >
      <Fish height={100} width={100} />
      <Text className="pt-2 font-bold">{text}</Text>
    </TouchableOpacity>
  );
};

export default Species;

import { View, Text, TouchableOpacity } from 'react-native';
import Fish from "../../../../assets/species.svg";
interface SpeciesProps {
  id: string;
  name: string;
  image?: string;
  onPress?: () => void;
}

const Species: React.FC<SpeciesProps> = ({ id, name, image, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} className="bg-water mb-3 rounded-md flex flex-col w-[32%] justify-center items-center pt-[2%] pb-[5%]">
      <Fish height={100} width={100}/>
      <Text className="pt-2 font-bold">{name}</Text>
    </TouchableOpacity>
  );
};

export default Species;

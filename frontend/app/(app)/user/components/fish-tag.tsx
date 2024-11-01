import { TouchableOpacity, Text } from "react-native";

interface FishTagProps {
    id: string;
    name: string;
    onPress?: () => void;
}

const FishTag: React.FC<FishTagProps> = ({id, name, onPress}) => {
    return (
        <TouchableOpacity onPress={onPress} className="rounded-md bg-slate-200 p-[3%]">
            <Text>{name}</Text>
        </TouchableOpacity>
    )
}

export default FishTag;
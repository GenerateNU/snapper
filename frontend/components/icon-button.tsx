import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { TouchableOpacity } from "react-native";

interface IconProps {
    onPress?: () => void;
    size?: number;
    icon: IconDefinition;
}

const IconButton: React.FC<IconProps> = ({icon, onPress, size}) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <FontAwesomeIcon size={size ? size : 20} icon={icon} />
        </TouchableOpacity>
    )
}

export default IconButton;
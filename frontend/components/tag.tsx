import React from "react"
import { View, Text, Image} from "react-native"

interface TagProps{
    fish?: string
}
const Tag: React.FC<TagProps> = ({
    fish
}) => {
    return (
        <View className = "flex flex-row border rounded-[5px] border-[#7c8a9e] items-center justify-ceter py-1 px-2">
            <Text className = 'font-medium text-[#7c8a9e]'> {fish} </Text>
            <Image className = "h-2.5 w-2.5" source = {require('../assets/x.png')}/>
        </View>
    )
}

export default Tag
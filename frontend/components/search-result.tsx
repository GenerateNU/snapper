import { View, Text } from "react-native"
import Profile from "./profile"
import { PROFILE_PHOTO } from "../consts/profile"

type UserResult = {
    profilePhoto?: string
    email: string
    username: string
}

type FishResult = {
    iconUrl: string
    species: string
}

const email = "email";
const username = "username";
const iconUrl = "iconUrl";
const species = "species"

/**
 * Is that object of type UserResult?
 * @param obj 
 * @returns true if it is, else otherwise.
 */
function isUser(obj: unknown): obj is UserResult {
    if (!obj || typeof obj !== "object") {
        return false;
    }
    return Object.hasOwn(obj, email) && Object.hasOwn(obj, username);
}

/**
 * Is that object of type FishResult?
 * @param obj 
 * @returns true if it is, else otherwise.
 */
function isFish(obj: unknown): obj is FishResult {
    if (!obj || typeof obj !== "object") {
        return false;
    }
    return Object.hasOwn(obj, iconUrl) && Object.hasOwn(obj, species);
}

function renderUserResult(props: UserResult) {
    const uri = props.profilePhoto ? props.profilePhoto : PROFILE_PHOTO;
    return (<View className="flex flex-row items-center w-96">
        <Profile image={uri} size="md" />
        <View className="flex flex-col pl-2">
            <Text>
                {props.username}
            </Text>
            <Text>
                {props.email}
            </Text>
        </View>
    </View>)
}

export default function SearchResult(props: UserResult | FishResult) {
    if (isFish(props)) {
        return (
            <View>
                <Text className="text-bold w-full h-full">
                    Fish PlaceHolder.
                </Text>
            </View>
        )
    } else if (isUser(props)) {
        return renderUserResult(props);
    } else {
        throw new Error("Illegal Prop Type, input must be of type UserResult or FishResult.")
    }

}
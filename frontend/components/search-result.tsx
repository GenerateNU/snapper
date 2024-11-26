import { View, Text, TouchableOpacity } from "react-native"
import Profile from "./profile"
import { PROFILE_PHOTO } from "../consts/profile"
import { router } from 'expo-router';
import PopulatedInfoPopupButton from "./populated-info-popup";
import SpeciesTag from "../app/(app)/user/components/species-tag";

type UserResult = {
    profilePicture?: string
    email: string
    username: string
    _id: string
}

type FishResult = {
    iconUrl: string
    _id: string
    species: string
    scientificName : string
    commonNames : string[]
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
    const uri = props.profilePicture ? props.profilePicture : PROFILE_PHOTO;
    const _id = props._id;
    const onPress = () => {
        router.push(`/user/${_id}`)
    }
    return (
        <TouchableOpacity onPress={onPress} className="flex flex-row items-center w-96">
            <Profile image={uri} size="md" />
            <View className="flex flex-col pl-2">
                <Text>
                    {props.username}
                </Text>
                <Text>
                    {props.email}
                </Text>
            </View>
        </TouchableOpacity>
    )
}

function renderFishResult(props: FishResult) {
    const img = props.iconUrl;
    const name = props.scientificName ? props.scientificName : "Unknown Fish"
    const onPress = () => {
        return <PopulatedInfoPopupButton speciesId={props.scientificName} children={<SpeciesTag/>}/>
    }
    return (<TouchableOpacity onPress={onPress} className="flex flex-row items-center w-96">
        <Profile image={img} size="md" />
        <View className="flex flex-col pl-2">
            <Text>
                {name}
            </Text>
        </View>
    </TouchableOpacity>);
}

export default function SearchResult(props: UserResult | FishResult) {
    if (isFish(props)) {
       return renderFishResult(props);
    } else if (isUser(props)) {
        return renderUserResult(props);
    } else {
        throw new Error("Illegal Prop Type, input must be of type UserResult or FishResult.")
    }

}
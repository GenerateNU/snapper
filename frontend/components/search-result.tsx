import { View, Text, TouchableOpacity } from 'react-native';
import Profile from './profile';
import { PROFILE_PHOTO } from '../consts/profile';
import { router } from 'expo-router';
import PopulatedInfoPopupButton from './populated-info-popup';
import NearbyDiveLog from './home/nearby-divelog';

type UserResult = {
  profilePicture?: string;
  email: string;
  username: string;
  _id: string;
};

type FishResult = {
  iconUrl: string;
  _id: string;
  species: string;
  scientificName: string;
  commonNames: string[];
};

type PostResult = {
  _id: string;
  user: string;
  description: string;
  photos: string[];
  profilePhoto?: string;
};

const email = 'email';
const username = 'username';
const iconUrl = 'iconUrl';
const species = 'species';
const alphaId = 'aphiaId';
const user = 'user';

/**
 * Is that object of type UserResult?
 * @param obj
 * @returns true if it is, else otherwise.
 */
function isUser(obj: unknown): obj is UserResult {
  if (!obj || typeof obj !== 'object') {
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
  if (!obj || typeof obj !== 'object') {
    return false;
  }
  return (
    (Object.hasOwn(obj, iconUrl) && Object.hasOwn(obj, species)) ||
    Object.hasOwn(obj, alphaId)
  );
}

function isDiveLog(obj: unknown): obj is PostResult {
  if (!obj || typeof obj !== 'object') {
    return false;
  }
  return Object.hasOwn(obj, user);
}

function renderUserResult(props: UserResult) {
  const uri = props.profilePicture ? props.profilePicture : PROFILE_PHOTO;
  const _id = props._id;
  const onPress = () => {
    router.push(`/user/${_id}`);
  };
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex flex-row items-center w-96"
    >
      <Profile image={uri} size="md" />
      <View className="flex flex-col pl-2">
        <Text>{props.username}</Text>
        <Text>{props.email}</Text>
      </View>
    </TouchableOpacity>
  );
}

function renderFishResult(props: FishResult) {
  const img = props.iconUrl;
  const scientificName = props.scientificName
    ? props.scientificName
    : 'Unknown Scientific Name.';
  const commonName =
    props.commonNames.length > 0
      ? props.commonNames[0]
      : 'Unknown Common Name.';
  return (
    <PopulatedInfoPopupButton speciesId={props.scientificName}>
      <TouchableOpacity className="flex flex-row items-center w-96">
        <Profile image={img} size="md" />
        <View className="flex flex-col pl-2">
          <Text>
            {commonName}, {scientificName}
          </Text>
        </View>
      </TouchableOpacity>
    </PopulatedInfoPopupButton>
  );
}

function renderDiveLogResult(props: PostResult, index: number) {
  return (
    <View className={`mb-4 ${index % 2 === 0 ? 'mr-2' : 'ml-2'}`}>
      <NearbyDiveLog
        profilePhoto={props.profilePhoto || PROFILE_PHOTO}
        description={props.description}
        divelogId={props._id}
        coverPhoto={props?.photos[0]}
      />
    </View>
  );
}

export default function SearchResult(
  props: UserResult | FishResult | PostResult,
  index?: number,
) {
  if (isFish(props)) {
    return renderFishResult(props);
  } else if (isUser(props)) {
    return renderUserResult(props);
  } else if (isDiveLog(props)) {
    return renderDiveLogResult(props, index!);
  } else {
    return <Text> Unknown Search Result... </Text>;
  }
}

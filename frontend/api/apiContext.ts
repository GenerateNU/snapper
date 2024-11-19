import Constants from 'expo-constants';

// Check if hostUri is defined
if (!Constants.expoConfig?.hostUri && !Constants.expoConfig) {
  throw Error('Expo Config Not Loaded');
}
export const apiConfig =
  'http://' +
  `${Constants.expoConfig.hostUri?.split(':').shift() || 'localhost'}:3000`;

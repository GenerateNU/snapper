import * as Location from 'expo-location';

interface LocationPermissionProps {
    mongoDBId: string | null;
    isAuthenticated: boolean;
}

export const useLocationPermission = async ({ mongoDBId, isAuthenticated }: LocationPermissionProps) => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
    }
    
    let location = await Location.getCurrentPositionAsync({});
    console.log(location);
}
import { View, Text } from "react-native"
import Button from "../../components/button";
import { useAuthStore } from "../../auth/authStore";
import { router } from "expo-router";
import { useEffect } from "react";

const Home = () => {
    const { logout, loading, error: authError } = useAuthStore();

    const pressLogout = () => {
        logout();
        router.push('/(auth)');
    }

    return (
        <View className="flex-1 justify-center items-center">
            <Text className="text-3xl pb-[5%]">Home</Text>
            {authError && <Text className="text-red-500">Failed to logout. Please try again.</Text>}
            <Button onPress={pressLogout} textOnly text={loading ? "Logging out" : "Logout"} />
        </View>
    )
}

export default Home;
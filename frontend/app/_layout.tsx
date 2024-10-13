import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '../auth/authProvider';

const queryClient = new QueryClient();

const InitialLayout = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="(app)" />
      ) : (
        <Stack.Screen name="(auth)" />
      )}
    </Stack>
  );
};

const RootLayout = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <StatusBar />
        <InitialLayout />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default RootLayout;

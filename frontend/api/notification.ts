import { API_BASE_URL } from '../consts/onboarding';

export const sendExpoToken = async (
  token: string,
  userId: string,
): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/${userId}/expoToken`, {
      method: 'POST',
      body: JSON.stringify({ token }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to register token');
    }

    return {
      success: true,
      message: 'Token registered successfully',
    };
  } catch (error) {
    console.error('Error registering token:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

export const deleteExpoToken = async (
  token: string,
  userId: string,
): Promise<any> => {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const response = await fetch(`${API_BASE_URL}/user/${userId}/expoToken`, {
      method: 'DELETE',
      headers,
      body: JSON.stringify({
        token,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete token');
    }

    return {
      success: true,
      message: 'Token deleted successfully',
    };
  } catch (error) {
    console.error('Error deleting token:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

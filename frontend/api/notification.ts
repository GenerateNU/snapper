import { apiConfig } from './apiContext';

const API_BASE_URL = apiConfig;

export const manageExpoToken = async (
  token: string,
  userId: string,
): Promise<any> => {
  try {
    const requestBody = {
      token: token,
    };

    const response = await fetch(
      `${API_BASE_URL}/user/${userId}/expoDeviceToken`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error);
    }

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

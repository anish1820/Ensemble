import AsyncStorage from '@react-native-async-storage/async-storage';

// Key for storing the user ID in AsyncStorage
const USER_ID_KEY = '@IoTLights:userId';

/**
 * Save the user ID to AsyncStorage
 * @param {string} userId - The user ID to save
 * @returns {Promise<void>}
 */
export const saveUserId = async (userId) => {
  try {
    await AsyncStorage.setItem(USER_ID_KEY, userId);
  } catch (error) {
    console.error('Error saving user ID:', error);
    throw error;
  }
};

/**
 * Retrieve the user ID from AsyncStorage
 * @returns {Promise<string|null>} - The user ID or null if not found
 */
export const getUserId = async () => {
  try {
    return await AsyncStorage.getItem(USER_ID_KEY);
  } catch (error) {
    console.error('Error retrieving user ID:', error);
    return null;
  }
};

/**
 * Remove the user ID from AsyncStorage
 * @returns {Promise<void>}
 */
export const removeUserId = async () => {
  try {
    await AsyncStorage.removeItem(USER_ID_KEY);
  } catch (error) {
    console.error('Error removing user ID:', error);
    throw error;
  }
};

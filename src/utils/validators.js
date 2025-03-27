/**
 * Validate the user ID format
 * @param {string} userId - The user ID to validate
 * @returns {boolean} - Whether the user ID is valid
 */
export const validateUserId = (userId) => {
  // User ID should be non-empty and contain only alphanumeric characters
  if (!userId || userId.trim() === '') {
    return false;
  }
  
  // Check if userId contains only alphanumeric characters
  const alphanumericRegex = /^[a-zA-Z0-9]+$/;
  return alphanumericRegex.test(userId);
};

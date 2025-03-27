import { Amplify } from 'aws-amplify';

/**
 * Fetch personalized recommendations from AWS Personalize
 * @param {string} userId - The unique identifier for the user
 * @returns {Promise<Object>} - The recommendations response
 */
export const getRecommendations = async (userId) => {
  try {
    // Campaign ARN should be configured in your environment
    const campaignArn = process.env.PERSONALIZE_CAMPAIGN_ARN || 
      'arn:aws:personalize:us-east-1:123456789012:campaign/iot-lights-campaign';

    const params = {
      campaignArn,
      userId,
      numResults: 1
    };

    // Call AWS Personalize API
    const response = await Amplify.API.post('personalizeApi', '/recommendations', {
      body: params,
      headers: {
        'Content-Type': 'application/json',
      }
    });

    return response;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    throw error;
  }
};

/**
 * Format the item ID based on light settings
 * @param {number} brightness - The brightness level (0-100)
 * @param {number} cct - The color temperature (2700-6500K)
 * @param {number} dimmer - The dimmer rate (0-100)
 * @returns {string} - Formatted item ID
 */
export const formatItemId = (brightness, cct, dimmer) => {
  return `brightness:${brightness}|cct:${cct}|dimmer:${dimmer}`;
};

/**
 * Send user feedback to AWS Personalize Event Tracker
 * @param {string} userId - The user ID
 * @param {string} itemId - The formatted item ID representing the settings
 * @returns {Promise<Object>} - The response from the event tracker
 */
export const sendUserFeedback = async (userId, itemId) => {
  try {
    // Event Tracker ARN should be configured in your environment
    const eventTrackerArn = process.env.PERSONALIZE_EVENT_TRACKER_ARN || 
      'arn:aws:personalize:us-east-1:123456789012:event-tracker/iot-lights-event-tracker';

    const params = {
      trackingId: eventTrackerArn.split('/').pop(),
      userId,
      sessionId: `session-${Date.now()}`,
      eventList: [
        {
          eventType: 'SETTING_ADJUSTED',
          sentAt: Math.floor(Date.now() / 1000), // Unix timestamp in seconds
          itemId,
          properties: JSON.stringify({
            event: 'SETTING_ADJUSTED',
            source: 'mobile_app',
          }),
        },
      ],
    };

    // Call AWS Personalize Event Tracker API
    const response = await Amplify.API.post('personalizeApi', '/events', {
      body: params,
      headers: {
        'Content-Type': 'application/json',
      }
    });

    return response;
  } catch (error) {
    console.error('Error sending user feedback:', error);
    throw error;
  }
};

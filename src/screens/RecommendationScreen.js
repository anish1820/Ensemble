import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import LightSettingSlider from '../components/LightSettingSlider';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  getRecommendations, 
  sendUserFeedback,
  formatItemId 
} from '../services/personalize';

const RecommendationScreen = ({ navigation }) => {
  const { userId, logout } = useContext(AuthContext);
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  
  // Default settings
  const defaultSettings = {
    brightness: 50,
    cct: 3000,
    dimmer: 70,
  };
  
  // Recommended settings from AWS Personalize
  const [recommendedSettings, setRecommendedSettings] = useState(null);
  
  // Current settings (initialized with defaults, will be updated with recommendations)
  const [currentSettings, setCurrentSettings] = useState({...defaultSettings});
  
  // Track if user has made manual adjustments
  const [userAdjusted, setUserAdjusted] = useState(false);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Call AWS Personalize to get recommendations
      const recommendations = await getRecommendations(userId);
      
      if (recommendations && recommendations.itemList && recommendations.itemList.length > 0) {
        const recommendation = recommendations.itemList[0];
        
        // Parse the itemId format: "brightness:VALUE|cct:VALUE|dimmer:VALUE"
        const settingsParts = recommendation.itemId.split('|');
        const parsedSettings = {};
        
        settingsParts.forEach(part => {
          const [key, value] = part.split(':');
          parsedSettings[key] = parseInt(value);
        });
        
        setRecommendedSettings(parsedSettings);
        setCurrentSettings(parsedSettings);
      } else {
        // If no recommendations found, use defaults
        setRecommendedSettings(defaultSettings);
        setCurrentSettings(defaultSettings);
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError('Failed to fetch recommendations. Please try again.');
      
      // Fall back to default settings on error
      setRecommendedSettings(defaultSettings);
      setCurrentSettings(defaultSettings);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [userId]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchRecommendations();
  };

  const handleSettingChange = (setting, value) => {
    setCurrentSettings(prev => ({
      ...prev,
      [setting]: value,
    }));
    
    // Mark that user has made adjustments
    setUserAdjusted(true);
  };

  const handleApplySettings = async () => {
    try {
      setLoading(true);
      
      // Format the item ID for feedback event
      const itemId = formatItemId(
        currentSettings.brightness,
        currentSettings.cct,
        currentSettings.dimmer
      );
      
      // Send feedback to AWS Personalize
      await sendUserFeedback(userId, itemId);
      
      setUserAdjusted(false);
      Alert.alert('Success', 'Your preferences have been saved!');
    } catch (err) {
      console.error('Error applying settings:', err);
      Alert.alert('Error', 'Failed to save your preferences. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigation.replace('Login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner size="large" />
        <Text style={styles.loadingText}>Loading your personalized settings...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Personalized Light Settings</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity 
              style={styles.retryButton} 
              onPress={fetchRecommendations}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.userContainer}>
              <Text style={styles.welcomeText}>Welcome, User</Text>
              <Text style={styles.userId}>{userId}</Text>
            </View>
            
            <View style={styles.cardContainer}>
              <Text style={styles.sectionTitle}>Your Recommended Settings</Text>
              
              <LightSettingSlider
                title="Brightness"
                value={currentSettings.brightness}
                defaultValue={recommendedSettings?.brightness}
                minimumValue={0}
                maximumValue={100}
                step={1}
                format={value => `${value}%`}
                onValueChange={value => handleSettingChange('brightness', value)}
              />
              
              <LightSettingSlider
                title="Color Temperature (CCT)"
                value={currentSettings.cct}
                defaultValue={recommendedSettings?.cct}
                minimumValue={2700}
                maximumValue={6500}
                step={100}
                format={value => `${value}K`}
                onValueChange={value => handleSettingChange('cct', value)}
              />
              
              <LightSettingSlider
                title="Dimmer Rate"
                value={currentSettings.dimmer}
                defaultValue={recommendedSettings?.dimmer}
                minimumValue={0}
                maximumValue={100}
                step={1}
                format={value => `${value}%`}
                onValueChange={value => handleSettingChange('dimmer', value)}
              />
            </View>
            
            <TouchableOpacity
              style={[
                styles.applyButton,
                { opacity: userAdjusted ? 1 : 0.6 }
              ]}
              onPress={handleApplySettings}
              disabled={!userAdjusted}
            >
              <Text style={styles.applyButtonText}>
                {userAdjusted ? 'Apply Changes' : 'Using Recommended Settings'}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  logoutButton: {
    padding: 8,
  },
  logoutText: {
    color: '#3498db',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  userContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#2c3e50',
  },
  userId: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 4,
  },
  cardContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 16,
  },
  applyButton: {
    backgroundColor: '#27ae60',
    margin: 16,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    margin: 16,
    padding: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default RecommendationScreen;

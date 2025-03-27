import React from 'react';
import { StatusBar, SafeAreaView } from 'react-native';
import { Amplify } from 'aws-amplify';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';

// Initialize Amplify
Amplify.configure({
  Auth: {
    // We're using a simpler userId-based auth instead of full Cognito setup
    // for the scope of this prototype
    mandatorySignIn: false,
    region: 'us-east-1',
  },
  Analytics: {
    disabled: false,
    autoSessionRecord: true,
    AWSPinpoint: {
      region: 'us-east-1',
    }
  },
  API: {
    endpoints: [
      {
        name: 'personalizeApi',
        endpoint: 'https://personalize.us-east-1.amazonaws.com',
        region: 'us-east-1',
      },
    ]
  }
});

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <AuthProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaView>
  );
}

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/components/AuthProvider';

import { GestureHandlerRootView } from 'react-native-gesture-handler';

function App() {
  useEffect(() => {
      // Replaced expo-notifications usage with a lightweight native
      // AppState listener. If you plan to use push/local notifications
      // without Expo, consider a native library such as
      // @react-native-community/push-notification-ios or
      // react-native-push-notification.
      const subscription = AppState.addEventListener('change', (_nextState: AppStateStatus) => {
        // placeholder: handle app state changes if needed
        // tiny no-op to avoid unused-arg lint warnings
      });

      return () => {
        subscription.remove();
      };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}



export default App;

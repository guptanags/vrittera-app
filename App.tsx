/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import * as Notifications from 'expo-notifications';

function App() {
  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldShowBanner: true,
        shouldShowList: true,
        shouldSetBadge: false,
      }),
    });
  }, []);

  return <AppNavigator />;
}



export default App;

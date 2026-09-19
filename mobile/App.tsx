import React, { useEffect } from 'react';
import { Alert, PermissionsAndroid, Platform } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import messaging from '@react-native-firebase/messaging';
import AppNavigator from './src/navigation/AppNavigation';
import { store, persistor } from './src/store/store';
import { StatusBar } from 'react-native';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import API from './src/services/api';
import apis from './src/services/endpoint';
import { navigate } from './src/navigation/NavigationService';
import AppNavigation from './src/navigation/AppStack';
import { createMessageTable } from './src/storage/messageStorage';

const App = () => {
  useEffect(() => {
    const setupFCM = async () => {
      try {
        if (Platform.OS === 'android' && Platform.Version >= 33) {
          const result = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          );

          if (result !== PermissionsAndroid.RESULTS.GRANTED) {
            return;
          }
        }

        // const token = await messaging().getToken();
        // console.log('FCM Token:', token);
        // await API.post(apis.saveFCMToken, {
        //   fcmToken: token,
        // });
        // console.log('Fcm token save successfully');
      } catch (error) {
        console.log('FCM Error:', error);
      }
    };

    setupFCM();

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert(
        remoteMessage.notification?.title || 'Notification',
        remoteMessage.notification?.body || '',
      );
    });

    messaging().onNotificationOpenedApp(remoteMessage => {
      if (remoteMessage?.data?.screen === 'Chat') {
        console.log('cht screen open');
        navigate('MainTabs', {
          screen: 'Chat',
          params: {
            senderId: remoteMessage.data.senderId,
          },
        });
      }
      console.log('Background Tap:', remoteMessage);
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage?.data?.screen === 'Chat') {
          navigate('MainTabs', {
            screen: 'Chat',
            params: {
              senderId: remoteMessage.data.senderId,
            },
          });
        }
      });

    return unsubscribe;
  }, []);

  useEffect(() => {
    createMessageTable();
  }, []);
  return (
    <SafeAreaProvider>
      <View
        style={{
          height: StatusBar.currentHeight,
          backgroundColor: '#1976D2',
        }}
      />
      <StatusBar
        backgroundColor="#1976D2"
        barStyle="light-content"
        translucent={false}
      />

      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AppNavigator />
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
};

export default App;

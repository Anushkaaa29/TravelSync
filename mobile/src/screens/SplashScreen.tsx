import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Compass } from 'lucide-react-native';
import { useSelector } from 'react-redux';
import { connectSocket } from '../services/socket';
import API from '../services/api';
import apis from '../services/endpoint';
import messaging from '@react-native-firebase/messaging';

const SplashScreen = ({ navigation }: any) => {
  const auth = useSelector((state: any) => state.auth);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (auth?.token) {
        try {
          const fcmToken = await messaging().getToken();
          await API.post(apis.saveFCMToken, {
            fcmToken,
          });
          await connectSocket(auth.token);
        } catch (error) {
          console.log('Offline mode');
        }
        navigation.replace('MainTabs');
      } else {
        navigation.replace('Login');
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [auth]);
  return (
    <View style={styles.container}>
      <View style={styles.logoCircle}>
        <Compass size={18} color="#0D47C9" />
      </View>
      <Text style={styles.title}>TravelApp</Text>
      <Text style={styles.subtitle}>
        Your app to the world's most{'\n'}
        extraordinary destinations.
      </Text>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D47C9',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  subtitle: {
    marginTop: 10,
    textAlign: 'center',
    color: '#C7D2FE',
    fontSize: 14,
    lineHeight: 22,
  },
});

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  House,
  User,
  Briefcase,
  MessageCircle,
  Book,
} from 'lucide-react-native';
import HomeScreen from '../screens/HomeScreen';
import MyBookingsScreen from '../screens/MyBookingScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ChatScreen from '../screens/ChatScreen';
import TripScreen from '../screens/TripScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigation() {
  console.log('APP TABS');
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#1565F9',
        tabBarInactiveTintColor: '#64748B',
        tabBarStyle: {
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 0,
        },
        tabBarIcon: ({ color, size }) => {
          switch (route.name) {
            case 'Home':
              return <House color={color} size={size} />;
            case 'MyBookings':
              return <Briefcase color={color} size={size} />;
            case 'Profile':
              return <User color={color} size={size} />;
            case 'Chat':
              return <MessageCircle color={color} size={size} />;
            // case 'Trip':
            //   return <Book color={color} size={size} />;
            default:
              return <House color={color} size={size} />;
          }
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name="MyBookings"
        component={MyBookingsScreen}
        options={{ tabBarLabel: 'Bookings' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{ tabBarLabel: 'Chat' }}
      />
      {/* <Tab.Screen
        name="Trip"
        component={TripScreen}
        options={{ tabBarLabel: 'Trip' }}
      /> */}
    </Tab.Navigator>
  );
}

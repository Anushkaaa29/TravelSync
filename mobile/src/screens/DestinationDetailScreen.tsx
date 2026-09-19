import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ArrowLeft, MapPin, CalendarDays } from 'lucide-react-native';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setBookingData } from '../store/BookingSlice';
import { RootState } from '../store/store';
import API from '../services/api';
import apis from '../services/endpoint';

const BASE_URL = 'http://10.0.1.126:5000';

const DestinationDetailsScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  console.log('Route:', route);
  if (!route.params?.destination) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No destination found</Text>
      </View>
    );
  }
  const { destination } = route.params;

  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(new Date());
  const [guests, setGuests] = useState(2);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showCheckOut, setShowCheckOut] = useState(false);

  const dispatch = useDispatch<any>();
  const bookings = useSelector((state: RootState) => state.booking.bookings);

  const imageUrl = destination.imageUrl?.startsWith('http')
    ? destination.imageUrl
    : `${BASE_URL}${destination.imageUrl}`;

  const handleBooking = async () => {
    try {
      const response = await API.post(apis.myBook, {
        destinationId: destination._id,
        bookingDate: checkInDate.toISOString(),
        guests,
      });

      console.log('Booking Success:', response.data);
      Alert.alert('Success', 'Booking Confirmed');

      navigation.navigate('MainTabs', {
        screen: 'MyBookings',
      });
    } catch (error: any) {
      console.log('Booking Error:', error?.response?.data);
      Alert.alert('Error', error?.response?.data?.message || 'Booking Failed');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: imageUrl }} style={styles.image} />

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <ArrowLeft color="#fff" size={24} />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>{destination.title}</Text>

        <View style={styles.locationRow}>
          <MapPin size={18} color="#64748B" />
          <Text style={styles.location}>{destination.location}</Text>
        </View>

        <Text style={styles.price}>₹{destination.pricePerNight}/night</Text>

        <Text style={styles.heading}>Description</Text>

        <Text style={styles.description}>{destination.description}</Text>
        <View style={styles.bookingCard}>
          <Text style={styles.bookingTitle}>Book Your Stay</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Check-In Date</Text>

            <TouchableOpacity
              style={styles.inputBox}
              onPress={() => setShowCheckIn(true)}
            >
              <Text>{checkInDate.toDateString()}</Text>
            </TouchableOpacity>

            {showCheckIn && (
              <DateTimePicker
                value={checkInDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowCheckIn(false);
                  if (selectedDate) {
                    setCheckInDate(selectedDate);
                  }
                }}
              />
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Check-Out Date</Text>

            <TouchableOpacity
              style={styles.inputBox}
              onPress={() => setShowCheckOut(true)}
            >
              <Text>{checkOutDate.toDateString()}</Text>
            </TouchableOpacity>

            {showCheckOut && (
              <DateTimePicker
                value={checkOutDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowCheckOut(false);

                  if (selectedDate) {
                    setCheckOutDate(selectedDate);
                  }
                }}
              />
            )}
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Guests</Text>

            <View style={styles.guestRow}>
              <TouchableOpacity
                style={styles.guestButton}
                onPress={() => guests > 1 && setGuests(guests - 1)}
              >
                <Text style={styles.guestButtonText}>-</Text>
              </TouchableOpacity>

              <Text style={styles.guestCount}>{guests}</Text>

              <TouchableOpacity
                style={styles.guestButton}
                onPress={() => setGuests(guests + 1)}
              >
                <Text style={styles.guestButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.bookButton} onPress={handleBooking}>
            <Text style={styles.bookButtonText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default DestinationDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  image: {
    width: '100%',
    height: 250,
  },

  backButton: {
    position: 'absolute',
    top: 25,
    left: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 20,
  },

  content: {
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0F172A',
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },

  location: {
    marginLeft: 8,
    color: '#64748B',
    fontSize: 16,
  },

  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1565F9',
    marginTop: 15,
  },

  heading: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 10,
  },

  description: {
    fontSize: 16,
    color: '#475569',
    lineHeight: 24,
  },

  bookButton: {
    backgroundColor: '#1565F9',
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 30,
    alignItems: 'center',
  },

  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  bookingCard: {
    backgroundColor: '#FFFFFF',
    marginTop: 20,
    padding: 16,
    borderRadius: 20,
    elevation: 4,
    paddingBottom: 40,
  },

  bookingTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    color: '#0F172A',
  },

  inputContainer: {
    marginBottom: 5,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 8,
  },

  inputBox: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 14,
    backgroundColor: '#F8FAFC',
  },

  guestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 140,
  },

  guestButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#1565F9',
    justifyContent: 'center',
    alignItems: 'center',
  },

  guestButtonText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },

  guestCount: {
    fontSize: 18,
    fontWeight: '700',
  },

  Button: {
    backgroundColor: '#1565F9',
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 5,
    alignItems: 'center',
  },

  ButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

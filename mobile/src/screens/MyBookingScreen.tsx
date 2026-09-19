import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Menu, MapPin, Users, CalendarDays } from 'lucide-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { setBookingData } from '../store/BookingSlice';
import API from '../services/api';
import apis from '../services/endpoint';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

const BASE_URL = 'http://10.0.1.126:5000';

const MyBookingsScreen = () => {
  const dispatch = useDispatch();
  const bookings = useSelector((state: RootState) => state.booking.bookings);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = ['All', 'Upcoming', 'Completed'];
  const [isOffline, setIsOffline] = useState(false);
  const [isBackOnline, setIsBackOnline] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await API.get(apis.book);
      console.log('Bookings Response:', JSON.stringify(response.data, null, 2));
      const data = response.data.bookings || response.data || [];
      dispatch(setBookingData(data));
      await AsyncStorage.setItem('cached_bookings', JSON.stringify(data));
    } catch (error: any) {
      setIsOffline(true);

      const cached = await AsyncStorage.getItem('cached_bookings');
      if (cached) {
        dispatch(setBookingData(JSON.parse(cached)));
      }
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (!state.isConnected) {
        setWasOffline(true);
        setIsOffline(true);
        setIsBackOnline(false);
      } else {
        if (wasOffline) {
          setWasOffline(false);
          setIsOffline(false);
          setIsBackOnline(true);

          fetchBookings();
        }
      }
    });

    return () => unsubscribe();
  }, [wasOffline]);

  useEffect(() => {
    if (isBackOnline) {
      const timer = setTimeout(() => {
        setIsBackOnline(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isBackOnline]);
  const filteredBookings = bookings.filter((booking: any) => {
    if (selectedCategory === 'All') return true;
    return booking.status?.toLowerCase() === selectedCategory.toLowerCase();
  });

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <Text>Loading your trips...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isOffline && (
        <View
          style={{
            padding: 10,
            marginVertical: 0,
          }}
        >
          <Text
            style={{
              color: '#B45309',
              textAlign: 'center',
              fontWeight: '700',
              marginLeft: 20,
            }}
          >
            You're offline.
          </Text>
        </View>
      )}
      {isBackOnline && (
        <View
          style={{
            padding: 10,
            marginVertical: 0,
          }}
        >
          <Text
            style={{ color: '#16A34A', textAlign: 'center', fontWeight: '700' }}
          >
            Back online!
          </Text>
        </View>
      )}
      <FlatList
        data={filteredBookings}
        keyExtractor={(item: any) => item._id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <Menu size={28} color="#1565F9" />
              <Text style={styles.title}>TravelApp</Text>
            </View>
            <Text style={styles.sectionTitle}>My Bookings</Text>
            <Text style={styles.bannerSubtitle}>
              Manage your upcoming and past adventures
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoryContainer}
            >
              {categories.map(category => (
                <TouchableOpacity
                  key={category}
                  onPress={() => setSelectedCategory(category)}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category && styles.activeCategory,
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      selectedCategory === category &&
                        styles.activeCategoryText,
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No bookings found</Text>
        }
        renderItem={({ item }: any) => {
          const isConfirmed = item.status === 'Confirmed';
          const imageUrl = item.destination?.imageUrl || item.imageUrl || '';
          return (
            <TouchableOpacity style={styles.card}>
              <Image
                source={{
                  uri: imageUrl.startsWith('http')
                    ? imageUrl
                    : `${BASE_URL}${imageUrl}`,
                }}
                style={styles.cardImage}
              />

              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>
                  {item.destination?.title || item.title}
                </Text>

                <View style={styles.locationRow}>
                  <MapPin size={16} color="#64748B" />
                  <Text style={styles.location}>
                    {item.destination?.location || item.location}
                  </Text>
                </View>

                <Text style={styles.price}>₹{item.totalPrice}</Text>

                <View style={styles.bottomRow}>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor: isConfirmed ? '#7dbb9b' : '#FEF3C7',
                      },
                    ]}
                  >
                    <Text
                      style={{
                        color: isConfirmed ? '#047857' : '#92400E',
                        fontWeight: '600',
                      }}
                    >
                      {item.status}
                    </Text>
                  </View>

                  <View style={styles.guestRow}>
                    <Users size={16} color="#1565F9" />
                    <Text style={styles.guestText}>{item.guests} Guests</Text>
                  </View>
                </View>

                <TouchableOpacity style={styles.detailButton}>
                  <Text style={styles.detailButtonText}>View Booking</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default MyBookingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 20,
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#1565F9',
    marginLeft: 20,
  },

  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
  },

  bannerSubtitle: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 8,
  },

  categoryContainer: {
    marginVertical: 20,
  },

  categoryButton: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 12,
  },

  activeCategory: {
    backgroundColor: '#1565F9',
    borderColor: '#1565F9',
  },

  categoryText: {
    color: '#0F172A',
  },

  activeCategoryText: {
    color: '#FFF',
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 12,
    marginBottom: 16,
    elevation: 5,
    alignItems: 'center',
  },

  cardImage: {
    width: 130,
    height: 160,
    borderRadius: 20,
  },

  cardContent: {
    flex: 1,
    marginLeft: 15,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },

  location: {
    marginLeft: 5,
    color: '#64748B',
  },

  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1565F9',
    marginTop: 8,
  },

  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  guestRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  guestText: {
    marginLeft: 5,
    color: '#64748B',
    fontWeight: '600',
  },

  detailButton: {
    marginTop: 12,
    alignSelf: 'flex-end',
    backgroundColor: '#1565F9',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },

  detailButtonText: {
    color: '#fff',
    fontWeight: '600',
  },

  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 20,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  infoBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  infoContent: {
    marginRight: 24,
  },

  label: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },

  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },

  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#64748B',
  },
});

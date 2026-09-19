import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Menu,
  Search,
  SlidersHorizontal,
  User,
} from 'lucide-react-native';
import Images from '../assets/images/image';
import { useRoute, useNavigation } from '@react-navigation/native';
import API from '../services/api';
import apis from '../services/endpoint';
import AppNavigation from '../navigation/AppStack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import ProfileScreen from './ProfileScreen';
import { setUserData } from '../store/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

interface Destination {
  _id: string;
  title: string;
  location: string;
  imageUrl: string;
  pricePerNight: number;
  category: string;
}

const HomeScreen = () => {
  const categories = [
    { label: 'All', value: '' },
    { label: 'Beach', value: 'beach' },
    { label: 'Mountain', value: 'mountain' },
    { label: 'City', value: 'city' },
    { label: 'Nature', value: 'nature' },
    { label: 'Desert', value: 'desert' },
    { label: 'Snow', value: 'snow' },
  ];
  const [selectedCategory, setSelectedCategory] = useState('');
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(false);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const user = useSelector((state: any) => state.user);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadMore, setLoadMore] = useState(false);
  const Limit = 10;
  const [initialLoading, setInitialLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [isBackOnline, setIsBackOnline] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  const fetchDestinations = async (pageNumber = 1) => {
    try {
      if (initialLoading) {
        setLoading(true);
      } else if (pageNumber > 1) {
        setLoadMore(true);
      }
      // const response = await API.get(apis.destination);
      const response = await API.get(apis.destination, {
        params: {
          page: pageNumber,
          limit: Limit,
          category: selectedCategory,
        },
      });
      console.log('FETCHING DESTINATIONS...');
      console.log('Response:', response.data);
      const newData = response.data.destinations;
      if (pageNumber === 1) {
        setDestinations(newData);
        await AsyncStorage.setItem(
          'cached_destinations',
          JSON.stringify(newData),
        );
      } else {
        setDestinations(prev => [...prev, ...newData]);
      }
      setHasMore(pageNumber < response.data.pagination.totalPages);
      console.log('Response:', response.data);
      console.log('DESTINATIONS RESPONSE');
      console.log(response.data);
    } catch (error) {
      setIsOffline(true);
      console.log('Fetch Error:', error);
      const cached = await AsyncStorage.getItem('cached_destinations');
      if (cached) {
        setDestinations(JSON.parse(cached));
        console.log('loaded cache successfully');
      }
    } finally {
      setLoading(false);
      setLoadMore(false);
      if (initialLoading) {
        setInitialLoading(false);
      }
    }
  };
  useEffect(() => {
    setPage(1);
    fetchDestinations(1);
  }, [selectedCategory]);

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
          setPage(1);
          fetchDestinations(1);
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

  const handleloadMore = async () => {
    if (loadMore || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    await fetchDestinations(nextPage);
  };

  const filteredDestinations = destinations.filter(
    item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  console.log('filteredDestinations', filteredDestinations);

  const renderCard = ({ item }: any) => (
    <TouchableOpacity style={styles.card}>
      <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <View style={styles.locationRow}>
          <MapPin size={16} color={'#64748B'} />
          <Text style={styles.cardLocation}>{item.location}</Text>
        </View>
        <Text style={styles.priceText}>₹{item.pricePerNight}/night</Text>
        <TouchableOpacity
          style={styles.detailButton}
          onPress={() => {
            console.log('Button Pressed');
            console.log(item);
            navigation.navigate('Destination', {
              destination: item,
            });
          }}
        >
          <Text style={styles.detailButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (initialLoading && loading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 20,
          }}
        >
          <ActivityIndicator size="large" color="#1565F9" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: '#F8FAFC' }}
      edges={['left', 'right']}
    >
      {isOffline && (
        <View
          style={{
            borderRadius: 10,
            padding: 10,
            marginVertical: 0,
          }}
        >
          <Text
            style={{ color: '#B45309', textAlign: 'center', fontWeight: '700' }}
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
      <View style={styles.container}>
        <FlatList
          data={filteredDestinations}
          renderItem={renderCard}
          keyExtractor={item => item._id}
          onEndReached={handleloadMore}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListHeaderComponent={
            <>
              <View style={styles.header}>
                <Menu size={28} color="#1565F9" />
                <Text style={styles.title}>TravelApp</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Profile')}
                  style={styles.profile}
                >
                  {user?.imageUri ? (
                    <Image
                      source={{ uri: user.imageUri }}
                      style={styles.profileImage}
                    />
                  ) : (
                    <User size={24} color="#999" />
                  )}
                </TouchableOpacity>
              </View>
              {/* <ImageBackground
                source={Images.bg}
                style={styles.banner}
                imageStyle={{ borderRadius: 20 }}
              >
                <View style={styles.overlay}>
                  <Text style={styles.bannerTitle}>Explore The World</Text>

                  <Text style={styles.bannerSubtitle}>
                    Discover Hidden Gems and Popular Landmarks
                  </Text>
                </View>
              </ImageBackground> */}

              <View style={styles.searchContainer}>
                <Search size={20} color="#64748B" />

                <TextInput
                  placeholder="Where do you want to go?"
                  style={styles.searchInput}
                  placeholderTextColor="#64748B"
                  value={searchTerm}
                  onChangeText={setSearchTerm}
                />

                <TouchableOpacity style={styles.filterButton}>
                  <SlidersHorizontal size={18} color="#fff" />
                </TouchableOpacity>
              </View>
              <View style={styles.SectionHeader}>
                <Text style={styles.SectionTitle}>Popular Destination</Text>

                <TouchableOpacity>
                  <Text style={styles.viewAll}>View All</Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoryContainer}
              >
                {categories.map(item => (
                  <TouchableOpacity
                    key={item.value}
                    onPress={() => setSelectedCategory(item.value)}
                    style={[
                      styles.categoryButton,
                      selectedCategory === item.value && styles.activeCategory,
                    ]}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        selectedCategory === item.value &&
                          styles.activeCategoryText,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </>
          }
          ListFooterComponent={
            loadMore ? (
              <Text style={{ textAlign: 'center', padding: 20 }}>
                Load More...
              </Text>
            ) : null
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  title: {
    flex: 1,
    fontSize: 30,
    fontWeight: '700',
    color: '#1565F9',
    marginLeft: 20,
  },

  profile: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#D9D9D9',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 21,
    resizeMode: 'cover',
  },
  banner: {
    height: 200,
    justifyContent: 'flex-end',
  },

  overlay: {
    backgroundColor: 'rgba(0,0,0,0.35)',
    padding: 20,
    borderRadius: 20,
  },

  bannerTitle: {
    color: '#fff',
    fontSize: 34,
    fontWeight: '700',
  },

  bannerSubtitle: {
    color: '#fff',
    fontSize: 16,
    marginTop: 8,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginTop: 15,
    paddingHorizontal: 15,
    borderRadius: 16,
    height: 60,
    elevation: 4,
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#0F172A',
  },

  filterButton: {
    backgroundColor: '#1565F9',
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  SectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    alignItems: 'center',
  },

  SectionTitle: {
    fontSize: 24,
    fontWeight: '700',
  },

  viewAll: {
    color: '#1565F9',
    fontWeight: '600',
  },

  categoryContainer: {
    marginTop: 20,
    marginBottom: 20,
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
    color: '#fff',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 12,
    marginBottom: 16,
    elevation: 5,
    alignItems: 'center',
  },

  cardImage: {
    width: 110,
    height: 110,
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
    marginTop: 5,
  },

  cardLocation: {
    marginLeft: 5,
    color: '#64748B',
    fontSize: 14,
  },

  priceText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1565F9',
    marginTop: 10,
    marginBottom: 12,
  },

  detailButton: {
    alignSelf: 'flex-end',
    marginTop: 0,
    backgroundColor: '#1565F9',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },

  detailButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

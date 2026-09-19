import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import { Menu, User, Camera, Edit } from 'lucide-react-native';
import { useDispatch, useSelector } from 'react-redux';
import API from '../services/api';
import { setUserData } from '../store/userSlice';
import { setLogout } from '../store/authSlice';
import { LogOut } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { clearUserData } from '../store/userSlice';
import ImagePicker from '../components/imagePicker';
import { persistor } from '../store/store';
import { KeyboardAvoidingView, Platform } from 'react-native';
import apis from '../services/endpoint';
import { disconnectSocket } from '../services/socket';

const ProfileScreen = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);
  const auth = useSelector((state: any) => state.auth);
  console.log('USER SLICE =>', user);
  console.log('AUTH SLICE =>', auth);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(user.imageUri || '');

  useEffect(() => {
    setName(user.name || '');
    setEmail(user.email || '');
    setSelectedImage(user.imageUri || '');
  }, [user]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      console.log('REQUEST BODY =>', {
        name,
        imageUri: selectedImage,
      });
      const response = await API.put('/auth/profile', {
        name,
        imageUri: selectedImage,
      });
      console.log('UPDATE RESPONSE =>', response.data);
      dispatch(
        setUserData({
          name: response.data.name,
          email: response.data.email,
          imageUri: response.data.imageUri || '',
        }),
      );
      setLoading(false);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error: any) {
      console.log('ERROR RESPONSE =>', error?.response?.data);
      console.log('ERROR STATUS =>', error?.response?.status);
      console.log('FULL ERROR =>', error);
      Alert.alert(
        'Error',
        error?.response?.data?.message || 'Failed to update profile',
      );
    }
  };

  const handleLogout = async () => {
    try {
      await API.post(apis.logout);
      disconnectSocket();
      dispatch(setLogout());
      dispatch(clearUserData());
      await persistor.flush();
      await persistor.purge();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.log('Logout Error:', error);
    }
  };
  console.log('User Data:', user);
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <Menu size={28} color="#1565F9" />
            <Text style={styles.appTitle}>TravelApp</Text>
          </View>
          <Text style={styles.headerTitle}>My Profile</Text>

          <View style={styles.containerProfile}>
            <View style={styles.avatarWrapper}>
              {selectedImage ? (
                <Image source={{ uri: selectedImage }} style={styles.avatar} />
              ) : (
                <User size={60} color="#999" />
              )}
              <TouchableOpacity
                style={styles.cameraButton}
                disabled={!isEditing}
                onPress={() => setModalVisible(true)}
              >
                <Camera size={18} color="#fff" />
              </TouchableOpacity>
            </View>

            <Text style={styles.nameTitle}>{user?.name}</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              editable={isEditing}
            />
            <Text style={styles.label}>Email Address</Text>
            <TextInput style={styles.input} value={email} editable={false} />
          </View>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => {
              if (isEditing) {
                handleSubmit();
              } else {
                setIsEditing(true);
              }
            }}
          >
            <Edit size={18} color="#fff" />

            <Text style={styles.editButtonText}>
              {loading
                ? 'Saving...'
                : isEditing
                ? 'Save Profile'
                : 'Edit Profile'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={18} color="#fff" />

            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
          <ImagePicker
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            hasProfileImage={!!user.imageUri}
            onImageSelected={uri => {
              setSelectedImage(uri || '');
            }}
          />
        </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ProfileScreen;

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
    marginBottom: 20,
  },

  appTitle: {
    fontSize: 30,
    fontWeight: '700',
    color: '#1565F9',
    marginLeft: 20,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
  },

  containerProfile: {
    alignItems: 'center',
    marginBottom: 30,
  },

  avatarWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#EEE',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },

  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: '#1565F9',
    justifyContent: 'center',
    alignItems: 'center',
  },

  nameTitle: {
    marginTop: 15,
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
  },

  formContainer: {
    width: '100%',
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },

  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
  },

  editButton: {
    backgroundColor: '#1565F9',
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 10,
  },

  editButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },

  logoutButton: {
    backgroundColor: '#EF4444',
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 15,
  },

  logoutButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
});

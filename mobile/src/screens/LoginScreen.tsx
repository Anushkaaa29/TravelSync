import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react-native';
import API from '../services/api';
import Images from '../assets/images/image';
import apis from '../services/endpoint';
import { useDispatch } from 'react-redux';
import { setLogin } from '../store/authSlice';
import { setUserData } from '../store/userSlice';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { connectSocket } from '../services/socket';
import messaging from '@react-native-firebase/messaging';

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const dispatch = useDispatch();

  const handleLogin = async () => {
    try {
      const response = await API.post(apis.login, {
        email,
        password,
      });
      console.log('FULL RESPONSE =>', response.data);
      dispatch(
        setLogin({
          user: {
            _id: response.data._id,
            name: response.data.name,
            email: response.data.email,
            role: response.data.role,
          },
          token: response.data.token,
        }),
      );
      dispatch(
        setUserData({
          name: response.data.name,
          email: response.data.email,
          imageUri: response.data.imageUri || '',
        }),
      );
      const fcmToken = await messaging().getToken();
      console.log('Sending FCM Token');
      const token = response.data.token;
      await API.post(
        apis.saveFCMToken,
        {
          fcmToken,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log('FCM Token Saved API Success');
      connectSocket(token);
      Alert.alert('Success', 'Login Successful');
      connectSocket(token);
      console.log('Navigating to MainTabs');
      navigation.replace('MainTabs');
    } catch (error: any) {
      console.log('ERROR:', error);
      console.log('MESSAGE:', error.message);
      console.log('STATUS:', error.response?.status);
      console.log('DATA:', error.response?.data);

      Alert.alert(
        'Error',
        error.response?.data?.message ||
          error.message ||
          'Something went wrong',
      );
    }
  };
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
        <View style={styles.container}>
          <ImageBackground
            source={Images.bg}
            style={styles.headerImage}
            resizeMode="cover"
          >
            <Text style={styles.logoText}>TravelApp</Text>
          </ImageBackground>

          <View style={styles.cardContainer}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              <Text style={styles.title}>Welcome Back</Text>

              <Text style={styles.subtitle}>
                Adventure is calling! Log in to continue your journey.
              </Text>

              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputContainer}>
                <Mail size={20} color="#64748B" />
                <TextInput
                  style={styles.input}
                  placeholder="name@example.com"
                  placeholderTextColor="#94A3B8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              <View style={styles.passwordHeader}>
                <Text style={styles.label}>Password</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('ForgotPassword')}
                >
                  <Text style={styles.forgotPassword}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <Lock size={20} color="#64748B" />
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry={!isPasswordVisible}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                  {isPasswordVisible ? (
                    <EyeOff size={20} color="#64748B" />
                  ) : (
                    <Eye size={20} color="#64748B" />
                  )}
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.loginButton}
                activeOpacity={0.8}
                onPress={handleLogin}
              >
                <Text style={styles.loginButtonText}>Log In</Text>
                <LogIn size={18} color="#fff" style={{ marginLeft: 8 }} />
              </TouchableOpacity>

              <View style={styles.dividerContainer}>
                <View style={styles.line} />
              </View>
            </ScrollView>
          </View>
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerLink}> Register Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFC',
  },
  headerImage: {
    height: 300,
    width: '100%',
    paddingTop: 30,
  },
  logoText: {
    color: '#FFF',
    fontSize: 26,
    fontWeight: '800',
    paddingLeft: 15,
  },
  cardContainer: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: -100,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 24,
    elevation: 4,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 8,
    marginBottom: 30,
    lineHeight: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 24,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1E293B',
  },
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forgotPassword: {
    color: '#0066FF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  loginButton: {
    height: 56,
    backgroundColor: '#0066FF',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#0066FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 35,
    marginBottom: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 55,
    marginTop: 10,
  },
  registerText: {
    color: '#64748B',
    fontSize: 15,
  },
  registerLink: {
    color: '#0066FF',
    fontWeight: '700',
    fontSize: 15,
  },
});

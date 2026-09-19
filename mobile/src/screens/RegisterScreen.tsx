import React, { useState } from 'react';
import API from '../services/api';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
} from 'react-native';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react-native';
import { Alert } from 'react-native';
import Images from '../assets/images/image';
import apis from '../services/endpoint';
import { KeyboardAvoidingView, Platform } from 'react-native';

const RegisterScreen = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [checked, setChecked] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const response = await API.post(apis.register, {
        name,
        email,
        password,
      });
      console.log('API Response:', response.data);

      Alert.alert('Registration Successful', 'You can now log in!', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Login'),
        },
      ]);
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
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <ArrowLeft size={22} color="#1565F9" />
            </TouchableOpacity>
          </ImageBackground>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Join us to explore dream destinations
            </Text>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputContainer}>
              <User size={20} color="#7A7A8C" />
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                placeholderTextColor="#7A7A8C"
                value={name}
                onChangeText={setName}
              />
            </View>

            <Text style={styles.label}>Email</Text>
            <View style={styles.inputContainer}>
              <Mail size={20} color="#7A7A8C" />
              <TextInput
                style={styles.input}
                placeholder="name@example.com"
                placeholderTextColor="#7A7A8C"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <Text style={styles.label}>Password</Text>
            <View style={styles.inputContainer}>
              <Lock size={20} color="#7A7A8C" />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#7A7A8C"
                secureTextEntry={!isPasswordVisible}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                {isPasswordVisible ? (
                  <EyeOff size={20} color="#7A7A8C" />
                ) : (
                  <Eye size={20} color="#7A7A8C" />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                style={[styles.checkbox, checked && styles.checkedCheckbox]}
                onPress={() => setChecked(!checked)}
              >
                {checked && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>

              <Text style={styles.termsText}>
                By creating an account, you agree to our
                <Text style={styles.link}> Terms of Service </Text>
                and
                <Text style={styles.link}> Privacy Policy.</Text>
              </Text>
            </View>

            <TouchableOpacity
              style={styles.createButton}
              activeOpacity={0.8}
              onPress={handleRegister}
            >
              <Text style={styles.createButtonText}>Create Account</Text>
              <ChevronRight size={18} color="#fff" />
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account?</Text>

              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}> Log In</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  headerImage: {
    height: 280,
    width: '100%',
  },

  backButton: {
    width: 45,
    height: 45,
    borderRadius: 22,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    marginLeft: 20,
  },

  content: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: -30,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    padding: 20,
  },

  title: {
    fontSize: 38,
    fontWeight: '700',
    color: '#0F172A',
  },

  subtitle: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 8,
    marginBottom: 25,
  },

  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F4FB',
    borderWidth: 1,
    borderColor: '#D8DDED',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 58,
    marginBottom: 20,
  },

  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1E293B',
  },

  checkboxContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },

  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginRight: 8,
  },
  checkedCheckbox: {
    backgroundColor: '#007AFF',
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  termsText: {
    flex: 1,
    color: '#666',
    fontSize: 13,
    lineHeight: 20,
  },

  link: {
    color: '#1565F9',
    fontWeight: '600',
  },

  createButton: {
    marginTop: 30,
    height: 58,
    backgroundColor: '#1565F9',
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },

  createButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    marginRight: 8,
  },

  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
  },

  dividerText: {
    marginHorizontal: 10,
    color: '#777',
    fontSize: 14,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#D8DDED',
  },

  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
  },

  socialText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
  },

  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 30,
  },

  loginText: {
    color: '#666',
    fontSize: 15,
  },

  loginLink: {
    color: '#1565F9',
    fontWeight: '700',
    fontSize: 15,
  },
});

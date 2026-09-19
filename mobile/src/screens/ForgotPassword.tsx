import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, { useState } from 'react';
import { Mail, Send, RotateCcwKey } from 'lucide-react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import API from '../services/api';
import apis from '../services/endpoint';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const route = useRoute<any>();
  const resetToken = route.params?.resetToken;
  const navigation = useNavigation<any>();

  const handleForgotPassword = async () => {
    try {
      const response = await API.post(apis.forgotpassword, {
        email,
        platform: 'mobile',
      });

      console.log(response.data);

      Alert.alert('Success', 'Password reset link sent to your email');
    } catch (err: any) {
      console.log(err.response?.data);

      Alert.alert(
        'Error',
        err.response?.data?.message || 'Something went wrong',
      );
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <RotateCcwKey size={40} color="#fff" />
      </View>
      <View>
        <Text style={styles.title}>Forgot Password?</Text>
        <Text style={styles.subtitle}>
          Enter your Email address to reset your password
        </Text>
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
      <TouchableOpacity
        style={styles.Button}
        activeOpacity={0.8}
        onPress={handleForgotPassword}
      >
        <Text style={styles.buttonText}>Send Reset Link</Text>
        <Send size={18} color="#fff" />
      </TouchableOpacity>
      <View style={styles.forgotContainer}>
        <Text style={styles.forgotText}>Remember your Password?</Text>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.forgotLink}>Back To Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#1565F9',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 40,
    marginBottom: 20,
  },

  title: {
    fontSize: 34,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
    marginTop: 30,
  },

  subtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 40,
    lineHeight: 24,
  },

  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#D8DDED',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 58,
    marginBottom: 24,
  },

  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1E293B',
  },

  Button: {
    height: 58,
    backgroundColor: '#1565F9',
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },

  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    marginRight: 8,
  },
  forgotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 30,
  },

  forgotText: {
    color: '#666',
    fontSize: 15,
  },

  forgotLink: {
    color: '#1565F9',
    fontWeight: '700',
    fontSize: 15,
  },
});

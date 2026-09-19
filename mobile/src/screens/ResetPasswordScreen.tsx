import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, { useState } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import API from '../services/api';
import apis from '../services/endpoint';

const ResetPasswordScreen = ({ route }: any) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // const route = useRoute<any>();
  const navigation = useNavigation<any>();

  const { resetToken } = route.params;

  console.log(resetToken);

  const handleReset = async () => {
    if (!password || !confirmPassword) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Password do not match');
      return;
    }

    try {
      console.log('resetToken:', resetToken);
      console.log('URL:', `${apis.resetPassword}/${resetToken}`);
      await API.put(`${apis.resetPassword}/${resetToken}`, {
        password,
      });

      Alert.alert('Password Reset Successfully');
      navigation.navigate('Login');
    } catch (err: any) {
      console.log('Error:', err.response?.data);

      Alert.alert(
        'Error',
        err.response?.data?.message || 'Something went wrong',
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text>Token: {String(resetToken)}</Text>
      <Text style={styles.title}>Reset Password</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="New Password"
          placeholderTextColor="#7A7A8C"
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#7A7A8C"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleReset}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ResetPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
    marginTop: 30,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1E293B',
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
  button: {
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
});

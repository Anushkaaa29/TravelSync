import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../store/userSlice';
import { addDestination, removeDestination } from '../store/tripSlice';
import { RootState } from '../store/store';

const TripScreen = () => {
  const dispatch = useDispatch();
  const [inputText, setInputText] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const user = useSelector((state: any) => state.user);
  const [list, setList] = useState('');

  const handleAdd = async () => {
    if (inputText.trim() !== '') {
      dispatch(addDestination(inputText));
      setInputText('');
    }
  };

  useEffect(() => {
    setName(user.name || '');
    setEmail(user.email || '');
  }, [user]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Travel Bucket List</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter where you want to go"
          value={inputText}
          onChangeText={setInputText}
        ></TextInput>
        <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.nameTitle}>{user.name}</Text>
      <Text style={styles.nameTitle}>{user.email}</Text>
    </View>
  );
};

export default TripScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6F8' },
  title: {
    fontSize: 30,
    textAlign: 'center',
    justifyContent: 'center',
    marginTop: 30,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#DDD',
    marginTop: 30,
    marginHorizontal: 30,
  },
  nameTitle: {
    marginTop: 15,
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
  },

  addButton: {
    backgroundColor: '#0066FF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderRadius: 8,
    marginLeft: 10,
  },
  addButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
});

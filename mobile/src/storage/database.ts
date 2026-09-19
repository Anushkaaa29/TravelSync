import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

export const openDB = async () => {
  return await SQLite.openDatabase({
    name: 'travelapp.db',
    location: 'default',
  });
};
import { sendMessage } from '@react-native-firebase/messaging';

const apis = {
  register: '/auth/register',
  login: '/auth/login',
  forgotpassword: '/auth/forgotpassword',
  resetPassword: '/auth/resetpassword',
  destination: '/destinations',
  book: '/bookings/my-bookings',
  myBook: '/bookings',
  messages: '/chat/messages',
  sendMessage: '/chat/send-message',
  deleteMessage: '/chat/delete/',
  saveFCMToken: '/auth/save-fcm-token',
  logout: '/auth/logout',
  edit: '/chat/edit',
};

export default apis;

// import { open } from 'react-native-quick-sqlite';

// export const db = open({
//   name: 'travel_chat.db',
// });

// export const createTable = () => {
//   db.execute(`CREATE TABLE IF NOT EXISTS messages(
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         localId TEXT UNIQUE,
//         server TEXT,
//         senderId TEXT,
//         receiverId TEXT,
//         message TEXT,
//         status TEXT,
//         createdAt TEXT);`);
//   console.log('message table created successfully');
// };

// export const saveMessage = (
//   localId: string,
//   senderId: string,
//   receiverId: string,
//   message: string,
//   status: string,
//   createdAt: string,
// ) => {
//   try {
//     db.execute(
//       `INSERT INTO(
//             localId,
//             senderId,
//             receiverId,
//             message,
//             status,
//             createdAt)
//             VALUES (?,?,?,?,?,?,)`,
//       [localId, senderId, receiverId, message, status, createdAt],
//     );
//     console.log('message save successfully');
//   } catch (error) {
//     console.log('save Error', error);
//   }
// };

// export const updateMessageStatus = (
//   localId: string,
//   status: string,
//   serverId: string,
// ) => {
//   try {
//     db.execute(`UPDATE messages SET status=?,serverId=?,WHERE localId=?`, [
//       status,
//       serverId,
//       localId,
//     ]);
//     console.log('message Updated');
//   } catch (error) {
//     console.log('error in update', error);
//   }
// };

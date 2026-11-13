import { io } from 'socket.io-client';

const SERVER_URL = 'https://travelsync-backend-zcoj.onrender.com';

let socket: any = null;

export const connectSocket = (token: string): Promise<any> => {
  if (socket) {
    if (socket.connected) {
      console.log('Socket already connected');
      return Promise.resolve(socket);
    }
    // Update token and reconnect
    socket.auth = { token };
    socket.connect();
    return Promise.resolve(socket);
  }

  return new Promise(resolve => {
    socket = io(SERVER_URL, {
      transports: ['websocket', 'polling'],
      auth: {
        token,
      },
      forceNew: false,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      console.log('SOCKET CONNECTED:', socket.id);
      resolve(socket);
    });

    socket.on('connect_error', (error: any) => {
      console.log('SOCKET CONNECT ERROR:', error?.message);
      resolve(socket);
    });

    socket.on('disconnect', (reason: string) => {
      console.log('SOCKET DISCONNECTED:', reason);
    });
  });
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket.removeAllListeners();
    socket = null;
  }
};


import { io } from 'socket.io-client';

const SERVER_URL = 'http://10.0.1.126:5000';

let socket: any = null;

export const connectSocket = (token: string): Promise<any> => {
  // Already connected
  if (socket?.connected) {
    console.log('Socket already connected');
    return Promise.resolve(socket);
  }
  if (socket) {
    return Promise.resolve(socket);
  }

  return new Promise(resolve => {
    socket = io(SERVER_URL, {
      transports: ['websocket'],
      auth: {
        token,
      },
      forceNew: false,
      reconnection: true,
    });

    socket.on('connect', () => {
      console.log('SOCKET CONNECTED:', socket.id);
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

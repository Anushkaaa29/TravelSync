import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import API from '../services/api';
import { getSocket } from '../services/socket';
import { useSelector } from 'react-redux';
import apis from '../services/endpoint';
import AppNavigation from '../navigation/AppStack';
import {
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Pressable } from 'react-native';
import { RefreshCw, Edit, Trash, ArrowLeft } from 'lucide-react-native';
import { Modal } from 'react-native';
import uuid from 'react-native-uuid';
import NetInfo from '@react-native-community/netinfo';
import {
  saveMessage,
  deleteAllMessages,
  insertServerMessage,
  getMessages,
  updateMessageStatus,
  getPendingMessages,
  deleteMessageFromDB,
  updateLocalMessage,
} from '../storage/messageStorage';
import { connectSocket } from '../services/socket';

const ChatScreen = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const user = useSelector((state: any) => state.auth.user);
  const token = useSelector((state: any) => state.auth.token);
  const userId = user?._id;
  const flatListRef = useRef<FlatList>(null);
  const [replyMessage, setReplyMessage] = useState<any>(null);
  const [isEditing, setIsEditing] = useState<any>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const syncingRef = useRef(false);

  const syncPendingMessages = async () => {
    if (syncingRef.current) {
      console.log('Already syncing');
      return;
    }
    syncingRef.current = true;
    try {
      console.log('start syncing');
      const pendingMessages = await getPendingMessages();
      console.log('Pending:', pendingMessages);
      for (const msg of pendingMessages) {
        // EDIT OFFLINE MESSAGE
        if (msg.syncAction === 'edit') {
          if (!msg.serverId) {
            console.log('No serverId, sending as new message');
            const response = await API.post(apis.sendMessage, {
              message: msg.message,
              receiverId: msg.receiverId,
            });
            const serverMessage = response.data.data;
            await updateMessageStatus(msg.localId, 'sent', serverMessage._id);
            continue;
          }
          const response = await API.put(`${apis.edit}/${msg.serverId}`, {
            message: msg.message,
          });
          await updateLocalMessage(
            msg.localId,
            response.data.data.message,
            1,
            null,
          );
          continue;
        }
        // SEND NEW OFFLINE MESSAGE
        console.log('Sending:', msg.message);
        const response = await API.post(apis.sendMessage, {
          message: msg.message,
          receiverId: msg.receiverId,
        });
        console.log('SEND RESPONSE:', response.data);
        const serverMessage = response.data.data;
        console.log('SERVER ID:', serverMessage._id);
        await updateMessageStatus(msg.localId, 'sent', serverMessage._id);
        console.log('Message synced:', msg.localId);
      }
      console.log('syncing end');
    } catch (error) {
      console.log('SYNC ERROR', error);
    } finally {
      syncingRef.current = false;
    }
  };

  const loadMessages = async () => {
    try {
      const state = await NetInfo.fetch();
      if (state.isConnected) {
        await syncPendingMessages();
        const response = await API.get(`${apis.messages}/admin`);
        await insertServerMessage(response.data);
        const localMessages = await getMessages();
        setMessages(localMessages);
      } else {
        const localMessages = await getMessages();
        setMessages(localMessages);
      }
    } catch (error) {
      console.log(error);
      const localMessages = await getMessages();
      setMessages(localMessages);
    }
  };
  useFocusEffect(
    useCallback(() => {
      console.log('Chat Focused');
      loadMessages();
    }, []),
  );
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(async state => {
      if (!state.isConnected) return;
      console.log('Internet restored');
      try {
        await connectSocket(token);
        await syncPendingMessages();
        const response = await API.get(`${apis.messages}/admin`);
        await insertServerMessage(response.data);
        const localMessages = await getMessages();
        setMessages(localMessages);
      } catch (err) {
        console.log('Reconnect Sync Error', err);
      }
    });
    return () => unsubscribe();
  }, [token]);
  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages.length]);

  const handleRefresh = async () => {
    await loadMessages();
  };

  const sendMessage = async () => {
    console.log('1. sendMessage called');
    if (!message.trim()) return;
    const localId = uuid.v4().toString();
    const createdAt = new Date().toISOString();
    try {
      // Edit Message
      if (isEditing) {
        const state = await NetInfo.fetch();
        if (!state.isConnected) {
          await updateLocalMessage(isEditing.localId, message, 1, 'edit');
          const localMessages = await getMessages();
          setMessages(localMessages);
          setIsEditing(null);
          setMessage('');
          setSelectedMessage(null);
          setMenuVisible(false);
          setMessage('');
          return;
        }
        const response = await API.put(`${apis.edit}/${isEditing.serverId}`, {
          message,
        });
        await updateLocalMessage(
          isEditing.localId,
          response.data.data.message,
          1,
          null,
        );
        const localMessages = await getMessages();
        setMessages(localMessages);
        // close edit mode
        setIsEditing(null);
        setSelectedMessage(null);
        setMenuVisible(false);
        setMessage('');
        return;
      }
      // Offline
      const state = await NetInfo.fetch();
      if (!state.isConnected) {
        const offlineMessage = {
          localId,
          serverId: null,
          senderId: user._id,
          receiverId: 'admin',
          message,
          status: 'pending',
          syncAction: 'send',
          createdAt,
          isSynced: 0,
        };
        await saveMessage(offlineMessage);
        const localMessages = await getMessages();
        setMessages(localMessages);
        setMessage('');
        setReplyMessage(null);
        return;
      }
      console.log('2. Internet:', state.isConnected);
      console.log('3. Before API');
      //  Online
      const response = await API.post(apis.sendMessage, {
        message,
        receiverId: 'admin',
        replyTo: replyMessage?._id,
      });
      console.log('4. After API', response.data);
      const serverMessage = response.data.data;
      await saveMessage({
        localId: serverMessage._id,
        serverId: serverMessage._id,
        senderId:
          typeof serverMessage.senderId === 'object'
            ? serverMessage.senderId._id
            : serverMessage.senderId,
        receiverId:
          typeof serverMessage.receiverId === 'object'
            ? serverMessage.receiverId._id
            : serverMessage.receiverId,
        message: serverMessage.message,
        status: 'sent',
        createdAt: serverMessage.createdAt,
        isSynced: 1,
      });
      const localMessages = await getMessages();
      setMessages(localMessages);
      setMessage('');
      setReplyMessage(null);
    } catch (error) {
      console.log('SEND MESSAGE ERROR', error);
    }
  };

  const deleteMessage = async (item: any) => {
    try {
      // Pending message
      if (!item.serverId) {
        await deleteMessageFromDB(item.localId);
        const localMessages = await getMessages();
        setMessages(localMessages);
        return;
      }
      // Sent message
      await API.delete(`${apis.deleteMessage}${item.serverId}`, {
        data: {
          deleteType: 'me',
        },
      });
      await deleteMessageFromDB(item.serverId);
      const localMessages = await getMessages();
      setMessages(localMessages);
    } catch (error) {
      console.log('DELETE ERROR', error);
    }
  };
  const socket = getSocket();
  console.log('Socket:', socket);
  console.log('Connected:', socket?.connected);
  useEffect(() => {
    if (!socket) return;
    socket.on('receive-message', async (msg: any) => {
      console.log('RECEIVED MESSAGE');
      console.log(msg);
      await saveMessage({
        localId: uuid.v4().toString(),
        serverId: msg._id,
        senderId: msg.senderId,
        receiverId: msg.receiverId,
        message: msg.message,
        status: 'sent',
        createdAt: msg.createdAt,
        isSynced: 1,
      });
      const localMessages = await getMessages();
      setMessages(localMessages);
    });
    socket.on('message-deleted', async ({ messageId }: { messageId: any }) => {
      await deleteMessageFromDB(messageId);
      const localMessages = await getMessages();
      setMessages(localMessages);
    });
    socket.on('message-edited', async (updatedMessage: any) => {
      const localMessages = await getMessages();
      const message = localMessages.find(
        m => m.serverId === updatedMessage._id,
      );
      if (message) {
        await updateLocalMessage(
          message.localId,
          updatedMessage.message,
          1,
          null,
        );
      }
      const updated = await getMessages();
      setMessages(updated);
    });

    return () => {
      socket.off('receive-message');
      // socket.off('message-sent');
      socket.off('message-edited');
      socket.off('message-deleted');
    };
  }, [socket]);

  const MessageItem = React.memo(({ item, isUser, onDelete }: any) => {
    const lastTap = useRef(0);
    const handleDoubleTap = () => {
      const now = Date.now();
      if (now - lastTap.current < 3000) {
        console.log('double tap');
        setReplyMessage(item);
      }
      lastTap.current = now;
    };
    return (
      <View
        style={[
          styles.messageContainer,
          isUser ? styles.userContainer : styles.adminContainer,
        ]}
      >
        <Pressable
          style={[
            styles.messageContainer,
            isUser ? styles.userContainer : styles.adminContainer,
          ]}
          onPress={handleDoubleTap}
          onLongPress={() => {
            setSelectedMessage(item);
            setMenuVisible(true);
          }}
        >
          <View
            style={[
              styles.messageBubble,
              isUser ? styles.userBubble : styles.adminBubble,
              item.status === 'pending' &&
                isUser && {
                  backgroundColor: '#FFF4CC',
                  borderWidth: 1,
                  borderColor: '#FACC15',
                },
            ]}
          >
            {item.replyTo && (
              <View
                style={[
                  styles.replyPreview,
                  isUser ? styles.replyPreviewUser : styles.replyPreviewAdmin,
                ]}
              >
                <Text style={styles.replyLabel}>Replying to :</Text>

                <Text
                  numberOfLines={1}
                  style={isUser ? { color: '#fff' } : { color: '#111827' }}
                >
                  {item.replyTo.message}
                </Text>
              </View>
            )}
            <Text
              style={[
                styles.messageText,
                {
                  color:
                    item.status === 'pending'
                      ? '#374151'
                      : isUser
                      ? '#FFFFFF'
                      : '#111827',
                },
              ]}
            >
              {item.message}
            </Text>
            {item.edited && (
              <View style={styles.editedContainer}>
                <Text
                  style={[
                    styles.editedText,
                    isUser ? { color: '#E5E7EB' } : { color: '#6B7280' },
                  ]}
                >
                  Edited
                </Text>
              </View>
            )}
            <Text style={[styles.time, isUser && { color: '#E5E7EB' }]}>
              {new Date(item.createdAt).toLocaleTimeString()}
            </Text>
          </View>
        </Pressable>
      </View>
    );
  });
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>A</Text>
            </View>

            <View>
              <Text style={styles.name}>Travel Admin</Text>
              <Text style={styles.status}>Online</Text>
            </View>
          </View>
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={({ item }) => (
              <MessageItem
                item={item}
                isUser={
                  (typeof item.senderId === 'object'
                    ? item.senderId?._id
                    : item.senderId) === user?._id
                }
                onDelete={deleteMessage}
              />
            )}
            // keyExtractor={item => item._id}
            keyExtractor={item =>
              (item.serverId || item.localId || item._id).toString()
            }
            contentContainerStyle={{ padding: 15 }}
            keyboardShouldPersistTaps="handled"
            initialNumToRender={15}
            maxToRenderPerBatch={10}
            windowSize={10}
            removeClippedSubviews={true}
          />
          <Modal
            visible={menuVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setMenuVisible(false)}
          >
            <View style={styles.menuOverlay}>
              <View style={styles.menuBox}>
                {selectedMessage &&
                  selectedMessage.senderId === user?._id &&
                  Date.now() - new Date(selectedMessage.createdAt).getTime() <
                    10 * 60 * 1000 && (
                    <TouchableOpacity
                      style={styles.menuItem}
                      onPress={() => {
                        setIsEditing(selectedMessage);
                        setMessage(selectedMessage.message);
                        setMenuVisible(false);
                      }}
                    >
                      <Edit size={20} color="#2563EB" />
                      <Text style={{ marginLeft: 12 }}>Edit</Text>
                    </TouchableOpacity>
                  )}

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    console.log('Selected Message:', selectedMessage);
                    deleteMessage(selectedMessage);
                    setMenuVisible(false);
                  }}
                >
                  <Trash size={20} color="red" />
                  <Text style={{ marginLeft: 12 }}>Delete</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => setMenuVisible(false)}
                >
                  <ArrowLeft size={20} color="gray" />
                  <Text style={{ marginLeft: 12 }}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          {replyMessage && (
            <View style={styles.replyContainer}>
              <View style={{ flex: 1 }}>
                <Text style={styles.replyTitle}>Replying to :</Text>
                <Text numberOfLines={1}>{replyMessage.message}</Text>
              </View>
              <TouchableOpacity onPress={() => setReplyMessage(null)}>
                <Text style={{ fontSize: 18 }}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.bottomContainer}>
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Type message..."
              style={styles.input}
            />
            <TouchableOpacity onPress={handleRefresh}>
              <RefreshCw size={20} color={'blue'} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
              <Text style={styles.sendText}>Send</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
  },

  header: {
    backgroundColor: '#fff',
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },

  avatar: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },

  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },

  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },

  status: {
    color: 'green',
    marginTop: 3,
  },

  messageContainer: {
    marginBottom: 15,
  },

  adminContainer: {
    alignItems: 'flex-start',
  },

  userContainer: {
    alignItems: 'flex-end',
  },

  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 18,
  },
  adminBubble: {
    backgroundColor: '#fff',
  },
  userBubble: {
    backgroundColor: '#2563EB',
  },
  messageText: {
    color: '#111827',
    fontSize: 15,
  },
  time: {
    alignSelf: 'flex-end',
    marginTop: 5,
    fontSize: 10,
    color: '#6B7280',
  },
  bottomContainer: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 25,
    paddingHorizontal: 18,
    paddingVertical: 10,
    fontSize: 15,
  },
  sendBtn: {
    marginLeft: 10,
    backgroundColor: '#2563EB',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  sendText: {
    color: '#fff',
    fontWeight: '700',
  },
  replyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F3F4F6',
    borderLeftWidth: 4,
    borderLeftColor: '#6a93ec',
    padding: 10,
  },

  replyTitle: {
    fontWeight: '700',
    color: '#2563EB',
    marginBottom: 2,
  },
  replyPreview: {
    padding: 8,
    borderLeftWidth: 3,
    borderRadius: 6,
    marginBottom: 8,
  },

  replyPreviewAdmin: {
    backgroundColor: '#E5E7EB',
    borderLeftColor: '#2563EB',
  },

  replyPreviewUser: {
    backgroundColor: '#8ea3df',
    borderLeftColor: '#FFFFFF',
  },

  replyLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 2,
  },
  menuOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },

  menuBox: {
    width: 250,
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingVertical: 10,
    elevation: 8,
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  editedText: {
    fontSize: 11,
    color: 'gray',
    fontStyle: 'italic',
  },
  editedContainer: {
    marginTop: 4,
    alignSelf: 'flex-end',
  },
});

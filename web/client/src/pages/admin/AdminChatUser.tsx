import { useEffect, useRef, useState } from "react";
import { createSocket } from "../../socket/socket";
import { Pin, PinOff } from "lucide-react";

const AdminChatUser = () => {
  const socketRef = useRef<any>(null);
  const [message, setMessage] = useState("");
  const [activeUsers, setActiveUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [deleteMenu, setDeleteMenu] = useState({
    visible: false,
    messageId: "",
  });
  const [isEditing, setIsEditing] = useState<any>(null);
  const [replyMessage, setReplyMessage] = useState<any>(null);
  const [pinnedMessage, setPinnedMessage] = useState<any>(null);

  //socket connection
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("NO TOKEN FOUND");
      return;
    }
    socketRef.current = createSocket(token);
    socketRef.current.on("connect", () => {
      console.log("SOCKET CONNECTED");
      socketRef.current.emit("get-active-users");
    });
    socketRef.current.on("active-users", (onlineUsers: any) => {
      console.log("ACTIVE USERS");
      console.log(onlineUsers);
      setActiveUsers((prev) => {
        const userMap = new Map();
        prev.forEach((u) => userMap.set(u.userId, { ...u, isOnline: false }));
        onlineUsers.forEach((u: any) =>
          userMap.set(u.userId, { ...u, isOnline: true }),
        );
        return Array.from(userMap.values());
      });
    });

    socketRef.current.on("message-sent", (msg: any) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === msg._id)) {
          return prev;
        }
        return [...prev, msg];
      });
    });

    socketRef.current.on("receive-message", (msg: any) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === msg._id)) {
          return prev;
        }
        return [...prev, msg];
      });
    });

    socketRef.current.on("message-deleted", ({ messageId }: any) => {
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
    });

    socketRef.current.on("message-edited", (updatedMessage: any) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === updatedMessage._id ? updatedMessage : msg,
        ),
      );
    });

    socketRef.current.on("message-pinned", (updatedMessage: any) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === updatedMessage._id
            ? {
                ...msg,
                isPinned: true,
                pinnedAt: updatedMessage.pinnedAt,
              }
            : {
                ...msg,
                isPinned: false,
                pinnedAt: null,
              },
        ),
      );
      setPinnedMessage(updatedMessage);
    });

    socketRef.current.on("message-unpinned", (updatedMessage: any) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === updatedMessage._id
            ? {
                ...msg,
                isPinned: false,
                pinnedAt: null,
              }
            : msg,
        ),
      );
      setPinnedMessage(null);
    });

    return () => {
      socketRef.current.off("message-sent");
      socketRef.current.off("receive-message");
      socketRef.current.off("message-deleted");
      socketRef.current.off("message-edited");
      socketRef.current.off("message-pinned");
      socketRef.current.off("message-unpinned");
      socketRef.current.disconnect();
    };
  }, []);

  // load chat
  useEffect(() => {
    if (selectedUser?.userId) {
      loadMessages(selectedUser.userId);
    }
  }, [selectedUser]);
  //load messages
  const loadMessages = async (userId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/chat/messages/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await response.json();
      console.log("OLD MESSAGES:", data);
      setMessages(data);
      const pinned = data.find((m: any) => m.isPinned);
      setPinnedMessage(pinned || null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedUser) return;
    try {
      if (isEditing) {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:5000/api/chat/edit/${isEditing._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              message,
            }),
          },
        );
        const data = await response.json();
        setMessages((prev) =>
          prev.map((msg) => (msg._id === isEditing._id ? data.data : msg)),
        );
        setIsEditing(null);
        setMessage("");
        setReplyMessage(null);
        return;
      }
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/chat/send-message`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            receiverId: selectedUser.userId,
            message,
            replyTo: replyMessage?._id,
          }),
        },
      );
      const responseData = await response.json();
      console.log("SEND MESSAGE RESPONSE");
      console.log(responseData);
      // setMessages((prev) => [...prev, responseData.data]);
      setMessage("");
      setReplyMessage(null);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);
  const loadUsers = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:5000/api/chat/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    setActiveUsers((prev: any[]) => {
      const userMap = new Map();
      data.forEach((u: any) =>
        userMap.set(u.userId, { ...u, isOnline: false }),
      );
      prev.forEach((u: any) => userMap.set(u.userId, { ...u }));
      return Array.from(userMap.values());
    });
  };

  const deleteMessage = async (
    messageId: string,
    deleteType: "me" | "everyone",
  ) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/chat/delete/${messageId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ deleteType }),
        },
      );
      const data = await response.json();
      setMessages((prev) => {
        console.log("Before:", prev.length);
        const updated = prev.filter((msg) => msg._id !== messageId);
        console.log("After:", updated.length);
        console.log(updated);
        return updated;
      });
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    console.log(
      "Messages state:",
      messages.map((m) => m._id),
    );
  }, [messages]);

  const adminId = JSON.parse(
    atob(localStorage.getItem("token")!.split(".")[1]),
  ).id;

  const selectedMsg = messages.find((m: any) => m._id === deleteMenu.messageId);

  const getDateLabel = (date: string): string => {
    const messageDate = new Date(date);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (messageDate.toDateString() === today.toDateString()) {
      return "Today";
    }
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }
    const diffTime = today.getTime() - messageDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 7) {
      return messageDate.toLocaleDateString("en-IN", {
        weekday: "long",
      });
    }
    return messageDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="h-[calc(100vh-80px)] bg-gray-100 p-6">
      <div className="h-full rounded-2xl overflow-hidden shadow-lg bg-white flex">
        <div className="w-80 bg-gray-50 p-5">
          <h2 className="text-2xl font-bold mb-6">Conversations</h2>
          <div className="space-y-3 overflow-y-auto h-full">
            {activeUsers.length === 0 ? (
              <div>No Active Users</div>
            ) : (
              activeUsers.map((user) => (
                <div
                  key={user.userId}
                  onClick={() => {
                    console.log("USER CLICKED");
                    console.log(user);
                    setSelectedUser(user);
                    loadMessages(user.userId);
                  }}
                  className={`rounded-xl p-4 cursor-pointer transition ${
                    selectedUser?.userId === user.userId
                      ? "bg-blue-100 border border-blue-500"
                      : "bg-white hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center">
                      U
                    </div>

                    <div>
                      <h3 className="font-semibold">
                        {user.name || user.userId}
                      </h3>
                      <p
                        className={
                          user.isOnline
                            ? "text-green-600 text-sm"
                            : "text-gray-400 text-sm"
                        }
                      >
                        {user.isOnline ? "Online" : "Offline"}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          <div className="border-b p-5">
            {selectedUser ? (
              <div>
                <h2 className="font-bold text-lg">Chat with</h2>

                <p className="text-blue-600">
                  {selectedUser.name || selectedUser.userId}
                </p>
              </div>
            ) : (
              <h2>Select User</h2>
            )}
          </div>
          {pinnedMessage && (
            <div className="flex items-center gap-2 bg-blue-50 border-b border-blue-200 px-5 py-3">
              <Pin size={18} className="text-blue-600" />
              <div>
                <p className="text-xs text-blue-600 font-semibold">
                  Pinned Message
                </p>
                <p className="text-sm">{pinnedMessage.message}</p>
              </div>
            </div>
          )}
          <div className="flex-1 overflow-y-auto bg-gray-100 p-6">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500">No Messages Yet</div>
            ) : (
              messages.map((msg, index) => {
                const previousMessage = messages[index - 1];
                const showDate =
                  !previousMessage ||
                  new Date(previousMessage.createdAt).toDateString() !==
                    new Date(msg.createdAt).toDateString();
                const isAdmin = msg.receiverId === selectedUser?.userId;
                console.log("Rendering:", msg._id);

                return (
                  <>
                    {showDate && (
                      <div className="flex justify-center my-4">
                        <span className="bg-gray-300 text-gray-700 text-xs px-3 py-1 rounded-full">
                          {getDateLabel(msg.createdAt)}
                        </span>
                      </div>
                    )}
                    <div
                      key={msg._id}
                      className={`flex mb-4 ${
                        isAdmin ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        onDoubleClick={() => setReplyMessage(msg)}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          setDeleteMenu({
                            visible: true,
                            messageId: msg._id,
                          });
                        }}
                        className={`px-4 py-2 rounded-xl max-w-md cursor-pointer ${
                          isAdmin
                            ? "bg-blue-600 text-white"
                            : "bg-white text-black"
                        }`}
                      >
                        {msg.replyTo && (
                          <div
                            className={`rounded p-2 mb-2 border-l-4 ${
                              isAdmin
                                ? "bg-blue-500 border-white text-white"
                                : "bg-gray-200 border-blue-500 text-black"
                            }`}
                          >
                            <p className="text-xs opacity-80">Replying to</p>

                            <p className="text-sm">{msg.replyTo.message}</p>
                          </div>
                        )}
                        <p>{msg.message}</p>
                        {msg.edited && (
                          <p className="text-xs opacity-60 italic mt-1">
                            Edited
                          </p>
                        )}
                      </div>
                    </div>
                  </>
                );
              })
            )}
          </div>
          {replyMessage && (
            <div className="border-t bg-gray-200 p-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-blue-300 font-semibold text-sm">
                    Replying To:
                  </p>
                  <p className="text-sm">{replyMessage.message}</p>
                </div>

                <button onClick={() => setReplyMessage(null)}>✕</button>
              </div>
            </div>
          )}
          <div className="border-t p-4 flex gap-3">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type message..."
              className="flex-1 border rounded-lg px-4 py-2"
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-600 text-white px-6 rounded-lg"
            >
              Send
            </button>
          </div>
        </div>
      </div>
      {deleteMenu.visible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
          <div className="bg-white rounded-lg p-4 w-64 shadow-lg">
            {(() => {
              const msg = messages.find((m) => m._id === deleteMenu.messageId);
              const canEdit =
                msg &&
                msg.senderId === adminId &&
                Date.now() - new Date(msg.createdAt).getTime() < 10 * 60 * 1000;

              if (!canEdit) return null;

              return (
                <button
                  className="w-full text-left p-2 hover:bg-blue-300"
                  onClick={() => {
                    setIsEditing(msg);
                    setMessage(msg.message);
                    setDeleteMenu({ visible: false, messageId: "" });
                  }}
                >
                  Edit
                </button>
              );
            })()}
            <button
              className="w-full flex items-center gap-2 text-left p-2 hover:bg-gray-100"
              onClick={async () => {
                try {
                  const token = localStorage.getItem("token");
                  if (selectedMsg?.isPinned) {
                    await fetch(
                      `http://localhost:5000/api/chat/unpin/${deleteMenu.messageId}`,
                      {
                        method: "PUT",
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      },
                    );
                    setPinnedMessage(null);

                    setMessages((prev) =>
                      prev.map((m) => ({
                        ...m,
                        isPinned: false,
                      })),
                    );
                  } else {
                    await fetch(
                      `http://localhost:5000/api/chat/pin/${deleteMenu.messageId}`,
                      {
                        method: "PUT",
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      },
                    );
                    setPinnedMessage(selectedMsg);
                    setMessages((prev) =>
                      prev.map((m) => ({
                        ...m,
                        isPinned: m._id === selectedMsg?._id,
                      })),
                    );
                  }
                  setDeleteMenu({
                    visible: false,
                    messageId: "",
                  });
                } catch (err) {
                  console.log(err);
                }
              }}
            >
              {selectedMsg?.isPinned ? (
                <>
                  <PinOff size={18} />
                  <span>Unpin</span>
                </>
              ) : (
                <>
                  <Pin size={18} />
                  <span>Pin</span>
                </>
              )}
            </button>
            <button
              className="w-full text-left p-2 hover:bg-gray-100"
              onClick={() => {
                deleteMessage(deleteMenu.messageId, "me");
                setDeleteMenu({
                  visible: false,
                  messageId: "",
                });
              }}
            >
              Delete from Me
            </button>
            <button
              className="w-full text-left p-2 text-red-600 hover:bg-grey-100"
              onClick={() => {
                deleteMessage(deleteMenu.messageId, "everyone");
                setDeleteMenu({
                  visible: false,
                  messageId: "",
                });
              }}
            >
              Delete from Everyone
            </button>
            <button
              className="w-full text-left p-2 hover:bg-gray-100"
              onClick={() => {
                setDeleteMenu({
                  visible: false,
                  messageId: "",
                });
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminChatUser;

import { openDB } from './database';

export const createMessageTable = async () => {
  const db = await openDB();
  await db.executeSql(`
CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    localId TEXT,
    serverId TEXT UNIQUE,
    senderId TEXT,
    receiverId TEXT,
    message TEXT,
    status TEXT,
    createdAt TEXT,
    isSynced INTEGER,
    isEdited INTEGER DEFAULT 0,
    syncAction TEXT DEFAULT NULL
);
`);

  console.log("Message table created");
};

export interface OfflineMessage {
  localId: string;
  senderId: string;
  receiverId: string;
  message: string;
  status: string;
  createdAt: string;
}

export const saveMessage = async (message: any) => {
  const db = await openDB();
  await db.executeSql(
`
INSERT OR IGNORE INTO messages(
  localId,
  serverId,
  senderId,
  receiverId,
  message,
  status,
  createdAt,
  isSynced
)
VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`,
[
  message.localId,
  message.serverId,
  message.senderId,
  message.receiverId,
  message.message,
  message.status,
  message.createdAt,
  message.isSynced,
]
);
};

export const getMessages = async (): Promise<any[]> => {
  const db = await openDB();
  const [results] = await db.executeSql(
    `SELECT * FROM messages ORDER BY createdAt ASC`,
  );
  const data = [];
  for (let i = 0; i < results.rows.length; i++) {
    data.push(results.rows.item(i));
  }
  return data;
};

export const deleteAllMessages = async () => {
  const db = await openDB();
  await db.executeSql(`DELETE FROM messages`);
};

export const updateMessageStatus = async (
  localId: string,
  status: string,
  serverId: string,
) => {
  try {
    const db = await openDB();
    await db.executeSql(
      `
      UPDATE messages
      SET status = ?, serverId = ?, isSynced = ?
      WHERE localId = ?
      `,
      [
        status,
        serverId,
        1,
        localId,
      ],
    );
    console.log("Message updated");
  } catch (error) {
    console.log("Error updating message:", error);
  }
};

export const insertServerMessage = async (messages: any[]) => {
  const db = await openDB();

  for (const msg of messages) {
    // Check already exists
    const [result] = await db.executeSql(
      `SELECT * FROM messages WHERE serverId = ?`,
      [msg._id]
    );
    // If already exists
    if (result.rows.length > 0) {
      continue;
    }
    // Otherwise insert
    await db.executeSql(
      `
     INSERT OR IGNORE INTO messages(
      localId,
      serverId,
      senderId,
      receiverId,
      message,
      status,
      createdAt,
      isSynced
)
VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        msg._id,
        msg._id,
        msg.senderId,
        msg.receiverId,
        msg.message,
        'sent',
        msg.createdAt,
        1,
      ],
    );
  }
};
export const getPendingMessages = async () => {
 const db = await openDB();
 const [results] = await db.executeSql(
   `
   SELECT * FROM messages
   WHERE isSynced = 0
   `
 );
 const messages=[];
 for(let i=0;i<results.rows.length;i++){
    messages.push(results.rows.item(i));
 }
 return messages;

};

export const deleteMessageFromDB = async (id: string) => {
  try {
    const db = await openDB();
    await db.executeSql(
      `
      DELETE FROM messages
      WHERE serverId = ? OR localId = ?
      `,
      [id, id],
    );
    console.log("Deleted from SQLite:", id);
  } catch (error) {
    console.log("DELETE SQLITE ERROR", error);
  }
};

export const updateLocalMessage = async (
  localId: string,
  message: string,
  isEdited: number,
  syncAction: string | null
) => {
  try {
    const db = await openDB();
    await db.executeSql(
      `
      UPDATE messages
      SET 
        message = ?,
        isEdited = ?,
        syncAction = ?
      WHERE localId = ?
      `,
      [
        message,
        isEdited,
        syncAction,
        localId
      ]
    );
    console.log("Local message updated");
  } catch(error){
    console.log("UPDATE LOCAL MESSAGE ERROR", error);
  }
};
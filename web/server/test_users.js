const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { Message } = require('./src/models/Message');
const { User } = require('./src/models/User');

mongoose.connect('mongodb+srv://anushkasurve:Q4Q470Jm2tQj4gLz@cluster0.e8s1j.mongodb.net/travelapp').then(async () => {
  try {
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) { console.log('Admin not found'); process.exit(); }
    
    // Simulate the exact API logic
    const userId = adminUser._id.toString();
    console.log('Admin ID (string):', userId);

    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }]
    });
    console.log('Total messages found for admin:', messages.length);

    const otherUserIds = new Set();
    messages.forEach((msg) => {
      if (msg.senderId && msg.senderId.toString() !== userId) {
        otherUserIds.add(msg.senderId.toString());
      }
      if (msg.receiverId && msg.receiverId.toString() !== userId) {
        otherUserIds.add(msg.receiverId.toString());
      }
    });

    console.log('Other user IDs found:', Array.from(otherUserIds));

    const objectIdArray = Array.from(otherUserIds).map((id) => new mongoose.Types.ObjectId(id));
    
    const users = await User.find({
      _id: { $in: objectIdArray }
    }).select('name email role');

    console.log('Users mapped from IDs:', users);
    process.exit(0);
  } catch (error) {
    console.log('Error:', error);
    process.exit(1);
  }
});

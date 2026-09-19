import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
{
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  message: {
    type: String,
    trim: true,
    required: false, // allow file-only messages
  },

  file: {
    url: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      default: null,
    },
    type: {
      type: String,
      default: null,
    },
    size: {
      type: Number,
      default: null,
    },
  },

  edited: {
    type: Boolean,
    default: false,
  },

  editedAt: {
    type: Date,
    default: null,
  },

  replyTo: {
    messageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },

    message: {
      type: String,
    },

    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },

  isPinned: {
    type: Boolean,
    default: false,
  },

  pinnedAt: {
    type: Date,
    default: null,
  },

  deletedFor: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
},
{
  timestamps: true,
}
);
export const Message = mongoose.model("Message", messageSchema);
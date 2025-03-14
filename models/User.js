const mongoose = require("mongoose");

const User = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: "http://cdn-icons-png.flaticon.com/128/3177/3177440.png",
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },
    favourite: [{ type: mongoose.Types.ObjectId, ref: "books" }],
    cart: [{ type: mongoose.Types.ObjectId, ref: "books" }],
    orders: [{ type: mongoose.Types.ObjectId, ref: "order" }],
  },
  { timestamps: true }
);
module.exports = mongoose.model("user", User);

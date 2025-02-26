const express = require("express");
const mongoose = require("mongoose");

const app = express();
require("dotenv").config();
const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;
const Authuser = require("./routes/user");
const Book = require("./routes/book");
const favourite = require("./routes/favourite");
const cart = require("./routes/cart");
const Order = require("./routes/order");
const cors = require("cors");
// databse connection
mongoose.connect(MONGO_URL).then(() => {
  console.log("db connected");
});

// middleware
app.use(express.json());
app.use(cors());
// routes
app.use("/api/v1", Authuser);
app.use("/api/v1", Book);
app.use("/api/v1", favourite);
app.use("/api/v1", cart);
app.use("/api/v1", Order);

app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});

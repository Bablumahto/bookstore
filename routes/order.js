const router = require("express").Router();
const User = require("../models/User");
const Book = require("../models/books");
const Order = require("../models/order");
const { authenticateToken } = require("../middlewares/userAuth");

// Place order
router.post("/place-order", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;

    const { order } = req.body;

    for (const orderData of order) {
      // Create and save new order

      const newOrder = new Order({ user: id, book: orderData._id });

      const orderDataFromDb = await newOrder.save();

      // Save order in user model

      await User.findByIdAndUpdate(id, {
        $push: { orders: orderDataFromDb._id },
      });

      await User.findByIdAndUpdate(id, {
        $pull: { cart: orderData._id },
      });
    }

    return res.json({ status: "success", message: "order placed" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

// Get order history of a particular profile
router.get("/get-order-history", authenticateToken, async (req, res) => {
  try {
    const id = req.headers.id || req.get("id");
    if (!id) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    console.log("Fetching order history for user:", id);

    const userData = await User.findById(id).populate({
      path: "orders",
      populate: { path: "book" },
    });

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Order Data Retrieved:", userData.orders);

    return res
      .status(200)
      .json({ message: "Success", data: userData.orders.reverse() });
  } catch (error) {
    console.error("Error fetching order history:", error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

// Get all orders (Admin)
router.get("/get-all-orders", authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate({ path: "book", select: "title author price" }) // Select only needed fields
      .populate({ path: "user", select: "name email" }) // Select only needed fields
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
});

// Update order (Admin)
router.put("/update-status/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params; // Correctly extracting the ID from params

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status: req.body.status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.json({
      status: "success",
      message: "Status updated successfully",
      data: updatedOrder,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;

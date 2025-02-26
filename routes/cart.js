const router = require("express").Router();
const User = require("../models/User");
const { authenticateToken } = require("../middlewares/userAuth");

router.put("/add-to-cart", authenticateToken, async (req, res) => {
  try {
    const { id, bookid } = req.headers;
    const userData = await User.findById(id);
    const isBookInCart = userData.cart.includes(bookid);
    if (isBookInCart) {
      return res.status(200).json({ message: "book is already in cart" });
    }
    await User.findByIdAndUpdate(id, { $push: { cart: bookid } });

    return res.status(200).json({ message: "book added to cart" });
  } catch (error) {
    return res.status(500).json({ message: "internal error" });
  }
});

//  remove from cart
router.put("/remove-from-cart/:bookid", authenticateToken, async (req, res) => {
  try {
    const { bookid } = req.params;
    const { id } = req.headers;
    await User.findByIdAndUpdate(id, { $pull: { cart: bookid } });
    return res.json({ message: "removed" });
  } catch (error) {
    return res.status(500).json({ message: "interanl server error" });
  }
});

// get cart of a particular user
router.get("/get-user-cart", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const userData = await User.findById(id).populate("cart");
    const cart = userData.cart.reverse();
    return res.json({ data: cart });
  } catch (error) {
    console.log(error);

    return res.json({ message: "error occur" });
  }
});
module.exports = router;

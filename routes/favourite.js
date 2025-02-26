const router = require("express").Router();
const User = require("../models/User");
const { authenticateToken } = require("../middlewares/userAuth");
// add book to favourite
router.put("/add-book-to-favourite", authenticateToken, async (req, res) => {
  try {
    const { id, bookid } = req.headers;
    const userData = await User.findById(id);
    const isBookFavourite = userData.favourite.includes(bookid);
    if (isBookFavourite) {
      return res.status(200).json({ message: "already in favourites" });
    }
    await User.findByIdAndUpdate(id, { $push: { favourite: bookid } });
    return res.status(200).json({ message: "added to favourites" });
  } catch (error) {
    return res.status(500).json({ message: "interanl server error" });
  }
});

// delte book from favourite
router.put("/remove-favourite", authenticateToken, async (req, res) => {
  try {
    const { id, bookid } = req.headers;
    const userData = await User.findById(id);
    const isBookFavourite = userData.favourite.includes(bookid);
    if (isBookFavourite) {
      await User.findByIdAndUpdate(id, { $pull: { favourite: bookid } });
    }
    return res.status(200).json({ message: "remove book from favourites" });
  } catch (error) {
    return res.status(500).json({ message: "interanl server error" });
  }
});

// get favaourite of a particular user
router.get("/get-favourite-books", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const userData = await User.findById(id).populate("favourite");
    const favouriteBooks = userData.favourite;
    return res.status(200).json({ data: favouriteBooks });
  } catch (error) {
    return res.status(500).json({ message: "something went wront" });
  }
});

module.exports = router;

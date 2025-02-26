const router = require("express").Router();
const User = require("../models/User");
const Book = require("../models/books");
const { authenticateToken } = require("../middlewares/userAuth");

// book adding api
router.post("/add-book", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const user = await User.findById(id);
    if (user.role !== "admin") {
      return res
        .status(400)
        .json({ message: "your are not access for perform admin work" });
    }

    const book = new Book({
      url: req.body.url,
      title: req.body.title,
      author: req.body.author,
      price: req.body.price,
      desc: req.body.desc,
      language: req.body.language,
    });
    await book.save();
    res.status(200).json({ message: "book added successfully" });
  } catch (error) {
    // return res.status(400).json({ message: "internal  error" });
    console.log(error);
  }
});

// update book
router.put("/update-book", authenticateToken, async (req, res) => {
  try {
    const { bookid } = req.headers;
    await Book.findByIdAndUpdate(bookid, {
      url: req.body.url,
      title: req.body.title,
      desc: req.body.desc,
      author: req.body.author,
      price: req.body.price,
      language: req.body.language,
    });
    return res.status(200).json({ message: "book updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
});

// delete api
router.delete("/delete", authenticateToken, async (req, res) => {
  try {
    const { bookid } = req.headers;
    await Book.findByIdAndDelete(bookid);
    return res.status(200).json({ message: "book deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "something went wront" });
  }
});

// get all books
router.get("/get-all-books", async (req, res) => {
  try {
    const book = await Book.find().sort({ createdAt: -1 });
    return res.json({ data: book });
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
});

// get rencently added books
router.get("/get-recent-books", async (req, res) => {
  try {
    const book = await Book.find().sort({ createdAt: -1 }).limit(4);
    return res.json({ data: book });
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
});

// book detail

router.get("/get-book-by-id/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);
    return res.json({ data: book });
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
});

module.exports = router;

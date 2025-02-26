const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("../middlewares/userAuth");
// post api
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, address } = req.body;

    // check if user exist
    const existingEmail = await User.findOne({ email: email });
    if (existingEmail) {
      return res.status(400).json({ mesaage: "email exist" });
    }

    // create user
    const haspassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username: username,
      email: email,
      password: haspassword,
      address: address,
    });

    await newUser.save();
    return res.status(200).json({ mesaage: "register successsfully" });
  } catch (error) {
    res.json({ mesaage: "inetrnal server error" });
  }
});

// login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (!existingUser) {
      res.status(400).json({ message: "user not exists" });
    }
    await bcrypt.compare(password, existingUser.password, (err, data) => {
      if (data) {
        const authClaim = [
          {
            name: existingUser.username,
          },
          { role: existingUser.role },
        ];
        const token = jwt.sign({ authClaim }, "bookstore123");
        return res.status(200).json({
          id: existingUser._id,
          role: existingUser.role,
          token: token,
          message: "login successfull",
        });
      } else {
        return res.status(400).json({ message: "invlaid credentials" });
      }
    });
  } catch (error) {
    console.log(error);
  }
});

// getting user
router.get("/get-user-information", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const data = await User.findById(id).select("-password");
    return res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
});

// update address
router.put("/update-address", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { address } = req.body;
    await User.findById(id, { address: address });
    return res.status(200).json({ message: "address updated" });
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;

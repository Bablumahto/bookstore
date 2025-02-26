const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.status(401).json({ message: "auth token required" });
  }

  jwt.verify(token, "bookstore123", (err, user) => {
    if (err) {
      return res.status(402).json({ message: "token expired" });
    }
    req.user = user;
    next();
  });
};
module.exports = { authenticateToken };

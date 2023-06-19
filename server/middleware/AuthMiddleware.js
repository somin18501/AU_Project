const User = require("../models/UserModel");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const jwtSecret = "bjhfewf74926966jheufuf";

module.exports.userVerification = (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.json({ status: false })
  }
  jwt.verify(token, jwtSecret, async (err, data) => {
    if (err) {
      return res.json({ status: false })
    } else {
      const user = await User.findById(data.id)
      if (user) return res.json({ status: true, user: user.username })
      else return res.json({ status: false })
    }
  })
}
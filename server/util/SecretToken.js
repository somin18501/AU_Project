const dotenv = require('dotenv');
dotenv.config();
const jwt = require("jsonwebtoken");

const jwtSecret = "bjhfewf74926966jheufuf";

module.exports.createSecretToken = (id) => {
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: 3 * 24 * 60 * 60,
  });
};
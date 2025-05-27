var jwt = require("jsonwebtoken"); // jwt 모듈
require("dotenv").config();

const ensureAuthorization = (req, res) => {
  try {
    let receivedJwt = req.headers["authorization"];
    let decodedJwt = jwt.verify(receivedJwt, process.env.PRIVATE_KEY);

    return decodedJwt;
  } catch (err) {
    console.log(err.name);
    console.log(err.message);
    return err;
  }
};

module.exports = ensureAuthorization;

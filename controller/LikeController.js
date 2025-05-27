const connection = require("../mariadb");
const { StatusCodes } = require("http-status-codes");
var jwt = require("jsonwebtoken"); // jwt 모듈

require("dotenv").config();

const addLike = (req, res) => {
  const book_id = req.params.id;
  const authorization = ensureAuthorization(req);

  let sql = "INSERT INTO likes (user_id, liked_book_id) VALUES (?, ?);";
  let values = [authorization.id, book_id];
  connection.query(sql, values, (err, result) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    return res.status(StatusCodes.OK).json(result);
  });
};

const removeLike = (req, res) => {
  const book_id = req.params.id;
  const authorization = ensureAuthorization(req);
  let sql = "DELETE FROM likes WHERE user_id=? AND liked_book_id=?";

  let values = [authorization.id, book_id];
  connection.query(sql, values, (err, result) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    return res.status(StatusCodes.OK).json(result);
  });
};

const ensureAuthorization = (req) => {
  let receivedJwt = req.headers["authorization"];
  let decodedJwt = jwt.verify(receivedJwt, process.env.PRIVATE_KEY);
  return decodedJwt;
};

module.exports = { addLike, removeLike };

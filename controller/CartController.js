const ensureAuthorization = require("../authorization");
const connection = require("../mariadb");
const { StatusCodes } = require("http-status-codes");
require("dotenv").config();
var jwt = require("jsonwebtoken"); // jwt 모듈

const addCart = (req, res) => {
  const { book_id, quantity } = req.body;
  const authorization = ensureAuthorization(req, res);

  if (authorization instanceof jwt.TokenExpiredError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "로그인 세션이 만료되었습니다. 다시 로그인 하세요.",
    });
  } else if (authorization instanceof jwt.JsonWebTokenError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "잘못된 토큰입니다.",
    });
  } else {
    let sql = `INSERT INTO cartItems (book_id, quantity, user_id) VALUES (?, ?, ?)`;
    let values = [book_id, quantity, authorization.id];
    connection.query(sql, values, (err, result) => {
      if (err) {
        return res.status(StatusCodes.BAD_REQUEST).end();
      }

      return res.status(StatusCodes.OK).json(result);
    });
  }
};

const getCartItems = (req, res) => {
  const { selected } = req.body;
  const authorization = ensureAuthorization(req, res);

  console.log(authorization);

  if (authorization instanceof jwt.TokenExpiredError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "로그인 세션이 만료되었습니다. 다시 로그인 하세요.",
    });
  } else if (authorization instanceof jwt.JsonWebTokenError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "잘못된 토큰입니다.",
    });
  } else {
    let sql = `SELECT cartItems.id, book_id, title, summary, quantity, price 
    FROM cartItems
    LEFT JOIN books ON books.id=cartItems.book_id
    WHERE user_id=? `;
    let values = [authorization.id];
    if (selected) {
      sql += `AND cartItems.id IN (?)`;
      values.push(selected);
    }

    connection.query(sql, values, (err, result) => {
      if (err) {
        return res.status(StatusCodes.BAD_REQUEST).end();
      }
      return res.status(StatusCodes.OK).json(result);
    });
  }
};

const removeCartItems = (req, res) => {
  const cartItemId = req.param.id;
  let sql = `DELETE FROM cartItems WHERE id=?`;
  connection.query(sql, cartItemId, (err, result) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    return res.status(StatusCodes.OK).json(result);
  });
};

module.exports = { addCart, getCartItems, removeCartItems };

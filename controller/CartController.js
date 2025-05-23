const connection = require("../mariadb");
const { StatusCodes } = require("http-status-codes");

const addCart = (req, res) => {
  const { id } = req.params;
  const { book_id, quantity, user_id } = req.body;

  let sql = `INSERT INTO cartItems (book_id, quantity, user_id) VALUES (?, ?, ?)`;

  let values = [book_id, quantity, user_id];
  connection.query(sql, values, (err, result) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    return res.status(StatusCodes.OK).json(result);
  });
};

const getCartItems = (req, res) => {
  const { user_id, selected } = req.body;

  let sql = `SELECT cartItems.id, book_id, title, summary, quantity, price 
            FROM cartItems
            LEFT JOIN books ON books.id=cartItems.book_id
            WHERE user_id=? `;
  let values = [user_id];

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
};

const removeCartItems = (req, res) => {
  const { id } = req.params;

  let sql = `DELETE FROM cartItems WHERE id=?`;

  connection.query(sql, id, (err, result) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    return res.status(StatusCodes.OK).json(result);
  });
};

const selectCartItems = (req, res) => {};

module.exports = { addCart, getCartItems, removeCartItems };

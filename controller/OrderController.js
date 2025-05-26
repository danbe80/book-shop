// const connection = require("../mariadb");
const mysql = require("mysql2/promise");
const { StatusCodes } = require("http-status-codes");

const order = async (req, res) => {
  const { items, delivery, totalQuantity, totalPrice, userId, firstBookTitle } =
    req.body;

  const conn = await mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: process.env.DB_PASSWORD,
    database: "BookShop",
    dateStrings: true, // YYYY-MM-DD HH:MM:SS
  });

  let sql = `INSERT INTO
              delivery (address, receiver, contact)
              VALUES (?, ?, ?)`;
  let values = [delivery.address, delivery.receiver, delivery.contact];
  let [result] = await conn.execute(sql, values);
  let delivery_id = result.insertId;

  sql = `INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id)
    VALUES ( ?, ?, ?, ?, ?)`;
  values = [firstBookTitle, totalQuantity, totalPrice, userId, delivery_id];
  [result] = await conn.execute(sql, values);
  let order_id = result.insertId;

  // items를 가지고, 장바구니에서 book_id, quantity 조회
  sql = `SELECT book_id, quantity FROM cartItems WHERE id IN (?)`;
  let [orderItems, fields] = await conn.query(sql, [items]);

  sql = `INSERT INTO orderedBook (order_id, book_id, quantity) VALUES ?;`;
  // items.. 배열 : 요소들을 하나씩 꺼내 (foreach문 돌려서)
  values = [];
  orderItems.forEach((item) =>
    values.push([order_id, item.book_id, item.quantity])
  );
  result = await conn.query(sql, [values]);

  // 장바구니 삭제
  result = deleteCartItem(conn, items);

  return res.status(StatusCodes.OK).json(result);
};

const deleteCartItem = async (conn, items) => {
  let sql = `DELETE FROM cartItems WHERE id IN (?)`;

  let result = await conn.query(sql, [items]);
  return result;
};

const getOrders = async (req, res) => {
  const conn = await mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: process.env.DB_PASSWORD,
    database: "BookShop",
    dateStrings: true, // YYYY-MM-DD HH:MM:SS
  });

  let sql = `SELECT orders.id, created_at, address, receiver, contact, book_title, total_quantity, total_price
                FROM orders LEFT JOIN delivery
                ON orders.delivery_id = delivery.id`;

  let [rows, fields] = await conn.query(sql);

  return res.status(StatusCodes.OK).json(rows);
};

const getOrderDetail = async (req, res) => {
  const { id } = req.params;

  const conn = await mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: process.env.DB_PASSWORD,
    database: "BookShop",
    dateStrings: true, // YYYY-MM-DD HH:MM:SS
  });

  let sql = `SELECT book_id, title, author, price, quantity
                    FROM orderedBook LEFT JOIN books
                    ON orderedBook.book_id = books.id
                    WHERE order_id=?`;

  let [rows, fields] = await conn.query(sql, id);

  return res.status(StatusCodes.OK).json(rows);
};

module.exports = { order, getOrderDetail, getOrders };

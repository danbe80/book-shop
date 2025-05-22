const connection = require("../mariadb");
const { StatusCodes } = require("http-status-codes");

const allBooks = (req, res) => {
  let { category_id, news, limit, currentPage } = req.query;
  let offset = limit * (currentPage - 1);
  let sql = `SELECT *, 
  (SELECT count(*) FROM likes WHERE liked_book_id=books.id) AS likes 
  FROM books`;
  let values = [];

  if (category_id) {
    sql += " WHERE category_id=? ";
    values.push(category_id);
  }
  if (news) {
    sql += category_id ? "AND" : "WHERE";
    sql += " pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH ) AND NOW()";
  }

  sql += ` LIMIT ? OFFSET ?`;
  values.push(parseInt(limit), offset);

  connection.query(sql, values, (err, result) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    if (result.length) return res.status(StatusCodes.OK).json(result);
    else return res.status(StatusCodes.NOT_FOUND).end();
  });
};

const bookDetail = (req, res) => {
  const { user_id } = req.body;
  const book_id = parseInt(req.params.id);
  let sql = `SELECT *,
            (SELECT count(*) FROM likes WHERE liked_book_id=books.id) AS likes,
            (SELECT EXISTS (SELECT * FROM BookShop.likes WHERE user_id=? AND liked_book_id=?)) AS liked 
            FROM books 
            LEFT JOIN category ON books.category_id=category.category_id 
            WHERE books.id=?`;
  let values = [user_id, book_id, book_id];
  connection.query(sql, values, (err, result) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    if (result[0]) return res.status(StatusCodes.OK).json(result[0]);
    else return res.status(StatusCodes.NOT_FOUND).end();
  });
};

module.exports = { allBooks, bookDetail };

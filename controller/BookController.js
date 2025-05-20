const connection = require("../mariadb");
const { StatusCodes } = require("http-status-codes");

const allBooks = (req, res) => {
  let { category_id } = req.query;
  if (category_id) {
    let sql = "SELECT * FROM books WHERE category_id=?";

    connection.query(sql, category_id, (err, result) => {
      if (err) {
        return res.status(StatusCodes.BAD_REQUEST).end();
      }
      if (result.length) return res.status(StatusCodes.OK).json(result);
      else return res.status(StatusCodes.NOT_FOUND).end();
    });
  } else {
    let sql = "SELECT * FROM books";

    connection.query(sql, (err, result) => {
      if (err) {
        return res.status(StatusCodes.BAD_REQUEST).end();
      }
      return res.status(StatusCodes.OK).json(result);
    });
  }
};

const bookDetail = (req, res) => {
  const id = parseInt(req.params.id);
  let sql = "SELECT * FROM books WHERE id=?";

  connection.query(sql, id, (err, result) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    if (result[0]) return res.status(StatusCodes.OK).json(result[0]);
    else return res.status(StatusCodes.NOT_FOUND).end();
  });
};

// const categoryBooks = (req, res) => {
//   let { category_id } = req.query;
//   if (!category_id) {
//   }

//   let sql = "SELECT * FROM books WHERE category_id=?";

//   connection.query(sql, category_id, (err, result) => {
//     if (err) {
//       return res.status(StatusCodes.BAD_REQUEST).end();
//     }
//     if (result.length) return res.status(StatusCodes.OK).json(result);
//     else return res.status(StatusCodes.NOT_FOUND).end();
//   });
// };

module.exports = { allBooks, bookDetail };

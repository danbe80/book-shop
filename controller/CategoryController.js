const connection = require("../mariadb");
const { StatusCodes } = require("http-status-codes");

const allCategory = (req, res) => {
  let sql = "SELECT * FROM category";

  connection.query(sql, (err, result) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    return res.status(StatusCodes.OK).json(result);
  });
};

module.exports = { allCategory };

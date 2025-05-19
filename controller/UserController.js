const connection = require("../mariadb");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const crypto = require("crypto"); // 암호화
require("dotenv").config();

const join = (req, res) => {
  const { email, password } = req.body;
  let sql = "INSERT INTO users (email, password, salt) VALUES (?, ?, ?)";

  // 암호화된 비밀번호와 salt 값을 같이 저장
  const salt = crypto.randomBytes(10).toString("base64");
  const hashPassword = crypto
    .pbkdf2Sync(password, salt, 10000, 10, "sha512")
    .toString("base64");

  let values = [email, hashPassword, salt];
  connection.query(sql, values, (err, result) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    res.status(StatusCodes.CREATED).send("회원가입이 완료되었습니다.");
  });
};

const login = (req, res) => {
  const { email, password } = req.body;

  let sql = "SELECT * FROM `users` WHERE email = ?";
  connection.query(sql, email, (err, result) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    let loginUser = result[0];

    // salt값 꺼내서 비밀번호 암호화 해보고
    const hashPassword = crypto
      .pbkdf2Sync(password, loginUser.salt, 10000, 10, "sha512")
      .toString("base64");

    // => 디비 비밀번호와 비교
    if (loginUser && loginUser.password == hashPassword) {
      // token 발급
      const token = jwt.sign(
        {
          email: loginUser.email,
        },
        process.env.PRIVATE_KEY,
        {
          expiresIn: "5m",
          issuer: "hyerin",
        }
      );
      // 토큰 쿠키에 담기
      res.cookie("token", token, {
        httpOnly: true,
      });

      res.status(StatusCodes.OK).json({
        message: `로그인 되었습니다. 어서오세요. ${loginUser.email}님`,
      });
    } else {
      res.status(StatusCodes.UNAUTHORIZED).json({
        message: "이메일 또는 비밀번호가 틀렸습니다.",
      }); // 401 : Unauthorized(비인증), 403 : Forbidden (접근 권리 없음)
    }
  });
};

const passwordResetRequest = (req, res) => {
  const { email } = req.body;

  let sql = "SELECT * FROM `users` WHERE email = ?";
  connection.query(sql, email, (err, result) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    const findUser = result[0];

    if (findUser) {
      return res.status(StatusCodes.OK).json({
        email: email,
      });
    } else {
      return res.status(StatusCodes.UNAUTHORIZED).end();
    }
  });
};

const passwordReset = (req, res) => {
  const { password, email } = req.body;
  const salt = crypto.randomBytes(10).toString("base64");
  const hashPassword = crypto
    .pbkdf2Sync(password, salt, 10000, 10, "sha512")
    .toString("base64");

  let sql = "UPDATE users SET password=?, salt=? WHERE email=?";

  let values = [hashPassword, salt, email];

  connection.query(sql, values, (err, result) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    if (result.affectedRows == 0) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    } else {
      return res.status(StatusCodes.OK).json(result);
    }
  });
};

module.exports = { join, login, passwordResetRequest, passwordReset };

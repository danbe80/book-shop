const express = require("express");
const { body, param, validationResult } = require("express-validator");
const router = express.Router();

const connection = require("../mariadb");
const jwt = require("jsonwebtoken");

router.use(express.json());

const validate = (req, res, next) => {
  const err = validationResult(req);
  if (err.isEmpty()) {
    next();
  } else {
    return res.status(400).json(err.array());
  }
};

router.post(
  "/join",
  [
    body("email").notEmpty().isEmail().withMessage("이메일 확인 필요"),
    body("password").notEmpty().isString().withMessage("비밀번호 확인 필요"),
    validate,
  ],
  (res, req) => {
    const { email, password } = req.body;

    let sql = "INSERT INTO users (email, password) VALUES (?, ?)";
    let values = [email, password];
    connection.query(sql, values, (err, result) => {
      if (err) {
        return res.status(400).end();
      }

      res.status(201).send("회원가입이 완료되었습니다.");
    });
  }
);

router.post(
  "/login",
  [
    body("email").notEmpty().isEmail().withMessage("이메일 필요"),
    body("password").notEmpty().isString().withMessage("비밀번호 입력 필요"),
    validate,
  ],
  (res, req) => {
    const { email, password } = req.body;

    let sql = "SELECT * FROM `users` WHERE email = ?";
    connection.query(sql, email, (err, result) => {
      let loginUser = result[0];
      if (err) {
        return res.status(400).end();
      }
      if (loginUser && loginUser.password == password) {
        // token 발급
        const token = jwt.sign(
          {
            email: loginUser.email,
          },
          process.env.PRIVATE_KEY,
          {
            expiresIn: "30m",
            issuer: "hyerin",
          }
        );

        res.cookie("token", token, {
          httpOnly: true,
        });

        res.status(200).json({
          message: `로그인 되었습니다. 어서오세요. ${loginUser.email}님`,
        });
      } else {
        res.status(403).json({
          message: "이메일 또는 비밀번호가 틀렸습니다.",
        });
      }
    });
  }
);

router.post("/reset", (res, req) => {});

router.put("/reset", (res, req) => {});

module.exports = router;

const express = require("express");
const router = express.Router();
const { body, param, validationResult } = require("express-validator");
const {
  join,
  login,
  passwordReset,
  passwordResetRequest,
} = require("../controller/UserController");
// router.use(express.json());

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
  join
);

router.post(
  "/login",
  [
    body("email").notEmpty().isEmail().withMessage("이메일 필요"),
    body("password").notEmpty().isString().withMessage("비밀번호 입력 필요"),
    validate,
  ],
  login
);

router.post("/reset", passwordResetRequest);

router.put("/reset", passwordReset);

module.exports = router;

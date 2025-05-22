const express = require("express");
const router = express.Router();

const { allBooks, bookDetail } = require("../controller/BookController");

// router.use(express.json());

//전체 조회에게 우선 순위가 밀리므로
//쿼리값이 있으면 카테고리 조회 먼저 실행하도록 순서를 위로 올려준다.
// router.get("/", categoryBooks);

router.get("/", allBooks);

router.get("/:id", bookDetail);

module.exports = router;

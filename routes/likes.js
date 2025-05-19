const express = require("express");
const router = express.Router();

router.use(express.json());

router.post("/:id", (res, req) => {});

router.delete("/:id", (res, req) => {});

module.exports = router;

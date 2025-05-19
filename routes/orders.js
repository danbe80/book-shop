const express = require("express");
const router = express.Router();

router.use(express.json());

router.post("/:id", (res, req) => {});

router.get("/", (res, req) => {});

router.get("/:id", (res, req) => {});

module.exports = router;

const express = require("express");
const router = express.Router();

router.use(express.json());

router.post("/", (res, req) => {});

router.get("/", (res, req) => {});

router.delete("/:id", (res, req) => {});

router.get("/", (res, req) => {});

module.exports = router;

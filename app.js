const express = require("express");
const app = express();
const bodyParser = require("body-parser");

require("dotenv").config();

app.listen(process.env.PORT);
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.json());

const userRouter = require("./routes/users");
const bookRouter = require("./routes/books");
const orderRouter = require("./routes/orders");
const likeRouter = require("./routes/likes");
const cartRouter = require("./routes/carts");

app.use("/users", userRouter);
app.use("/books", bookRouter);
app.use("/orders", orderRouter);
app.use("/likes", likeRouter);
app.use("/carts", cartRouter);

app.use((req, res, next) => {
  console.log("🔥 요청 도착!");
  console.log("Method:", req.method);
  console.log("URL:", req.originalUrl);
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  res.status(200).send("요청 받음");
});

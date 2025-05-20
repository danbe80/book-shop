const express = require("express");
const app = express();
const bodyParser = require("body-parser");

require("dotenv").config();

app.listen(process.env.PORT);
app.use(express.json());

const userRouter = require("./routes/users");
const bookRouter = require("./routes/books");
const categoryRouter = require("./routes/category");
const orderRouter = require("./routes/orders");
const likeRouter = require("./routes/likes");
const cartRouter = require("./routes/carts");

app.use("/users", userRouter);
app.use("/books", bookRouter);
app.use("/category", categoryRouter);
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

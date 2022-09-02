require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const authRouter = require("./routes/authRoute");
const userRouter = require("./routes/userRoute");
const friendRouter = require("./routes/friendRoute");
const postRouter = require("./routes/postRoute");
const allPostRouter = require("./routes/allPostRoute");

const authenticate = require("./middlewares/authenticate");
const notFoundMiddleware = require("./middlewares/notFound");
const errorMiddleware = require("./middlewares/error");

app.use(cors({credentials:true}));
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get("/test", (req, res) => {
 
  res.send({cookie: req.cookies})
});

app.use("/auth",authRouter);
app.use("/users", authenticate, userRouter);
app.use("/friends", authenticate, friendRouter);
app.use("/posts", authenticate, postRouter);
app.use("/allposts",authenticate,allPostRouter);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const port = process.env.PORT || 8000;
app.listen(port, () => console.log("server run on port: " + port));

require('dotenv').config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const corsOptions = require ('./config/corsOptions')
const { logger } = require("./middleware/logEvent");
const errorHandler = require("./middleware/errHandler");
const verifyJWT = require ('./middleware/verifyJWT')
const cookieParser = require ('cookie-parser')
const credentials = require ('./middleware/credential')
const mongoose = require("mongoose");
const connectDB = require("./config/dbConnect");
const PORT = process.env.PORT || 4500;

//Connect to Mongodb
connectDB();

//custom middleware logger
app.use(logger);

//Handle options credentials checkes before CORS and fetch cookies credential requirement
app.use(credentials);

//cross origin resource sharing
app.use(cors(corsOptions));

//built-in middleware for form Data
app.use(express.urlencoded({ extended: false }));

//buit-in middleware for json
app.use(express.json());

//middleware for cookie parser
app.use(cookieParser());

//built-in middleware for static files
app.use("/", express.static(path.join(__dirname, "/public")));

//routes
app.use("/", require("./routes/root"));
app.use("/register", require("./routes/api/register"));
app.use("/auth", require("./routes/api/auth"));
app.use("/refresh", require("./routes/api/refresh"));
app.use("/logout", require("./routes/api/logout"));

// app.use(verifyJWT);
app.use("/employees", require("./routes/api/employees"));

//app.use('/')
app.all(/.*/, (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("MongoDB connected successfully.");
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
});

//Route handlers
// app.get(
//   "/hello.html",
//   (req, res, next) => {
//     console.log("Attempted to load hello.html");
//     next();
//   },
//   (req, res) => {
//     res.send("Hello World!");
//   }
// );

// const one = (req,res,next) =>{
//   console.log('one');
//   next();
// }

// const two = (req,res,next) =>{
//   console.log('two');
//   next();
// }

// const three = (req,res) =>{
//   console.log('three');
//   res.send('Finished!');
// }

// app.get('/chain.html', [one,two,three]);

// app.get(
//   "/chain.html",
//   (req, res, next) => {
//     console.log("one");
//     next();
//   },
//   (req, res, next) => {
//     console.log("two");
//     next();
//   },
//   (req, res) => {
//     console.log("three");
//     res.send("Finished!");
//   }
// );

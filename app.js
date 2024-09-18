if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const router = require("./routes");
const cors = require("cors");

// const corsOptions = {
//   origin: "http://localhost:5173",
//   methods: "GET,POST,PUT,DELETE,PATCH",
//   allowedHeaders: "Content-Type,Authorization",
// };

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", router);

module.exports = app;

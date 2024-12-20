const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const { db } = require("./db");

dotenv.config();
const app = express();

const port = process.env.PORT || 5000;

db.connect((err) => {
  if (err) {
    console.error(err);
  } else {
    console.log("Connected to the MySQL database!");
  }
});

app.listen(port, () => {
  console.log("Server is running on port " + port);
});

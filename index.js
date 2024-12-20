const express = require("express");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();
const app = express();

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log("Server is running on port " + port);
});

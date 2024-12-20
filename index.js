const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const { db } = require("./db");
const routerUsers = require("./src/routes/users");
const routerAuth = require("./src/routes/auth");

dotenv.config();
const app = express();
app.use(express.json());

const port = process.env.PORT || 5000;

app.use("/auth", routerAuth);
app.use("/users", routerUsers);

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

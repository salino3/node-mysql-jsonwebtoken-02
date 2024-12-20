const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const routerUsers = require("./src/routes/users");
const routerAuth = require("./src/routes/auth");

dotenv.config();
const app = express();
app.use(express.json());

const port = process.env.PORT || 5000;

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.FRONT_END_PORT
        : "http://localhost:3000",
    credentials: true,
  })
);

app.use("/auth", routerAuth);
app.use("/users", routerUsers);

if (process.env.NODE_ENV === "production") {
  console.log("Running in production mode");
} else if (process.env.NODE_ENV === "development") {
  console.log("Running in development mode");
} else {
  console.log("Unknown environment");
}

app.listen(port, () => {
  console.log("Server is running on port " + port);
});

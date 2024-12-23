const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const routerAuth = require("./src/routes/auth");
const routerUsers = require("./src/routes/users");
const routerCompanies = require("./src/routes/companies");
const routerWorkRelationships = require("./src/routes/work_relationships");

dotenv.config();
const app = express();
app.use(express.json());

const port = process.env.PORT || 5000;

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.FRONT_END_PORT
        : "http://localhost:7000",
    credentials: true,
  })
);

app.use("/auth", routerAuth);
app.use("/users", routerUsers);
app.use("/companies", routerCompanies);
app.use("/work_relationships", routerWorkRelationships);

//
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

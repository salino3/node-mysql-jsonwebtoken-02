const express = require("express");
const authController = require("../controllers/auth");

const routerAuth = express.Router();

routerAuth.post("/register", authController?.register);

routerAuth.post("/login", authController.login);

module.exports = routerAuth;

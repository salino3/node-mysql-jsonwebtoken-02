const express = require("express");
const authController = require("../controllers/auth");

const routerAuth = express.Router();

routerAuth.post("/users/register", authController?.registerUser);

routerAuth.post("/users/login", authController.loginUser);

routerAuth.post("/companies/register", authController?.registerCompany);

routerAuth.post("/companies/login", authController.loginCompany);

module.exports = routerAuth;

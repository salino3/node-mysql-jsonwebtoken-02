const express = require("express");
const usersController = require("../controllers/users");

const routerUsers = express.Router();

routerUsers.get("/", usersController?.getUsers);

module.exports = routerUsers;

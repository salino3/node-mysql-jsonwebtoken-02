const express = require("express");
const usersController = require("../controllers/users");

const routerUsers = express.Router();

routerUsers.get("/users", usersController?.getUsers);

module.exports = routerUsers;

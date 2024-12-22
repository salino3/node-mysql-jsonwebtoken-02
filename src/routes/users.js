const express = require("express");
const usersController = require("../controllers/users");

const routerUsers = express.Router();

routerUsers.get("/", usersController?.getUsers);

routerUsers.delete("/:id", usersController?.deleteUser);

routerUsers.put("/:id", usersController?.updateUser);

module.exports = routerUsers;

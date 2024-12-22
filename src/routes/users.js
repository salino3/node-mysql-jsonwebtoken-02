const express = require("express");
const usersController = require("../controllers/users");

const routerUsers = express.Router();

routerUsers.get("/", usersController?.getUsers);

routerUsers.get("/:id", usersController?.getUserById);

routerUsers.get("/email/:email", usersController?.getUserByEmail);

routerUsers.put("/:id", usersController?.updateUser);

routerUsers.patch("/:id", usersController?.changePasswordUser);

routerUsers.delete("/:id", usersController?.deleteUser);

module.exports = routerUsers;

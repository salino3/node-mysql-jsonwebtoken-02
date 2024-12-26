const express = require("express");
const usersController = require("../controllers/users");
const { verifyJWT } = require("../middleware/verify-token");

const routerUsers = express.Router();

routerUsers.get("/", usersController?.getUsers);

routerUsers.get("/:id", usersController?.getUserById);

routerUsers.get("/email/:email", usersController?.getUserByEmail);

routerUsers.put("/:id", verifyJWT("id"), usersController?.updateUser);

routerUsers.patch("/:id", verifyJWT, usersController?.changePasswordUser);

routerUsers.delete("/:id", verifyJWT, usersController?.deleteUser);

module.exports = routerUsers;

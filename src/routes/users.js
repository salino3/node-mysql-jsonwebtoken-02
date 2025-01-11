const express = require("express");
const usersController = require("../controllers/users");
const { verifyJWT } = require("../middleware/verify-token");

const routerUsers = express.Router();

routerUsers.get("/", usersController?.getUsers);

routerUsers.get("/batch/get", usersController?.getBatchUsers);

routerUsers.get("/:id", usersController?.getUserById);

routerUsers.get("/email/:email", usersController?.getUserByEmail);

routerUsers.put("/:id", verifyJWT("id"), usersController?.updateUser);

routerUsers.patch("/:id", verifyJWT("id"), usersController?.changePasswordUser);

routerUsers.delete("/:id", verifyJWT("id"), usersController?.deleteUser);

module.exports = routerUsers;

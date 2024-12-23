const express = require("express");
const companiesController = require("../controllers/users");

const routerCompanies = express.Router();

routerCompanies.get("/", companiesController?.getUsers);

routerCompanies.get("/:id", companiesController?.getUserById);

routerCompanies.get("/email/:email", companiesController?.getUserByEmail);

routerCompanies.put("/:id", companiesController?.updateUser);

routerCompanies.patch("/:id", companiesController?.changePasswordUser);

routerCompanies.delete("/:id", companiesController?.deleteUser);

module.exports = routerCompanies;

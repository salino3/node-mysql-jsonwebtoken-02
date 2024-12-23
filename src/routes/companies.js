const express = require("express");
const companiesController = require("../controllers/companies");

const routerCompanies = express.Router();

routerCompanies.get("/", companiesController?.getCompanies);

routerCompanies.get("/:id", companiesController?.getCompanyById);

routerCompanies.get("/email/:email", companiesController?.getCompanyByEmail);

routerCompanies.put("/:id", companiesController?.updateCompany);

routerCompanies.patch("/:id", companiesController?.changePasswordCompany);

routerCompanies.delete("/:id", companiesController?.deleteCompany);

module.exports = routerCompanies;

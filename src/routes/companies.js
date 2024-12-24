const express = require("express");
const companiesController = require("../controllers/companies");
const { verifyJWT } = require("../middleware/verify-token");

const routerCompanies = express.Router();

routerCompanies.get("/", companiesController?.getCompanies);

routerCompanies.get("/:id", companiesController?.getCompanyById);

routerCompanies.get("/email/:email", companiesController?.getCompanyByEmail);

routerCompanies.put("/:id", verifyJWT, companiesController?.updateCompany);

routerCompanies.patch(
  "/:id",
  verifyJWT,
  companiesController?.changePasswordCompany
);

routerCompanies.delete("/:id", verifyJWT, companiesController?.deleteCompany);

module.exports = routerCompanies;

const express = require("express");
const companiesController = require("../controllers/companies");
const { verifyJWT } = require("../middleware/verify-token");

const routerCompanies = express.Router();

routerCompanies.get("/", companiesController?.getCompanies);

routerCompanies.get("/batch/get", companiesController?.getBatchCompanies);

routerCompanies.get("/:id", companiesController?.getCompanyById);

routerCompanies.get("/email/:email", companiesController?.getCompanyByEmail);

routerCompanies.put(
  "/:id",
  verifyJWT("id"),
  companiesController?.updateCompany
);

routerCompanies.patch(
  "/:id",
  verifyJWT("id"),
  companiesController?.changePasswordCompany
);

routerCompanies.delete(
  "/:id",
  verifyJWT("id"),
  companiesController?.deleteCompany
);

module.exports = routerCompanies;

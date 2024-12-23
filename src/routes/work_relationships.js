const express = require("express");
const workRelationshipsController = require("../controllers/work_relationships");

const routerWorkRelationships = express.Router();

routerWorkRelationships.post(
  "/pending/:id",
  workRelationshipsController.pendingRelationship
);

module.exports = routerWorkRelationships;

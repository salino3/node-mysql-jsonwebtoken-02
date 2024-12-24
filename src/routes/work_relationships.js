const express = require("express");
const workRelationshipsController = require("../controllers/work_relationships");

const routerWorkRelationships = express.Router();

routerWorkRelationships.post(
  "/pending/:userId",
  workRelationshipsController.pendingRelationship
);

routerWorkRelationships.patch(
  "/active/:companyId",
  workRelationshipsController.activeRelationship
);

// routerWorkRelationships.delete(
//   "/left",
//   workRelationshipsController.leftRelationship
// );

module.exports = routerWorkRelationships;

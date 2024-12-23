const express = require("express");
const workRelationshipsController = require("../controllers/work_relationships");

const routerWorkRelationships = express.Router();

routerWorkRelationships.post(
  "/pending/:id",
  workRelationshipsController.pendingRelationship
);

// routerWorkRelationships.delete(
//   "/left",
//   workRelationshipsController.leftRelationship
// );

// routerWorkRelationships.post(
//   "/active/:id",
//   workRelationshipsController.activeRelationship
// );

module.exports = routerWorkRelationships;

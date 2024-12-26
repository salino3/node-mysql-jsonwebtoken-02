const express = require("express");
const workRelationshipsController = require("../controllers/work_relationships");
const { verifyJWT } = require("../middleware/verify-token");

const routerWorkRelationships = express.Router();

routerWorkRelationships.post(
  "/pending/:userId",
  verifyJWT("userId"),
  workRelationshipsController.pendingRelationship
);

routerWorkRelationships.patch(
  "/active/:companyId",
  verifyJWT("companyId"),
  workRelationshipsController.activeRelationship
);

routerWorkRelationships.delete(
  "/left/:userId/:companyId",
  verifyJWT(""),
  workRelationshipsController.leftRelationship
);

module.exports = routerWorkRelationships;

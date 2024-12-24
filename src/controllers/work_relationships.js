const { db } = require("../../db");
require("dotenv").config();

const pendingRelationship = async (req, res) => {
  const dbName = process.env.DB_NAME;
  const userId = req.params.userId;
  const { company_id, role } = req.body;
  try {
    // Verify if the company exist and already has a relationship
    const [existingRelationship] = await db.promise().query(
      `SELECT 
        c.id AS company_id, 
        r.id AS relationship_id
     FROM \`${dbName}\`.companies c
     LEFT JOIN \`${dbName}\`.work_relationships r ON c.id = r.company_id AND r.user_id = ?
     WHERE c.id = ?`,
      [userId, company_id]
    );

    // Check if the company exist
    if (existingRelationship.length === 0) {
      return res.status(400).send({ message: "Company does not exist." });
    }

    // Check if the relation already exist
    if (existingRelationship[0].relationship_id) {
      return res.status(400).send({
        message: "User already has a relationship with this company.",
      });
    }

    await db
      .promise()
      .query(
        `INSERT INTO \`${dbName}\`.work_relationships (user_id, company_id, role, status) VALUES (?, ?, ?, 'pending')`,
        [userId, company_id, role]
      );

    return res.status(201).send({
      message: "Relationship created successfully, pending approval.",
    });
  } catch (error) {
    return res.status(500).send({ message: "Error: " + error });
  }
};

const activeRelationship = async (req, res) => {
  const dbName = process.env.DB_NAME;
  const companyId = req.params.companyId;
  const { user_id } = req.body;
  try {
    // Verify if the user exist and already has a relationship
    const [existingRelationship] = await db.promise().query(
      `SELECT 
         u.id AS user_id,
         r.id AS relationship_id,
         r.status AS relationship_status
       FROM \`${dbName}\`.users u
       LEFT JOIN \`${dbName}\`.work_relationships r 
         ON u.id = r.user_id AND r.company_id = ?
       WHERE u.id = ?`,
      [companyId, user_id]
    );

    // Verify if user exists
    if (existingRelationship.length === 0) {
      return res.status(400).send({ message: "User does not exist." });
    }

    // Verify if a relationship exists
    if (!existingRelationship[0].relationship_id) {
      return res.status(400).send({
        message: "No relationship exists with this company.",
      });
    }

    // Verify if the status is 'pending'
    if (existingRelationship[0].relationship_status !== "pending") {
      return res.status(400).send({
        message: "Relationship is not pending.",
      });
    }

    // Update the relationship status to 'active'
    await db.promise().query(
      `UPDATE \`${dbName}\`.work_relationships 
         SET status = 'active' 
         WHERE id = ?`,
      [existingRelationship[0].relationship_id]
    );

    return res.status(200).send({
      message: "Relationship activated successfully.",
    });
  } catch (error) {
    return res.status(500).send({ message: "Error: " + error });
  }
};

const leftRelationship = async (req, res) => {
  const dbName = process.env.DB_NAME;
  const { companyId, userId } = req.params;

  try {
    // Verify if the relationship exists and status is 'active'
    const [existingRelationship] = await db.promise().query(
      `SELECT id, status 
       FROM \`${dbName}\`.work_relationships 
       WHERE user_id = ? AND company_id = ?`,
      [userId, companyId]
    );

    // Verify if relationship exists
    if (existingRelationship.length === 0) {
      return res.status(400).send({
        message: "No relationship exists between this user and company.",
      });
    }

    // Verify if status is 'left'
    if (existingRelationship[0].status === "left") {
      return res.status(400).send({
        message: "Relationship is already deleted.",
      });
    }

    // Verify if status is 'active'
    if (existingRelationship[0].status !== "active") {
      return res.status(400).send({
        message: "Relationship is not active, cannot delete.",
      });
    }

    await db.promise().query(
      `UPDATE \`${dbName}\`.work_relationships 
       SET status = 'left' 
       WHERE user_id = ? AND company_id = ?`,
      [userId, companyId]
    );

    return res.status(200).send({
      message: "Relationship status updated to 'left'.",
    });
  } catch (error) {
    return res.status(500).send({ message: "Error: " + error });
  }
};

module.exports = { pendingRelationship, activeRelationship, leftRelationship };

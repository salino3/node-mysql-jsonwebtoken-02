const { db } = require("../../db");
require("dotenv").config();

const pendingRelationship = async (req, res) => {
  const dbName = process.env.DB_NAME;
  const userId = req.params.id;
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

module.exports = { pendingRelationship };

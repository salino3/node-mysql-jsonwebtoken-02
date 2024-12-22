const { db } = require("../../db");
const axios = require("axios");
require("dotenv").config();

const getUsers = async (req, res) => {
  const dbName = process.env.DB_NAME;

  const query = await db.promise().query(`SELECT * FROM \`${dbName}\`.users`);
  return res.status(200).send(query[0]);
};

const deleteUser = async (req, res) => {
  const dbName = process.env.DB_NAME;
  const userId = req.params.id;

  const query = await db
    .promise()
    .query(`DELETE FROM \`${dbName}\`.users WHERE id = (?)`, [userId]);

  if (query.affectedRows > 0) {
    return res.status(200).send("User deleted successfully.");
  } else {
    return res.status(404).send("User not found.");
  }
};

module.exports = { getUsers, deleteUser };

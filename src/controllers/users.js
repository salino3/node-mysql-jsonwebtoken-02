const { db } = require("../../db");
const axios = require("axios");
require("dotenv").config();

const getUsers = async (req, res) => {
  const dbName = process.env.DB_NAME;
  try {
    const result = await db
      .promise()
      .query(`SELECT * FROM \`${dbName}\`.users`);
    return res.status(200).send(result[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "An error occurred.", error });
  }
};

const deleteUser = async (req, res) => {
  const dbName = process.env.DB_NAME;
  const userId = req.params.id;
  try {
    const result = await db
      .promise()
      .query(`DELETE FROM \`${dbName}\`.users WHERE id = (?)`, [userId]);
    if (result.affectedRows > 0) {
      return res.status(200).send("User deleted successfully.");
    } else {
      return res.status(404).send("User not found.");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "An error occurred.", error });
  }
};

const updateUser = async (req, res) => {
  const dbName = process.env.DB_NAME;
  const userId = req.params.id;
  const { name, surname, email, age } = req.body;

  try {
    const fieldsToUpdate = [];
    const valuesToUpdate = [];

    if (name !== undefined) {
      fieldsToUpdate.push("name = ?");
      valuesToUpdate.push(name);
    }

    if (surname !== undefined) {
      fieldsToUpdate.push("surname = ?");
      valuesToUpdate.push(surname);
    }

    if (email !== undefined) {
      fieldsToUpdate.push("email = ?");
      valuesToUpdate.push(email);
    }

    if (age !== undefined) {
      fieldsToUpdate.push("age = ?");
      valuesToUpdate.push(age);
    }

    if (fieldsToUpdate.length === 0) {
      return res
        .status(400)
        .send({ message: "No valid fields provided to update." });
    }

    valuesToUpdate.push(userId);

    const sqlQuery = `UPDATE \`${dbName}\`.users SET ${fieldsToUpdate.join(
      ", "
    )} WHERE id = ?`;

    const [result] = await db.promise().query(sqlQuery, valuesToUpdate);

    if (result.affectedRows > 0) {
      return res.status(200).send({ message: "User updated successfully." });
    } else {
      return res.status(404).send({ message: "User not found." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "An error occurred.", error });
  }
};

module.exports = { getUsers, deleteUser, updateUser };

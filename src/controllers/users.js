const { db } = require("../../db");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const getUsers = async (req, res) => {
  const dbName = process.env.DB_NAME;
  try {
    const result = await db
      .promise()
      .query(`SELECT * FROM \`${dbName}\`.users`);

    if (result[0]?.length === 0) {
      return res.status(404).send("No users found.");
    }

    const users = result[0].map(({ password, ...user }) => user);
    return res.status(200).send(users);
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
};

const getBatchUsers = async (req, res) => {
  const dbName = process.env.DB_NAME;
  const { limit = 5, offset = 0 } = req.query;

  try {
    const parsedLimit = parseInt(limit, 10);
    const parsedOffset = parseInt(offset, 10);

    if (
      isNaN(parsedLimit) ||
      isNaN(parsedOffset) ||
      parsedLimit <= 0 ||
      parsedOffset < 0
    ) {
      return res.status(400).send("Invalid limit or offset values.");
    }

    // 'offset 10' starts returning index 10, it is eleventh user in the list
    const query = `
      SELECT * FROM \`${dbName}\`.users
      LIMIT ? OFFSET ?`;
    const result = await db.promise().query(query, [parsedLimit, parsedOffset]);

    if (result[0]?.length === 0) {
      return res.status(404).send("No users found.");
    }

    const users = result[0].map(({ password, ...user }) => user);
    return res.status(200).send(users);
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
};

const getUserById = async (req, res) => {
  const dbName = process.env.DB_NAME;
  const { id } = req.params;
  try {
    const result = await db
      .promise()
      .query(`SELECT * FROM \`${dbName}\`.users WHERE id = (?)`, id);

    if (result[0]?.length === 0) {
      return res.status(404).send("User not found.");
    }
    const { password, ...user } = result[0][0];

    return res.status(200).send(user);
  } catch (error) {
    return res.status(500).send(error);
  }
};

const getUserByEmail = async (req, res) => {
  const dbName = process.env.DB_NAME;
  const { email } = req.params;
  try {
    const result = await db
      .promise()
      .query(`SELECT * FROM \`${dbName}\`.users WHERE email = (?)`, email);

    if (result[0]?.length === 0) {
      return res.status(404).send("User not found.");
    }

    const { password, ...user } = result[0][0];
    return res.status(200).send(user);
  } catch (error) {
    return res.status(500).send(error);
  }
};

const updateUser = async (req, res) => {
  const dbName = process.env.DB_NAME;
  const userId = req.id;
  const { name, surname, email, age } = req.body;

  try {
    const [existingUser] = await db
      .promise()
      .query(`SELECT * FROM \`${dbName}\`.users WHERE email = ?`, [email]);

    if (
      existingUser[0] &&
      existingUser[0]?.email === email &&
      userId != existingUser[0].id
    ) {
      return res.status(400).send({ message: "Email is already in use." });
    }

    const fieldsToUpdate = [];
    const valuesToUpdate = [];

    if (name && name !== existingUser[0]?.name) {
      fieldsToUpdate.push("name = ?");
      valuesToUpdate.push(name);
    }

    if (surname && surname !== existingUser[0]?.surname) {
      fieldsToUpdate.push("surname = ?");
      valuesToUpdate.push(surname);
    }

    if (email && email !== existingUser[0]?.email) {
      fieldsToUpdate.push("email = ?");
      valuesToUpdate.push(email);
    }

    if (age && age !== existingUser[0]?.age) {
      fieldsToUpdate.push("age = ?");
      valuesToUpdate.push(age);
    }

    if (fieldsToUpdate.length === 0) {
      return res.status(400).send({
        message: "No valid fields provided to update, or  no changes detected",
      });
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
    return res.status(500).send(error);
  }
};

const changePasswordUser = async (req, res) => {
  const dbName = process.env.DB_NAME;
  const userId = req.params.id;
  const { password, newPassword } = req.body;

  try {
    if (!newPassword) {
      return res.status(400).send({ message: "New password is required." });
    }
    if (!password) {
      return res.status(400).send({ message: "Old password is required." });
    }

    if (password === newPassword) {
      return res.status(400).send({
        message: "New password should be different from old password.",
      });
    }

    //
    const [user] = await db
      .promise()
      .query(`SELECT * FROM \`${dbName}\`.users WHERE id = ?`, [userId]);
    if (user.length === 0) {
      return res.status(404).send({ message: "User not found." });
    }

    const isPasswordValid = await bcrypt.compare(password, user[0]?.password);
    if (!isPasswordValid) {
      return res.status(400).send({ message: "Old password is incorrect." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const [result] = await db
      .promise()
      .query(`UPDATE \`${dbName}\`.users SET password = ? WHERE id = ?`, [
        hashedPassword,
        userId,
      ]);

    if (result.affectedRows > 0) {
      return res
        .status(200)
        .send({ message: "Password updated successfully." });
    } else {
      return res.status(404).send({ message: "User not found." });
    }
  } catch (error) {
    return res.status(500).send(error);
  }
};

const deleteUser = async (req, res) => {
  const dbName = process.env.DB_NAME;
  const userId = req.params.id;
  try {
    const [result] = await db
      .promise()
      .query(`DELETE FROM \`${dbName}\`.users WHERE id = (?)`, [userId]);
    if (result.affectedRows > 0) {
      return res.status(200).send("User deleted successfully.");
    } else {
      return res.status(404).send("User not found.");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
};

module.exports = {
  getUsers,
  getBatchUsers,
  getUserById,
  getUserByEmail,
  updateUser,
  changePasswordUser,
  deleteUser,
};

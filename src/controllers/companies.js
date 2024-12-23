const { db } = require("../../db");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const getCompanies = async (req, res) => {
  const dbName = process.env.DB_NAME;
  try {
    const result = await db
      .promise()
      .query(`SELECT * FROM \`${dbName}\`.companies`);

    if (result[0] === 0) {
      return res.status(404).send("No companies found.");
    }

    return res.status(200).send(result[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
};

const getCompanyById = async (req, res) => {
  const dbName = process.env.DB_NAME;
  const { id } = req.params;
  try {
    const result = await db
      .promise()
      .query(`SELECT * FROM \`${dbName}\`.companies WHERE id = (?)`, id);

    if (result[0] === 0) {
      return res.status(404).send("Company not found.");
    }
    return res.status(200).send(result[0]);
  } catch (error) {
    return res.status(500).send(error);
  }
};

const getCompanyByEmail = async (req, res) => {
  const dbName = process.env.DB_NAME;
  const { email } = req.params;
  try {
    const result = await db
      .promise()
      .query(`SELECT * FROM \`${dbName}\`.companies WHERE email = (?)`, email);

    if (result[0] === 0) {
      return res.status(404).send("Company not found.");
    }
    return res.status(200).send(result[0]);
  } catch (error) {
    return res.status(500).send(error);
  }
};

const updateCompany = async (req, res) => {
  const dbName = process.env.DB_NAME;
  const companyId = req.params.id;
  const { name, industry, email, head_quarters } = req.body;

  try {
    const fieldsToUpdate = [];
    const valuesToUpdate = [];

    if (name !== undefined) {
      fieldsToUpdate.push("name = ?");
      valuesToUpdate.push(name);
    }

    if (industry !== undefined) {
      fieldsToUpdate.push("industry = ?");
      valuesToUpdate.push(industry);
    }

    if (email !== undefined) {
      fieldsToUpdate.push("email = ?");
      valuesToUpdate.push(email);
    }

    if (head_quarters !== undefined) {
      fieldsToUpdate.push("head_quarters = ?");
      valuesToUpdate.push(head_quarters);
    }

    if (fieldsToUpdate.length === 0) {
      return res
        .status(400)
        .send({ message: "No valid fields provided to update." });
    }

    const [existingUser] = await db
      .promise()
      .query(`SELECT * FROM \`${dbName}\`.companies WHERE email = ?`, [email]);

    if (existingUser.length > 0) {
      return res.status(400).send({ message: "Email is already in use." });
    }

    valuesToUpdate.push(companyId);

    const sqlQuery = `UPDATE \`${dbName}\`.companies SET ${fieldsToUpdate.join(
      ", "
    )} WHERE id = ?`;

    const [result] = await db.promise().query(sqlQuery, valuesToUpdate);

    if (result.affectedRows > 0) {
      return res.status(200).send({ message: "Company updated successfully." });
    } else {
      return res.status(404).send({ message: "Company not found." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
};

const changePasswordCompany = async (req, res) => {
  const dbName = process.env.DB_NAME;
  const companyId = req.params.id;
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
    const [company] = await db
      .promise()
      .query(`SELECT * FROM \`${dbName}\`.companies WHERE id = ?`, [companyId]);
    if (company.length === 0) {
      return res.status(404).send({ message: "Company not found." });
    }

    const isPasswordValid = await bcrypt.compare(password, company[0].password);
    if (!isPasswordValid) {
      return res.status(400).send({ message: "Old password is incorrect." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const [result] = await db
      .promise()
      .query(`UPDATE \`${dbName}\`.companies SET password = ? WHERE id = ?`, [
        hashedPassword,
        companyId,
      ]);

    if (result.affectedRows > 0) {
      return res
        .status(200)
        .send({ message: "Password updated successfully." });
    } else {
      return res.status(404).send({ message: "Company not found." });
    }
  } catch (error) {
    return res.status(500).send(error);
  }
};

const deleteCompany = async (req, res) => {
  const dbName = process.env.DB_NAME;
  const companyId = req.params.id;
  try {
    const [result] = await db
      .promise()
      .query(`DELETE FROM \`${dbName}\`.companies WHERE id = (?)`, [companyId]);
    if (result.affectedRows > 0) {
      return res.status(200).send("Company deleted successfully.");
    } else {
      return res.status(404).send("Company not found.");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
};

module.exports = {
  getCompanies,
  getCompanyById,
  getCompanyByEmail,
  updateCompany,
  changePasswordCompany,
  deleteCompany,
};

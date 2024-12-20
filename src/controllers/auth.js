const { db } = require("../../db");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const register = (req, res) => {
  const { name, surname, email, password, passwordConfirm, age } = req.body;

  db.promise()
    .query("SELECT email FROM users WHERE email = (?)", [email])
    .then((result) => {
      if (result[0].length > 0) {
        return res.send("This email is already in use");
      } else if (age < 18) {
        return res.send("You must be at least 18 years old");
      } else if (password !== passwordConfirm) {
        if (password?.length < 6 || passwordConfirm?.length < 6) {
          return res.send("Password should be at least 6 characters long");
        }
        return res.send("Password and confirm password do not match");
      }

      const hashedPassword = bcrypt.hashSync(password, 10);

      return db
        .promise()
        .query("INSERT INTO users SET ?", {
          name,
          surname,
          email,
          password: hashedPassword,
          age,
        })
        .then(() => {
          return res.send("User registered successfully");
        })
        .catch((err) => {
          console.error(err);
          return res.send("Error registering user");
        });
    })
    .catch((err) => {
      console.error(err);
      return res.send("Error checking email");
    });
};

module.exports = { register };

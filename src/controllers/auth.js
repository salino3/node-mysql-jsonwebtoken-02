const { db } = require("../../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const register = async (req, res) => {
  const { name, surname, email, password, passwordConfirm, age } = req.body;

  await db
    .promise()
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

const login = async (req, res) => {
  const { email, password } = req.body;

  db.promise()
    .query("SELECT * FROM users WHERE email = (?)", [email])
    .then((result) => {
      if (result[0].length === 0) {
        return result.status(404).send("Email not found");
      }

      const user = result[0][0];
      const isPasswordValid = bcrypt.compareSync(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).send("Invalid password");
      }

      // Generate token
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.SECRET_KEY,
        {
          expiresIn: "1h",
        }
      );

      const generateRandomNumber = () => {
        return Math.floor(1000 + Math.random() * 9000);
      };

      res.cookie("auth_token_" + generateRandomNumber(), token, {
        httpOnly: process.env.NODE_ENV === "production",
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict",
        expires: new Date(Date.now() + 3600 * 1000),
      });

      return res.json({
        message: "Login successful",
        token,
      });
    })
    .catch((err) => {
      console.error(err);
      return res.send("Error during login");
    });
};

module.exports = { register, login };

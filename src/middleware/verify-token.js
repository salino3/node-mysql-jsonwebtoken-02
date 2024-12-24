const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const endToken = req.headers["end_token"];

  if (!endToken) {
    return res
      .status(400)
      .send({ message: "Four numbers (cookie identifier) is missing." });
  }

  const cookieName = `auth_token_${endToken}`;

  const cookieValue = req.cookies[cookieName];
  if (!cookieValue) {
    return res.status(400).send({ message: `Cookie end code is missing.` });
  }

  try {
    jwt.verify(cookieValue, process.env.SECRET_KEY);

    next();
  } catch (error) {
    return res.status(403).send({ message: "Forbidden: Invalid token." });
  }
};

module.exports = { verifyJWT };

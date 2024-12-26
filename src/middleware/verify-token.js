const jwt = require("jsonwebtoken");

const verifyJWT = (key = "") => {
  return (req, res, next) => {
    const endToken = req.headers["end_token"];

    if (!endToken) {
      return res
        .status(400)
        .send({ message: "Numbers (cookie identifier) is missing." });
    }

    const cookieName = `auth_token_${endToken}`;

    const cookieValue = req.cookies[cookieName];
    if (!cookieValue) {
      return res.status(400).send({ message: `Cookie end code is missing.` });
    }

    try {
      const decoded = jwt.verify(cookieValue, process.env.SECRET_KEY);
      if (key && decoded[key]) {
        // Verification IDs
        const paramsId = req.params[key];
        if (decoded[key] != paramsId) {
          return res.status(401).send({ message: "Unauthorized." });
        }
        req[key] = decoded[key];
        next();
      } else {
        next();
      }
    } catch (error) {
      return res.status(403).send({ message: "Forbidden: Invalid token." });
    }
  };
};

module.exports = { verifyJWT };

const axios = require("axios");

const register = async (req, res) => {
  return res.status(200).send("Registered");
};

module.exports = { register };

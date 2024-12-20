const axios = require("axios");

const getUsers = async (req, res) => {
  return res.status(200).send("Hola");
};

module.exports = { getUsers };

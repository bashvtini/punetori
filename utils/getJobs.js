const njoftimefalas = require("../utils/njoftimefalas");
const duapune = require("../utils/duapune");
const njoftime = require("../utils/njoftime");

module.exports = async (query, city = "", type = 0) => {
  const data = [
    ...(await njoftimefalas(query, city)),
    ...(await njoftime(query, city, type)),
    ...(await duapune(query, city, type)),
  ];

  return data;
};

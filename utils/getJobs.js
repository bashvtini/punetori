const njoftimefalas = require("../utils/njoftimefalas");
const duapune = require("../utils/duapune");
const njoftime = require("../utils/njoftime");

module.exports = async (query, city = "", type = 0, days = 1) => {
  const data = [
    ...(await njoftimefalas(query, city, days)),
    ...(await njoftime(query, city, type, days)),
    ...(await duapune(query, type, days)),
  ];

  return data;
};

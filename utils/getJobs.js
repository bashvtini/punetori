const njoftimefalas = require("../utils/njoftimefalas");
const duapune = require("../utils/duapune");
const njoftime = require("../utils/njoftime");

module.exports = async (query) => {
  const data = [
    ...(await njoftimefalas(query)),
    ...(await njoftime(query)),
    ...(await duapune(query)),
  ];

  return data;
};

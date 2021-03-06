const njoftimefalas = require("../utils/njoftimefalas");
const duapune = require("../utils/duapune");
const njoftime = require("../utils/njoftime");

module.exports = async (query, city, type, days) => {
  const njoftimeJobs = await njoftime(query, city, type, days);
  // console.log("njoftime Done");
  const njoftimeFalasJobs = await njoftimefalas(query, city, days);
  // console.log("njoftimefalas Done");
  const duapuneJobs = await duapune(query, type);
  // console.log("dunapune Done");

  const data = [...njoftimeJobs, ...njoftimeFalasJobs, ...duapuneJobs];

  return data;
};

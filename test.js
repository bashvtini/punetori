const njoftime = require("./utils/duapune");

njoftime("kamarier", "", 3)
  .then((e) => {
    console.log(e.length);
  })
  .catch((e) => {
    console.log(e);
  });

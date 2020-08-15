const axios = require("axios");
const cheerio = require("cheerio");
module.exports = async (query) => {
  // Get Today's Job Offers from https://www.njoftimefalas.com/
  let page = 1;
  let switcher = true;
  const date = String(new Date().getDate()).padStart(2, "0");

  const jobs = [];

  while (switcher) {
    await axios
      .post(
        `https://www.njoftimefalas.com/name.php?name=ads_advertise&ads_advertise=njoftime&njoftime=ads_list&ads_city=1&idk=23&ads_keyword=${query}&page=${page}`
      )
      .then((result) => {
        const $ = cheerio.load(result.data);

        page++;

        // Get Jobs
        $(`.adds-wrapper .job-item`).each((index, element) => {
          const title = $(element).find(`.job-title a`).text();
          let link = $(element).find(`.job-title a`).attr("href");
          // const tag = $(element).find(`.save-job`).text().trim();
          const time = $(element)
            .find(`.list-inline li:last-child b`)
            .text()
            .trim()
            .split("/")[0];

          if (time === date) {
            jobs.push({
              title,
              link,
              // tag,
              // time,
            });
          } else {
            switcher = false;
          }
        });
      });
  }

  return jobs;
};

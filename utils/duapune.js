const axios = require("axios");
const cheerio = require("cheerio");

module.exports = async (query) => {
  // Get Today's Job Offers from https://duapune.com/
  const jobs = [];

  await axios
    .get(`https://duapune.com/search/advanced/filter?keyword=${query}`)
    .then((result) => {
      const $ = cheerio.load(result.data);

      // Get Jobs
      $(`#latest-jobs .sponsored-listing`).each((index, element) => {
        const title = $(element)
          .find(`.job-title a`)
          .text()
          .replace(/[^\w\s]/gi, "e");
        let link = $(element).find(`.job-title a`).attr("href");
        // const employer = $(element).find(`.job-title small`).text();

        // const tag = $(element).find(`.main-jobs-tag a`).text();
        if ($(element).find(`.tagIt`).text().trim() === "e re") {
          jobs.push({
            title,
            link,
            // employer,
            // tag,
          });
        }
      });
    });

  return jobs;
};

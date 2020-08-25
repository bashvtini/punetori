const axios = require("axios");
const cheerio = require("cheerio");

const typeConverter = (enteredType) => {
  if (enteredType === 0 || enteredType > 3) {
    return "";
  }

  const typeList = [
    { name: 1, value: "2" }, // Full time
    { name: 2, value: "1" }, // Part time
    { name: 3, value: "4" }, // Intership
  ];

  for (const type of typeList) {
    if (type.name === enteredType) {
      return type.value;
    }
  }

  return "";
};

module.exports = async (query, type = "") => {
  // Get Today's Job Offers from https://duapune.com/
  const jobs = [];

  await axios
    .get(
      `https://duapune.com/search/advanced/filter?keyword=${query}&job_type=${typeConverter(
        type
      )}`
    )
    .then((result) => {
      const $ = cheerio.load(result.data);

      // Get Jobs
      $(`#latest-jobs .sponsored-listing`).each((index, element) => {
        const title = $(element).find(`.job-title a`).text();
        // .replace(/[^\w\s]/gi, "e");
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

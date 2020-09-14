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

module.exports = async (query, type = "", days = 0) => {
  // Get Today's Job Offers from https://duapune.com/
  const jobs = [];
  // let lastPage = 0;
  // let page = 1;

  // while (page === lastPage) {

  // }

  await axios
    .get(
      `https://duapune.com/search/advanced/filter?keyword=${query}&job_type=${typeConverter(
        type
      )}`
    )
    .then((result) => {
      const $ = cheerio.load(result.data);

      // const paggination = $("#latest-jobs nav").length;
      // if (paggination) {
      //   lastPage = parseInt(
      //     $(`.pagination .page-item:nth-last-child(2)`).text(),
      //     10
      //   );
      // }

      // Get Jobs
      $(`#latest-jobs .sponsored-listing`).each((index, element) => {
        const title = $(element).find(`.job-title a`).text();
        // .replace(/[^\w\s]/gi, "e");
        let link = $(element).find(`.job-title a`).attr("href");

        // const jobDate = $(element).find(`.time`).text().trim().split("-");
        // const jobDay = jobDate[0];
        // const jobMonth = jobDate[1];

        // const jobTimeLeft = parseInt($(".expire").text().split(" ")[1], 10);

        // const employer = $(element).find(`.job-title small`).text();

        // const tag = $(element).find(`.main-jobs-tag a`).text();

        if (days === 0) {
          if ($(element).find(`.tagIt`).text().trim() === "e re") {
            jobs.push({
              title,
              link,
              // employer,
              // tag,
            });
          }
        } else {
          jobs.push({
            title,
            link,
          });
        }
      });
    });

  return jobs;
};

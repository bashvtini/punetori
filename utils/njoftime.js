const axios = require("axios");
const cheerio = require("cheerio");

module.exports = async (query) => {
  // Get Today's Job Offers from http://www.njoftime.com/
  let totalPages = 2;
  let page = 1;
  const limit = 200;
  const date = String(new Date().getDate()).padStart(2, "0");

  const jobs = [];

  while (totalPages >= page) {
    await axios
      .get(
        `http://www.njoftime.com/forumdisplay.php?14-ofroj-vende-pune/page${page}&pp=${limit}&daysprune=1&input_titull=${query}`
      )
      .then((result) => {
        const $ = cheerio.load(result.data);

        page++;

        const paggination = $(`.pagination span a.popupctrl`).text();

        if (
          paggination.split("nga ") &&
          totalPages === 2 &&
          paggination !== ""
        ) {
          totalPages = Number(paggination.split("nga")[2].trim());
        }

        // Get Jobs
        $(`#threads .threadbit`).each((index, element) => {
          const title = $(element)
            .find(`.title`)
            .text()
            .replace(/[^\w\s]/gi, "e");

          let link = $(element).find(`.title`).attr("href");

          if (link.split("&s=")) {
            link = link.split("&s=")[0].split("-")[0];
          }

          // const employer = $(element)
          //   .find(`.threadlastpostintitle a.username strong`)
          //   .text();
          const time = $(element)
            .find(`.threadlastpostintitle dd:last-child`)
            .text()
            .trim()
            .split(".")[0];

          if (time === date) {
            jobs.push({
              title,
              link: "http://njoftime.com/" + link,
              // employer,
            });
          }
        });
      });
  }

  return jobs;
};

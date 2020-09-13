const axios = require("axios");
const cheerio = require("cheerio");

const cityCoverter = (enteredCity) => {
  if (enteredCity === "") {
    return "";
  }

  const cityList = [
    { name: "tirane", value: "1" },
    { name: "berati", value: "11" },
    { name: "durres", value: "2" },
    { name: "elbasan", value: "6" },
    { name: "fier", value: "10" },
    { name: "gjirokaster", value: "9" },
    { name: "himare", value: "23" },
    { name: "kavaje", value: "13" },
    { name: "korce", value: "5" },
    { name: "kruje", value: "19" },
    { name: "kukes", value: "20" },
    { name: "lezhe", value: "12" },
    { name: "lushnje", value: "7" },
    { name: "permet", value: "21" },
    { name: "peshkopi", value: "16" },
    { name: "pogradec", value: "14" },
    { name: "puke", value: "15" },
    { name: "sarande", value: "8" },
    { name: "shkoder", value: "4" },
    { name: "skrapar", value: "17" },
    { name: "tepelene", value: "22" },
    { name: "tirane", value: "1" },
    { name: "tropoje", value: "18" },
    { name: "vlore", value: "3" },
  ];

  for (const city of cityList) {
    if (city.name === enteredCity.toLowerCase()) {
      return city.value;
    }
  }

  return "";
};

module.exports = async (query, city = "", days = 0) => {
  // Get Today's Job Offers from https://www.njoftimefalas.com/
  let page = 1;
  let switcher = true;
  const date = String(new Date().getDate()).padStart(2, "0");

  // Get Month after - days
  var d = new Date();
  d.setDate(d.getDate() - days);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  const jobs = [];

  while (switcher) {
    const url = `https://www.njoftimefalas.com/name.php?name=ads_advertise&ads_advertise=njoftime&njoftime=ads_list&ads_city=${cityCoverter(
      city
    )}&idk=23&ads_keyword=${query}&page=${page}`;
    await axios
      .post(url)
      .then((result) => {
        const $ = cheerio.load(result.data);

        page++;

        // Get Jobs
        $(`.adds-wrapper > div.item-list.job-item`).each((index, element) => {
          const title = $(element).find(`.job-title a`).text();
          let link = $(element).find(`.job-title a`).attr("href");
          // const tag = $(element).find(`.save-job`).text().trim();

          const jobDate = $(element)
            .find(`.list-inline li:last-child .info-row b`)
            .text()
            .split("/");

          const jobDay = jobDate[0];
          const jobMonth = jobDate[1];

          // fix the month

          // month - the month of the filter
          // day - the day of the filter
          // jobMonth - current job month
          // jobDay - current job day

          if (month < jobMonth) {
            // console.log(
            //   `Filter Day: ${day}`,
            //   `| Job Day: ${jobDay}`,
            //   `| Filter Month: ${month}`,
            //   `| Job Month: ${jobMonth}`
            // );
            jobs.push({
              title,
              link,
              // tag,
              // time,
            });
            return;
          }

          if (month === jobMonth) {
            if (day > jobDay) {
              // console.log("false");
              switcher = false;
              return;
            }

            // console.log(
            //   `Filter Day: ${day}`,
            //   `| Job Day: ${jobDay}`,
            //   `| Filter Month: ${month}`,
            //   `| Job Month: ${jobMonth}`
            // );

            jobs.push({
              title,
              link,
              // tag,
              // time,
            });
          }
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  return jobs;
};

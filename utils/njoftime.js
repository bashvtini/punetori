const axios = require("axios");
const cheerio = require("cheerio");

const cityCoverter = (enteredCity) => {
  if (enteredCity === "") {
    return false;
  }

  const cityList = [
    { name: "tirane", value: "Tirane" },
    { name: "durres", value: "Durres" },
    { name: "elbasan", value: "Elbasan" },
    { name: "fier", value: "Fier" },
    { name: "gjirokaster", value: "Gjirokaster" },
    { name: "kavaje", value: "Kavaje" },
    { name: "korce", value: "Korce" },
    { name: "kruje", value: "Kruje" },
    { name: "kukes", value: "Kukes" },
    { name: "lezhe", value: "Lezhe" },
    { name: "lushnje", value: "Lushnje" },
    { name: "permet", value: "Permet" },
    { name: "peshkopi", value: "Peshkopi" },
    { name: "pogradec", value: "Pogradec" },
    { name: "puke", value: "Puke" },
    { name: "sarande", value: "Sarande" },
    { name: "shkoder", value: "Shkoder" },
    { name: "skrapar", value: "Skrapar" },
    { name: "tepelene", value: "Tepelene" },
    { name: "tirane", value: "Tirane" },
    { name: "tropoje", value: "Tropoje" },
    { name: "vlore", value: "Vlore" },
  ];

  for (const city of cityList) {
    if (city.name === enteredCity.toLowerCase()) {
      return city.value;
    }
  }

  return false;
};

const typeConverter = (enteredType) => {
  if (enteredType === 0 || enteredType > 3) {
    return "0";
  }

  const typeList = [
    { name: 1, value: "1" }, // Full time
    { name: 2, value: "part time" }, // Part time
    { name: 3, value: "vend praktike" }, // Intership
  ];

  for (const type of typeList) {
    if (type.name === enteredType) {
      return type.value;
    }
  }

  return "0";
};

module.exports = async (query, city = "", type = 0, days = 1) => {
  // Get Today's Job Offers from http://www.njoftime.com/
  let totalPages = 2;
  let page = 1;
  const limit = 200;
  // const date = String(new Date().getDate()).padStart(2, "0");
  // const month = String(new Date().getMonth()).padStart(2, "0") + 1;
  const selectedCity = city !== "" ? "&field3[0]=" + cityCoverter(city) : "";
  const selectedJobType = type !== 0 ? "&field1[0]=" + typeConverter(type) : "";

  const jobs = [];

  while (totalPages >= page) {
    const url = `http://www.njoftime.com/forumdisplay.php?14-ofroj-vende-pune&s=&pp=${limit}${selectedCity}${selectedJobType}&field4_isMin=&field4_isMax=&input_titull=${query}&daysprune=${days}`;

    await axios
      .get(url)
      .then((result) => {
        const $ = cheerio.load(result.data);

        // Check If any Jobs are avaliable
        const availbaleJobs = $(".threadbit .nonthread").length;
        if (availbaleJobs) {
          page = 100;
          return;
        }

        // Get Jobs
        $(`#threads li.threadbit`).each((index, element) => {
          const title = $(element).find(`.title`).text();
          // .replace(/[^\w\s]/gi, "e");

          let link = $(element).find(`.title`).attr("href");

          if (link.split("&s=")) {
            link = link.split("&s=")[0].split("-")[0];
          }

          // const employer = $(element)
          //   .find(`.threadlastpostintitle a.username strong`)
          //   .text();
          // const time = $(element)
          //   .find(`.threadlastpostintitle dd:last-child`)
          //   .text()
          //   .trim()
          //   .split(".")[0];

          // if (time === date) {
          jobs.push({
            title,
            link: "http://njoftime.com/" + link,
            // employer,
          });
          // }
        });

        // Paggination check
        const availablePaggination = $(".threadpagenav form").length;
        if (availablePaggination) {
          const paggination = $(`.pagination span a.popupctrl`).text();

          if (
            paggination.split("nga ") &&
            totalPages === 2 &&
            paggination !== ""
          ) {
            totalPages = Number(paggination.split("nga")[2].trim());
          }

          page++;
        } else {
          page = 100;
          return;
        }
      })
      .catch((error) => {
        page = 100;
        return error;
      });
  }

  return jobs;
};

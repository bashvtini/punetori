// const axios = require("axios");
// const cheerio = require("cheerio");
// const fs = require("fs");

// axios
//   .get(
//     "https://duapune.com/search/advanced/filter?keyword=&employer=&country=&city=&category=&job_type=3"
//   )
//   .then((e) => {
//     const $ = cheerio.load(e.data);

//     const arr = [];
//     $(`#job_type option`).each((index, city) => {
//       arr.push({
//         city: $(city).text().toLocaleLowerCase(),
//         value: $(city).attr("value"),
//       });
//     });

//     fs.writeFileSync("./data.json", JSON.stringify(arr));
//   });

// const typeListNjoftime = [
//   { city: "me orar të plote", value: "1" },
//   { city: "part time", value: "part time" },
//   { city: "internship/vend praktike", value: "vend praktike" },
// ];

// const typeListDuapune = [
//   { city: "kohe e pjesshme", value: "1" },
//   { city: "kohe e plote ", value: "2" },
//   { city: "internship", value: "4" },
// ];

// const search = require("./utils/getJobs");

// search("kamarier", "tirane").then((e) => {
//   console.log(e);
// });

// http://www.njoftime.com/forumdisplay.php?14-ofroj-vende-pune&s=&pp=30&field4_isMin=&field4_isMax=&input_titull=kamarier&daysprune=1
// http://www.njoftime.com/forumdisplay.php?14-ofroj-vende-pune/page1&pp=200&daysprune=1&input_titull=kamarier&field1[0]=0

const city1 = [
  { name: "berat", value: "Berat" },
  { name: "bulqize", value: "Bulqize" },
  { name: "delvine", value: "Delvine" },
  { name: "devoll", value: "Devoll" },
  { name: "diber", value: "Diber" },
  { name: "durres", value: "Durres" },
  { name: "durres gjiri lalezit", value: "Gjiri Lalezit" },
  { name: "durres plazh", value: "Plazh-Durres" },
  { name: "kavaje", value: "Kavaje" },
  { name: "kavaje golem", value: "Golem" },
  { name: "kavaje mali robit", value: "Mali Robit" },
  { name: "kavaje qerret", value: "Qerret" },
  { name: "shkembi kavajes", value: "Shkembi Kavajes" },
  { name: "kavaje spille", value: "Spille" },
  { name: "elbasan", value: "Elbasan" },
  { name: "fier", value: "Fier" },
  { name: "gjirokaster", value: "Gjirokaster" },
  { name: "gramsh", value: "Gramsh" },
  { name: "has", value: "Has" },
  { name: "kolonje", value: "Kolonje" },
  { name: "korce", value: "Korce" },
  { name: "kruje", value: "Kruje" },
  { name: "fushe kruje", value: "Fushe Kruje" },
  { name: "kucove", value: "Kucove" },
  { name: "kukes", value: "Kukes" },
  { name: "kurbin", value: "Kurbin" },
  { name: "lezhe", value: "Lezhe" },
  { name: "lezhe shengjin", value: "Shengjin" },
  { name: "librazhd", value: "Librazhd" },
  { name: "lushnje", value: "Lushnje" },
  { name: "lushnje divjake", value: "Divjake" },
  { name: "malesi e madhe", value: "Malesi e Madhe" },
  { name: "mallakaster", value: "Mallakaster" },
  { name: "mat", value: "Mat" },
  { name: "mirdite", value: "Mirdite" },
  { name: "peqin", value: "Peqin" },
  { name: "permet", value: "Permet" },
  { name: "peshkopi", value: "Peshkopi" },
  { name: "pogradec", value: "Pogradec" },
  { name: "puke", value: "Puke" },
  { name: "rreshen", value: "Rreshen" },
  { name: "rrogozhine", value: "Rrogozhine" },
  { name: "sarande", value: "Sarande" },
  { name: "sarande ksamil", value: "Ksamil" },
  { name: "shkoder", value: "Shkoder" },
  { name: "shkoder velipoje", value: "Velipoje" },
  { name: "skrapar", value: "Skrapar" },
  { name: "tirane", value: "Tirane" },
  { name: "tepelene", value: "Tepelene" },
  { name: "tropoje", value: "Tropoje" },
  { name: "vlore", value: "Vlore" },
  { name: "vlore orikum", value: "Orikum" },
  { name: "vlore dhermi", value: "Dhermi" },
  { name: "vlore himare", value: "Himare" },
];

const city2 = [
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

const final = [];
city2.forEach((e) => {
  city1.forEach((t) => {
    if (e.name === t.name) {
      final.push(t.name);
    }
  });
});

require("fs").writeFileSync("./data.json", JSON.stringify(final));

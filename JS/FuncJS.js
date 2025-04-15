let db, curDay;
let dbFileName = "/BAkunin/Bakunin.s3db";
let key, text;
let html, img;

async function initDB() {
  const SQL = await initSqlJs({
    locateFile: (filename) =>
      `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${filename}`,
  });
  const response = await fetch(dbFileName);
  const buffer = await response.arrayBuffer();
  db = new SQL.Database(new Uint8Array(buffer));
  console.log("База данных SQLite инициализирована!");
}
async function queryDB(mykey) {
  let SQL = "SELECT key, value FROM Calendar WHERE key = ?";
  return db.exec(SQL, [mykey]);
}
async function fetchData(md) {
  const result = await queryDB(md);
  if (result && result.length > 0 && result[0].values.length > 0) {
    const row = result[0].values[0]; // берём первую строку
    key = row[0];
    text = row[1];
    return [key, text];
  } else {
    console.log("Нет данных для отображения.");
  }
}
async function htmlFill() {
  // console.log(tstmp(), "HTMLFILL ");
  nextPage();
  await initDB();
  let prmDate = new URLSearchParams(window.location.search).get("date");
  if (prmDate == null || prmDate == curDay) {
    curDay = new Date()
      .toLocaleDateString("ru-RU", { day: "numeric", month: "long" })
      .toUpperCase();
  } else {
    curDay = prmDate;
  }
  console.log(curDay);
  await fetchData(curDay);
  html = text
    .replace(/align="left"/g, "")
    .replace("<h4", '<h4 align="center"')
    .replace("l:href", "href");
  // console.log(html);
  document.title = key.toLowerCase();
  document.querySelector('link[rel="icon"]').href =
    "../Styles/" + String(new Date().getMonth() + 1).padStart(2, "0") + ".ico";
  console.log(document.getElementById("myHead"));
  document.getElementById("myHead").innerHTML =
    key.toLowerCase() +
    " " +
    new Date().getFullYear() +
    " года <br><br>" +
    text.slice(0, html.indexOf("$", 0));

  await imgFill();
  document.getElementById("text").innerHTML = html.slice(
    html.indexOf("$", 0) + 1
  );
}
async function imgFill() {
  while (true) {
    j = html.indexOf(".jpg");
    if (j == -1) break;
    let imgId = html.slice(j - 5, j);
    await fetchData(imgId);
    html = html.replace(imgId + ".jpg", "data:image/jpeg;base64," + text);
  }
}
function nextPage(prm) {
  // console.log(tstmp(), "NEXTPAGE");
  let nextDay = new Date();
  nextDay.setDate(nextDay.getDate() + 1);
  nextDay.setHours(0, 0, 0, 0);
  // console.log("next day: " + nextDay);
  // let delay = nextDay - Date.now() + 60 * 1000;
  let delay = 1 * 60 * 1000;
  if (prm == undefined) setTimeout(htmlFill, delay);
  else setTimeout(homePage, delay);
}
function homePage() {
  window.location.href = "/BAkunin/index.html";
}
function toolTip() {
  document.addEventListener("DOMContentLoaded", function () {
    var tooltipTriggerList = [].slice.call(
      document.querySelectorAll("[title]")
    );
    tooltipTriggerList.forEach(function (tooltipTriggerEl) {
      new bootstrap.Tooltip(tooltipTriggerEl, { html: true });
    });
  });
}
function tstmp() {
  return (
    new Date().toLocaleTimeString("ru-RU", { hour12: false }) +
    "," +
    String(new Date().getMilliseconds()).padStart(3, "0")
  );
}

Hyphenator.config({
  minwordlength: 4,
  defaultlanguage: "ru",
  selectorfunction: function () {
    return document.querySelectorAll("p");
  },
});
Hyphenator.run();

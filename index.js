const pptr = require("puppeteer"),
  moment = require("moment"),
  cheerio = require("cheerio"),
  { Parser } = require("json2csv");

const giantbomb = require("./giantbomb"),
  parser = new Parser();
(async () => {
  const browser = await pptr.launch({
    headless: false,
    defaultViewport: { height: 927, width: 1278 }
  });

  await giantbomb({
    page: await browser.newPage(),
    cheerio,
    moment,
    parser
  });

  browser.close();
})();

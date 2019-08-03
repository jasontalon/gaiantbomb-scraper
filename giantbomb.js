const asyncForEach = require("./asyncForEach"),
  fs = require("fs");

module.exports = async ({ page, cheerio, moment, parser }) => {
  let pageNumbers = Array.from(Array(1573).keys()).slice(1);

  await page.setDefaultNavigationTimeout(60000);
  await page.setDefaultTimeout(60000);
  let urls = [];

  console.log(`[${moment().format("LTS")}] begin scraping`);

  await asyncForEach(pageNumbers, async pageNumber => {
    let maxAttempts = 5;

    for (i = 1; maxAttempts >= i; i++) {
      try {
        await page.goto(`https://www.giantbomb.com/games/?page=${pageNumber}`, {
          waitUntil: "networkidle2"
        });
        break;
      } catch (err) {}
    }

    console.log(
      `[${moment().format("LTS")}] processing page ${pageNumber}/${
        pageNumbers.length
      }`
    );

    let $ = cheerio.load(await page.evaluate(() => document.body.innerHTML));

    $("ul.editorial.grid > li > a:nth-child(1)").each((i, game) => {
      let name = $(game)
        .find("h3.title")
        .first()
        .text();

      urls.push({ url: $(game).attr("href"), name });
    });
  });

  const csv = parser.parse(urls);

  fs.writeFile(
    `./gamebomb-urls-${moment().format("MM-DD-YYYY-hh-mm-a")}.csv`,
    csv,
    "utf-8",
    console.log
  );
};

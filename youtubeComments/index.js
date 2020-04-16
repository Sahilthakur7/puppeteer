const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  const navigationPromise = page.waitForNavigation();
  await page.goto("https://www.youtube.com/watch?v=LTDuGU38-70", {
    waitUntil: "networkidle2",
  });
  await page.screenshot({ path: "youtube.png" });

  await page.evaluate((_) => {
    window.scrollBy(0, window.innerHeight);
  });

  await page.waitFor(2000);
  await page.waitForSelector("#comments");

  await navigationPromise;

  const comments = [];

  for (let i = 0; i < 5; i++) {
    const authorSelector = `.style-scope:nth-child(${i}) > #comment > #body > #main > #header > #header-author > #author-text > .style-scope`;
    const commentSelector = `.style-scope:nth-child(${i}) > #comment > #body > #main > #expander > #content-text`;
    await page.waitForSelector(authorSelector);
    await page.waitForSelector(commentSelector);

    const commentText = await getElText(page, commentSelector);
    const authorText = await getElText(page, authorSelector);

    if (commentText) {
      console.log(`${authorText} :  ${commentText} /n`);
    }
  }

  console.log("here??");
  await browser.close();
})();

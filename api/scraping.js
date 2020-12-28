const puppeteer = require('puppeteer');
const browserFetcher = puppeteer.createBrowserFetcher();

const express = require('express');
const app = express();

const mysql      = require('mysql');
const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'kumakuma',
  database : 'database_development'
});

(async () => {
  const revisionInfo = await browserFetcher.download('809590.');
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ],
    headless: false,
    slowMo: 50,
    executablePath: revisionInfo.executablePath
  });

  const page = await browser.newPage();


  await page.goto('https://www.farfetch.com/jp/shopping/men/sacai--item-15466999.aspx?storeid=9359');

  let farfetchBrandName = "#bannerComponents-Container > h1 > span._0ab287 > a > span";
  let farfetchItemName = "#bannerComponents-Container > h1 > span._d85b45._3c73f1._d85b45";
  let farfetchItemPrice = "#slice-pdp > div > div._53a765 > div._d47db0 > div._3eed2e > div._7dad7e > div > span";
  let farfetchItemMaterial = "#panelInner-0 > div > div:nth-child(2) > div > div:nth-child(1) > p";
  let farfetchItemBrandStyleId = "#panelInner-0 > div > div:nth-child(2) > div > div:nth-child(3) > p > span";
  //let data = [{ text: 'brandName'}];

  const brandName = await page.$eval(farfetchBrandName, item => {
    return item.textContent;
  });

  const itemName = await page.$eval(farfetchItemName, item => {
    return item.textContent;
  });

  const price = await page.$eval(farfetchItemPrice, item => {
    return item.textContent;
  });

  const material = await page.$eval(farfetchItemMaterial, item => {
    return item.textContent;
  });

  const brandStyleId = await page.$eval(farfetchItemBrandStyleId, item => {
    return item.textContent;
  });

  await browser.close();

  connection.connect(function(err){
    if(err) throw err;

    const sql =`INSERT INTO scrapings(brandName, itemName, price, material, brandStyleId, createdAt, updatedAt) values('${brandName}', '${itemName}', '${price}',  '${material}', '${brandStyleId}', '2020-12-26 11:00:00', '2020-12-26 12:00:00')`;

    connection.query(sql, function (err, result) {
      if(err) throw err;
      console.log("1 recoad inserted");
  });


  console.log(brandName);
  console.log(itemName);
  console.log(price);
  console.log(material);
  console.log(brandStyleId);

  })
})();

app.get('/', function (req, res) {
  res.set({ 'Access-Control-Allow-Origin': '*' });
  connection.query('select * from scrapings order by id desc limit 1;', function (error, results) {
    if (error) throw error;
    res.send(results[0]
);
  });
});

app.listen(5000, function () {
  console.log('Example app listening on port 5000!');
});

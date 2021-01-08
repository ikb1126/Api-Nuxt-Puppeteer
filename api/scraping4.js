//--Puppeteerを利用--//
const puppeteer = require('puppeteer');
const browserFetcher = puppeteer.createBrowserFetcher();

//--Expressを利用--//
const express = require('express');
const app = express();

//--Puppeteer起動--//
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
//--新規ページをクロームで開く------//
  const page = await browser.newPage();

//--FarfetchのSACAIのTOPページを開く------//
  await page.goto('https://www.farfetch.com/jp/shopping/men/sacai/items.aspx');

//☆商品名☆-----------------------------//

  let farfetchImageUrl = "#slice-container > div:nth-child(3) > div > div._0f346c > div > div._0ab668 > ul > li:nth-child(1) > a > div._9c4bad._976d71 > img#slice-container > div:nth-child(3) > div > div._0f346c > div > div._0ab668 > ul > li:nth-child(1) > a > div._9c4bad._976d71 > img";

  let farfetchItemName = "#slice-container > div:nth-child(3) > div > div._0f346c > div > div._0ab668 > ul > li:nth-child(1) > a > div._bab25b._18fbc8 > p";

  let farfetchItemPrice = "#slice-container > div:nth-child(3) > div > div._0f346c > div > div._0ab668 > ul > li:nth-child(1) > a > div._bab25b._18fbc8 > div > span._5cf853";

  const imageUrl = await page.evaluate(() => {
    return document.querySelector('#slice-container > div:nth-child(3) > div > div._0f346c > div > div._0ab668 > ul > li:nth-child(1) > a > div._9c4bad._976d71 > img').src;
    return item.textContent;
  });

  const itemName = await page.$eval(farfetchItemName, item => {
    return item.textContent;
  });

  const price = await page.$eval(farfetchItemPrice, item => {
    return item.textContent;
  });

  console.log( imageUrl );
  console.log( itemName );
  console.log( price );

  //--------------------------------------//

  //--ブラウザを閉じる------------------------//
  await browser.close();

  //--ルーティング(localhost:6000)------------//
  app.get('/api', (req, res) => {
    res.set({ 'Access-Control-Allow-Origin': '*' });
    Scraping.create({
      imageUrl: `${imageUrl}`,
      itemName: `${itemName}`,
      price: `${price}`
    }).then(result => {
      console.log('created:', result.itemName);
    });
    Scraping.findOne({
      order: [
        ['itemName', 'DESC']
      ]
    }).then(scrapings => res.json(scrapings))
  });
})();

//--Sequelizeによるデータベース操作-----------//
const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize('database_development', 'root', 'kumakuma', {
  host: 'localhost',
  dialect: 'mysql'
});

class Scraping extends Model {}
Scraping.init({
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  itemName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.STRING,
    allowNull: false
  },

}, {
  sequelize,
  modelName: 'Scraping'
});

//console.log(Scraping === sequelize.models.Scraping);

app.listen(5000, function () {
  console.log('Example app listening on port 5000!');
});

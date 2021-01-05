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

  //let contents = "#slice-container > div:nth-child(3) > div > div._0f346c > div > div._0ab668 > ul";

  //const contentsAll = await page.$eval(contents, item => {
    //return item.textContent;
  //});

  //☆商品名☆-----------------------------//
  const itemNameSelectors = 'p._d85b45';

  const items = await page.evaluate(( selector ) => {
      const items = Array.from(document.querySelectorAll( selector ))
      return items.map( v => v.textContent )
  } ,itemNameSelectors );

  for ( let item of items ) {
    console.log( item )
  };
  //--------------------------------------//

  //☆商品価格☆--------------------------- //
  const itemPriceSelectors = 'div._6356bb';

  const itemsPrices = await page.evaluate(( selector ) => {
    const itemsPrices = Array.from(document.querySelectorAll( selector ))
    return itemsPrices.map( v => v.textContent )
  } ,itemPriceSelectors);

  for ( let item of itemsPrices ) {
    console.log( itemsPrices )
  };

  //--ブラウザを閉じる------------------------//
  await browser.close();

  //--ルーティング(localhost:6000)------------//
  app.get('/', (req, res) => {
    res.set({ 'Access-Control-Allow-Origin': '*' });
    Scraping.create({
      itemUrl:  `${itemUrl}`,
      itemName: `${itemName}`,
      price: `${itemsPrices}`,
    }).then(result => {
      console.log('created:', result.brandName);
    });
    Scraping.findOne({
      order: [
        ['id', 'DESC']
      ]
    }).then(scrapings => res.json(scrapings))
  });
})();

const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize('database_development', 'root', 'kumakuma', {
  host: 'localhost',
  dialect: 'mysql'
});

class Scraping extends Model {}
Scraping.init({
  itemUrl: {
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
  }
}, {
  sequelize,
  modelName: 'Scraping'
});

console.log(Scraping === sequelize.models.Scraping);


app.listen(6000, function () {
  console.log('Example app listening on port 6000!');
});

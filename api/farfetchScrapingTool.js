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

//☆商品名を全て取得☆-----------------------------//

  let itemNameSelectors = 'p._d85b45';

  //const imageUrl = await page.evaluate(() => {
    //return document.querySelector('#slice-container > div:nth-child(3) > div > div._0f346c > div > div._0ab668 > ul > li:nth-child(1) > a > div._9c4bad._976d71 > img').src;
    //return item.textContent;
  //});

  const itemAll = await page.evaluate(( selector ) => {
    const itemAll = Array.from(document.querySelectorAll( selector ))
    return itemAll.map( v => v.textContent )
  } ,itemNameSelectors );

  for ( let item of itemAll ) {
    console.log( item )
  };

  //console.log( itemAll);

  //--------------------------------------//

  //--ブラウザを閉じる------------------------//
  await browser.close();

  //Sequelize--ルーティング(localhost:6000)------------//
  app.get('/api', (req, res) => {
    res.set({ 'Access-Control-Allow-Origin': '*' });
    Sacais.create({
      itemAll: `${itemAll}`
    }).then(result => {
      console.log('created:', result.itemAll);
    });
    Sacais.findAll({
      order: [
        ['itemAll', 'DESC']
      ]
    }).then(sacais => res.json(sacais))
  });
})();

//--Sequelizeによるデータベース操作-----------//
const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize('database_development', 'root', 'kumakuma', {
  host: 'localhost',
  dialect: 'mysql',
  define: {
      timestamps: false
  }
});

class Sacais extends Model {}
Sacais.init({
  itemAll: {
    type: DataTypes.STRING
  }
}, {
  sequelize,
  modelName: 'Sacais'
});

//console.log(Scraping === sequelize.models.Scraping);

app.listen(5000, function () {
  console.log('Example app listening on port 5000!');
});

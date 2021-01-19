//--Puppeteerを利用--//
const puppeteer = require('puppeteer');
const browserFetcher = puppeteer.createBrowserFetcher();

//--Expressを利用--//
const express = require('express');
const app = express();

let url = 'https://www.ssense.com/ja-jp/men/designers/maison-margiela';

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

//--SSENSE マルジェラのTOPページを開く------//
  await page.goto(url);

//☆ html全て取得☆-----------------------------//
  let html = await page.$eval('html', item => {
      return item.innerHTML;
  });

  let itemNameSelectors = await html.match();

  const itemAll = await page.evaluate(( selector ) => {
    const itemAll = Array.from(document.querySelectorAll( selector ))
    return itemAll.map( v => v.textContent )
  } ,itemNameSelectors );

  for ( let item of itemAll ) {
    console.log( item )
  };

  //--ブラウザを閉じる------------------------//
  await browser.close();

  //Sequelize--ルーティング(localhost:6000)------------//
  app.get('/api', (req, res) => {
    res.set({ 'Access-Control-Allow-Origin': '*' });
    Sacais.bulkCreate({
      itemAll: `${itemAll}`
    }).then(result => {
      console.log('created:', result.itemAll);
    });
    Sacais.findAll({
      order: [
        ['id', 'DESC']
      ]
    }).then(sacais => res.json(sacais))
  });
})();

//--Sequelizeによるデータベース操作-----------//
const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE, process.env.USERNAME, process.env.MYSQL_PASSWORD, {
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

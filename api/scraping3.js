//--Puppeteerを利用--//
const puppeteer = require('puppeteer');
const browserFetcher = puppeteer.createBrowserFetcher();

//--Expressを利用--//
const express = require('express');
const app = express();

const router = express.Router();

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

//商品名、ブランド名、価格を取得------//
  let contents = "#slice-container > div:nth-child(3) > div > div._0f346c > div > div._0ab668 > ul";

  const contentsAll = await page.$eval(contents, item => {
    return item.textContent;
  });

  //取得した情報をコンソール上に表示------//
  for ( let item of contentsAll ) {
    console.log( item )
  };


  //--ブラウザを閉じる------------------------//
  await browser.close();

  //--ルーティング(localhost:6000)------------//
  app.get('/api', (req, res) => {
    res.set({ 'Access-Control-Allow-Origin': '*' });
    Sacai.create({
      itemAll: `${itemAll}`
    }).then(result => {
      console.log('created:', result.itemAll);
    });
    Sacai.findAll({
      order: [
        ['itemAll', 'DESC']
      ]
    }).then(sacai => res.json(sacai))
  });
})();

//--Sequelizeによるデータベース操作-----------//
const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize('database_development', 'root', 'kumakuma', {
  host: 'localhost',
  dialect: 'mysql'
});

class Sacai extends Model {}
Sacai.init({
  itemAll: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Sacai'
});

app.listen(6000, function () {
  console.log('Example app listening on port 6000!');
});

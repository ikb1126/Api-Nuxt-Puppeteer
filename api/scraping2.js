const puppeteer = require('puppeteer');
const browserFetcher = puppeteer.createBrowserFetcher();

const express = require('express');
const app = express();

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

  let farfetchImageUrl = "#slice-pdp > div > div._53a765 > div._d47db0 > div._158f0f > div > div._34b430._480705 > div:nth-child(1) > img";
  let farfetchBrandName = "#bannerComponents-Container > h1 > span._0ab287 > a > span";
  let farfetchItemName = "#bannerComponents-Container > h1 > span._d85b45._3c73f1._d85b45";
  let farfetchItemPrice = "#slice-pdp > div > div._53a765 > div._d47db0 > div._3eed2e > div._7dad7e > div > span";
  let farfetchItemMaterial = "#panelInner-0 > div > div:nth-child(2) > div > div:nth-child(1) > p";
  let farfetchItemBrandStyleId = "#panelInner-0 > div > div:nth-child(2) > div > div:nth-child(3) > p > span";

  const imageUrl = await page.$eval(farfetchImageUrl, item => {
    return item.textContent;
  });

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

  console.log(imageUrl);
  console.log(brandName);
  console.log(itemName);
  console.log(price);
  console.log(material);
  console.log(brandStyleId);

  app.get('/api', (req, res) => {
    res.set({ 'Access-Control-Allow-Origin': '*' });
    Scraping.create({
      imageUrl:  `${imageUrl}`,
      brandName: `${brandName}`,
      itemName: `${itemName}`,
      price: `${price}`,
      material: `${material}`,
      brandStyleId: `${brandStyleId}`
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
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  brandName: {
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
  material: {
    type: DataTypes.STRING,
    allowNull: false
  },
  brandStyleId: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Scraping'
});

console.log(Scraping === sequelize.models.Scraping);

app.listen(5000, function () {
  console.log('Example app listening on port 5000!');
});

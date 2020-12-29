const express = require('express');
const app = express();

const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize('database_development', 'root', 'kumakuma', {
  host: 'localhost',
  dialect: 'mysql'
});

class Scraping extends Model {}
Scraping.init({
  brandName: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Scraping'
});

console.log(Scraping === sequelize.models.Scraping);

app.get('/api', (req, res) => {
  Scraping.findByPk(31).then(scrapings => res.json(scrapings))
})

app.listen(5000, function () {
  console.log('Example app listening on port 5000!');
});

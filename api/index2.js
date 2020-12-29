var mysql = require('mysql');

var con =mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "kumakuma",
  database: "database_development"
});

con.connect(function(err){
  if(err) throw err;
  var sql ="INSERT INTO scrapings(brandName, createdAt, updatedAt) values('kolor', '2020-12-26 11:00:00', '2020-12-26 12:00:00')";

  con.query(sql, function (err, result) {
    if(err) throw err;
    console.log("1 recoad inserted");
 });
});

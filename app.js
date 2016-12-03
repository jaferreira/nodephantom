var path = require('path');
var Horseman = require("node-horseman");
var express = require('express');
var bodyParser = require('body-parser')
var _url = require("url");
var app = express();

var horseman = new Horseman();

app.set('view engine', 'ejs')
app.set('views', path.resolve(__dirname, 'views'));
app.get('/', function (req, res) {
   res.render('index');
});

app.post('/add', bodyParser.json(), function (req, res) {


horseman
  .open('https://www.onlinebettingacademy.com/stats/match/portugal-stats/primeira-liga/sporting-cp/vitoria-setubal/2284833/1/prelive')
  .evaluate(function () {
    var homeTeam = $('td.stats-game-head-teamname')[0].querySelectorAll('a')[1].innerText.trim();
    return {HomeTeam : homeTeam.trim()};
  })
  .then(function(result){
    console.log("Number of links: " +result.HomeTeam);
    res.json(result.HomeTeam);
	  horseman.close();
  });

    var a = req.body.a;
    var b = req.body.b;

    var sum = a + b;

   
})


app.use(express.static(path.resolve(__dirname, 'public')));
app.listen(process.env.Port || 80)

// horseman
//   .open('http://www.abola.pt')

//   .count("li")
//   .then(function(numLinks){
// 	console.log("Number of links: " +numLinks);
// 	horseman.close();
//   });
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
    var a = req.body.a;
    var b = req.body.b;

    var sum = a + b;

    res.json(sum);
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
var Horseman = require("node-horseman");
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser')
var _url = require("url");
var app = express();
var _data = require('./dataAccess');
var http = require('http');

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

var horseman = new Horseman({
    injectJquery: true,
    injectBluebird: true,
    debugPort: process.env.PORT,
    webSecurity: false
});
var team = null;

//error logging
horseman
    .on('error', function(msg, trace) {
        console.log(msg, trace);
    }).on('timeout', function(timeout, msg) {
        console.log('timeout', msg);
    }).on('resourceTimeout', function(msg) {
        console.log('resourceTimeout', msg);
    }).on('resourceError', function(msg) {
        console.log('resourceError', msg);
    }).on('loadFinished', function(msg) {
        console.log('loadFinished', msg);
    }).on('loadStarted', function(msg) {
        console.log('loadStarted', msg);
    });

var result = [];


function getTeamByName(name) {
    // TODO: Call db find here...(by name)
    var ptTeams = [
        { "name": "Benfica", "url": "https://www.onlinebettingacademy.com/stats/team/portugal/benfica/1679" },
        { "name": "Sporting CP", "url": "https://www.onlinebettingacademy.com/stats/team/portugal/sporting-cp/1680" },
        { "name": "Porto", "url": "https://www.onlinebettingacademy.com/stats/team/portugal/porto/1678" },
        { "name": "Sporting Braga", "url": "https://www.onlinebettingacademy.com/stats/team/portugal/sporting-braga/1682" },
        { "name": "Vitória Guimarães", "url": "https://www.onlinebettingacademy.com/stats/team/portugal/vitria-guimares/1689" },
        { "name": "Rio Ave", "url": "https://www.onlinebettingacademy.com/stats/team/portugal/rio-ave/1683" },
        { "name": "Marítimo", "url": "https://www.onlinebettingacademy.com/stats/team/portugal/martimo/1684" },
        { "name": "Chaves", "url": "https://www.onlinebettingacademy.com/stats/team/portugal/chaves/1704" },
        { "name": "Estoril", "url": "https://www.onlinebettingacademy.com/stats/team/portugal/estoril/1695" },
        { "name": "Belenenses", "url": "https://www.onlinebettingacademy.com/stats/team/portugal/belenenses/1692" },
        { "name": "Arouca", "url": "https://www.onlinebettingacademy.com/stats/team/portugal/arouca/11611" },
        { "name": "Paços de Ferreira", "url": "https://www.onlinebettingacademy.com/stats/team/portugal/paos-de-ferreira/1693" },
        { "name": "Boavista", "url": "https://www.onlinebettingacademy.com/stats/team/portugal/boavista/1685" },
        { "name": "Vitória Setúbal", "url": "https://www.onlinebettingacademy.com/stats/team/portugal/vitria-setbal/1696" },
        { "name": "Moreirense", "url": "https://www.onlinebettingacademy.com/stats/team/portugal/moreirense/1687" },
        { "name": "Feirense", "url": "https://www.onlinebettingacademy.com/stats/team/portugal/feirense/1705" },
        { "name": "Tondela", "url": "https://www.onlinebettingacademy.com/stats/team/portugal/tondela/11833" },
        { "name": "Nacional", "url": "https://www.onlinebettingacademy.com/stats/team/portugal/nacional/1681" }
    ];

    return ptTeams.filter(function(obj) {
        return obj.name == name;
    });
}


var iteration = 0;
var maxIteratios = 2;

function getGames() {
    return horseman.evaluate(function() {
        // This code is executed in the browser.
        var gamesPage = {
            data: []
        };
        $('div.team-info.t_calendar.loaded > table > tbody > tr').each(function(item) {
            var game = {
                Competition: this.cells[2].innerText.trim(),
                Date: this.cells[0].innerText.trim(),
                Hour: this.cells[1].innerText.trim(),
                HomeTeam: this.cells[3].innerText.trim(),
                AwayTeam: this.cells[5].innerText.trim(),
                Result: this.cells[4].innerText.trim(),
                HomeScore: this.cells[4].innerText.trim().split('-')[0],
                AwayScore: this.cells[4].innerText.trim().split('-')[1],

                Url: this.cells[6].children[0].href,

                Scrapped: false,
                gameId: this.cells[2].innerText.trim() +
                this.cells[0].innerText.trim() +
                this.cells[3].innerText.trim() +
                this.cells[5].innerText.trim()
            };

            game.gameId = game.gameId.replace("/", "_");

            gamesPage.data.push(game);
        });
        return gamesPage;
    });
}

function hasNextPage() {
    return horseman.exists(".previous.changepage") && (iteration < maxIteratios);
}

function scrape() {
    return getGames()
        .then(function(newGames) {
            result.push(newGames);
            iteration++
            return hasNextPage()
        })
        .then(function(hasNext) {
            console.log('[HasNextPage] ' + hasNext);
            if (hasNext) {
                return horseman
                    .click('.previous.changepage')
                    .wait(5000)
                    // .waitForNextPage()
                    // .waitFor(function () {
                    //     return document.readyState === 'complete';
                    // }, true)
                    // .then(function(){
                    //     console.log(horseman.url());
                    // })
                    .then(scrape);
            }
            // result.push(newGames);
            // fs.appendFileSync('../path/to/file.json', newGames.slice(-1));
            return result;
        }).catch(function(err) {
            console.log("Error " + err.message);
            return err;
        })
}




app.set('view engine', 'ejs')
app.set('views', path.resolve(__dirname, 'views'));
app.get('/', function(req, res) {
    res.render('index');
});

app.get('/scrap/matches/:team', function(req, res) {
    var teamName = req.params.team;
    team = getTeamByName(teamName);

    console.log('Scraping team ' + teamName);

    //runs a google search with a specific query string
    horseman
        .do(function scrapGames() {
            console.log('Url: ' + team.url);
            return horseman
                .userAgent('*Mozilla Firefox/47.0.1 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Chrome 53.0.2785.34 Internet Explorer 11.0.28 Safari 9.1.2')
                .open('https://www.onlinebettingacademy.com/stats/team/portugal/benfica/1679')
                .then(scrape)
                .log("Scraping Complete")
                // .catch(function (err) {
                //     res.writeHead(200, { 'Content-Type': 'application/json' });
                //     res.end(JSON.stringify(err));
                //     horseman.close();
                // })
                .finally(function() {
                    var dbData = [];
                    for (i = 0; i < result.length; i++) {
                        dbData = dbData.concat(result[i].data);
                    }

                    console.log(JSON.stringify(dbData));

                    _data.saveGames(dbData, function() {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(result));
                        horseman.close();
                    })
                });
        })
});


app.get('/scrap/matchinfo/:id', function(req, res) {
    var gameId = req.params.id;

    _data.getGame(gameId, function(game) {
        var result = {};
        var url = game[0].Url + '/1/live';
        console.log(url);
        horseman
            .open(url)
            .evaluate(function(result) {
                result.GameData = {
                    Events: [],
                    HomeLineup: [],
                    AwayLineup: []
                };

                // 1 index based (has title in 0)
                var firstHalfSummary = $('table#first-half-summary > tbody > tr');
                var secondHalfSummary = $('table#second-half-summary > tbody > tr');

                for (i = 1; i < firstHalfSummary.length; i++) {
                    var homeEventTime = firstHalfSummary[i].children[0].innerText.trim();

                    var homeEventType = firstHalfSummary[i].children[1].querySelectorAll('img');
                    if (homeEventType.length > 0)
                        homeEventType = homeEventType[0].title.trim();

                    var homeEventPlayer = firstHalfSummary[i].children[2].innerText.trim();
                    var awayEventTime = firstHalfSummary[i].children[5].innerText.trim();

                    var awayEventType = firstHalfSummary[i].children[4].querySelectorAll('img');
                    if (awayEventType.length > 0)
                        awayEventType = awayEventType[0].title.trim();


                    var awayEventPlayer = firstHalfSummary[i].children[3].innerText.trim();
                }

                for (i = 1; i < secondHalfSummary.length; i++) {
                    var homeEventTime = secondHalfSummary[i].children[0].innerText.trim();

                    var homeEventType = secondHalfSummary[i].children[1].querySelectorAll('img');
                    if (homeEventType.length > 0)
                        homeEventType = homeEventType[0].title.trim();

                    var homeEventPlayer = secondHalfSummary[i].children[2].innerText.trim();
                    var awayEventTime = secondHalfSummary[i].children[5].innerText.trim();

                    var awayEventType = secondHalfSummary[i].children[4].querySelectorAll('img');
                    if (awayEventType.length > 0)
                        awayEventType = awayEventType[0].title.trim();

                    var awayEventPlayer = secondHalfSummary[i].children[3].innerText.trim();

                    result.GameData.Events.push({
                        TimeOfGame: 'Second-Half',
                        Time: (homeEventTime) ? homeEventTime : awayEventTime,
                        Type: (homeEventType) ? homeEventType : awayEventType,
                        Player: (homeEventPlayer) ? homeEventPlayer : awayEventPlayer
                    });
                }

                var homeTeamLineup = $('table#team-lineups > tbody > tr > td > table > tbody')[0].children;
                var awayTeamLineup = $('table#team-lineups > tbody > tr > td > table > tbody')[1].children;

                for (i = 0; i < homeTeamLineup.length; i++) {
                    result.GameData.HomeLineup.push({
                        Position: homeTeamLineup[i].children[0].innerText,
                        Nationality: homeTeamLineup[i].children[1].innerText,
                        Number: homeTeamLineup[i].children[2].innerText,
                        Name: homeTeamLineup[i].children[3].innerText
                    });
                }

                for (i = 0; i < awayTeamLineup.length; i++) {
                    result.GameData.AwayLineup.push({
                        Position: awayTeamLineup[i].children[3].innerText,
                        Nationality: awayTeamLineup[i].children[2].innerText,
                        Number: awayTeamLineup[i].children[1].innerText,
                        Name: awayTeamLineup[i].children[0].innerText
                    });
                }

                return result;
            }, result)
            .then(function(result) {
                console.log(result);
                _data.setGameAsScrapped(gameId, function() {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(result));
                });
                horseman.close();
            });
    });
});


app.get('/worker/', function(req, res) {
    _data.getUnscrappedGames(1, function(games) {

        for (i = 0; i < games.length; i++) {
            var game = games[i];
            //The url we want is: 'www.random.org/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'
            var options = {
                host: 'localhost',
                port: 4000,
                path: '/scrap/matchInfo/' + game.gameId.replaceAll(' ', '%20')
            };

            callback = function(response) {
                var str = '';

                //another chunk of data has been recieved, so append it to `str`
                response.on('data', function(chunk) {
                    str += chunk;
                });

                //the whole response has been recieved, so we just print it out here
                response.on('end', function() {
                    console.log(str);
                });
            }

            console.log('[Http Request] ' + options.host + options.path);
            http.request(options, callback).end();
        }
    });
});

app.get('/status', function(req, res) {
    var games = _data.getAllGames(function(games) {
        res.render('status', { games: games });
    });
});


app.use(express.static(path.resolve(__dirname, 'public')));
app.listen(process.env.Port || 4000)

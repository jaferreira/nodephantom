var path = require('path');
var Horseman = require("node-horseman");
var express = require('express');
var bodyParser = require('body-parser')
var _url = require("url");
var app = express();


var gameUrlsToScrap = [];
var ptTeams = [
    { name: 'porto', url: 'https://www.onlinebettingacademy.com/stats/team/portugal/porto/1678' },
    { name: 'benfica', url: 'https://www.onlinebettingacademy.com/stats/team/portugal/benfica/1679' },
    { name: 'sporting', url: 'https://www.onlinebettingacademy.com/stats/team/portugal/sporting-cp/1680' },
    { name: 'braga', url: 'https://www.onlinebettingacademy.com/stats/team/portugal/sporting-braga/1682' },
    { name: 'vitoria', url: 'https://www.onlinebettingacademy.com/stats/team/portugal/vitoria-guimaraes/1689' },
    { name: 'chaves', url: 'https://www.onlinebettingacademy.com/stats/team/portugal/chaves/1704' }
];

var COMPETITION_DEFAULT = 'DEFAULT';
var COMPETITION_CHAMPIONS = 'CHAMPIONS';
var COMPETITION_TACA_LIGA = 'TACA_LIGA';

var competitions = [
    { name: 'Primeira Liga 16/17', type: COMPETITION_DEFAULT },
    { name: 'UEFA Champions League 16/17', type: COMPETITION_CHAMPIONS }
];

function scrap() {
    try {

        var homeTeam = $('td.stats-game-head-teamname')[0].querySelectorAll('a')[1].innerText.trim();
        var awayTeam = $('td.stats-game-head-teamname')[1].querySelectorAll('a')[1].innerText.trim();
        var gamesBetweenTeams = [];
        var matches = $('table.stat-cd3 > tbody > tr');

        for (i = 0; i < matches.length - 1; i++) {
            match = matches[i].querySelectorAll('td');
            if (match[0].innerText == 'No results')
                break;

            gamesBetweenTeams[i] = {
                'Season': match[1].querySelector('a').innerText,
                'Competicion': match[1].getAttribute("title"),
                'Date': match[0].innerText,
                'HomeTeam': match[2].querySelector('a').innerText,
                'AwayTeam': match[4].innerText,
                'Result': match[3].innerText,
                'SameHomeTeam': match[2].querySelector('a').innerText.trim().toLowerCase() == homeTeam.toLowerCase(),
                'HomeScore': match[3].innerText.split('-')[0],
                'AwayScore': match[3].innerText.split('-')[1]
            };
        }

        var classificationstable = $('.competition-rounds');

        var total = classificationstable[0].querySelectorAll('tbody')[0].children;
        var casa = classificationstable[1].querySelectorAll('tbody')[0].children;
        var fora = classificationstable[2].querySelectorAll('tbody')[0].children;

        var generalTable = [];

        for (i = 0; i < total.length; i++) {
            var gameData = total[i].children;
            var order = gameData[0].innerText.trim();
            var team = gameData[1].innerText.trim();
            var P = gameData[2].innerText.trim();
            var J = gameData[3].innerText.trim();
            var V = gameData[4].innerText.trim();
            var E = gameData[5].innerText.trim();
            var D = gameData[6].innerText.trim();
            var goals = gameData[7].innerText.trim();


            generalTable[i] = {
                Order: order,
                Team: team,
                Points: P,
                Games: J,
                Vitories: V,
                Draws: E,
                Defeats: D,
                Goals: goals,
                IsHomeTeam: team.toLowerCase() == homeTeam.toLowerCase(),
                IsAwayTeam: team.toLowerCase() == awayTeam.toLowerCase()
            };


        }

        var homeTable = [];
        for (i = 0; i < total.length; i++) {
            var gameData = casa[i].children;

            var order = gameData[0].innerText;
            var team = gameData[1].innerText;
            var P = gameData[2].innerText;
            var J = gameData[3].innerText;
            var V = gameData[4].innerText;
            var E = gameData[5].innerText;
            var D = gameData[6].innerText;
            var goals = gameData[7].innerText;

            homeTable[i] = {
                Order: order,
                Team: team,
                Points: P,
                Games: J,
                Vitories: V,
                Draws: E,
                Defeats: D,
                Goals: goals,
                IsHomeTeam: team.toLowerCase() == homeTeam.toLowerCase(),
                IsAwayTeam: team.toLowerCase() == awayTeam.toLowerCase()
            };



        }


        var awayTable = [];
        for (i = 0; i < total.length; i++) {
            var gameData = fora[i].children;

            var order = gameData[0].innerText;
            var team = gameData[1].innerText;
            var P = gameData[2].innerText;
            var J = gameData[3].innerText;
            var V = gameData[4].innerText;
            var E = gameData[5].innerText;
            var D = gameData[6].innerText;
            var goals = gameData[7].innerText;

            awayTable[i] = {
                Order: order,
                Team: team,
                Points: P,
                Games: J,
                Vitories: V,
                Draws: E,
                Defeats: D,
                Goals: goals,
                IsHomeTeam: team.toLowerCase() == homeTeam.toLowerCase(),
                IsAwayTeam: team.toLowerCase() == awayTeam.toLowerCase()
            };


        }

        var homeRoad = [];
        var awayRoad = [];

        // Percurso
        var precursoTr = $('span.stats-title.course')[0].parentElement.parentElement.parentElement.children[1];
        var precursoHome = precursoTr.children[0].querySelectorAll('tbody > tr');
        var precursoAway = precursoTr.children[1].querySelectorAll('tbody > tr');


        for (i = 0; i < precursoHome.length; i++) {
            var desc = precursoHome[i].children[0].innerText;
            var casa = precursoHome[i].children[1].innerText;
            var fora = precursoHome[i].children[2].innerText;
            var global = precursoHome[i].children[3].innerText;


            homeRoad[i] = {
                Desc: precursoHome[i].children[0].innerText,
                Home: precursoHome[i].children[1].innerText,
                Away: precursoHome[i].children[2].innerText,
                Global: precursoHome[i].children[3].innerText

            };

        }

        for (i = 0; i < precursoAway.length; i++) {
            var desc = precursoAway[i].children[0].innerText;
            var casa = precursoAway[i].children[1].innerText;
            var fora = precursoAway[i].children[2].innerText;
            var global = precursoAway[i].children[3].innerText;


            awayRoad[i] = {
                Desc: precursoAway[i].children[0].innerText,
                Home: precursoAway[i].children[1].innerText,
                Away: precursoAway[i].children[2].innerText,
                Global: precursoAway[i].children[3].innerText

            };

        }
        var goalsHome = [];
        var goalsAway = [];

        // Golos
        var golosTr = $('span.stats-title.course')[1].parentElement.parentElement.parentElement.parentElement.children[1].children[0];
        var golosSecondTr = $('span.stats-title.course')[1].parentElement.parentElement.parentElement.parentElement.children[1].children[1];

        var golosHome = golosTr.children[0].querySelectorAll('tbody > tr');
        var golosAway = golosTr.children[1].querySelectorAll('tbody > tr');

        var momentosGolosHome = golosSecondTr.children[0].querySelectorAll('tbody > tr');
        var momentosGolosAway = golosSecondTr.children[1].querySelectorAll('tbody > tr');


        for (i = 0; i < golosHome.length; i++) {

            if (golosHome[i].children.length == 3) {
                var desc = golosHome[i].children[0].innerText;
                var casa = golosHome[i].children[1].innerText;
                var fora = golosHome[i].children[2].innerText;

                goalsHome[i] = {
                    Desc: golosHome[i].children[0].innerText,
                    Home: golosHome[i].children[1].innerText,
                    Away: golosHome[i].children[2].innerText

                };

            }
            else {
                var desc = golosHome[i].children[0].innerText;

                var casa = golosHome[i].children[1].innerText;

                var fora = golosHome[i].children[2].innerText;

                var global = golosHome[i].children[3].innerText;

                goalsHome[i] = {
                    Desc: golosHome[i].children[0].innerText,
                    Home: golosHome[i].children[1].innerText,
                    Away: golosHome[i].children[2].innerText,
                    Global: golosHome[i].children[3].innerText

                };

            }
        }

        var homePeriodGoals = [];

        for (i = 0; i < momentosGolosHome.length; i++) {

            if (i == momentosGolosHome.length - 1)
                continue;

            var odd = (i % 2) != 0;
            var periodo = '';

            if (!odd) {
                if (i < 2) {
                    periodo = '0-15';
                } else if (i < 4) {
                    periodo = '16-30';
                } else if (i < 6) {
                    periodo = '31-45';
                } else if (i < 8) {
                    periodo = '46-60';
                } else if (i < 10) {
                    periodo = '61-75';
                } else {
                    periodo = '76-90';
                }
            }

            var desc = (odd) ? momentosGolosHome[i].children[0].innerText : momentosGolosHome[i].children[1].innerText;
            var numGolos = (odd) ? momentosGolosHome[i].children[1].innerText : momentosGolosHome[i].children[2].innerText;



            homePeriodGoals[i] = {
                Period: periodo,
                Desc: desc,
                Goals: numGolos

            };


        }


        for (i = 0; i < golosAway.length; i++) {

            if (golosAway[i].children.length == 3) {
                var desc = golosAway[i].children[0].innerText;
                var casa = golosAway[i].children[1].innerText;
                var fora = golosAway[i].children[2].innerText;

                goalsAway[i] = {
                    Desc: golosAway[i].children[0].innerText,
                    Home: golosAway[i].children[1].innerText,
                    Away: golosAway[i].children[2].innerText

                };


            }
            else {

                var desc = golosAway[i].children[0].innerText;
                var casa = golosAway[i].children[1].innerText;
                var fora = golosAway[i].children[2].innerText;
                var global = golosAway[i].children[3].innerText;

                goalsAway[i] = {
                    Desc: golosAway[i].children[0].innerText,
                    Home: golosAway[i].children[1].innerText,
                    Away: golosAway[i].children[2].innerText,
                    Global: golosAway[i].children[3].innerText

                };
            }
        }

        var awayPeriodGoals = [];
        for (i = 0; i < momentosGolosAway.length; i++) {

            if (i == momentosGolosAway.length - 1)
                continue;

            var odd = (i % 2) != 0;
            var periodo = '';

            if (!odd) {
                if (i < 2) {
                    periodo = '0-15';
                } else if (i < 4) {
                    periodo = '16-30';
                } else if (i < 6) {
                    periodo = '31-45';
                } else if (i < 8) {
                    periodo = '46-60';
                } else if (i < 10) {
                    periodo = '61-75';
                } else {
                    periodo = '76-90';
                }
            }

            var desc = (odd) ? momentosGolosAway[i].children[0].innerText : momentosGolosAway[i].children[1].innerText;
            var numGolos = (odd) ? momentosGolosAway[i].children[1].innerText : momentosGolosAway[i].children[2].innerText;



            awayPeriodGoals[i] = {
                Period: periodo,
                Desc: desc,
                Goals: numGolos

            };

        }


        var resultadoTr = $('span.stats-title.course')[2].parentElement.parentElement.parentElement.children[1];

        var resultadosHome = resultadoTr.children[0];
        var resultadosAway = resultadoTr.children[1];

        var resultadoAoIntervaloHome = resultadosHome.querySelectorAll('tbody')[1].children;
        var resultadoFinalHome = resultadosHome.querySelectorAll('tbody')[2].children;

        var resultadoAoIntervaloAway = resultadosAway.querySelectorAll('tbody')[1].children;
        var resultadoFinalAway = resultadosAway.querySelectorAll('tbody')[2].children;

        var homeResultsHome = [];
        var awayResultsAway = [];


        for (i = 0; i < resultadoAoIntervaloHome.length; i++) {
            var resultado = resultadoAoIntervaloHome[i].children[0].innerText;
            var percent = resultadoAoIntervaloHome[i].children[1].innerText;

            homeResultsHome[i] = {
                Result: resultadoAoIntervaloHome[i].children[0].innerText,
                Percent: resultadoAoIntervaloHome[i].children[1].innerText

            };

        }

        for (i = 0; i < resultadoFinalHome.length; i++) {
            var resultado = resultadoFinalHome[i].children[0].innerText;
            var percent = resultadoFinalHome[i].children[1].innerText;

            homeResultsHome[i] = {
                Result: resultadoFinalHome[i].children[0].innerText,
                Percent: resultadoFinalHome[i].children[1].innerText

            };

        }
        for (i = 0; i < resultadoAoIntervaloAway.length; i++) {
            var resultado = resultadoAoIntervaloAway[i].children[0].innerText;
            var percent = resultadoAoIntervaloAway[i].children[1].innerText;

            awayResultsAway[i] = {
                Result: resultadoAoIntervaloAway[i].children[0].innerText,
                Percent: resultadoAoIntervaloAway[i].children[1].innerText

            };


        }


        for (i = 0; i < resultadoFinalAway.length; i++) {
            var resultado = resultadoFinalAway[i].children[0].innerText;
            var percent = resultadoFinalAway[i].children[1].innerText;

            awayResultsAway[i] = {
                Result: resultadoFinalAway[i].children[0].innerText,
                Percent: resultadoFinalAway[i].children[1].innerText

            };

        }

        return {
            HomeTeam: homeTeam.trim(),
            AwayTeam: awayTeam.trim(),
            GamesBetweenTeams: gamesBetweenTeams,
            GeneralTable: generalTable,
            HomeTable: homeTable,
            AwayTable: awayTable,
            HomeRoad: homeRoad,
            AwayRoad: awayRoad,
            GoalsHome: goalsHome,
            GoalsAway: goalsAway,
            HomePeriodGoals: homePeriodGoals,
            AwayPeriodGoals: awayPeriodGoals,
            HomeResultsHome: homeResultsHome,
            AwayResultsAway: awayResultsAway
        };
    }
    catch (err) {
        return err;
    }
}


app.set('view engine', 'ejs')
app.set('views', path.resolve(__dirname, 'views'));
app.get('/', function (req, res) {
    res.render('index');
});


app.get('/v1/scrap/pt/:team', function (req, res) {
    var team = req.params.team;
    console.log(team);
    var foundTeam = ptTeams.filter(function (obj) {
        return obj.name == team;
    });
    console.log(foundTeam[0]);
    console.log(foundTeam[0].url);
    var gameToScrap;

    var horseman = new Horseman();
    horseman
        .userAgent("Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0")
        .open(foundTeam[0].url)
        .evaluate(function () {
            try {
                var debugInfo = [];
                var teamGames = $('table.next-games > tbody')[0].querySelectorAll('tr');
                var tempGameRow;
                var nextGameUrl = '';
                var competition = '';

                for (i = 0; i < teamGames.length; i++) {
                    if (teamGames[i].innerText.indexOf('vs') == -1)
                        break;
                    tempGameRow = teamGames[i];
                }

                if (tempGameRow) {
                    nextGameUrl = tempGameRow.children[4].children[0].href;
                    competition = tempGameRow.children[2].children[0].innerText.trim();
                }
                return { competition: competition, url: nextGameUrl, debug: debugInfo };
            }
            catch (err) {
                return { isError: true, errorInfo: [err] };
            }
        })
        .then(function (gameData) {

            //console.log('string' + JSON.stringify(gameData));
            if (gameData.isError) {
                //logError('Error on Horseman', gameData.errorInfo);
            }
            else {
                if (gameData.debug.length > 0) {
                    //logInfo('Debug Info:');
                    // for (i = 0; i < gameData.debug.length; i++) {
                    //     logInfo('\t-' + gameData.debug[i]);
                    // }
                }
                // console.log('push - ' + gameData.url);
                gametoScrap = gameData;
            }

            var comp = competitions.find(function (c) {
                return c.name === gameData.competition;
            });

            var gameInfo = {
                url: gameData.url,
                competition: comp
            };

            console.log(JSON.stringify(gameInfo, null, 2));

            horseman
                .open(gameData.url)
                .evaluate(function (gameInfo) {
                    var competition = gameInfo.competition;

                    var steps = '0';
                    var homeTeam = $('td.stats-game-head-teamname')[0].querySelectorAll('a')[1].innerText.trim();
                    var awayTeam = $('td.stats-game-head-teamname')[1].querySelectorAll('a')[1].innerText.trim();
                    var gamesBetweenTeams = [];
                    var matches = $('table.stat-cd3 > tbody > tr');

                    try {
                        var scoreTables = document.querySelectorAll('#ultimos_resultados > table > tbody > tr')[1].querySelectorAll('.stat-last10.stat-half-padding');
                        var homeScoresTable = scoreTables[0].querySelectorAll('tbody > tr');
                        var awayScoresTable = scoreTables[1].querySelectorAll('tbody > tr');

                        var homeScores = [];
                        var awayScores = [];

                        for (i = 0; i < homeScoresTable.length; i++) {
                            var homeCells = homeScoresTable[i].querySelectorAll('td');
                            if (homeCells.length < 5)
                                continue;

                            var date = homeCells[0].innerText;
                            var homeTeam_ = homeCells[2].innerText;
                            var awayTeam_ = homeCells[4].innerText;
                            var finalScore = homeCells[3].querySelectorAll('a')[0].innerText;

                            homeScores.push({
                                Competicion: competition.name,
                                Date: date,
                                HomeTeam: homeTeam_,
                                AwayTeam: awayTeam_,
                                Result: finalScore,
                                SameHomeTeam: homeTeam_.toLowerCase() == homeTeam.toLowerCase(),
                                HomeScore: finalScore.split('-')[0],
                                AwayScore: finalScore.split('-')[1]
                            });
                        }
                        for (i = 0; i < awayScoresTable.length; i++) {
                            var homeCells = awayScoresTable[i].querySelectorAll('td');
                            if (homeCells.length < 5)
                                continue;

                            var date = homeCells[0].innerText;

                            var homeTeam_ = homeCells[2].innerText;
                            var awayTeam_ = homeCells[4].innerText;
                            var finalScore = homeCells[3].querySelectorAll('a')[0].innerText;

                            awayScores.push({
                                Competicion: competition.name,
                                Date: date,
                                HomeTeam: homeTeam_,
                                AwayTeam: awayTeam_,
                                Result: finalScore,
                                SameAwayTeam: awayTeam_.toLowerCase() == awayTeam.toLowerCase(),
                                HomeScore: finalScore.split('-')[0],
                                AwayScore: finalScore.split('-')[1]
                            });
                        }

                        for (i = 0; i < matches.length - 1; i++) {
                            match = matches[i].querySelectorAll('td');
                            if (match[0].innerText == 'No results')
                                break;

                            gamesBetweenTeams[i] = {
                                'Season': match[1].querySelector('a').innerText,
                                'Competicion': match[1].getAttribute("title"),
                                'Date': match[0].innerText,
                                'HomeTeam': match[2].querySelector('a').innerText,
                                'AwayTeam': match[4].innerText,
                                'Result': match[3].innerText,
                                'SameHomeTeam': match[2].querySelector('a').innerText.trim().toLowerCase() == homeTeam.toLowerCase(),
                                'HomeScore': match[3].innerText.split('-')[0],
                                'AwayScore': match[3].innerText.split('-')[1]
                            };
                        }

                        var generalTable = [];
                        var homeTable = [];
                        var awayTable = [];

                        if (competition.type == 'DEFAULT') {
                            var classificationstable = $('.competition-rounds');

                            var total = classificationstable[0].querySelectorAll('tbody')[0].children;
                            var casa = classificationstable[1].querySelectorAll('tbody')[0].children;
                            var fora = classificationstable[2].querySelectorAll('tbody')[0].children;

                            for (i = 0; i < total.length; i++) {
                                var gameData = total[i].children;
                                var order = gameData[0].innerText.trim();
                                var team = gameData[1].innerText.trim();
                                var P = gameData[2].innerText.trim();
                                var J = gameData[3].innerText.trim();
                                var V = gameData[4].innerText.trim();
                                var E = gameData[5].innerText.trim();
                                var D = gameData[6].innerText.trim();
                                var goals = gameData[7].innerText.trim();


                                generalTable[i] = {
                                    Order: order,
                                    Team: team,
                                    Points: P,
                                    Games: J,
                                    Vitories: V,
                                    Draws: E,
                                    Defeats: D,
                                    Goals: goals,
                                    IsHomeTeam: team.toLowerCase() == homeTeam.toLowerCase(),
                                    IsAwayTeam: team.toLowerCase() == awayTeam.toLowerCase()
                                };
                            }

                            for (i = 0; i < total.length; i++) {
                                var gameData = casa[i].children;

                                var order = gameData[0].innerText;
                                var team = gameData[1].innerText;
                                var P = gameData[2].innerText;
                                var J = gameData[3].innerText;
                                var V = gameData[4].innerText;
                                var E = gameData[5].innerText;
                                var D = gameData[6].innerText;
                                var goals = gameData[7].innerText;

                                homeTable[i] = {
                                    Order: order,
                                    Team: team,
                                    Points: P,
                                    Games: J,
                                    Vitories: V,
                                    Draws: E,
                                    Defeats: D,
                                    Goals: goals,
                                    IsHomeTeam: team.toLowerCase() == homeTeam.toLowerCase(),
                                    IsAwayTeam: team.toLowerCase() == awayTeam.toLowerCase()
                                };



                            }

                            for (i = 0; i < total.length; i++) {
                                var gameData = fora[i].children;

                                var order = gameData[0].innerText;
                                var team = gameData[1].innerText;
                                var P = gameData[2].innerText;
                                var J = gameData[3].innerText;
                                var V = gameData[4].innerText;
                                var E = gameData[5].innerText;
                                var D = gameData[6].innerText;
                                var goals = gameData[7].innerText;

                                awayTable[i] = {
                                    Order: order,
                                    Team: team,
                                    Points: P,
                                    Games: J,
                                    Vitories: V,
                                    Draws: E,
                                    Defeats: D,
                                    Goals: goals,
                                    IsHomeTeam: team.toLowerCase() == homeTeam.toLowerCase(),
                                    IsAwayTeam: team.toLowerCase() == awayTeam.toLowerCase()
                                };


                            }
                        }

                        // Course on Competition
                        var courseOnCompetition = {
                            group: '',
                            qualifyingGames: [],
                            groupGames: [],
                            groupClassification: []
                        };

                        if (competition.type == 'CHAMPIONS') {
                            var competitionHistoryTable = document.querySelectorAll('.comp-history > tbody');

                            var qualifyingGamesInfo = competitionHistoryTable[0].children[1];
                            var qualifyingGamesInfoHome = qualifyingGamesInfo.children[0].querySelectorAll('table');
                            var qualifyingGamesInfoAway = qualifyingGamesInfo.children[1].querySelectorAll('table');

                            for (j = 0; j < qualifyingGamesInfoHome.length; j++) {

                                var qualificationGame = {
                                    round: qualifyingGamesInfoHome[j].querySelectorAll('thead > tr > td')[0].innerText,
                                    games: []
                                };

                                var roundGames = qualifyingGamesInfoHome[j].querySelectorAll('tbody > tr');
                                for (r = 0; r < roundGames.length; r++) {
                                    if (roundGames[r].children[1].innerText.length == 1)
                                        break;
                                    qualificationGame.games.push({
                                        Competicion: competition.name,
                                        Date: '',
                                        HomeTeam: roundGames[r].children[0].innerText,
                                        AwayTeam: roundGames[r].children[2].innerText,
                                        Result: roundGames[r].children[1].innerText,
                                        HomeScore: roundGames[r].children[1].innerText.split('-')[0],
                                        AwayScore: roundGames[r].children[1].innerText.split('-')[1]
                                    });
                                }

                                courseOnCompetition.qualifyingGames.push(qualificationGame);
                            }

                            for (j = 0; j < qualifyingGamesInfoAway.length; j++) {

                                var qualificationGame = {
                                    round: qualifyingGamesInfoAway[j].querySelectorAll('thead > tr > td')[0].innerText,
                                    games: []
                                };

                                var roundGames = qualifyingGamesInfoAway[j].querySelectorAll('tbody > tr');
                                for (r = 0; r < roundGames.length; r++) {
                                    if (roundGames[r].children[1].innerText.length == 1)
                                        break;

                                    qualificationGame.games.push({
                                        Competicion: competition.name,
                                        Date: '',
                                        HomeTeam: roundGames[r].children[0].innerText,
                                        AwayTeam: roundGames[r].children[2].innerText,
                                        Result: roundGames[r].children[1].innerText,
                                        HomeScore: roundGames[r].children[1].innerText.split('-')[0],
                                        AwayScore: roundGames[r].children[1].innerText.split('-')[1]
                                    });
                                }

                                courseOnCompetition.qualifyingGames.push(qualificationGame);
                            }

                            var groupClassification = competitionHistoryTable[0].children[3].querySelectorAll('table.competition-class > tbody')[0].children;
                            for (g = 0; g < groupClassification.length; g++) {
                                
                                var futureClass = groupClassification[g].getAttribute('class');
                                var state = '';

                                if (futureClass == 'zone-nr')
                                    state = 'Next Round';
                                else if (futureClass == 'zone-el')
                                    state = 'Europa League';

                                courseOnCompetition.groupClassification.push({
                                    position: groupClassification[g].children[0].innerText,
                                    state: state,
                                    team: groupClassification[g].children[2].innerText,
                                    points: groupClassification[g].children[3].innerText,
                                    games: groupClassification[g].children[4].innerText,
                                    wins: groupClassification[g].children[5].innerText,
                                    draws: groupClassification[g].children[6].innerText,
                                    losses: groupClassification[g].children[7].innerText,
                                    goalScore: groupClassification[g].children[8].innerText,
                                    goalConceded: groupClassification[g].children[9].innerText,
                                    goalDiff: groupClassification[g].children[10].innerText,
                                });
                            }

                            var groupHistoryGames = competitionHistoryTable[0].children[3].querySelectorAll('table.comp-hist-round > tbody')[0].children;
                            for (g = 0; g < groupHistoryGames.length; g++) {


                                courseOnCompetition.groupGames.push({
                                    Competicion: competition.name,
                                    Date: '',

                                    HomeTeam: groupHistoryGames[r].children[0].innerText,
                                    AwayTeam: groupHistoryGames[r].children[2].innerText,

                                    Result: groupHistoryGames[r].children[1].innerText,
                                    HomeScore: groupHistoryGames[g].children[1].innerText.split('-')[0],
                                    AwayScore: groupHistoryGames[g].children[1].innerText.split('-')[1]
                                });
                            }


                        }


                        steps += '  -> classifications done';

                        var homeRoad = [];
                        var awayRoad = [];

                        // Percurso
                        var precursoTr = $('span.stats-title.course')[0].parentElement.parentElement.parentElement.children[1];
                        var precursoHome = precursoTr.children[0].querySelectorAll('tbody > tr');
                        var precursoAway = precursoTr.children[1].querySelectorAll('tbody > tr');


                        for (i = 0; i < precursoHome.length; i++) {
                            var desc = precursoHome[i].children[0].innerText;
                            var casa = precursoHome[i].children[1].innerText;
                            var fora = precursoHome[i].children[2].innerText;
                            var global = precursoHome[i].children[3].innerText;


                            homeRoad[i] = {
                                Desc: precursoHome[i].children[0].innerText,
                                Home: precursoHome[i].children[1].innerText,
                                Away: precursoHome[i].children[2].innerText,
                                Global: precursoHome[i].children[3].innerText

                            };

                        }

                        for (i = 0; i < precursoAway.length; i++) {
                            var desc = precursoAway[i].children[0].innerText;
                            var casa = precursoAway[i].children[1].innerText;
                            var fora = precursoAway[i].children[2].innerText;
                            var global = precursoAway[i].children[3].innerText;


                            awayRoad[i] = {
                                Desc: precursoAway[i].children[0].innerText,
                                Home: precursoAway[i].children[1].innerText,
                                Away: precursoAway[i].children[2].innerText,
                                Global: precursoAway[i].children[3].innerText

                            };

                        }
                        var goalsHome = [];
                        var goalsAway = [];

                        // Golos
                        var golosTr = $('span.stats-title.course')[1].parentElement.parentElement.parentElement.parentElement.children[1].children[0];
                        var golosSecondTr = $('span.stats-title.course')[1].parentElement.parentElement.parentElement.parentElement.children[1].children[1];

                        var golosHome = golosTr.children[0].querySelectorAll('tbody > tr');
                        var golosAway = golosTr.children[1].querySelectorAll('tbody > tr');

                        var momentosGolosHome = golosSecondTr.children[0].querySelectorAll('tbody > tr');
                        var momentosGolosAway = golosSecondTr.children[1].querySelectorAll('tbody > tr');


                        for (i = 0; i < golosHome.length; i++) {

                            if (golosHome[i].children.length == 3) {
                                var desc = golosHome[i].children[0].innerText;
                                var casa = golosHome[i].children[1].innerText;
                                var fora = golosHome[i].children[2].innerText;

                                goalsHome[i] = {
                                    Desc: golosHome[i].children[0].innerText,
                                    Home: golosHome[i].children[1].innerText,
                                    Away: golosHome[i].children[2].innerText

                                };

                            }
                            else {
                                var desc = golosHome[i].children[0].innerText;

                                var casa = golosHome[i].children[1].innerText;

                                var fora = golosHome[i].children[2].innerText;

                                var global = golosHome[i].children[3].innerText;

                                goalsHome[i] = {
                                    Desc: golosHome[i].children[0].innerText,
                                    Home: golosHome[i].children[1].innerText,
                                    Away: golosHome[i].children[2].innerText,
                                    Global: golosHome[i].children[3].innerText

                                };

                            }
                        }

                        var homePeriodGoals = [];

                        for (i = 0; i < momentosGolosHome.length; i++) {

                            if (i == momentosGolosHome.length - 1)
                                continue;

                            var odd = (i % 2) != 0;
                            var periodo = '';

                            if (!odd) {
                                if (i < 2) {
                                    periodo = '0-15';
                                } else if (i < 4) {
                                    periodo = '16-30';
                                } else if (i < 6) {
                                    periodo = '31-45';
                                } else if (i < 8) {
                                    periodo = '46-60';
                                } else if (i < 10) {
                                    periodo = '61-75';
                                } else {
                                    periodo = '76-90';
                                }
                            }

                            var desc = (odd) ? momentosGolosHome[i].children[0].innerText : momentosGolosHome[i].children[1].innerText;
                            var numGolos = (odd) ? momentosGolosHome[i].children[1].innerText : momentosGolosHome[i].children[2].innerText;



                            homePeriodGoals[i] = {
                                Period: periodo,
                                Desc: desc,
                                Goals: numGolos

                            };


                        }


                        for (i = 0; i < golosAway.length; i++) {

                            if (golosAway[i].children.length == 3) {
                                var desc = golosAway[i].children[0].innerText;
                                var casa = golosAway[i].children[1].innerText;
                                var fora = golosAway[i].children[2].innerText;

                                goalsAway[i] = {
                                    Desc: golosAway[i].children[0].innerText,
                                    Home: golosAway[i].children[1].innerText,
                                    Away: golosAway[i].children[2].innerText

                                };


                            }
                            else {

                                var desc = golosAway[i].children[0].innerText;
                                var casa = golosAway[i].children[1].innerText;
                                var fora = golosAway[i].children[2].innerText;
                                var global = golosAway[i].children[3].innerText;

                                goalsAway[i] = {
                                    Desc: golosAway[i].children[0].innerText,
                                    Home: golosAway[i].children[1].innerText,
                                    Away: golosAway[i].children[2].innerText,
                                    Global: golosAway[i].children[3].innerText

                                };
                            }
                        }

                        var awayPeriodGoals = [];
                        for (i = 0; i < momentosGolosAway.length; i++) {

                            if (i == momentosGolosAway.length - 1)
                                continue;

                            var odd = (i % 2) != 0;
                            var periodo = '';

                            if (!odd) {
                                if (i < 2) {
                                    periodo = '0-15';
                                } else if (i < 4) {
                                    periodo = '16-30';
                                } else if (i < 6) {
                                    periodo = '31-45';
                                } else if (i < 8) {
                                    periodo = '46-60';
                                } else if (i < 10) {
                                    periodo = '61-75';
                                } else {
                                    periodo = '76-90';
                                }
                            }

                            var desc = (odd) ? momentosGolosAway[i].children[0].innerText : momentosGolosAway[i].children[1].innerText;
                            var numGolos = (odd) ? momentosGolosAway[i].children[1].innerText : momentosGolosAway[i].children[2].innerText;



                            awayPeriodGoals[i] = {
                                Period: periodo,
                                Desc: desc,
                                Goals: numGolos

                            };

                        }

                        var resultadoTr = $('span.stats-title.course')[2].parentElement.parentElement.parentElement.children[1];

                        var resultadosHome = resultadoTr.children[0];
                        var resultadosAway = resultadoTr.children[1];

                        var resultadoAoIntervaloHome = resultadosHome.querySelectorAll('tbody')[1].children;
                        var resultadoFinalHome = resultadosHome.querySelectorAll('tbody')[2].children;

                        var resultadoAoIntervaloAway = resultadosAway.querySelectorAll('tbody')[1].children;
                        var resultadoFinalAway = resultadosAway.querySelectorAll('tbody')[2].children;

                        var homeResultsHome = [];
                        var awayResultsAway = [];


                        for (i = 0; i < resultadoAoIntervaloHome.length; i++) {
                            var resultado = resultadoAoIntervaloHome[i].children[0].innerText;
                            var percent = resultadoAoIntervaloHome[i].children[1].innerText;

                            homeResultsHome[i] = {
                                Result: resultadoAoIntervaloHome[i].children[0].innerText,
                                Percent: resultadoAoIntervaloHome[i].children[1].innerText

                            };

                        }

                        for (i = 0; i < resultadoFinalHome.length; i++) {
                            var resultado = resultadoFinalHome[i].children[0].innerText;
                            var percent = resultadoFinalHome[i].children[1].innerText;

                            homeResultsHome[i] = {
                                Result: resultadoFinalHome[i].children[0].innerText,
                                Percent: resultadoFinalHome[i].children[1].innerText

                            };

                        }
                        for (i = 0; i < resultadoAoIntervaloAway.length; i++) {
                            var resultado = resultadoAoIntervaloAway[i].children[0].innerText;
                            var percent = resultadoAoIntervaloAway[i].children[1].innerText;

                            awayResultsAway[i] = {
                                Result: resultadoAoIntervaloAway[i].children[0].innerText,
                                Percent: resultadoAoIntervaloAway[i].children[1].innerText

                            };


                        }


                        for (i = 0; i < resultadoFinalAway.length; i++) {
                            var resultado = resultadoFinalAway[i].children[0].innerText;
                            var percent = resultadoFinalAway[i].children[1].innerText;

                            awayResultsAway[i] = {
                                Result: resultadoFinalAway[i].children[0].innerText,
                                Percent: resultadoFinalAway[i].children[1].innerText

                            };

                        }

                        return {
                            Competition: competition,
                            HomeTeam: homeTeam.trim(),
                            AwayTeam: awayTeam.trim(),
                            HomeScores: homeScores,
                            AwayScores: awayScores,
                            GamesBetweenTeams: gamesBetweenTeams,
                            GeneralTable: generalTable,
                            HomeTable: homeTable,
                            AwayTable: awayTable,
                            HomeRoad: homeRoad,
                            AwayRoad: awayRoad,
                            GoalsHome: goalsHome,
                            GoalsAway: goalsAway,
                            HomePeriodGoals: homePeriodGoals,
                            AwayPeriodGoals: awayPeriodGoals,
                            HomeResultsHome: homeResultsHome,
                            AwayResultsAway: awayResultsAway,
                            CompetitionPath: courseOnCompetition
                        };
                    } catch (err) { return steps; }
                }, gameInfo)
                .then(function (result) {
                    // var scrapperFunction = scraper.scrapGame;
                    // result = scrapperFunction(gameInfo, '');

                    var resul = JSON.stringify(result);

                    console.log("Number of links: " + resul);
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(resul);
                    horseman.close();
                });

        });
});


app.post('/add', bodyParser.json(), function (req, res) {


    horseman
        .open('https://www.onlinebettingacademy.com/stats/match/portugal-stats/primeira-liga/sporting-cp/vitoria-setubal/2284833/1/prelive')
        .evaluate(function () {
            var homeTeam = $('td.stats-game-head-teamname')[0].querySelectorAll('a')[1].innerText.trim();
            var awayTeam = $('td.stats-game-head-teamname')[1].querySelectorAll('a')[1].innerText.trim();
            var gamesBetweenTeams = [];
            var matches = $('table.stat-cd3 > tbody > tr');

            for (i = 0; i < matches.length - 1; i++) {
                match = matches[i].querySelectorAll('td');
                if (match[0].innerText == 'No results')
                    break;

                gamesBetweenTeams[i] = {
                    'Season': match[1].querySelector('a').innerText,
                    'Competicion': match[1].getAttribute("title"),
                    'Date': match[0].innerText,
                    'HomeTeam': match[2].querySelector('a').innerText,
                    'AwayTeam': match[4].innerText,
                    'Result': match[3].innerText,
                    'SameHomeTeam': match[2].querySelector('a').innerText.trim().toLowerCase() == homeTeam.toLowerCase(),
                    'HomeScore': match[3].innerText.split('-')[0],
                    'AwayScore': match[3].innerText.split('-')[1]
                };
            }

            var classificationstable = $('.competition-rounds');

            var total = classificationstable[0].querySelectorAll('tbody')[0].children;
            var casa = classificationstable[1].querySelectorAll('tbody')[0].children;
            var fora = classificationstable[2].querySelectorAll('tbody')[0].children;

            var generalTable = [];

            for (i = 0; i < total.length; i++) {
                var gameData = total[i].children;
                var order = gameData[0].innerText.trim();
                var team = gameData[1].innerText.trim();
                var P = gameData[2].innerText.trim();
                var J = gameData[3].innerText.trim();
                var V = gameData[4].innerText.trim();
                var E = gameData[5].innerText.trim();
                var D = gameData[6].innerText.trim();
                var goals = gameData[7].innerText.trim();


                generalTable[i] = {
                    Order: order,
                    Team: team,
                    Points: P,
                    Games: J,
                    Vitories: V,
                    Draws: E,
                    Defeats: D,
                    Goals: goals,
                    IsHomeTeam: team.toLowerCase() == homeTeam.toLowerCase(),
                    IsAwayTeam: team.toLowerCase() == awayTeam.toLowerCase()
                };


            }

            var homeTable = [];
            for (i = 0; i < total.length; i++) {
                var gameData = casa[i].children;

                var order = gameData[0].innerText;
                var team = gameData[1].innerText;
                var P = gameData[2].innerText;
                var J = gameData[3].innerText;
                var V = gameData[4].innerText;
                var E = gameData[5].innerText;
                var D = gameData[6].innerText;
                var goals = gameData[7].innerText;

                homeTable[i] = {
                    Order: order,
                    Team: team,
                    Points: P,
                    Games: J,
                    Vitories: V,
                    Draws: E,
                    Defeats: D,
                    Goals: goals,
                    IsHomeTeam: team.toLowerCase() == homeTeam.toLowerCase(),
                    IsAwayTeam: team.toLowerCase() == awayTeam.toLowerCase()
                };



            }


            var awayTable = [];
            for (i = 0; i < total.length; i++) {
                var gameData = fora[i].children;

                var order = gameData[0].innerText;
                var team = gameData[1].innerText;
                var P = gameData[2].innerText;
                var J = gameData[3].innerText;
                var V = gameData[4].innerText;
                var E = gameData[5].innerText;
                var D = gameData[6].innerText;
                var goals = gameData[7].innerText;

                awayTable[i] = {
                    Order: order,
                    Team: team,
                    Points: P,
                    Games: J,
                    Vitories: V,
                    Draws: E,
                    Defeats: D,
                    Goals: goals,
                    IsHomeTeam: team.toLowerCase() == homeTeam.toLowerCase(),
                    IsAwayTeam: team.toLowerCase() == awayTeam.toLowerCase()
                };


            }

            var homeRoad = [];
            var awayRoad = [];

            // Percurso
            var precursoTr = $('span.stats-title.course')[0].parentElement.parentElement.parentElement.children[1];
            var precursoHome = precursoTr.children[0].querySelectorAll('tbody > tr');
            var precursoAway = precursoTr.children[1].querySelectorAll('tbody > tr');


            for (i = 0; i < precursoHome.length; i++) {
                var desc = precursoHome[i].children[0].innerText;
                var casa = precursoHome[i].children[1].innerText;
                var fora = precursoHome[i].children[2].innerText;
                var global = precursoHome[i].children[3].innerText;


                homeRoad[i] = {
                    Desc: precursoHome[i].children[0].innerText,
                    Home: precursoHome[i].children[1].innerText,
                    Away: precursoHome[i].children[2].innerText,
                    Global: precursoHome[i].children[3].innerText

                };

            }

            for (i = 0; i < precursoAway.length; i++) {
                var desc = precursoAway[i].children[0].innerText;
                var casa = precursoAway[i].children[1].innerText;
                var fora = precursoAway[i].children[2].innerText;
                var global = precursoAway[i].children[3].innerText;


                awayRoad[i] = {
                    Desc: precursoAway[i].children[0].innerText,
                    Home: precursoAway[i].children[1].innerText,
                    Away: precursoAway[i].children[2].innerText,
                    Global: precursoAway[i].children[3].innerText

                };

            }
            var goalsHome = [];
            var goalsAway = [];

            // Golos
            var golosTr = $('span.stats-title.course')[1].parentElement.parentElement.parentElement.parentElement.children[1].children[0];
            var golosSecondTr = $('span.stats-title.course')[1].parentElement.parentElement.parentElement.parentElement.children[1].children[1];

            var golosHome = golosTr.children[0].querySelectorAll('tbody > tr');
            var golosAway = golosTr.children[1].querySelectorAll('tbody > tr');

            var momentosGolosHome = golosSecondTr.children[0].querySelectorAll('tbody > tr');
            var momentosGolosAway = golosSecondTr.children[1].querySelectorAll('tbody > tr');


            for (i = 0; i < golosHome.length; i++) {

                if (golosHome[i].children.length == 3) {
                    var desc = golosHome[i].children[0].innerText;
                    var casa = golosHome[i].children[1].innerText;
                    var fora = golosHome[i].children[2].innerText;

                    goalsHome[i] = {
                        Desc: golosHome[i].children[0].innerText,
                        Home: golosHome[i].children[1].innerText,
                        Away: golosHome[i].children[2].innerText

                    };

                }
                else {
                    var desc = golosHome[i].children[0].innerText;

                    var casa = golosHome[i].children[1].innerText;

                    var fora = golosHome[i].children[2].innerText;

                    var global = golosHome[i].children[3].innerText;

                    goalsHome[i] = {
                        Desc: golosHome[i].children[0].innerText,
                        Home: golosHome[i].children[1].innerText,
                        Away: golosHome[i].children[2].innerText,
                        Global: golosHome[i].children[3].innerText

                    };

                }
            }

            var homePeriodGoals = [];

            for (i = 0; i < momentosGolosHome.length; i++) {

                if (i == momentosGolosHome.length - 1)
                    continue;

                var odd = (i % 2) != 0;
                var periodo = '';

                if (!odd) {
                    if (i < 2) {
                        periodo = '0-15';
                    } else if (i < 4) {
                        periodo = '16-30';
                    } else if (i < 6) {
                        periodo = '31-45';
                    } else if (i < 8) {
                        periodo = '46-60';
                    } else if (i < 10) {
                        periodo = '61-75';
                    } else {
                        periodo = '76-90';
                    }
                }

                var desc = (odd) ? momentosGolosHome[i].children[0].innerText : momentosGolosHome[i].children[1].innerText;
                var numGolos = (odd) ? momentosGolosHome[i].children[1].innerText : momentosGolosHome[i].children[2].innerText;



                homePeriodGoals[i] = {
                    Period: periodo,
                    Desc: desc,
                    Goals: numGolos

                };


            }


            for (i = 0; i < golosAway.length; i++) {

                if (golosAway[i].children.length == 3) {
                    var desc = golosAway[i].children[0].innerText;
                    var casa = golosAway[i].children[1].innerText;
                    var fora = golosAway[i].children[2].innerText;

                    goalsAway[i] = {
                        Desc: golosAway[i].children[0].innerText,
                        Home: golosAway[i].children[1].innerText,
                        Away: golosAway[i].children[2].innerText

                    };


                }
                else {

                    var desc = golosAway[i].children[0].innerText;
                    var casa = golosAway[i].children[1].innerText;
                    var fora = golosAway[i].children[2].innerText;
                    var global = golosAway[i].children[3].innerText;

                    goalsAway[i] = {
                        Desc: golosAway[i].children[0].innerText,
                        Home: golosAway[i].children[1].innerText,
                        Away: golosAway[i].children[2].innerText,
                        Global: golosAway[i].children[3].innerText

                    };
                }
            }

            var awayPeriodGoals = [];
            for (i = 0; i < momentosGolosAway.length; i++) {

                if (i == momentosGolosAway.length - 1)
                    continue;

                var odd = (i % 2) != 0;
                var periodo = '';

                if (!odd) {
                    if (i < 2) {
                        periodo = '0-15';
                    } else if (i < 4) {
                        periodo = '16-30';
                    } else if (i < 6) {
                        periodo = '31-45';
                    } else if (i < 8) {
                        periodo = '46-60';
                    } else if (i < 10) {
                        periodo = '61-75';
                    } else {
                        periodo = '76-90';
                    }
                }

                var desc = (odd) ? momentosGolosAway[i].children[0].innerText : momentosGolosAway[i].children[1].innerText;
                var numGolos = (odd) ? momentosGolosAway[i].children[1].innerText : momentosGolosAway[i].children[2].innerText;



                awayPeriodGoals[i] = {
                    Period: periodo,
                    Desc: desc,
                    Goals: numGolos

                };

            }


            var resultadoTr = $('span.stats-title.course')[2].parentElement.parentElement.parentElement.children[1];

            var resultadosHome = resultadoTr.children[0];
            var resultadosAway = resultadoTr.children[1];

            var resultadoAoIntervaloHome = resultadosHome.querySelectorAll('tbody')[1].children;
            var resultadoFinalHome = resultadosHome.querySelectorAll('tbody')[2].children;

            var resultadoAoIntervaloAway = resultadosAway.querySelectorAll('tbody')[1].children;
            var resultadoFinalAway = resultadosAway.querySelectorAll('tbody')[2].children;

            var homeResultsHome = [];
            var awayResultsAway = [];


            for (i = 0; i < resultadoAoIntervaloHome.length; i++) {
                var resultado = resultadoAoIntervaloHome[i].children[0].innerText;
                var percent = resultadoAoIntervaloHome[i].children[1].innerText;

                homeResultsHome[i] = {
                    Result: resultadoAoIntervaloHome[i].children[0].innerText,
                    Percent: resultadoAoIntervaloHome[i].children[1].innerText

                };

            }

            for (i = 0; i < resultadoFinalHome.length; i++) {
                var resultado = resultadoFinalHome[i].children[0].innerText;
                var percent = resultadoFinalHome[i].children[1].innerText;

                homeResultsHome[i] = {
                    Result: resultadoFinalHome[i].children[0].innerText,
                    Percent: resultadoFinalHome[i].children[1].innerText

                };

            }
            for (i = 0; i < resultadoAoIntervaloAway.length; i++) {
                var resultado = resultadoAoIntervaloAway[i].children[0].innerText;
                var percent = resultadoAoIntervaloAway[i].children[1].innerText;

                awayResultsAway[i] = {
                    Result: resultadoAoIntervaloAway[i].children[0].innerText,
                    Percent: resultadoAoIntervaloAway[i].children[1].innerText

                };


            }


            for (i = 0; i < resultadoFinalAway.length; i++) {
                var resultado = resultadoFinalAway[i].children[0].innerText;
                var percent = resultadoFinalAway[i].children[1].innerText;

                awayResultsAway[i] = {
                    Result: resultadoFinalAway[i].children[0].innerText,
                    Percent: resultadoFinalAway[i].children[1].innerText

                };

            }

            return {
                HomeTeam: homeTeam.trim(),
                AwayTeam: awayTeam.trim(),
                GamesBetweenTeams: gamesBetweenTeams,
                GeneralTable: generalTable,
                HomeTable: homeTable,
                AwayTable: awayTable,
                HomeRoad: homeRoad,
                AwayRoad: awayRoad,
                GoalsHome: goalsHome,
                GoalsAway: goalsAway,
                HomePeriodGoals: homePeriodGoals,
                AwayPeriodGoals: awayPeriodGoals,
                HomeResultsHome: homeResultsHome,
                AwayResultsAway: awayResultsAway
            };
        })
        .then(function (result) {
            var resul = JSON.stringify(result);
            console.log("Number of links: " + resul);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(resul);
            horseman.close();
        });
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
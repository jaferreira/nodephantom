var mongoose = require('mongoose');
var uuid = require('node-uuid');
var dateFormat = require('dateformat');

var scapeGamePermaLink = function (permaLink) {
  return permaLink.replace(/\ /g, '--')
                  .replace(/\//g, '-');
};

var generateGameId = function (gameInfo) {
  var delimiter = '_';
  var permaLink = gameInfo.sport + delimiter +
    gameInfo.competition + delimiter +
    dateFormat(gameInfo.date, "yyyymmdd") + delimiter +
    // gameInfo.hour + delimiter +
    gameInfo.homeTeam + delimiter +
    gameInfo.awayTeam + delimiter;
};

var generatePermaLink = function (gameInfo) {
  var routeDelimiter = '/';
  var delimiter = '-';
  var permaLink = gameInfo.sport + routeDelimiter +
    gameInfo.competition + routeDelimiter +

    dateFormat(gameInfo.date, "yyyymmdd") + delimiter +
    gameInfo.homeTeam + delimiter +
    gameInfo.awayTeam + delimiter;

  return scapeGamePermaLink(permaLink);
};

var checkIfExists = function (gameId) {

};

var gameSchema = new mongoose.Schema({
  sport: String,
  competition: String,

  date: Date,
  hour: String,

  homeTeam: String,
  awayTeam: String,
  result: String,

  url: String,
  scrapped: Boolean,

  gameId: String,
  permaLink: String,

  nextGameStats: mongoose.Schema.Types.Mixed,
  gameStats: mongoose.Schema.Types.Mixed

});
var Game = mongoose.model('Game', gameSchema);

gameSchema.pre('save', function (next) {
  var self = this;

  this.gameId = generateGameId(this);
  this.permaLink = generatePermaLink(this);

  // TODO : check if exists in db

  // Game.findOne({ gameId: self.gameId }, function (err, game) {
  //   if (err) {
  //     done(err);
  //   } else if (game) {
  //     console.log('Game already exists: ', this.gameId);
  //     done(new Error("gameId must be unique"));
  //   } else {
  //     done();
  //   }
  // });

  next();
});



module.exports = Game;



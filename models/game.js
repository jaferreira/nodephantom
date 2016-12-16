var mongoose = require('mongoose');
var uuid = require('node-uuid');

var generateGameId = function() {
  return uuid.v4();
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
  
  nextGameStats: mongoose.Schema.Types.Mixed,
  gameStats: mongoose.Schema.Types.Mixed

});

gameSchema.pre('save', function(next) {
  this.gameId = generateGameId();
  next();
});

module.exports = mongoose.model('Game', gameSchema);

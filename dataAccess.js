var MongoClient = require('mongodb').MongoClient, assert = require('assert');
var mongoDbUrl = 'mongodb://localhost:27017/matches';

var dbGetAllGames = function (db, callback) {
    var collection = db.collection('games');

    collection.find().sort({ ScrapDate: -1 }).toArray(function (err, items) {
        if (err) {
            reject(err);
        } else {
            callback(items);
        }
    });
}

var dbGetGame = function (gameId, db, callback) {
    var collection = db.collection('games');

    collection.find({ gameId: gameId }).toArray(function (err, items) {
        if (err) {
            reject(err);
        } else {
            callback(items);
        }
    });
}


var dbInsertGames = function (games, db, callback) {
    var collection = db.collection('games');

    collection.insert(games, function (err, result) {
        assert.equal(null, err);
        callback(result);
    });
}

var dbGetUnscrappedGames = function (numGames, db, callback) {
    var collection = db.collection('games');

    collection.find({ Scrapped: false, Result: { '$ne': 'vs' } }).limit(numGames).toArray(function (err, items) {
        if (err) {
            reject(err);
        } else {
            callback(items);
        }
    });
}

var dbSetGameAsScrapped = function (gameId, db, callback) {
    var collection = db.collection('games');

    collection.update({ gameId: gameId }, { $set: { Scrapped: true, ScrapDate: new Date() } }, function (err, result) {
        assert.equal(null, err);
        callback(result);
    });
}



exports.getAllGames = function (callback) {
    MongoClient.connect(mongoDbUrl, function (err, db) {
        assert.equal(null, err);
        console.log("Connected successfully to server");

        dbGetAllGames(db, function (items) {
            db.close();
            callback(items);
        })
    });
}

exports.saveGames = function (games) {
    MongoClient.connect(mongoDbUrl, function (err, db) {
        assert.equal(null, err);
        console.log("Connected successfully to server");

        dbInsertGames(games, db, function (items) {
            db.close();
        })
    });
}

exports.getGame = function (gameId, callback) {
    MongoClient.connect(mongoDbUrl, function (err, db) {
        assert.equal(null, err);
        console.log("Connected successfully to server");

        dbGetGame(gameId, db, function (item) {
            db.close();
            callback(item);
        })
    });
}

exports.getUnscrappedGames = function (numGames, callback) {
    MongoClient.connect(mongoDbUrl, function (err, db) {
        assert.equal(null, err);
        console.log("Connected successfully to server");

        dbGetUnscrappedGames(numGames, db, function (items) {
            db.close();
            callback(items);
        })
    });
}

exports.setGameAsScrapped = function (gameId, callback) {
    MongoClient.connect(mongoDbUrl, function (err, db) {
        assert.equal(null, err);
        console.log("Connected successfully to server");

        dbSetGameAsScrapped(gameId, db, function () {
            db.close();
            callback();
        })
    });
}
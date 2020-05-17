var mongoose = require('mongoose');
var stateSchema = new mongoose.Schema({
    stateName: String,
    score: Number,
    comparative: Number,
    posTweets: Number,
    negTweets: Number,
    neutralTweets: Number
});

module.exports = mongoose.model("state", stateSchema);
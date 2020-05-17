var mongoose = require('mongoose');
var stateSchema = new mongoose.Schema({
    stateName: String,
    score: Number,
    comparative: Number,
    numGood: Number,
    numBad: Number,
    numNeutral: Number
});

module.exports = mongoose.model("state", stateSchema);
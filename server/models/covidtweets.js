var mongoose = require('mongoose');
var pastcovidtweetSchema = new mongoose.Schema({
    content: String,
    sentiment: Number,
    createdAt: {
        type: Date
    }
});

module.exports = mongoose.model("PastCovidTweet", pastcovidtweetSchema);
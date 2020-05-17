var mongoose = require('mongoose');
var cityNameSchema = new mongoose.Schema({
    city: String,
    num: Number
});

module.exports = mongoose.model("city", cityNameSchema);
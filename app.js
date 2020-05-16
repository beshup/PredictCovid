 var express = require('express'),
     app = express(),
     mongoose = require('mongoose'),
     PORT = 3000;
     PastCovidTweet = require('./server/models/covidtweets')



mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect('mongodb+srv://predictcoviduser:ruhacks@cluster0-ztew1.mongodb.net/test?retryWrites=true&w=majority', () => {
    console.log("connected to database on atlas");
});

app.use('/', express.static('client'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/getRegionData', function(req, res){
    var data;
    res.send(data);
});

// Listen on specified port
app.listen(PORT, function() {
    console.log(`Server running at http://localhost:${PORT}/`);
});
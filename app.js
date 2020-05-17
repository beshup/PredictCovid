var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    PORT = 3000;
    PastCovidTweet = require('./server/models/covidtweets'),
    compression = require('compression'),
    cors = require('cors'),
    {PythonShell} = require('python-shell');

app.use(compression());
app.use(cors());

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect('mongodb+srv://predictcoviduser:ruhacks@cluster0-ztew1.mongodb.net/predictcovid?retryWrites=true&w=majority', () => {
    console.log("connected to database on atlas");
});

app.get('/', express.static('client'));
app.use('/test', express.static('client/test'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/findSentimentInLocation', function(req, res){

    // run python script and then get the results back
    // with the results, post in a database, and then in client side code, make following request showing results of database
    var location = req.body.area;


    res.send("Worked");
    
});

app.post('/newCovidTweets', function(req, res){

});

app.post('/getTweetsInArea', function(req, res){
    var city = req.body.area;
    
    // pass in city to flask made api in main.py, and then get the results back

});

// Listen on specified port
app.listen(PORT, function() {
    console.log(`Server running at http://localhost:${PORT}/`);
});
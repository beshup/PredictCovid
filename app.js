var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    PORT = 3000;
    CityName = require('./server/models/cityname'),
    compression = require('compression'),
    cors = require('cors'),
    {PythonShell} = require('python-shell'),
    Twitter = require('twitter'),
    Sentiment = require('sentiment');

var sentiment = new Sentiment();
var client = new Twitter({
    consumer_key: '7jAQTZMwnBW7EIaj58wQM4oKF',
    consumer_secret: 'EkS01Y1vPKVTycXxeFj5L701BnIXALviiB7rqRVEUY3M9Z0RVT',
    access_token_key: '2802654716-azAukzm36U3XdMENQ3KTdrQOc6wnEPc7WWuZ15o',
    access_token_secret: 'V6QBef9uoKxPqOszRYNUSgvex8v8G0IKg0nAiHyhQRz8B'
});

app.use(compression());
app.use(cors());

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect('mongodb+srv://predictcoviduser:ruhacks@cluster0-ztew1.mongodb.net/predictcovid?retryWrites=true&w=majority', () => {
    console.log("connected to database on atlas");
});

app.get('/', express.static('covidSent/templates'));
app.use('/show', express.static('covidSent/templates/leaflet'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/findSentimentInLocation', function(req, res){

    // run python script and then get the results back
    // with the results, post in a database, and then in client side code, make following request showing results of database
    var location = req.body.area;
    var searchterms = location + " AND covid"

    var sum = 0;
    var comparativeSum = 0;

    client.get('search/tweets', {q: searchterms, count: 100}, function(error, tweets, response) {
        for(var i=0; i<tweets.statuses.length; i++){
            var score = sentiment.analyze(tweets.statuses[i].text).score;
            var comparativeScore = sentiment.analyze(tweets.statuses[i].text).comparative;
            comparativeSum += comparativeScore;
            sum += score;
            //console.log(sum);
        }
        var obj = {score: sum, comparative: comparativeSum};
        res.send(JSON.stringify(obj));
    });
    
    /*
    var cityname = new CityName({
        city: location,
        num: 1
    });

    cityname.save();
    */

    /*
    PythonShell.run('covidSent/main.py', function (err) {
        if (err) throw err;
        console.log('finished');
    });
    */
    
});

app.post('/newCovidTweets', function(req, res){

});

app.post('/getTweetsInArea', function(req, res){
    var city = req.body.area;
    console.log(city);
    // pass in city to flask made api in main.py, and then get the results back

});

// Listen on specified port
app.listen(PORT, function() {
    console.log(`Server running at http://localhost:${PORT}/`);
});
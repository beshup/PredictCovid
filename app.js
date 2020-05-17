var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    PORT = 'https://predictcovid.herokuapp.com/';
    State = require('./server/models/statename'),
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
    
    var searchterms = location + " AND ";

    var sum = 0;
    var comparativeSum = 0;
    
    var sum2 = 0;
    var comparativeSum2 = 0;
    
    var numPosTweets = 0;
    var numNegTweets = 0;
    var numNeutralTweets = 0;
    
    var numPosTweets2 = 0;
    var numNegTweets2 = 0;
    var numNeutralTweets2 = 0;
    

    client.get('search/tweets', {q: searchterms + "covid", count: 100}, function(error, tweets, response) {
        for(var i=0; i<tweets.statuses.length; i++){
            var score = sentiment.analyze(tweets.statuses[i].text).score;
            var comparativeScore = sentiment.analyze(tweets.statuses[i].text).comparative;
            comparativeSum += comparativeScore;
            sum += score;
           // console.log(score)
            //console.log(sum)
            if(score < 0) {
                numNegTweets++;
            }
            else if(score == 0) {
                numNeutralTweets++;
            }
            else {
                numPosTweets++;
            }
            //console.log(sum);
        }
        
        
        client.get('search/tweets', {q: searchterms + "#socialdistancing", count: 100}, function(error, tweets, response) {
        for(var i=0; i<tweets.statuses.length; i++){
            var score = sentiment.analyze(tweets.statuses[i].text).score;
            var comparativeScore = sentiment.analyze(tweets.statuses[i].text).comparative;
            comparativeSum2 += comparativeScore;
            sum2 += score;
            //console.log(score)
            //console.log(sum)
            if(score < 0) {
                numNegTweets2++;
            }
            else if(score == 0) {
                numNeutralTweets2++;
            }
            else {
                numPosTweets2++;
            }
            //console.log(sum);
        }
        var obj = {score: sum+sum2, comparative: comparativeSum+comparativeSum2, numGood: numPosTweets2+numPosTweets, numBad: numNegTweets2+numNegTweets, numNeutral: numNeutralTweets2+numNeutralTweets2};
        res.send(JSON.stringify(obj));
    });
        
        var obj = {score: sum, comparative: comparativeSum, numGood: numPosTweets, numBad: numNegTweets, numNeutral: numNeutralTweets};
        //res.send(JSON.stringify(obj));
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

app.post('/findSentimentInState', function(req, res){

    // run python script and then get the results back
    // with the results, post in a database, and then in client side code, make following request showing results of database
    var location = req.body.area;
    
    var searchterms = location + " AND covid";

    var sum = 0;
    var comparativeSum = 0;
    
    var numPosTweets = 0;
    var numNegTweets = 0;
    var numNeutralTweets = 0;
    

    client.get('search/tweets', {q: searchterms, count: 100}, function(error, tweets, response) {
        for(var i=0; i<tweets.statuses.length; i++){
            var score = sentiment.analyze(tweets.statuses[i].text).score;
            var comparativeScore = sentiment.analyze(tweets.statuses[i].text).comparative;
            comparativeSum += comparativeScore;
            sum += score;
           // console.log(score)
            //console.log(sum)
            if(score < 0) {
                numNegTweets++;
            }
            else if(score == 0) {
                numNeutralTweets++;
            }
            else {
                numPosTweets++;
            }
            //console.log(sum);
        }
        var storage = new State({stateName: location, score: sum, comparative: comparativeSum, numGood: numPosTweets, numBad: numNegTweets, numNeutral: numNeutralTweets});
        storage.save();
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

app.get('/getStateData', function(req, res){
    var arrStates = [];
    State.find({} , (error, arr) => {
        if(error){

        } //do something...

        arr.forEach(function(eachState){
            var obj = {score: eachState.score, stateName: eachState.stateName, comparative: eachState.comparative, numGood: eachState.numGood, numBad: eachState.numBad, numNeutral: eachState.numNeutral};
            arrStates.push(obj);
        });

        res.send(JSON.stringify(arrStates));
    });
});

// Listen on specified port
app.listen(PORT, function() {
    console.log(`Server running at http://localhost:${PORT}/`);
});
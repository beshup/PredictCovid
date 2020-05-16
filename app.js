var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    PORT = 3000;
    PastCovidTweet = require('./server/models/covidtweets'),
    compression = require('compression'),
    cors = require('cors');

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

app.post('/storePastCovidTweets', function(req, res){

    // run python script and then get the results back
    // with the results, post in a database, and then in client side code, make following request showing results of database


    var arr = 
    [ 
        {content: "tweet text 1", sentiment: 7, createdAt: new Date()}, 
        {content: "tweet text 2", sentiment: 9, createdAt: new Date()},
        {content: "tweet text 3", sentiment: 3, createdAt: new Date()},
        {content: "tweet text 4", sentiment: 2, createdAt: new Date()},
        {content: "tweet text 5", sentiment: 18, createdAt: new Date()},
        {content: "tweet text 6", sentiment: 11, createdAt: new Date()}
    ];

    PastCovidTweet.insertMany(arr, (error, docs) => {
        if(error){
            console.log("Couldn't post past covid tweets to db");
        }
    });

    res.send("Worked");
    
});

app.post('/newCovidTweets', function(req, res){

});

app.post('/getTweetsInArea', function(req, res){
    var location = JSON.parse(req.body);
});

// Listen on specified port
app.listen(PORT, function() {
    console.log(`Server running at http://localhost:${PORT}/`);
});
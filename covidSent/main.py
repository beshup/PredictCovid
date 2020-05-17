import tweepy

from flask import Flask

from textblob import TextBlob

app = Flask(__name__)

@app.route('/getSentimentOffCity', methods = ['POST'])
def hello_world():
    return 'Hello, World!'

if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0', port=5000)


consumer_key = '7jAQTZMwnBW7EIaj58wQM4oKF'
consumer_secret = 'EkS01Y1vPKVTycXxeFj5L701BnIXALviiB7rqRVEUY3M9Z0RVT'
access_token = '2802654716-azAukzm36U3XdMENQ3KTdrQOc6wnEPc7WWuZ15o'
access_token_secret = 'V6QBef9uoKxPqOszRYNUSgvex8v8G0IKg0nAiHyhQRz8B'
auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)
api = tweepy.API(auth)
public_tweets = api.search('COVID')
myTweets = tweepy.Cursor(api.search, q='COVID', geocode="43.6532,79.3832,100km").items(10)

example = tweepy.Cursor(api.search, q='COVID')


beginningDate = '2020-02-01'
endDate = '2020-05-15'
maxTweetsTotal = 10

positiveTweets = 0
negativeTweets = 0
neutralTweets = 0


countAllTweets = 0

def get_tweets(cityName, leadTerm):
    global countAllTweets
    global neutralTweets
    global negativeTweets
    global positiveTweets
    mySearchTerm = leadTerm + " AND " + cityName
    count = 0
    polarityCount = 0
    subjectiveCount = 0
    for tweet in tweepy.Cursor(api.search,
                                q=mySearchTerm,
                                since=beginningDate, until=endDate,
                                count=10,
                                include_entities=True,
                                monitor_rate_limit=True,
                                wait_on_rate_limit=True,
                                lang="en").items(maxTweetsTotal):
        print(tweet.text)
        countAllTweets += 1
        print(countAllTweets)
        sent = TextBlob(tweet.text)
        if sent.sentiment.polarity == 0:
            #neutral tweet
            neutralTweets += 1
        elif sent.sentiment.polarity > 0:
            #positive tweet
            positiveTweets += 1
            count += 1
            polarityCount += sent.sentiment.polarity
            subjectiveCount += sent.sentiment.subjectivity
        else:
            #negative tweet
            negativeTweets += 1
            count += 1
            polarityCount += sent.sentiment.polarity
            subjectiveCount += sent.sentiment.subjectivity
        print(sent.sentiment)
    if count > 0:
        averagePolarity = polarityCount/count
        averageSubjectivity = subjectiveCount/count
    else:
        averagePolarity = 0
        averageSubjectivity = 0
    overallSentiment = [averagePolarity, averageSubjectivity]
    return overallSentiment


prefix = ["covid-19","covid","pandemic","coronavirus","quarantine","#selfisolation", "#socialdistancing"]

overallSubjectivity = 0
overallPolarity = 0

for i in prefix:
    #REPLACE "TORONTO" WITH THE STRING FROM THEIR SEARCH
    myList = get_tweets("Toronto", i)
    overallPolarity += myList[0]
    overallSubjectivity += myList[1]

overallPolarity = overallPolarity / len(prefix)
overallSubjectivity = overallSubjectivity / len(prefix)

print("Overall positive/negative score with -1 being bad and 1 being good: " + str(overallPolarity))
print("Overall subjectivity with a score of 1 being highly speculative and 0 factual: " + str(overallSubjectivity))
print("Num neutral tweets: " + str(neutralTweets))
print("num positive tweets: " + str(positiveTweets))
print("num negative tweets: " + str(negativeTweets))


#lat = "40.7128"
#long = "74.0060"
#rad = "75km"
#location = lat + "," + long + "," + rad
#searchTerms = "covid OR lockdown OR coronavirus OR quarantine OR covid-19"

#for status in tweepy.Cursor(api.search,
 #                      q=searchTerms,
  #                     since=beginningDate, until=endDate, geocode=location,
   #                    count=10,
    #                   include_entities=True,
     #                  monitor_rate_limit=True,
      #                 wait_on_rate_limit=True,
       #                lang="en").items(200):
    #print(status.text)
#   analysis = TextBlob(status.text)
    #print(analysis.sentiment)


#cityName = "Vancouver"
#mySearchTerm = "covid AND " + cityName

#for status in tweepy.Cursor(api.search,
#                       q=mySearchTerm,
 #                      since=beginningDate, until=endDate,
  #                     count=10,
   #                    include_entities=True,
    #                   monitor_rate_limit=True,
     #                  wait_on_rate_limit=True,
      #                 lang="en").items(maxTweetsTotal):
 #   print(status.text)
 #   analysis = TextBlob(status.text)
  #  print(analysis.sentiment)


#for tweet in tweepy.Cursor(api.search, q='COVID',lang='en').items(5):
#    print(tweet.text)

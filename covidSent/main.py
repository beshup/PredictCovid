import tweepy

from textblob import TextBlob

print("Hello Word")

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


#for tweet in tweepy.Cursor(api.search, q='COVID',lang='en').items(5):
#    print(tweet.text)

searchTerms = "covid OR lockdown OR coronavirus OR quarantine OR covid-19"
beginningDate = '2020-02-01'
endDate = '2020-05-15'
lat = "40.7128"
long = "74.0060"
rad = "75km"
maxTweetsTotal = 30


location = lat + "," + long + "," + rad


for status in tweepy.Cursor(api.search,
                       q=searchTerms,
                       since=beginningDate, until=endDate, geocode=location,
                       count=10,
                       include_entities=True,
                       monitor_rate_limit=True,
                       wait_on_rate_limit=True,
                       lang="en").items(maxTweetsTotal):
    print(status.text)
    analysis = TextBlob(status.text)
    print(analysis.sentiment)




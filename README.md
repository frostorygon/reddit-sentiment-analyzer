# Reddit Sentiment Analyzer

🤖 **AI-powered Reddit scraper with sentiment analysis** - Extract posts and comments from Reddit with automatic sentiment scoring, topic extraction, and entity recognition using Google Gemini AI.

[![Apify Actor](https://img.shields.io/badge/Apify-Actor-blue)](https://apify.com/quakerish_joyride/reddit-sentiment-analyzer)
[![License: ISC](https://img.shields.io/badge/License-ISC-green.svg)](https://opensource.org/licenses/ISC)

## 🚀 Features

- **Scrape Reddit** - Extract posts and comments from any subreddit or post URL
- **AI Sentiment Analysis** - Analyze sentiment using Google Gemini 2.5 Flash
- **Topic Extraction** - Automatically identify discussion topics
- **Entity Recognition** - Detect mentioned brands, people, and products
- **Controversy Scoring** - Score how likely comments are to spark debate
- **Proxy Support** - Built-in residential proxy to bypass Reddit blocking

## 📦 Try it on Apify

**[▶️ Run on Apify Store](https://apify.com/quakerish_joyride/reddit-sentiment-analyzer)**

First 5 results are FREE, then pay-per-result pricing.

## 💡 Use Cases

- **Brand Monitoring** - Track what people say about your brand on Reddit
- **Market Research** - Understand community sentiment on topics
- **Competitor Analysis** - Monitor competitor mentions and sentiment
- **Trend Detection** - Identify emerging topics and shifts in opinion
- **Content Ideas** - Find what resonates with Reddit communities

## 🛠️ Input

| Field | Type | Description |
|-------|------|-------------|
| `startUrls` | array | Reddit post or subreddit URLs |
| `maxPosts` | number | Max posts per subreddit (1-100) |
| `maxComments` | number | Max comments per post (0 = all) |
| `enableSentiment` | boolean | Enable AI sentiment analysis |
| `googleApiKey` | string | Your Gemini API key (required for AI) |
| `useProxy` | boolean | Use residential proxy (recommended) |

## 📊 Output Example

```json
{
  "postId": "abc123",
  "title": "What's your unpopular opinion?",
  "subreddit": "AskReddit",
  "score": 1547,
  "numComments": 892,
  "insights": {
    "dominant_sentiment": "mixed",
    "average_sentiment_score": 0.12,
    "sentiment_distribution": {
      "positive": 35,
      "negative": 28,
      "neutral": 25,
      "mixed": 12
    }
  },
  "comments": [
    {
      "author": "user123",
      "body": "I actually enjoy Mondays...",
      "score": 234,
      "sentiment": "positive",
      "sentiment_score": 0.7,
      "topics": ["work", "lifestyle"],
      "controversy_score": 0.8
    }
  ]
}
```

## 🔑 Getting a Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Create a new API key
3. Paste it in the `googleApiKey` input field

> 💡 **Tip:** Google AI Ultra subscribers get free Gemini API credits!

## 💰 Pricing

| Tier | Price |
|------|-------|
| First 5 results | **FREE** |
| Additional results | $0.002/result |

Proxy costs are included in the per-result pricing.

## 🏗️ Tech Stack

- **Runtime:** Node.js on Apify
- **AI:** Google Gemini 2.5 Flash
- **Proxy:** Apify Residential Proxies
- **HTTP:** Axios with https-proxy-agent

## 📄 License

ISC License - feel free to use and modify.

---

**Built by [@frostorygon](https://github.com/frostorygon)** | [Portfolio](https://frostorygon.github.io/)

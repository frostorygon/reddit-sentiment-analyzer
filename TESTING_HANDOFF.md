# Reddit Sentiment Analyzer - Testing Handoff

## For: Testing Agent
## From: Implementation Agent
## Date: 2026-02-01

---

## Actor Details

- **Name:** Reddit Sentiment Analyzer
- **Console:** https://console.apify.com/actors/MkfiN4VJaL4AtUQ6i
- **API Key:** Set as secret environment variable `GOOGLE_API_KEY`

---

## Testing Instructions

### Test 1: Basic Scrape (No AI)
```json
{
  "startUrls": ["https://www.reddit.com/r/AskReddit/hot"],
  "maxPosts": 1,
  "maxComments": 10,
  "enableSentiment": false
}
```
**Expected:** Returns post with 10 comments, no AI fields.

### Test 2: AI Sentiment Analysis
```json
{
  "startUrls": ["https://www.reddit.com/r/technology/hot"],
  "maxPosts": 1,
  "maxComments": 5,
  "enableSentiment": true
}
```
**Expected:** Returns post with AI-analyzed comments including:
- `sentiment`: positive/negative/neutral/mixed
- `sentiment_score`: -1.0 to 1.0
- `topics`: array of keywords
- `entities`: array of brands/people/products
- `controversy_score`: 0.0 to 1.0
- `insights`: aggregated post-level metrics

### Test 3: Error Handling
```json
{
  "startUrls": ["https://www.reddit.com/r/nonexistentsubreddit123456/hot"],
  "maxPosts": 1,
  "enableSentiment": true
}
```
**Expected:** Graceful error handling, no crash.

---

## Verification Checklist

- [ ] Actor runs without errors
- [ ] Comments are extracted correctly
- [ ] AI analysis returns valid JSON
- [ ] Sentiments are accurate
- [ ] Topics and entities are relevant
- [ ] Insights object is generated
- [ ] Error handling works

---

## Output File Request

Please create a file at:
`c:\Users\sky\Desktop\workspace\Dev\money-baby\TEST_RESULTS.md`

Include:
1. Test results for each scenario
2. Screenshots of output (if applicable)
3. Any bugs or issues found
4. Performance notes (run time, token usage)

---

## Technical Notes

- **Model:** Gemini 2.5 Flash
- **Batch size:** 20 comments per API call
- **Cost:** $0 (uses Google Ultra credits)

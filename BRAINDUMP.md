# Reddit Sentiment Analyzer - Brain Dump

> Complete knowledge capture from project inception to AI-enhanced v2
> Updated: 2026-02-01

---

## Project Overview

**Goal:** Build and monetize an AI-enhanced Reddit Sentiment Analyzer on Apify Store
**Status:** ✅ v2 DEPLOYED (AI-Enhanced)
**Console:** https://console.apify.com/actors/MkfiN4VJaL4AtUQ6i
**Cost:** $0 (uses Google Ultra $100/mo credits)

---

## Technical Stack (Validated)

| Component | Choice | Rationale |
|-----------|--------|-----------|
| Runtime | Node.js | Apify native, fastest cold start |
| HTTP Client | Axios | Lightweight, no browser overhead |
| Framework | Apify SDK only | Crawlee unnecessary for JSON APIs |
| Output | JSON dataset | Standard Apify format |

### Why NOT Crawlee?
- Reddit exposes `.json` endpoints for all pages
- No JavaScript rendering needed
- Axios + SDK is 10x lighter

---

## Reddit API Insights

### JSON Endpoints
```
Post:      https://reddit.com/r/{sub}/comments/{id}.json
Subreddit: https://reddit.com/r/{sub}.json?limit=25
```

### Response Structure
- Posts: `response[0].data.children[0].data`
- Comments: `response[1].data.children`
- Nested replies: `comment.data.replies.data.children`

### Headers Required
```javascript
{
  'User-Agent': 'Mozilla/5.0 (compatible; ApifyBot/1.0)',
  'Accept': 'application/json'
}
```

### Rate Limits
- ~60 requests/minute without auth
- Respect `Retry-After` headers

---

## Project Files

```
money-baby/
├── .actor/
│   ├── actor.json       # Apify config (version MUST be MAJOR.MINOR)
│   └── INPUT_SCHEMA.json # User inputs
├── src/
│   └── main.js          # Core scraping logic
├── Dockerfile           # Node 20 slim
├── package.json
├── README.md
├── icon.png             # Reddit-themed icon
└── .gitignore           # Protects secrets
```

---

## Key Bugs Fixed

### 1. Subreddit Parsing Error
**Error:** `Cannot read properties of undefined (reading 'children')`
**Cause:** Subreddit listings return `{data: {children: []}}`, not array
**Fix:** Updated `processSubreddit` to handle object response

### 2. Version Format Error
**Error:** Apify rejected `0.1.0` version
**Cause:** Apify requires `MAJOR.MINOR` only
**Fix:** Changed to `0.1`

---

## Monetization Strategy

### Phase 1: Launch FREE
- Build user base
- Gather 5+ reviews
- Establish credibility

### Phase 2: Pay-Per-Result (after reviews)
- Rate: $2 per 1,000 results ($0.002/comment)
- Competitive range: $1-4/1K (market research)

### Why FREE First?
- New Actor, no track record
- Reviews build trust
- Easier discovery in Store

---

## Marketing Plan

### Organic Channels
1. Reddit: r/datascience, r/webscraping, r/learnpython
2. Twitter: #buildinpublic, @ApifyTech mentions
3. Dev.to: Tutorial article

### SEO Optimized
- Title: "Reddit Comments Scraper" (keyword frontloaded)
- Description includes: JSON, author, score, nested replies, no API key

---

## Security Measures

| Item | Location | Status |
|------|----------|--------|
| API Token | `~/.credentials/apify.env` | ✅ External |
| CLI Auth | `~/.apify/auth.json` | ✅ Apify managed |
| .gitignore | Project root | ✅ Created |

**No secrets in codebase** - verified via grep

---

## Critic Loop Summary

| Critic Persona | Decision | Validation |
|----------------|----------|------------|
| UX Expert | Icon path clear | ✅ Accessible |
| Growth Hacker | SEO optimized | ✅ Keywords frontloaded |
| Security Auditor | Credentials external | ✅ No secrets in code |
| Market Analyst | FREE → PPR strategy | ✅ Competitive pricing |

---

## Competitor Analysis

| Actor | Price | Differentiator |
|-------|-------|----------------|
| RedditScraper Pro | $3/1K | Historical data |
| Reddit Crawler | $1.5/1K | User profiles |
| **Ours** | FREE → $2/1K | Nested replies, simple |

---

## Lessons Learned

1. **Reddit JSON is gold** - No need for browser automation
2. **Apify version format is strict** - MAJOR.MINOR only
3. **Browser file uploads can't be automated** - OS dialog blocks
4. **browser_subagent > MCP tools** - Has authenticated session access
5. **Critic loop catches blind spots** - Security .gitignore was missing

---

## Future Enhancements

- [ ] User profile scraping
- [ ] Subreddit analytics (top posts, activity patterns)
- [ ] Sentiment analysis integration
- [ ] Historical data (Pushshift alternative)
- [ ] Proxy rotation for scale

---

## Commands Reference

```bash
# Local test
npm start

# Deploy to Apify
npx apify-cli login -t YOUR_TOKEN
npx apify-cli push

# Check Actor
https://console.apify.com/actors
```

---

## Contact / Actor Info

- **Actor ID:** `quakerish_joyride/reddit-comments-scraper`
- **Apify Console:** https://console.apify.com/actors/aDbJkXhZzndaVhfpD
- **Public Store:** https://apify.com/quakerish_joyride/reddit-comments-scraper

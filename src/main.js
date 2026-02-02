// Reddit Sentiment Analyzer - AI-Enhanced Comment Scraper with Proxy Support
const { Actor } = require('apify');
const axios = require('axios');
const { HttpsProxyAgent } = require('https-proxy-agent');
const { analyzeComments, generatePostInsights } = require('./sentiment');

const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
};

// Global proxy agent (set during Actor init)
let proxyAgent = null;

// Extract comments recursively (flattened for analysis)
function extractComments(children, includeReplies = true, maxComments = 0, flat = []) {
    for (const item of children || []) {
        if (item.kind === 't1') {
            const c = item.data;
            const comment = {
                id: c.id,
                author: c.author,
                body: c.body,
                score: c.score,
                created: new Date(c.created_utc * 1000).toISOString(),
                permalink: `https://reddit.com${c.permalink}`,
                depth: c.depth || 0,
            };

            flat.push(comment);

            if (maxComments > 0 && flat.length >= maxComments) break;

            if (includeReplies && c.replies?.data?.children) {
                extractComments(c.replies.data.children, true, maxComments, flat);
            }
        }
    }
    return flat;
}

// Fetch and parse a Reddit URL with optional proxy
async function fetchRedditJson(url) {
    const jsonUrl = url.endsWith('.json') ? url : `${url.replace(/\/$/, '')}.json`;

    const config = {
        headers: HEADERS,
        timeout: 30000,
    };

    // Add proxy agent if available
    if (proxyAgent) {
        config.httpsAgent = proxyAgent;
    }

    const response = await axios.get(jsonUrl, config);
    return response.data;
}

// Process a single post URL
async function processPost(url, options) {
    console.log(`Processing post: ${url}`);

    const data = await fetchRedditJson(url);
    const [postData, commentsData] = data;
    const post = postData.data.children[0].data;

    // Extract comments (flattened for AI analysis)
    let comments = extractComments(
        commentsData.data.children,
        options.includeReplies,
        options.maxComments
    );

    console.log(`Extracted ${comments.length} comments`);

    // Apply AI sentiment analysis if enabled
    let insights = null;
    if (options.enableSentiment && comments.length > 0) {
        console.log(`Analyzing sentiment for ${comments.length} comments...`);
        comments = await analyzeComments(comments, {
            includeTopics: options.includeTopics,
            includeEntities: options.includeEntities,
            includeControversy: options.includeControversy,
            batchSize: options.batchSize || 20,
            apiKey: options.googleApiKey,
        });

        // Generate post-level insights
        insights = await generatePostInsights(post, comments);
        console.log(`Sentiment analysis complete. Avg score: ${insights.average_sentiment_score.toFixed(2)}`);
    }

    return {
        postId: post.id,
        title: post.title,
        author: post.author,
        subreddit: post.subreddit,
        score: post.score,
        numComments: post.num_comments,
        url: post.url,
        permalink: `https://reddit.com${post.permalink}`,
        created: new Date(post.created_utc * 1000).toISOString(),
        // AI insights (if enabled)
        ...(insights && { insights }),
        comments,
    };
}

// Process a subreddit URL (listing)
async function processSubreddit(url, options) {
    console.log(`Processing subreddit: ${url}`);

    const jsonUrl = `${url.replace(/\/$/, '')}.json?limit=${options.maxPosts}`;

    const config = {
        headers: HEADERS,
        timeout: 30000,
    };

    if (proxyAgent) {
        config.httpsAgent = proxyAgent;
    }

    const response = await axios.get(jsonUrl, config);
    const data = response.data;

    const posts = data.data.children
        .filter(child => child.kind === 't3')
        .slice(0, options.maxPosts);

    const results = [];
    for (const postWrapper of posts) {
        const post = postWrapper.data;
        try {
            const result = await processPost(
                `https://reddit.com${post.permalink}`,
                options
            );
            results.push(result);

            // Delay to respect rate limits
            await new Promise(r => setTimeout(r, 500));
        } catch (error) {
            console.log(`Error processing ${post.permalink}: ${error.message}`);
        }
    }

    return results;
}

// Detect URL type
function getUrlType(url) {
    if (url.includes('/comments/')) return 'post';
    if (url.match(/\/r\/[^/]+\/?($|\?|\/hot|\/new|\/top)/)) return 'subreddit';
    return 'unknown';
}

// Main Actor logic
Actor.main(async () => {
    const input = await Actor.getInput();
    const {
        startUrls = [],
        maxPosts = 10,
        maxComments = 0,
        includeReplies = true,
        // AI Sentiment options
        enableSentiment = false,
        googleApiKey = '',
        includeTopics = true,
        includeEntities = true,
        includeControversy = true,
        batchSize = 20,
        // Proxy option
        useProxy = true,
    } = input;

    // Initialize proxy if enabled
    if (useProxy) {
        console.log('Initializing Apify Proxy (residential)...');
        try {
            const proxyConfiguration = await Actor.createProxyConfiguration({
                groups: ['RESIDENTIAL'],
                countryCode: 'US',
            });
            const proxyUrlStr = await proxyConfiguration.newUrl();
            proxyAgent = new HttpsProxyAgent(proxyUrlStr);
            console.log('Residential proxy initialized successfully');
        } catch (error) {
            console.log(`Warning: Could not initialize residential proxy: ${error.message}`);
            console.log('Falling back to datacenter proxy...');
            try {
                const proxyConfiguration = await Actor.createProxyConfiguration();
                const proxyUrlStr = await proxyConfiguration.newUrl();
                proxyAgent = new HttpsProxyAgent(proxyUrlStr);
                console.log('Datacenter proxy initialized');
            } catch (err) {
                console.log(`Warning: No proxy available: ${err.message}`);
                console.log('Proceeding without proxy (may fail with 403)');
            }
        }
    } else {
        console.log('Proxy disabled by user');
    }

    const options = {
        maxPosts,
        maxComments,
        includeReplies,
        enableSentiment,
        googleApiKey,
        includeTopics,
        includeEntities,
        includeControversy,
        batchSize,
    };

    console.log(`Starting Reddit Sentiment Analyzer`);
    console.log(`URLs: ${startUrls.length}, Sentiment: ${enableSentiment ? 'ON' : 'OFF'}, Proxy: ${useProxy ? 'ON' : 'OFF'}`);

    for (const url of startUrls) {
        try {
            const urlType = getUrlType(url);

            if (urlType === 'post') {
                const result = await processPost(url, options);
                await Actor.pushData(result);
            } else if (urlType === 'subreddit') {
                const results = await processSubreddit(url, options);
                await Actor.pushData(results);
            } else {
                console.log(`Unknown URL type: ${url}`);
            }
        } catch (error) {
            console.log(`Error processing ${url}: ${error.message}`);
        }
    }

    console.log('Done!');
});

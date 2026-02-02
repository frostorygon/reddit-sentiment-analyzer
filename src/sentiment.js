// Sentiment Analysis Module - Gemini 2.5 Flash (FREE with Google AI Ultra credits)
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize client
let genAI = null;
let model = null;

function getModel(apiKey) {
    if (!model) {
        const key = apiKey || process.env.GOOGLE_API_KEY;
        if (!key) {
            throw new Error('Google API key required. Provide googleApiKey in input or set GOOGLE_API_KEY env var.');
        }
        genAI = new GoogleGenerativeAI(key);
        model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    }
    return model;
}

// Analyze a batch of comments for sentiment
async function analyzeComments(comments, options = {}) {
    const { batchSize = 20, apiKey } = options;
    const results = [];

    for (let i = 0; i < comments.length; i += batchSize) {
        const batch = comments.slice(i, i + batchSize);
        const batchResults = await analyzeBatch(batch, { ...options, apiKey });
        results.push(...batchResults);
    }

    return results;
}

// Analyze a batch in a single API call
async function analyzeBatch(comments, options) {
    const model = getModel(options.apiKey);

    const commentsText = comments.map((c, idx) =>
        `[${idx}] @${c.author}: "${c.body.slice(0, 500)}"`
    ).join('\n\n');

    const prompt = `Analyze these Reddit comments. Return ONLY a valid JSON array.

For EACH comment, provide:
- "index": the [idx] number
- "sentiment": "positive", "negative", "neutral", or "mixed"
- "sentiment_score": number from -1.0 to 1.0
${options.includeTopics !== false ? '- "topics": array of 1-3 topic keywords' : ''}
${options.includeEntities !== false ? '- "entities": array of mentioned brands/people/products' : ''}
${options.includeControversy !== false ? '- "controversy_score": number 0.0 to 1.0 (debate likelihood)' : ''}

Comments:
${commentsText}

JSON array only, no markdown:`;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();

        // Parse JSON from response
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
            console.log('Failed to parse AI response, returning defaults');
            return comments.map(c => ({
                ...c,
                sentiment: 'neutral',
                sentiment_score: 0,
                analysis_error: 'parse_failed',
            }));
        }

        const analyses = JSON.parse(jsonMatch[0]);

        return comments.map((comment, idx) => {
            const analysis = analyses.find(a => a.index === idx) || {};
            return {
                ...comment,
                sentiment: analysis.sentiment || 'neutral',
                sentiment_score: analysis.sentiment_score || 0,
                topics: analysis.topics || [],
                entities: analysis.entities || [],
                controversy_score: analysis.controversy_score || 0,
            };
        });
    } catch (error) {
        console.log(`AI analysis error: ${error.message}`);
        return comments.map(c => ({
            ...c,
            sentiment: 'unknown',
            sentiment_score: 0,
            analysis_error: error.message,
        }));
    }
}

// Generate summary insights
async function generatePostInsights(post, analyzedComments) {
    const sentimentCounts = { positive: 0, negative: 0, neutral: 0, mixed: 0 };
    let totalScore = 0;
    const allTopics = [];
    const allEntities = [];

    for (const c of analyzedComments) {
        if (c.sentiment) sentimentCounts[c.sentiment]++;
        totalScore += c.sentiment_score || 0;
        if (c.topics) allTopics.push(...c.topics);
        if (c.entities) allEntities.push(...c.entities);
    }

    const countOccurrences = arr => arr.reduce((acc, item) => {
        acc[item] = (acc[item] || 0) + 1;
        return acc;
    }, {});

    const topicCounts = countOccurrences(allTopics);
    const entityCounts = countOccurrences(allEntities);

    return {
        total_comments_analyzed: analyzedComments.length,
        sentiment_distribution: sentimentCounts,
        average_sentiment_score: analyzedComments.length ? totalScore / analyzedComments.length : 0,
        top_topics: Object.entries(topicCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([topic, count]) => ({ topic, count })),
        top_entities: Object.entries(entityCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([entity, count]) => ({ entity, count })),
        controversy_flags: analyzedComments
            .filter(c => (c.controversy_score || 0) > 0.7)
            .map(c => ({ author: c.author, body: c.body.slice(0, 100), score: c.controversy_score })),
    };
}

module.exports = { analyzeComments, analyzeBatch, generatePostInsights };

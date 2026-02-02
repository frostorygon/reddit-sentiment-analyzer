# Faceless Content Empire

Automated faceless content creation pipeline for YouTube Shorts, TikTok, Facebook Reels, and Pinterest.

## Stack
- **Script Generation:** Gemini 2.5 Flash
- **Voiceover:** ElevenLabs ($11/mo)
- **Video Clips:** Veo 3.1 via Flow ($0 with AI Ultra)
- **Assembly:** Remotion + FFmpeg (local RTX 3090)
- **Automation:** n8n (self-hosted)

## Folder Structure
```
faceless-empire/
├── scripts/         # AI-generated scripts
├── voiceovers/      # ElevenLabs audio files
├── videos/          # Completed videos
├── thumbnails/      # Canva/AI thumbnails
├── workflows/       # n8n workflow exports
└── templates/       # Remotion templates
```

## Monetization Targets
- YouTube AdSense: $10-22 RPM (finance niche)
- TikTok Affiliate: 5-20% commissions
- Shopee Affiliate: Up to 50% (SEA market)
- Digital Products: Gumroad templates/guides

## Quick Start
1. Set up n8n: `docker run -d --name n8n -p 5678:5678 n8nio/n8n`
2. Get ElevenLabs API key: https://elevenlabs.io
3. Get Gemini API key: https://aistudio.google.com
4. Run first script generation workflow

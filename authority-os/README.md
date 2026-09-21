# Haris Authority OS

CEO-led digital authority orchestration for Muhammad Haris Aslam.

## Goal

One morning command becomes a controlled campaign across the canonical website, WordPress, LinkedIn, Jetpack-connected social channels, search/indexing, visuals and analytics.

## Architecture

User -> Haris Authority CEO -> specialist subagents -> CEO Publisher -> Verification -> Performance feedback.

Only the CEO Publisher can trigger writes. Subagents research and prepare artifacts.

## Isolation

The app is under /authority-os on the authority-os-v1 branch. The existing mharisaslam.com project is not changed by deploying this folder as a separate Vercel project.

## Local setup

1. cd authority-os
2. copy .env.example to .env.local
3. add OPENAI_API_KEY
4. npm install
5. npm run dev

## Vercel setup

Create a separate Vercel project from the same GitHub repository and set Root Directory to authority-os.
Do not change the existing mharisaslam.com project.

## Integration order

Phase 1
- OpenAI Agents API
- GitHub
- WordPress.com
- Jetpack Social
- existing LinkedIn publisher
- Bing + IndexNow
- verification

Phase 2
- Google Search Console
- GA4
- Canva
- Medium browser worker
- Substack browser worker
- performance feedback

Phase 3
- short-form video
- selective Reddit/community participation
- CRM/prospect intelligence
- deeper Europe campaign automation

## Evidence rules

- Never invent Haris's record.
- Modeled/proposed outcomes must be labeled.
- Employer/client-sensitive information must be anonymized unless approved/public.
- Main website is canonical.
- No duplicate LinkedIn publishing through Jetpack.
- No spammy automated community posting.
- Never mark a channel successful without a verified live URL or platform success event.

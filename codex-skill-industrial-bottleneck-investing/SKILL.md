---
name: industrial-bottleneck-investing
description: Use this skill when continuing the user's global industrial bottleneck quantitative investing project, including the Netlify/GitHub dashboard, watchlist/discovery/validation pools, investment framework, risk stop rules, demand verification logic, sentiment sell signals, portfolio simulation, price-anchor correction, and weekly review workflow.
metadata:
  short-description: Continue the industrial bottleneck quant investing dashboard
---

# Industrial Bottleneck Investing

Use this skill to continue the user's quantitative investing project. The system tracks global industrial, hard-tech, and resource bottleneck equities where demand verification, scarcity, supply-demand mismatch, and narrative timing can create asymmetric upside.

## Project Locations

- Local project: `/Users/uaer/Documents/Codex/2026-05-29/twitter`
- Live site: `https://industrial-bottleneck-monitor.netlify.app`
- GitHub: `https://github.com/HZZZZZZZH/industrial-bottleneck-monitor`
- Netlify site id: `3c3c89b0-43cd-4915-a337-df5ae79abd7c`

When asked to continue the project, first inspect the local repo. Important files usually include:

- `index.html`
- `app.js`
- `styles.css`
- `data/watchlist.json`
- `data/discovery.json`
- `data/validation.json`
- `data/quotes.json`
- `data/manual-price-anchors.json`
- `data/events.json`
- `data/decision-log.json`
- `scripts/validate-data.mjs`
- `scripts/sync-price-derived-data.mjs`
- `scripts/fetch-eodhd-quotes.mjs`

## Product Goal

Build a practical investing workstation for a USD-denominated global stock pool. The first screen should show high-frequency decisions: watchlist, discovery pool, validation pool, portfolio status, red/yellow/green risk lights, sentiment heat, current action, and post-validation return.

Secondary pages or panels should handle lower-frequency work: framework definitions, parameter standards, weekly reviews, earnings reviews, trade reviews, error attribution, and new-stock intake.

## Investment Framework

Core formula:

`demand verification + fundamentals + scarcity + era beta + supply-demand mismatch + time/odds value`

The user values asymmetric opportunity more than obvious quality. Avoid recommending mega-cap certainty when the market cap already limits upside unless the risk-adjusted time/odds are still compelling.

### Entry Pool Standard

A stock can enter the pool only when most of these hold:

- It belongs to industrial, hard-tech, resource, or infrastructure supply-demand bottleneck fields.
- It is tied to era beta: AI, electricity, photonics, advanced packaging, defense, mining, shipping, grid infrastructure, energy infrastructure, or similar structural demand.
- It has trackable indicators: orders, backlog, pipeline, capacity, price, gross margin, customer qualification, licenses, policy permits, shipment schedule, utilization, or capex signal.
- It is not a pure concept stock. It needs at least one external validation signal.
- The verification point is when demand moves from narrative to order clue, pipeline, customer validation, capacity expansion, or revenue/margin evidence.

### Fundamental Quality

Use four clear tiers, not 0-100 scores:

- `极佳`: era beta, supply shortage, rapid revenue conversion, and value-chain scarcity are all strong.
- `优秀`: most factors are strong, with one material uncertainty.
- `可跟踪`: promising but validation, margin, or timing is not yet strong enough.
- `剔除`: not in era beta, lacks supply-demand mismatch, or is mainly concept-driven.

Fundamental logic:

- Is the industry a high-growth era-beta field?
- Does the field have strong demand and hard-to-expand supply?
- Is the company in the part of the chain where revenue can explode quickly?
- Is the business in the most valuable or scarce segment of the chain?

### Demand Verification

Use four tiers:

- `财报验证`: revenue, margin, backlog, orders, or guidance already confirms demand.
- `订单线索`: pipeline, customer certification, order clue, shipment schedule, or capacity reservation exists.
- `跟踪`: credible third-party indicators exist but financial conversion is not clear yet.
- `未验证`: only narrative or weak signals.

Demand verification should be weighted at least as strongly as fundamentals.

### Value For Money

The user's definition:

`性价比 = 时间 + 赔率`

Assess using comparable companies, optimistic future valuation, current market cap, expected time to confirmation, and upside/downside. Do not only say a company is good; decide whether the expected return over the next 6-24 months is worth the opportunity cost.

### Risk Standard

Use four risk tiers:

- `低风险`: core thesis is not disproven; no critical risk has triggered.
- `一般`: one warning sign exists but thesis remains intact.
- `危险`: a major verification/ramp/customer/timing issue appears.
- `高危`: demand is being disproven or the capital-market thesis is broken.

For each company, identify 3-4 company-specific intolerable risks. Examples:

- demand did not convert from pipeline/backlog to orders or revenue
- key customer qualification failed or delayed
- margins deteriorated when revenue should scale
- capacity expansion did not happen
- competitor captured the value-chain bottleneck
- valuation ran ahead while validation did not improve
- official media and retail attention reached euphoric levels after a multi-fold move

### Sentiment Sell Signal

Sentiment is high risk when ordinary people broadly know the stock and want to buy it. Track:

- Twitter/X heat
- Google/search trend
- official mainstream media articles saying the stock has risen several times
- retail-facing financial media coverage
- sudden broad social-media discovery after large price appreciation

### Contrarian Rule

If a stock has strong fundamentals and demand verification but rises less than 1x within one month after verification, raise its risk level. This may signal an unknown issue, weak market belief, dilution risk, or hidden timing problem.

## Data Rules

Do not fabricate historical anchor prices. If exact APIs are rate-limited, use fast web verification or user-provided sources. A 1-2% difference is acceptable for anchor price purposes, but the date, ticker, and split-adjustment logic must be directionally correct.

Post-verification return should be calculated from:

`current price / verification anchor price - 1`

Store or update the anchor date and price in the relevant data files. If the user points out an error, correct all affected derived data and redeploy.

Known corrected examples from prior work:

- AXTI verification date: `2025-05-14`
- AXTI anchor close: about `1.44`
- Historical anchor prices may be approximate, but must not be confused with current split-adjusted or wrong-period prices.

## Current Product State

The project is a static dashboard deployed to Netlify. It has:

- watchlist, discovery pool, validation pool
- portfolio box for a 100,000 USD simulated allocation
- fundamental, demand, value-for-money, risk, and sentiment tiers
- verification date, anchor price, and post-verification return
- manual price-anchor overrides
- sample EODHD daily quote fetching
- GitHub repo with source code

## Development Workflow

When editing the project:

1. Inspect current files before changing behavior.
2. Keep the app usable as a static site unless the user explicitly wants a backend.
3. Preserve the user's investing logic; avoid generic dashboard simplification.
4. Validate data after edits with `node scripts/validate-data.mjs` if available.
5. For derived price changes, run `node scripts/sync-price-derived-data.mjs` if relevant.
6. Visually verify meaningful UI changes in a browser when practical.
7. Deploy to Netlify after user-facing changes when requested.

## Deployment Notes

Netlify is already configured and the current live site is:

`https://industrial-bottleneck-monitor.netlify.app`

GitHub is:

`https://github.com/HZZZZZZZH/industrial-bottleneck-monitor`

If pushing to GitHub requires credentials, ask the user for a short-lived fine-grained PAT with only repository `Contents: Read and write`. Never store the token in git config, `.env`, remote URLs, source files, or logs intended for the user. Recommend revoking it after push.

## Communication Style

The user wants direct, high-conviction, practical analysis. They dislike vague scoring and generic quality-company recommendations. Be explicit about:

- what is verified
- what is only narrative
- what would disprove the thesis
- what capital can track
- where time/odds are favorable
- why a stock belongs in watchlist, discovery, validation, add, hold, reduce, or clear

This is not financial advice. Treat outputs as research tooling and decision support, not guaranteed recommendations.

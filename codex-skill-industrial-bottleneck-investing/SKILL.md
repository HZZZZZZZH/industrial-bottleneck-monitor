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

### Odds And Capital Priority

The dashboard separates visible research indicators from the final action.

Visible indicators should be these six tiers:

- `基本档`: fundamental quality.
- `兑现档`: demand verification and conversion.
- `估值档`: whether current market cap is low, reasonable, overdrawn, or extremely overdrawn against future consensus.
- `赔率档`: time/space/probability odds.
- `风险档`: hard company risks plus unknown-information risk.
- `情绪档`: true mass-awareness heat, separated from niche circle crowding.

`资金优先级` is no longer a visible peer indicator. It is the underlying decision logic that combines the six tiers into action/status: add, hold, wait for pullback, observe, reduce, or clear.

The visible `状态` is the weighted result of these six factors, with each factor weight adjustable in four levels: `低`, `中`, `高`, `极高`. Default posture:

- `赔率档` and `兑现档`: highest weights, because odds define bet quality and verification defines speed.
- `基本档`, `估值档`, and `风险档`: high weights, because fundamentals define downside floor, valuation defines upside ceiling, and risk can block entry.
- `情绪档`: medium by default, but can become decisive when true mass-awareness heat appears.

Hard red lines still override weights. Do not let user-adjusted weights cancel demand disproval, extreme valuation overdraw, true euphoric climax, or major company-specific risks.

`赔率 = 空间 × 时间 × 概率 × 验证强度 × 估值未透支程度`

Use these odds tiers:

- `极佳`: high probability of +100% within 1 year, or medium probability of +300% within 1 year.
- `优秀`: medium probability of +100% within 1 year for small caps, or high probability of +50-100% within 1 year.
- `普通`: high probability of +100% over 1-3 years, but time efficiency is ordinary.
- `平庸`: space, time, or probability is not compelling enough.
- `负赔率`: valuation is severely overdrawn, PS is near historical top 1-2% for the industry, or further upside mainly needs extreme sentiment.

Assess using comparable companies, optimistic future valuation, current market cap, expected time to confirmation, and upside/downside. Do not only say a company is good; decide whether the expected return over the next 6-24 months is worth the opportunity cost. Market validation from a large post-verification move is a positive quality signal, not an automatic penalty.

Examples:

- MU-like large-cap HBM leaders can still be valuable if the whole scarce HBM/memory complex can plausibly rerate toward NVIDIA-scale market value. If NVIDIA is about a $5T company and SK hynix + Micron + Samsung memory value can plausibly approach that scale, a $1T-class MU can still have +100% 1-year odds when memory shortage and earnings surprises keep compounding.
- SIVE/AXTI-like stocks with large verified moves are high-quality market-validated targets. A just-verified stock that quickly rises 100%+ may have higher probability of another 100-300% if valuation is still reasonable. The core action is usually to wait for pullbacks and sell only near true euphoric climax or valuation overdraw.
- VECO/POET/CAMT-like stocks with hard AI-era verification but weak post-verification price response require unknown-risk investigation before buying.

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

### Forward Valuation

Use future 3-year consensus profit expectations to judge valuation overdraw. If the current date is in H1, normally use current year / next year / year+2; if in H2, normally use next year / year+2 / year+3. For the current 2026 data file, Y1/Y2/Y3 maps to 2027/2028/2029 unless the data file is updated.

Decision logic:

- If current market cap trades at 30-40x year-1 expected profit, show `低估`. If a verified excellent company still trades there, also investigate whether the market knows something hidden.
- If current market cap trades at 30-40x year-2 expected profit, show `合理`.
- If current market cap trades at 30-40x year-3 expected profit, show `透支`.
- If current market cap is above 40x year-3 expected profit, show `极端透支` and treat it as a clear valuation sell signal.
- If PS reaches the industry's historical top 1-2% percentile, show at least `透支`; if the stock also lacks true mass awareness, reduce odds because further upside needs hard sentiment acceleration.

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
- six visible tiers: `基本档`, `兑现档`, `估值档`, `赔率档`, `风险档`, `情绪档`
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

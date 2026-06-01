# Industrial Bottleneck Monitor

A static research dashboard for tracking industrial bottleneck investing ideas.

The system is designed around four core questions:

- Is the company exposed to a strong industrial or hard-tech beta?
- Is there a real supply-demand mismatch with traceable signals?
- Can demand verification convert into revenue, backlog, pipeline, pricing, or margin?
- Are sentiment, valuation, and risk still acceptable relative to time and upside?

## Features

- Watchlist, discovery pool, and validation pool
- Four-level scoring for fundamentals, demand verification, risk, sentiment, and value
- Portfolio summary for a 100k USD industrial bottleneck strategy
- Price anchor tracking for "verification entry" gain calculations
- Weekly review-oriented data files for events and decision logs
- Static deployment support for Netlify or any plain web host

## Project Structure

```text
index.html
app.js
styles.css
_headers
data/
scripts/
standards.md
```

## Local Usage

Run a local static server:

```bash
python3 -m http.server 8765
```

Then open:

```text
http://127.0.0.1:8765/
```

## Data Validation

```bash
node scripts/validate-data.mjs
```

## Quote Updates

The EODHD token is read from the environment and is not committed:

```bash
EODHD_API_TOKEN=your_token node scripts/fetch-eodhd-quotes.mjs
```

## Disclaimer

This project is for research workflow design and educational use only. It is not investment advice, and the sample data should be independently verified before making trading decisions.

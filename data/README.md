# Data Layer

This folder is the auditable seed data layer for the industrial bottleneck monitor.

## Files

- `watchlist.json`: the user's active watchlist. Items in this file enter scoring, action status, details, and portfolio candidate logic.
- `discovery-pool.json`: weekly global candidates. These are interesting but not yet validated enough to compute validation gain.
- `validation-pool.json`: candidates with early validation evidence, such as order, backlog, customer certification, financial report signal, or policy permit.
- `events.json`: point-in-time validation events. Every validation entry should eventually have a source URL and observed timestamp.
- `decision-log.json`: append-only action log for add/watch/buy/hold/reduce/exit decisions.
- `quotes.json`: daily quote snapshot fetched from EODHD. It also stores the validation-date anchor price, anchor reliability status, and validation gain.
- `manual-price-anchors.json`: manual anchor prices used when the market data API cannot return the exact validation date. These can be exact closes or clearly marked research estimates.

## Required Evidence Rule

A stock can move from discovery to validation only when it has:

- `date`
- `eventType`
- `source`
- `sourceUrl`
- `observedAt`
- `priceAtEvent`
- `summary`
- `confidence`

Rows with `status: "needs_source"` are seed records and still need source proof before they should be treated as fully audited.

## Price Anchor Rule

Validation gain must come from `quotes.json`, not the seed `sinceAdded` field. If EODHD cannot return the exact validation date, `manual-price-anchors.json` can supply either an exact close or a `manual_estimate` close. For this research system, a correct validation date and a close within roughly 1-2% is acceptable; exactness matters less than avoiding wrong-date proxy anchors.

## Validate

Run:

```bash
node scripts/validate-data.mjs
```

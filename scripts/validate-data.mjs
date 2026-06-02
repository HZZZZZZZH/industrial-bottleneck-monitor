import { readFile } from "node:fs/promises";

const files = [
  ["watchlist", "data/watchlist.json", ["ticker", "name", "industry", "theme", "scores", "risk", "sentiment"]],
  ["discovery", "data/discovery-pool.json", ["symbol", "name", "country", "exchange", "currency", "marketCapUsd", "leadMetric"]],
  ["validation", "data/validation-pool.json", ["symbol", "name", "country", "exchange", "currency", "validation", "leadMetric"]],
  ["events", "data/events.json", ["id", "ticker", "date", "eventType", "observedAt", "priceAtEvent", "summary", "status"]],
  ["decisions", "data/decision-log.json", ["id", "date", "ticker", "action", "reason"]],
  ["quotes", "data/quotes.json", ["ticker", "symbol", "date", "price"]],
  ["manual anchors", "data/manual-price-anchors.json", ["ticker", "symbol", "requestedDate", "priceDate", "price", "sourceUrl"]],
  ["consensus estimates", "data/consensus-estimates.json", ["ticker", "marketCapUsd", "sourceQuality", "sourceUrls", "note"]],
];

function itemsFromPayload(payload, filePath) {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.items)) return payload.items;
  if (payload && Array.isArray(payload.quotes)) return payload.quotes;
  throw new Error(`${filePath}: expected an array or an object with items[]`);
}

function assertRequired(item, requiredFields, filePath, index) {
  for (const field of requiredFields) {
    if (item[field] === undefined || item[field] === null || item[field] === "") {
      throw new Error(`${filePath}: item ${index} missing ${field}`);
    }
  }
}

let total = 0;

for (const [name, filePath, requiredFields] of files) {
  const payload = JSON.parse(await readFile(filePath, "utf8"));
  const items = itemsFromPayload(payload, filePath);
  items.forEach((item, index) => assertRequired(item, requiredFields, filePath, index));
  total += items.length;
  console.log(`${name}: ${items.length} items`);
}

console.log(`Validated ${files.length} files, ${total} records.`);

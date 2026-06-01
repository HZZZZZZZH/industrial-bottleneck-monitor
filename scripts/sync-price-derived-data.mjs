import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

function round(value, digits = 2) {
  const number = Number(value);
  if (!Number.isFinite(number)) return null;
  return Number(number.toFixed(digits));
}

function itemsFromPayload(payload) {
  return Array.isArray(payload) ? payload : payload.items;
}

async function readJson(relativePath) {
  return JSON.parse(await readFile(path.join(rootDir, relativePath), "utf8"));
}

async function writeJson(relativePath, payload) {
  await writeFile(path.join(rootDir, relativePath), `${JSON.stringify(payload, null, 2)}\n`);
}

const [watchlistPayload, eventsPayload, decisionsPayload, quotesPayload] = await Promise.all([
  readJson("data/watchlist.json"),
  readJson("data/events.json"),
  readJson("data/decision-log.json"),
  readJson("data/quotes.json"),
]);

const quotes = new Map((quotesPayload.quotes || []).map((quote) => [quote.ticker, quote]));
const updatedAt = new Date().toISOString();

for (const stock of itemsFromPayload(watchlistPayload)) {
  const quote = quotes.get(stock.ticker);
  if (!quote) continue;

  stock.price = round(quote.price, 4);
  stock.day = round(quote.dayChangePct, 2);
  stock.month = round(quote.monthChangePct, 2);

  if (quote.validation) {
    stock.sinceAdded = Math.round(Number(quote.validation.gainPct));
    stock.validation = {
      ...(stock.validation || {}),
      price: quote.validation.price,
      priceDate: quote.validation.priceDate,
      priceProvider: quote.validation.provider,
      priceMethod: quote.validation.method,
      priceStatus: quote.validation.status,
      priceSourceUrl: quote.validation.sourceUrl,
      anchorReliable: quote.validation.reliable,
      gainPct: quote.validation.gainPct,
      tolerancePct: quote.validation.tolerancePct,
      note: quote.validation.note,
    };
  }
}
watchlistPayload.updatedAt = updatedAt;

for (const event of itemsFromPayload(eventsPayload)) {
  if (event.eventType !== "validation") continue;
  const quote = quotes.get(event.ticker);
  if (!quote?.validation) continue;

  event.observedAt = quote.validation.priceDate || event.observedAt;
  event.priceAtEvent = quote.validation.price;
  event.source = quote.validation.provider || event.source;
  event.sourceUrl = quote.validation.sourceUrl || event.sourceUrl;
  event.confidence = quote.validation.status === "manual_estimate" ? "medium" : "high";
  event.status = quote.validation.status === "manual_estimate" ? "estimate" : "verified";
}
eventsPayload.updatedAt = updatedAt;

for (const decision of itemsFromPayload(decisionsPayload)) {
  const quote = quotes.get(decision.ticker);
  if (!quote) continue;

  if (Number.isFinite(Number(quote.price))) decision.price = round(quote.price, 4);
  if (quote.validation) {
    decision.validationGain = Math.round(Number(quote.validation.gainPct));
    decision.correctedAt = updatedAt;
    decision.correctionReason = "使用统一行情层的当前价与验证日锚定价重算。";
  }
}
decisionsPayload.updatedAt = updatedAt;

await Promise.all([
  writeJson("data/watchlist.json", watchlistPayload),
  writeJson("data/events.json", eventsPayload),
  writeJson("data/decision-log.json", decisionsPayload),
]);

console.log("Synced watchlist, events, and decision log from data/quotes.json.");

import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

const symbolOverrides = {
  AXTI: "AXTI.US",
  SIVE: "SIVE.ST",
  POET: "POET.US",
  VECO: "VECO.US",
  AAOI: "AAOI.US",
  MU: "MU.US",
  XFAB: "XFAB.PA",
  CAMT: "CAMT.US",
};

async function loadEnvFile() {
  const envPath = path.join(rootDir, ".env");
  if (!existsSync(envPath)) return;

  const envText = await readFile(envPath, "utf8");
  for (const line of envText.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

function isoDate(daysAgo) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - daysAgo);
  return date.toISOString().slice(0, 10);
}

function dateDaysAgo(daysAgo) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - daysAgo);
  return date;
}

function dateString(date) {
  return date.toISOString().slice(0, 10);
}

function daysBetween(start, end) {
  const startTime = new Date(`${start}T00:00:00Z`).getTime();
  const endTime = new Date(`${end}T00:00:00Z`).getTime();
  if (!Number.isFinite(startTime) || !Number.isFinite(endTime)) return null;
  return Math.round((endTime - startTime) / 86400000);
}

function minDateString(...dates) {
  return dates.filter(Boolean).sort((a, b) => String(a).localeCompare(String(b)))[0];
}

async function loadWatchlist() {
  const payload = JSON.parse(await readFile(path.join(rootDir, "data", "watchlist.json"), "utf8"));
  const items = Array.isArray(payload) ? payload : payload.items;
  if (!Array.isArray(items)) throw new Error("data/watchlist.json must contain items[]");
  return items.map((stock) => ({
    ticker: stock.ticker,
    symbol: stock.quoteSymbol || symbolOverrides[stock.ticker] || `${stock.ticker}.US`,
    validationDate: stock.validation?.date || null,
  }));
}

async function loadManualAnchors() {
  const filePath = path.join(rootDir, "data", "manual-price-anchors.json");
  if (!existsSync(filePath)) return new Map();
  const payload = JSON.parse(await readFile(filePath, "utf8"));
  const items = Array.isArray(payload) ? payload : payload.items;
  if (!Array.isArray(items)) return new Map();
  return new Map(items.map((item) => [`${item.ticker}|${item.requestedDate}`, item]));
}

async function fetchHistory(symbol, fromDate) {
  const token = process.env.EODHD_API_TOKEN;
  const params = new URLSearchParams({
    api_token: token,
    fmt: "json",
    period: "d",
    from: fromDate,
    to: isoDate(0),
  });
  const url = `https://eodhd.com/api/eod/${encodeURIComponent(symbol)}?${params}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${symbol}: EODHD ${response.status} ${response.statusText}`);
  }
  const rows = await response.json();
  if (!Array.isArray(rows) || rows.length < 2) {
    throw new Error(`${symbol}: EODHD returned insufficient daily history`);
  }
  return rows;
}

function pctChange(current, previous) {
  if (!Number.isFinite(current) || !Number.isFinite(previous) || previous === 0) return null;
  return Number((((current - previous) / previous) * 100).toFixed(2));
}

function average(values) {
  const clean = values.filter((value) => Number.isFinite(value));
  if (!clean.length) return null;
  return clean.reduce((sum, value) => sum + value, 0) / clean.length;
}

function sma(values, period) {
  if (values.length < period) return null;
  return average(values.slice(-period));
}

function rsi(values, period = 14) {
  if (values.length <= period) return null;
  const window = values.slice(-(period + 1));
  let gains = 0;
  let losses = 0;

  for (let index = 1; index < window.length; index += 1) {
    const change = window[index] - window[index - 1];
    if (change >= 0) gains += change;
    else losses += Math.abs(change);
  }

  if (losses === 0) return 100;
  const relativeStrength = gains / period / (losses / period);
  return 100 - 100 / (1 + relativeStrength);
}

function round(value, digits = 2) {
  if (!Number.isFinite(value)) return null;
  return Number(value.toFixed(digits));
}

function marketPrice(row) {
  return Number(row.adjusted_close ?? row.close);
}

function validationDateLabel(validationDate) {
  return new Date(`${validationDate}T00:00:00Z`).toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function compactText(text) {
  return text
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseTrading212Anchor(html, validationDate) {
  const label = validationDateLabel(validationDate);
  const text = compactText(html);
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = text.match(new RegExp(`${escaped}\\s+([0-9]+(?:\\.[0-9]+)?)`));
  if (!match) return null;
  return {
    requestedDate: validationDate,
    priceDate: validationDate,
    price: round(Number(match[1]), 4),
    gapDays: 0,
    reliable: true,
    status: "exact",
    method: "trading212_historical_table_close",
    provider: "trading212",
    sourceUrl: null,
  };
}

async function fetchTrading212Anchor(symbol, validationDate) {
  const url = `https://www.trading212.com/trading-instruments/cfd/${encodeURIComponent(symbol)}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Trading212 ${response.status} ${response.statusText}`);
  const anchor = parseTrading212Anchor(await response.text(), validationDate);
  if (!anchor) throw new Error(`Trading212 anchor not found for ${symbol} ${validationDate}`);
  return { ...anchor, sourceUrl: url };
}

function normalizeManualAnchor(anchor) {
  if (!anchor) return null;
  return {
    requestedDate: anchor.requestedDate,
    priceDate: anchor.priceDate,
    price: round(Number(anchor.price), 4),
    gapDays: daysBetween(anchor.requestedDate, anchor.priceDate),
    reliable: Boolean(anchor.reliable),
    status: anchor.status || "exact",
    method: anchor.method || "manual_verified_close",
    provider: anchor.provider || "manual",
    sourceUrl: anchor.sourceUrl || null,
    verifiedAt: anchor.verifiedAt || null,
    tolerancePct: Number.isFinite(Number(anchor.tolerancePct)) ? Number(anchor.tolerancePct) : null,
    note: anchor.note || null,
  };
}

async function anchorForDate({ ticker, symbol, validationDate, manualAnchor }, rows) {
  if (!validationDate) return null;
  const row = rows.find((item) => String(item.date) >= validationDate) || rows.at(-1);
  if (!row) return null;
  const price = marketPrice(row);
  if (!Number.isFinite(price)) return null;
  const gapDays = daysBetween(validationDate, row.date);
  const exact = row.date === validationDate;
  const reliable = exact || (Number.isFinite(gapDays) && gapDays <= 5);
  const anchor = {
    requestedDate: validationDate,
    priceDate: row.date,
    price: round(price, 4),
    gapDays,
    reliable,
    status: exact ? "exact" : reliable ? "next_trading_day" : "requested_date_unavailable",
    method: reliable
      ? "first_trading_day_on_or_after_validation_date"
      : "first_available_trading_day_after_requested_date",
    provider: "eodhd",
    sourceUrl: null,
  };

  if (anchor.reliable) return anchor;

  const verifiedAnchor = normalizeManualAnchor(manualAnchor);
  if (verifiedAnchor) return verifiedAnchor;

  try {
    return await fetchTrading212Anchor(symbol, validationDate);
  } catch (error) {
    return {
      ...anchor,
      fallbackError: error.message,
    };
  }
}

async function buildQuote({ ticker, symbol, validationDate, manualAnchor }, rows) {
  const sorted = [...rows].sort((a, b) => String(a.date).localeCompare(String(b.date)));
  const latest = sorted.at(-1);
  const previous = sorted.at(-2);
  const monthAnchor = sorted.find((row) => row.date >= isoDate(32)) || sorted[0];
  const price = marketPrice(latest);
  const prevClose = marketPrice(previous);
  const monthClose = marketPrice(monthAnchor);
  const closes = sorted.map(marketPrice).filter(Number.isFinite);
  const volumes = sorted.map((row) => Number(row.volume ?? 0)).filter(Number.isFinite);
  const sma20 = sma(closes, 20);
  const sma50 = sma(closes, 50);
  const volume20 = average(volumes.slice(-20));
  const validationAnchor = await anchorForDate({ ticker, symbol, validationDate, manualAnchor }, sorted);

  return {
    ticker,
    symbol,
    date: latest.date,
    priceMode: "adjusted_close",
    price: Number(price.toFixed(4)),
    dayChangePct: pctChange(price, prevClose),
    monthChangePct: pctChange(price, monthClose),
    validation: validationAnchor
      ? {
          ...validationAnchor,
          gainPct: pctChange(price, validationAnchor.price),
        }
      : null,
    volume: Number(latest.volume ?? 0),
    technicals: {
      sma20: round(sma20, 4),
      sma50: round(sma50, 4),
      rsi14: round(rsi(closes, 14), 2),
      volumeRatio20: volume20 ? round(Number(latest.volume ?? 0) / volume20, 2) : null,
      distanceToSma20Pct: sma20 ? pctChange(price, sma20) : null,
      distanceToSma50Pct: sma50 ? pctChange(price, sma50) : null,
      aboveSma20: sma20 ? price >= sma20 : null,
      aboveSma50: sma50 ? price >= sma50 : null,
    },
  };
}

async function main() {
  await loadEnvFile();
  if (!process.env.EODHD_API_TOKEN) {
    throw new Error("Missing EODHD_API_TOKEN. Put it in .env or export it in the shell.");
  }

  const symbols = await loadWatchlist();
  const manualAnchors = await loadManualAnchors();
  const quotes = [];
  const errors = [];

  for (const item of symbols) {
    try {
      const fromDate = minDateString(item.validationDate, dateString(dateDaysAgo(90))) || isoDate(90);
      const rows = await fetchHistory(item.symbol, fromDate);
      const manualAnchor = manualAnchors.get(`${item.ticker}|${item.validationDate}`);
      quotes.push(await buildQuote({ ...item, manualAnchor }, rows));
    } catch (error) {
      errors.push({ ticker: item.ticker, symbol: item.symbol, error: error.message });
    }
  }

  const payload = {
    source: "eodhd",
    updatedAt: new Date().toISOString(),
    priceMode: "adjusted_close",
    validationPriceMode: "exact validation-date close when available; source-linked manual anchor otherwise",
    quotes,
    errors,
  };

  await writeFile(path.join(rootDir, "data", "quotes.json"), `${JSON.stringify(payload, null, 2)}\n`);

  if (errors.length) {
    console.warn(`Fetched ${quotes.length} quotes with ${errors.length} errors.`);
    for (const error of errors) console.warn(`${error.symbol}: ${error.error}`);
  } else {
    console.log(`Fetched ${quotes.length} quotes.`);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});

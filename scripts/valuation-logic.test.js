const test = require("node:test");
const assert = require("node:assert/strict");

const {
  forwardValuationBand,
  valuationTier,
} = require("./valuation-logic.js");

function makeStock({ marketCapUsd, y1 = null, y2 = null, y3 = null }) {
  return {
    marketCap: marketCapUsd,
    fundamentals: {
      marketCapUsd,
      consensusProfitUsdY1: y1,
      consensusProfitUsdY2: y2,
      consensusProfitUsdY3: y3,
    },
  };
}

test("gives 低估 when market cap is already inside the Y1 band even if Y2/Y3 are missing", () => {
  const stock = makeStock({ marketCapUsd: "~$7.0B", y1: "~$210M" });
  const valuation = forwardValuationBand(stock);

  assert.equal(valuation.available, true);
  assert.equal(valuation.label, "低估");
  assert.equal(valuationTier(stock).label, "低估");
});

test("falls back to 待补 when market cap is above Y1 40x and Y2 is missing", () => {
  const stock = makeStock({ marketCapUsd: "~$7.0B", y1: "~$49M" });
  const valuation = forwardValuationBand(stock);

  assert.equal(valuation.available, false);
  assert.match(valuation.note, /Y2/);
  assert.equal(valuationTier(stock).label, "待补");
});

test("gives 合理 when Y1 is not enough but Y2 supports the current market cap", () => {
  const stock = makeStock({ marketCapUsd: "~$2.1T", y1: "~$48.7B", y2: "~$55.5B" });
  const valuation = forwardValuationBand(stock);

  assert.equal(valuation.available, true);
  assert.equal(valuation.label, "合理");
  assert.equal(valuationTier(stock).label, "合理");
});

test("falls back to 待补 when market cap is above Y2 40x and Y3 is missing", () => {
  const stock = makeStock({ marketCapUsd: "~$3.5B", y1: "~$43M", y2: "~$64M" });
  const valuation = forwardValuationBand(stock);

  assert.equal(valuation.available, false);
  assert.match(valuation.note, /Y3/);
  assert.equal(valuationTier(stock).label, "待补");
});

(function (root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  root.ValuationLogic = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function clamp(value, min = 0, max = 100) {
    return Math.max(min, Math.min(max, value));
  }

  function parseUsdAmount(value) {
    if (Number.isFinite(Number(value))) return Number(value);
    const text = `${value || ""}`.replace(/,/g, "").trim();
    if (!text || /待补|待更新|待核验|SEK|JPY|EUR|CHF/i.test(text)) return null;
    const match = text.match(/-?\d+(?:\.\d+)?/);
    if (!match) return null;
    const number = Number(match[0]);
    if (!Number.isFinite(number)) return null;
    if (/万亿|trillion|T(?:\b|$)/i.test(text)) return number * 1e12;
    if (/千亿/.test(text)) return number * 1e11;
    if (/亿美元/.test(text)) return number * 1e8;
    if (/B(?:\b|$)|billion/i.test(text)) return number * 1e9;
    if (/M(?:\b|$)|million/i.test(text)) return number * 1e6;
    return null;
  }

  function consensusProfitUsd(stock, year) {
    const fundamentals = stock.fundamentals || {};
    const consensus = fundamentals.consensusProfitUsd || fundamentals.forwardProfitUsd || {};
    const aliases = {
      1: [consensus.y1, consensus.year1, fundamentals.consensusProfitUsdY1, fundamentals.forwardNetIncomeUsdY1, fundamentals.netIncomeUsdY1],
      2: [consensus.y2, consensus.year2, fundamentals.consensusProfitUsdY2, fundamentals.forwardNetIncomeUsdY2, fundamentals.netIncomeUsdY2],
      3: [consensus.y3, consensus.year3, fundamentals.consensusProfitUsdY3, fundamentals.forwardNetIncomeUsdY3, fundamentals.netIncomeUsdY3],
    };

    for (const candidate of aliases[year] || []) {
      const parsed = parseUsdAmount(candidate);
      if (parsed !== null && parsed !== 0) return parsed;
    }
    return null;
  }

  function consensusRevenueUsd(stock, year) {
    const fundamentals = stock.fundamentals || {};
    const consensus = fundamentals.consensusRevenueUsd || fundamentals.forwardRevenueUsd || {};
    const aliases = {
      1: [consensus.y1, consensus.year1, fundamentals.consensusRevenueUsdY1, fundamentals.forwardRevenueUsdY1, fundamentals.revenueUsdY1],
      2: [consensus.y2, consensus.year2, fundamentals.consensusRevenueUsdY2, fundamentals.forwardRevenueUsdY2, fundamentals.revenueUsdY2],
      3: [consensus.y3, consensus.year3, fundamentals.consensusRevenueUsdY3, fundamentals.forwardRevenueUsdY3, fundamentals.revenueUsdY3],
    };

    for (const candidate of aliases[year] || []) {
      const parsed = parseUsdAmount(candidate);
      if (parsed !== null && parsed > 0) return parsed;
    }
    return null;
  }

  function formatUsdCompact(value) {
    const number = Number(value);
    if (!Number.isFinite(number)) return "待补";
    const sign = number < 0 ? "-" : "";
    const absolute = Math.abs(number);
    if (absolute >= 1e12) return `${sign}${Number((absolute / 1e12).toFixed(2))}T`;
    if (absolute >= 1e9) return `${sign}${Number((absolute / 1e9).toFixed(1))}B`;
    if (absolute >= 1e8) return `${sign}${Number((absolute / 1e8).toFixed(1))}亿`;
    if (absolute >= 1e6) return `${sign}${Number((absolute / 1e6).toFixed(1))}M`;
    return `${sign}${Math.round(absolute).toLocaleString("en-US")}`;
  }

  function unavailable(note, consensusText) {
    return {
      available: false,
      label: "估值待补",
      percentile: 0,
      risk: 0,
      consensusText,
      note,
    };
  }

  function forwardValuationBand(stock) {
    const marketCap = parseUsdAmount(stock.fundamentals?.marketCapUsd || stock.marketCap || stock.marketCapUsd);
    const profits = [1, 2, 3].map((year) => consensusProfitUsd(stock, year));
    const revenues = [1, 2, 3].map((year) => consensusRevenueUsd(stock, year));
    const usableYears = profits
      .map((profit, index) => ({ year: index + 1, profit }))
      .filter(({ profit }) => Number.isFinite(profit) && profit > 0);
    const farthest = usableYears[usableYears.length - 1];
    const usableRevenues = revenues
      .map((revenue, index) => ({ year: index + 1, revenue }))
      .filter(({ revenue }) => Number.isFinite(revenue) && revenue > 0);
    const farthestRevenue = usableRevenues[usableRevenues.length - 1];
    const farthestConsensusYear = Math.max(farthest?.year || 0, farthestRevenue?.year || 0);
    const consensusPieces = [];
    if (farthestConsensusYear) {
      const profit = profits[farthestConsensusYear - 1];
      const revenue = revenues[farthestConsensusYear - 1];
      if (Number.isFinite(profit) && profit !== 0) consensusPieces.push(`Y${farthestConsensusYear} profit ${formatUsdCompact(profit)}`);
      if (Number.isFinite(revenue) && revenue > 0) consensusPieces.push(`Y${farthestConsensusYear} revenue ${formatUsdCompact(revenue)}`);
    }
    const consensusText = consensusPieces.join(" / ");

    function multipleText(year, profit) {
      const pieces = [];
      if (Number.isFinite(profit) && profit > 0) {
        pieces.push(`Y${year} PE 约 ${Number((marketCap / profit).toFixed(1))}x`);
      }
      const revenue = revenues[year - 1];
      if (Number.isFinite(revenue) && revenue > 0) {
        pieces.push(`Y${year} PS 约 ${Number((marketCap / revenue).toFixed(1))}x`);
      }
      return pieces.length ? `（${pieces.join("，")}）` : "";
    }

    function y3RevenueMeme() {
      const y3Revenue = revenues[2];
      if (!Number.isFinite(y3Revenue) || y3Revenue <= 0) return null;
      const y3Ps = marketCap / y3Revenue;
      if (y3Ps <= 20) return null;
      return {
        available: true,
        label: "Meme",
        percentile: 100,
        risk: 95,
        consensusText,
        note: `当前市值已经超过未来第 3 年合理营收估值，Y3 PS 约 ${Number(y3Ps.toFixed(1))}x，按框架归入 Meme 范围。`,
      };
    }

    if (!marketCap) {
      return unavailable("缺少市值，暂不触发估值卖点。", consensusText);
    }

    if (!usableYears.length) {
      const revenueMeme = y3RevenueMeme();
      if (revenueMeme) return revenueMeme;
      return unavailable("未来 1/2/3 年一致预期利润缺失或仍为亏损，暂不做利润估值档判断。", consensusText);
    }

    for (let index = 0; index < usableYears.length; index += 1) {
      const { year, profit } = usableYears[index];
      const low = profit * 30;
      const high = profit * 40;

      if (marketCap <= high) {
        const inBand = marketCap < low ? 0 : clamp(((marketCap - low) / (high - low)) * 100, 0, 100);
        const label = { 1: "低估", 2: "正常", 3: "高估" }[year];
        const risk = { 1: 24, 2: 40, 3: 72 }[year];
        const percentile = year === 1 && marketCap < low ? 12 : Math.round(clamp({ 1: 20, 2: 50, 3: 80 }[year] + inBand * 0.18));
        let note = "";

        const multipleNote = multipleText(year, profit);

        if (year === 1 && marketCap < low) {
          note = `当前市值低于未来第 1 年 30 倍利润${multipleNote}，归入低估；同时需要排查是否存在市场知道而我们还没看到的问题。`;
        } else if (year === 1) {
          note = `当前市值主要交易到未来第 1 年 30-40 倍利润区间${multipleNote}，按框架归入低估。`;
        } else if (year === 2 && profits[0] > 0) {
          note = `当前市值已超过未来第 1 年 40 倍利润，但仍在未来第 2 年 30-40 倍利润区间${multipleNote}，按框架归入正常。`;
        } else if (year === 2) {
          note = `未来第 1 年利润仍未转正，当前市值主要交易到未来第 2 年 30-40 倍利润区间${multipleNote}，按框架归入正常。`;
        } else {
          note = `当前市值已经交易到未来第 3 年 30-40 倍利润区间${multipleNote}，按框架归入高估。`;
        }

        return {
          available: true,
          label,
          percentile,
          risk,
          consensusText,
          note,
        };
      }

      if (index === usableYears.length - 1 && year < 3) {
        const revenueMeme = y3RevenueMeme();
        if (revenueMeme) return revenueMeme;
        return unavailable(`当前市值已超过 Y${year} 40 倍利润，但缺少可用的 Y${year + 1} 正利润一致预期，先标记待补。`, consensusText);
      }
    }

    if (usableYears.some((item) => item.year === 3)) {
      const y3Profit = profits[2];
      const y3Revenue = revenues[2];
      const y3Pe = y3Profit > 0 ? marketCap / y3Profit : null;
      const y3Ps = y3Revenue > 0 ? marketCap / y3Revenue : null;
      const revenueNote = y3Ps ? `；Y3 PS 约 ${Number(y3Ps.toFixed(1))}x` : "";
      return {
        available: true,
        label: "Meme",
        percentile: 100,
        risk: 95,
        consensusText,
        note: `当前市值已经超过未来第 3 年合理估值，Y3 PE 约 ${Number(y3Pe.toFixed(1))}x${revenueNote}，按框架归入 Meme 范围。`,
      };
    }

    const farthestYear = usableYears[usableYears.length - 1].year;
    const revenueMeme = y3RevenueMeme();
    if (revenueMeme) return revenueMeme;
    return unavailable(`当前市值已超过 Y${farthestYear} 40 倍利润，但缺少可用的 Y${farthestYear + 1} 正利润一致预期，先标记待补。`, consensusText);
  }

  function valuationTier(stock) {
    const valuation = forwardValuationBand(stock);
    if (!valuation.available) return { label: "待补", className: "tier-2", width: 35, note: valuation.note };
    if (valuation.label === "Meme") return { label: "Meme", className: "tier-1", width: 100, note: valuation.note };
    if (valuation.label === "高估") return { label: "高估", className: "tier-2", width: 82, note: valuation.note };
    if (valuation.label === "正常") return { label: "正常", className: "tier-3", width: 58, note: valuation.note };
    return { label: "低估", className: "tier-4", width: 28, note: valuation.note };
  }

  return {
    parseUsdAmount,
    consensusProfitUsd,
    consensusRevenueUsd,
    formatUsdCompact,
    forwardValuationBand,
    valuationTier,
  };
});

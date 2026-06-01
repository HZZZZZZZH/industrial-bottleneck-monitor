const factors = [
  { key: "validation", label: "验证强度", level: 4 },
  { key: "scarcity", label: "稀缺性", level: 4 },
  { key: "wave", label: "时代 Beta", level: 3 },
  { key: "mismatch", label: "供需错配", level: 3 },
  { key: "time", label: "转收入速度", level: 3 },
];

const factorLevels = [
  { level: 1, label: "低", weight: 8, help: "只做背景" },
  { level: 2, label: "中", weight: 16, help: "影响排序" },
  { level: 3, label: "高", weight: 24, help: "核心因子" },
  { level: 4, label: "极高", weight: 32, help: "一票否决" },
];

const baseWeights = Object.fromEntries(
  factors.map((factor) => [factor.key, factorLevels.find((item) => item.level === factor.level).weight])
);

const scoringModels = [
  {
    title: "基本面评分",
    body: "衡量是不是时代 Beta 下最好的生意：高增长行业、供需错配、收入弹性、价值链位置。",
    formula: "四档：排除 / 普通 / 优秀 / 极佳",
  },
  {
    title: "需求兑现概率",
    body: "衡量需求是否会从架构演进进入财报：领先指标、稀缺性、时代 Beta、供需错配、转收入速度。",
    formula: "四档：证伪 / 仅叙事 / 有订单线索 / 财报验证",
  },
  {
    title: "媒体热度风险",
    body: "衡量普通人是否已经知道并想买：推特/谷歌搜索、官方媒体、报道涨幅、社交拥挤。",
    formula: "四档：冷门 / 升温 / 拥挤 / 全民皆知",
  },
  {
    title: "综合性价比",
    body: "优先级：需求验证 = 基本面 > 性价比 > 风险。性价比只看时间和赔率，不替代验证。",
    formula: "四档：规避 / 期权仓 / 跟踪仓 / 主仓候选",
  },
];

const entryCriteria = [
  {
    title: "行业范围",
    body: "必须属于工业、硬科技、资源、能源、交通或国防等供需错配行业，不限定半导体。",
    formula: "AI / 电力 / 光子学 / 封装 / 军工 / 矿业 / 航运",
  },
  {
    title: "可追踪指标",
    body: "必须有资本能逐季追踪的指标，否则只是主题叙事。",
    formula: "订单 / backlog / pipeline / 产能 / ASP / 毛利 / 认证 / 政策许可",
  },
  {
    title: "架构演进预判",
    body: "允许早期技术路线入池，但必须能解释下一代架构为什么需要它。",
    formula: "旧瓶颈 -> 新架构 -> 新材料/设备/器件 -> 谁最难扩产",
  },
  {
    title: "外部验证",
    body: "入池从“需求验证”开始：从仅叙事进入订单线索、客户认证、backlog 或财报证据。",
    formula: "仅叙事不入池；订单线索起算验证后涨幅",
  },
];

const hardStopRules = [
  "需求证伪：领先指标连续两个季度没有从 pipeline / design-in 转成 backlog / PO / revenue。",
  "单次 ATM / 定增 / 可转债稀释超过 8%，或融资后仍不足 4 个季度现金 runway。",
  "核心客户取消、认证延后超过 2 个季度，或关键技术路线被大客户绕开。",
  "官方媒体集中报道数倍涨幅，同时搜索热度超过 5 倍且验证指标没有同步上修。",
  "行业特定卡点失效：材料、设备、产能、许可、良率或监管问题导致已披露订单无法按期交付。",
];

const reviewCadence = [
  {
    title: "每周复盘",
    body: "每周固定检查组合动作、红灯变化、热度卖点、验证后涨幅和技术面状态。",
    formula: "输出：下周加仓 / 持仓 / 减仓 / 清仓清单",
  },
  {
    title: "财报复盘",
    body: "围绕 pipeline、backlog、订单、收入、毛利、现金流和指引，判断需求是否继续兑现。",
    formula: "输出：验证增强 / 验证持平 / 需求证伪",
  },
  {
    title: "交易复盘",
    body: "记录买入、加仓、减仓、清仓时的价格、理由、技术面、风险状态和后续结果。",
    formula: "输出：执行是否优于等待或分批",
  },
  {
    title: "错误归因",
    body: "每次动作失误必须归因到逻辑、时间、赔率、风险、情绪或数据，而不是模糊归因。",
    formula: "输出：下次规则修订项",
  },
];

const reviewChecklist = [
  {
    module: "每周复盘",
    cadence: "每周一次",
    focus: "动作状态变化、组合暴露、红灯数量、热度卖点、验证后涨幅",
    output: "下周组合动作表",
  },
  {
    module: "财报复盘",
    cadence: "财报后 24 小时内",
    focus: "pipeline -> backlog -> revenue、毛利率、现金 runway、管理层指引",
    output: "需求兑现等级调整",
  },
  {
    module: "交易复盘",
    cadence: "每次交易后",
    focus: "买卖点、分批节奏、20D/50D、RSI、量能、是否追高或过早卖出",
    output: "执行质量标签",
  },
  {
    module: "错误归因",
    cadence: "每周汇总",
    focus: "逻辑错、时间错、赔率错、风险漏识别、情绪卖点没执行、数据滞后",
    output: "规则修订与黑名单",
  },
];

const errorAttributions = [
  {
    title: "逻辑错",
    body: "瓶颈不成立、架构演进判断错、公司不是最稀缺环节。",
    formula: "处理：降级 thesis 或移出观察池",
  },
  {
    title: "时间错",
    body: "方向正确但验证周期比预期更长，资金被过早占用。",
    formula: "处理：降低首批仓位，提高等待权重",
  },
  {
    title: "赔率错",
    body: "需求兑现了，但市值、竞争格局或估值上限导致剩余空间不足。",
    formula: "处理：从主仓候选降到持仓或减仓",
  },
  {
    title: "风险错",
    body: "融资、客户、政策、技术路线或供给释放风险没有及时计入。",
    formula: "处理：提高风险档，加入公司专属红线",
  },
  {
    title: "情绪错",
    body: "官方媒体报道数倍涨幅、搜索热度暴涨后没有执行卖点。",
    formula: "处理：热度卖点进入减仓硬规则",
  },
  {
    title: "数据错",
    body: "汇率、市值、盈利、订单口径、交易所代码或 ADR 映射错误。",
    formula: "处理：回滚信号，等待数据复核",
  },
];

const globalScope = [
  {
    title: "全球股票池",
    body: "工业瓶颈来自全球供应链，不限定美股；欧洲、日本、韩国、台湾、香港、澳洲、加拿大都要纳入。",
    formula: "symbol = ticker.exchange，例如 SIVE.ST / XFAB.PA",
  },
  {
    title: "美元统一口径",
    body: "市值、收入、盈利、现金、债务、订单和 backlog 尽量统一换算成美元，便于横向比较。",
    formula: "local currency -> USD",
  },
  {
    title: "去重与映射",
    body: "处理 ADR、本地股、双重上市、退市和低流动性，避免同一家公司重复入池。",
    formula: "primary listing 优先",
  },
  {
    title: "每周扫描",
    body: "每周扫描全球交易所、新闻、财报和产业关键词，候选股先进入发现池，再人工核验。",
    formula: "发现池 -> 待核验 -> 验证入池",
  },
];

const usdMetricFields = [
  { title: "市值 USD", body: "当前股价、股本、汇率换算后的公司规模。", formula: "marketCapUsd" },
  { title: "收入 USD", body: "TTM 或最近财年收入统一美元口径。", formula: "revenueTtmUsd" },
  { title: "盈利 USD", body: "净利润、EBITDA、经营利润至少保留一个可比字段。", formula: "netIncomeUsd / ebitdaUsd" },
  { title: "现金与债务", body: "现金、净现金、总债务、融资 runway，尤其适合小票。", formula: "cashUsd / debtUsd" },
  { title: "订单与 backlog", body: "订单、backlog、pipeline、产能、ASP 能换算则统一美元。", formula: "backlogUsd / pipelineUsd" },
  { title: "盈利质量", body: "毛利率、经营现金流、自由现金流、摊薄风险。", formula: "grossMargin / fcfUsd / dilution" },
];

const intakeStages = [
  { title: "发现池", body: "关键词、新闻、财报、产业会议和全球交易所扫描到的候选公司。", formula: "不进入组合" },
  { title: "待核验", body: "可能符合时代 Beta 和供需错配，但还没找到验证入池日和触发事件。", formula: "必须补证据" },
  { title: "验证入池", body: "已经有日期、价格、触发事件、美元口径数据和核心追踪指标。", formula: "开始计算验证后涨幅" },
  { title: "组合候选", body: "需求兑现、基本面、风险和技术面足以给出加仓/持仓动作。", formula: "进入仓位讨论" },
  { title: "淘汰池", body: "纯概念、无可追踪指标、需求证伪、流动性不足或数据无法核验。", formula: "保留归因" },
];

const weeklyScanSteps = [
  {
    step: "全球交易所粗筛",
    input: "EODHD exchange symbols / fundamentals",
    filter: "工业、硬科技、资源、能源、交通、国防",
    output: "发现池候选",
  },
  {
    step: "产业关键词扫描",
    input: "AI、电力、光子学、先进封装、军工、矿业、航运等关键词",
    filter: "必须能对应到公司业务和供应链位置",
    output: "主题候选",
  },
  {
    step: "美元口径归一",
    input: "本币财务、市值、汇率、ADR/本地股映射",
    filter: "市值、收入、盈利、现金债务字段可比",
    output: "可比较候选",
  },
  {
    step: "验证事件核验",
    input: "订单、backlog、pipeline、认证、财报、政策许可",
    filter: "必须有验证入池日、验证价格、触发事件",
    output: "验证入池候选",
  },
  {
    step: "组合动作评估",
    input: "基本面、需求兑现、性价比、风险、情绪、技术面",
    filter: "只能输出加仓、持仓、减仓、清仓",
    output: "组合候选或淘汰",
  },
];

let discoveryPool = [
  {
    ticker: "6146",
    symbol: "6146.T",
    name: "Disco Corp.",
    country: "日本",
    exchange: "Tokyo",
    currency: "JPY",
    industry: "半导体设备",
    theme: "切割/研磨/先进封装耗材",
    stage: "发现池",
    marketCapUsd: "约 350 亿美元",
    revenueUsd: "约 20 亿美元",
    profitUsd: "约 7 亿美元",
    leadMetric: "advanced packaging capex / blade & grinder demand / gross margin",
    thesis: "HBM、CoWoS、chiplet 带来晶圆减薄、切割、研磨需求，设备和耗材有高质量弹性。",
    evidence: "先进封装扩产链条持续紧张，但还需要核验 AI 相关订单占比和验证入池日。",
    nextCheck: "核验财报中 AI/advanced package 订单、客户扩产、美元市值和利润口径。",
    price: 0,
    day: 0,
    month: 0,
    sinceAdded: 0,
    scores: { validation: 46, scarcity: 82, wave: 84, mismatch: 76, time: 62 },
    metrics: [
      { label: "美元市值", value: "待更新", score: 52 },
      { label: "AI 订单纯度", value: "待核验", score: 38 },
      { label: "毛利质量", value: "高", score: 78 },
    ],
    risk: { dilution: 8, execution: 30, valuation: 72, export: 18, customer: 42 },
    sentiment: { searchSpike: 2.8, officialCoverage: 28, reportedMultiple: 1.2, socialCrowding: 32 },
  },
  {
    ticker: "4062",
    symbol: "4062.T",
    name: "Ibiden Co.",
    country: "日本",
    exchange: "Tokyo",
    currency: "JPY",
    industry: "先进封装材料",
    theme: "ABF substrate / AI package",
    stage: "发现池",
    marketCapUsd: "约 80 亿美元",
    revenueUsd: "约 25 亿美元",
    profitUsd: "约 3 亿美元",
    leadMetric: "AI substrate utilization / package substrate ASP / capex",
    thesis: "AI 加速器封装对 ABF substrate 需求提升，关键是客户认证和产能利用率是否重新上行。",
    evidence: "产业方向符合，但需要确认 AI 客户拉货是否已经进入订单和收入。",
    nextCheck: "核验 AI substrate 订单、稼动率、毛利率拐点与美元利润口径。",
    price: 0,
    day: 0,
    month: 0,
    sinceAdded: 0,
    scores: { validation: 44, scarcity: 72, wave: 82, mismatch: 70, time: 58 },
    metrics: [
      { label: "AI substrate", value: "待核验", score: 44 },
      { label: "稼动率", value: "待更新", score: 46 },
      { label: "客户集中", value: "中高", score: 58, inverse: true },
    ],
    risk: { dilution: 10, execution: 42, valuation: 50, export: 12, customer: 58 },
    sentiment: { searchSpike: 2.1, officialCoverage: 18, reportedMultiple: 0.6, socialCrowding: 24 },
  },
  {
    ticker: "VACN",
    symbol: "VACN.SW",
    name: "VAT Group",
    country: "瑞士",
    exchange: "SIX Swiss",
    currency: "CHF",
    industry: "半导体零部件",
    theme: "真空阀 / 晶圆设备供应链",
    stage: "发现池",
    marketCapUsd: "约 130 亿美元",
    revenueUsd: "约 10 亿美元",
    profitUsd: "约 2 亿美元",
    leadMetric: "semi orders / vacuum valve backlog / book-to-bill",
    thesis: "先进制程、存储和半导体设备复苏会拉动真空阀，属于设备链核心零部件。",
    evidence: "有硬件稀缺性，但 AI beta 不够纯，需要确认订单周期和半导体占比。",
    nextCheck: "核验 book-to-bill、semi segment backlog、美元估值和订单拐点。",
    price: 0,
    day: 0,
    month: 0,
    sinceAdded: 0,
    scores: { validation: 48, scarcity: 76, wave: 70, mismatch: 66, time: 56 },
    metrics: [
      { label: "semi backlog", value: "待更新", score: 50 },
      { label: "订单周期", value: "复苏观察", score: 52 },
      { label: "AI 纯度", value: "中", score: 44 },
    ],
    risk: { dilution: 6, execution: 36, valuation: 58, export: 18, customer: 34 },
    sentiment: { searchSpike: 1.7, officialCoverage: 14, reportedMultiple: 0.4, socialCrowding: 20 },
  },
  {
    ticker: "NEX",
    symbol: "NEX.PA",
    name: "Nexans",
    country: "法国",
    exchange: "Euronext Paris",
    currency: "EUR",
    industry: "电力设备",
    theme: "高压电缆 / 电网升级",
    stage: "发现池",
    marketCapUsd: "约 60 亿美元",
    revenueUsd: "约 80 亿美元",
    profitUsd: "约 4 亿美元",
    leadMetric: "HV cable backlog / grid capex / margin",
    thesis: "AI 数据中心、电气化和欧洲电网升级拉动高压电缆需求，供给扩张周期长。",
    evidence: "行业 beta 清楚，但需要核验 backlog、定价和数据中心关联度。",
    nextCheck: "核验高压电缆 backlog、毛利率、美元订单口径和产能瓶颈。",
    price: 0,
    day: 0,
    month: 0,
    sinceAdded: 0,
    scores: { validation: 46, scarcity: 64, wave: 78, mismatch: 76, time: 60 },
    metrics: [
      { label: "HV backlog", value: "待核验", score: 48 },
      { label: "电网 capex", value: "强", score: 72 },
      { label: "AI 关联", value: "待拆分", score: 42 },
    ],
    risk: { dilution: 14, execution: 40, valuation: 44, export: 10, customer: 30 },
    sentiment: { searchSpike: 1.5, officialCoverage: 18, reportedMultiple: 0.4, socialCrowding: 18 },
  },
];

let validationPool = [
  {
    ticker: "BESI",
    symbol: "BESI.AS",
    name: "BE Semiconductor Industries",
    country: "荷兰",
    exchange: "Euronext Amsterdam",
    currency: "EUR",
    industry: "先进封装设备",
    theme: "hybrid bonding",
    stage: "验证池",
    marketCapUsd: "约 120 亿美元",
    revenueUsd: "约 8 亿美元",
    profitUsd: "约 2 亿美元",
    leadMetric: "hybrid bonding orders / AI package adoption / gross margin",
    thesis: "混合键合是先进封装继续提高互连密度的潜在关键设备环节，若 AI 封装加速采用，订单弹性高。",
    evidence: "已有 hybrid bonding 订单线索和客户验证，但还需确认持续订单和收入兑现。",
    nextCheck: "核验 hybrid bonding backlog、客户量产节奏、订单是否连续。",
    price: 148,
    day: 1.2,
    month: 18,
    sinceAdded: 55,
    validation: {
      date: "2026-04-18",
      price: 95,
      trigger: "hybrid bonding 订单线索进入财报和客户验证口径",
    },
    scores: { validation: 72, scarcity: 78, wave: 84, mismatch: 72, time: 54 },
    metrics: [
      { label: "hybrid bonding orders", value: "订单线索", score: 72 },
      { label: "收入兑现", value: "待放量", score: 52 },
      { label: "毛利率", value: "高", score: 76 },
    ],
    risk: { dilution: 8, execution: 54, valuation: 62, export: 12, customer: 48 },
    sentiment: { searchSpike: 3.4, officialCoverage: 32, reportedMultiple: 1.4, socialCrowding: 38 },
  },
  {
    ticker: "COHR",
    symbol: "COHR.US",
    name: "Coherent",
    country: "美国",
    exchange: "NYSE",
    currency: "USD",
    industry: "光子学器件",
    theme: "datacom lasers / SiC",
    stage: "验证池",
    marketCapUsd: "约 150 亿美元",
    revenueUsd: "约 50 亿美元",
    profitUsd: "盈利修复中",
    leadMetric: "AI datacom revenue / transceiver lasers / margin recovery",
    thesis: "AI 光通信拉动 datacom lasers，同时公司还有 SiC 资产选择权，关键是利润率修复和订单质量。",
    evidence: "AI datacom 需求已有收入线索，但公司业务复杂，需要拆分纯度。",
    nextCheck: "核验 AI datacom 收入占比、毛利修复、SiC 资产处置和订单连续性。",
    price: 95,
    day: 2.0,
    month: 34,
    sinceAdded: 92,
    validation: {
      date: "2026-03-12",
      price: 49.5,
      trigger: "AI datacom 需求进入收入和订单讨论",
    },
    scores: { validation: 74, scarcity: 70, wave: 86, mismatch: 72, time: 72 },
    metrics: [
      { label: "AI datacom", value: "收入线索", score: 74 },
      { label: "利润率", value: "修复中", score: 56 },
      { label: "业务复杂度", value: "高", score: 62, inverse: true },
    ],
    risk: { dilution: 18, execution: 52, valuation: 58, export: 18, customer: 44 },
    sentiment: { searchSpike: 4.5, officialCoverage: 36, reportedMultiple: 1.8, socialCrowding: 46 },
  },
  {
    ticker: "PRY",
    symbol: "PRY.MI",
    name: "Prysmian",
    country: "意大利",
    exchange: "Borsa Italiana",
    currency: "EUR",
    industry: "电力设备",
    theme: "高压电缆 / 数据中心电力",
    stage: "验证池",
    marketCapUsd: "约 210 亿美元",
    revenueUsd: "约 170 亿美元",
    profitUsd: "约 10 亿美元",
    leadMetric: "transmission backlog / grid orders / data center power demand",
    thesis: "电网升级、海缆和数据中心电力需求带来长周期订单，高压电缆供给难快速扩。",
    evidence: "backlog 和订单验证较硬，但想象空间更多来自电力 beta 而非单一 AI 纯度。",
    nextCheck: "核验 transmission backlog、订单毛利、产能扩张和美元利润弹性。",
    price: 68,
    day: 0.6,
    month: 22,
    sinceAdded: 70,
    validation: {
      date: "2026-03-28",
      price: 40,
      trigger: "电网和高压电缆 backlog 上修进入可追踪状态",
    },
    scores: { validation: 78, scarcity: 66, wave: 78, mismatch: 78, time: 64 },
    metrics: [
      { label: "transmission backlog", value: "强", score: 78 },
      { label: "收入兑现", value: "稳", score: 66 },
      { label: "AI 纯度", value: "中", score: 48 },
    ],
    risk: { dilution: 10, execution: 34, valuation: 50, export: 8, customer: 28 },
    sentiment: { searchSpike: 2.4, officialCoverage: 26, reportedMultiple: 0.8, socialCrowding: 24 },
  },
];

let stocks = [
  {
    ticker: "AXTI",
    name: "AXT Inc.",
    industry: "化合物半导体材料",
    theme: "InP/GaAs 衬底",
    stage: "backlog 验证",
    price: 103.16,
    day: -10.84,
    month: 30.22,
    sinceAdded: 7064,
    validation: {
      date: "2025-05-14",
      price: 1.44,
      priceDate: "2025-05-14",
      priceProvider: "yahoo_finance",
      priceMethod: "manual_verified_us_equity_close",
      priceStatus: "exact",
      anchorReliable: true,
      gainPct: 7063.89,
      trigger: "InP backlog 与 InP revenue 同时进入可追踪状态",
    },
    marketCap: "约 90 亿美元",
    thesis:
      "InP 衬底处于 800G/1.6T 光模块与 CPO 激光器上游，客户拉货能较快反映到收入与毛利。",
    leadMetric: "InP backlog / InP revenue / 出口许可 / 6-inch InP 扩产",
    scores: { validation: 82, scarcity: 86, wave: 88, mismatch: 84, time: 78 },
    metrics: [
      { label: "InP backlog", value: ">$100M", score: 84 },
      { label: "InP revenue", value: "$13.6M/Q", score: 72 },
      { label: "毛利率", value: "29.6%", score: 68 },
      { label: "出口许可风险", value: "高", score: 36, inverse: true },
    ],
    risk: {
      dilution: 42,
      execution: 45,
      valuation: 78,
      export: 82,
      customer: 38,
    },
    sentiment: { searchSpike: 6.4, officialCoverage: 58, reportedMultiple: 4.2, socialCrowding: 78 },
  },
  {
    ticker: "SIVE",
    name: "Sivers Semiconductors",
    industry: "光子学器件",
    theme: "CPO / ELS 激光器",
    stage: "pipeline 验证",
    price: 68.95,
    day: -1.78,
    month: 81.45,
    sinceAdded: 1342,
    validation: {
      date: "2024-11-12",
      price: 4.78,
      priceDate: "2024-11-12",
      priceProvider: "manual_estimate",
      priceMethod: "validation_date_close_estimate",
      priceStatus: "manual_estimate",
      anchorReliable: true,
      gainPct: 1342.47,
      trigger: "CPO/ELS pipeline 变成资本可追踪的商业机会池",
    },
    marketCap: "约 20B+ SEK",
    thesis:
      "CPO 外部光源与 DFB 激光器的高 beta 标的，资本可追踪 pipeline、Jabil/O-Net/POET 等商业线索。",
    leadMetric: "opportunity pipeline -> backlog -> production order -> photonics revenue",
    scores: { validation: 66, scarcity: 82, wave: 93, mismatch: 88, time: 74 },
    metrics: [
      { label: "pipeline", value: "$799M", score: 78 },
      { label: "pipeline 增速", value: "+77%", score: 82 },
      { label: "收入兑现", value: "早期", score: 42 },
      { label: "现金/融资", value: "偏紧", score: 45, inverse: true },
    ],
    risk: {
      dilution: 62,
      execution: 68,
      valuation: 86,
      export: 22,
      customer: 48,
    },
    sentiment: { searchSpike: 9.2, officialCoverage: 86, reportedMultiple: 16, socialCrowding: 94 },
  },
  {
    ticker: "POET",
    name: "POET Technologies",
    industry: "光子集成平台",
    theme: "Optical Interposer",
    stage: "PO / 商业化前夜",
    price: 12.29,
    day: -7.32,
    month: 72.61,
    sinceAdded: 65,
    validation: {
      date: "2025-10-21",
      price: 7.45,
      priceDate: "2025-10-21",
      priceProvider: "eodhd",
      priceMethod: "first_trading_day_on_or_after_validation_date",
      priceStatus: "exact",
      anchorReliable: true,
      gainPct: 64.97,
      trigger: "Lumilens PO 让平台路线从故事进入订单线索",
    },
    marketCap: "约数十亿美元",
    thesis:
      "平台级光子集成路线，想象空间大于单一组件；Lumilens PO 提供初级商业验证。",
    leadMetric: "purchase order / sampling / design win / 1.6T module revenue",
    scores: { validation: 57, scarcity: 80, wave: 91, mismatch: 76, time: 52 },
    metrics: [
      { label: "初始 PO", value: "$50M", score: 66 },
      { label: "Q1 revenue", value: "$0.5M", score: 22 },
      { label: "现金缓冲", value: "强", score: 76 },
      { label: "量产风险", value: "高", score: 70, inverse: true },
    ],
    risk: {
      dilution: 54,
      execution: 82,
      valuation: 72,
      export: 18,
      customer: 62,
    },
    sentiment: { searchSpike: 5.8, officialCoverage: 48, reportedMultiple: 2.6, socialCrowding: 72 },
  },
  {
    ticker: "VECO",
    name: "Veeco Instruments",
    industry: "半导体设备",
    theme: "InP 激光设备",
    stage: "订单验证",
    price: 57.64,
    day: -2.52,
    month: 15.63,
    sinceAdded: 11,
    validation: {
      date: "2026-04-24",
      price: 51.73,
      priceDate: "2026-04-24",
      priceProvider: "eodhd",
      priceMethod: "first_trading_day_on_or_after_validation_date",
      priceStatus: "exact",
      anchorReliable: true,
      gainPct: 11.42,
      trigger: "InP laser equipment 大订单确认上游设备瓶颈",
    },
    marketCap: "约 35 亿美元",
    thesis:
      "InP 激光器扩产的上游设备铲子股，订单最硬，但收入确认与客户扩产周期较慢。",
    leadMetric: "InP laser equipment orders / shipment schedule / 2027 revenue ramp",
    scores: { validation: 90, scarcity: 78, wave: 84, mismatch: 80, time: 46 },
    metrics: [
      { label: "设备订单", value: ">$250M", score: 92 },
      { label: "交付", value: "2026-2027", score: 54 },
      { label: "客户数量", value: "多客户", score: 76 },
      { label: "收入滞后", value: "明显", score: 66, inverse: true },
    ],
    risk: {
      dilution: 18,
      execution: 44,
      valuation: 42,
      export: 24,
      customer: 34,
    },
    sentiment: { searchSpike: 2.3, officialCoverage: 24, reportedMultiple: 0.8, socialCrowding: 30 },
  },
  {
    ticker: "AAOI",
    name: "Applied Optoelectronics",
    industry: "光模块/光器件",
    theme: "光模块 / 激光",
    stage: "财报验证",
    price: 158.41,
    day: -6.28,
    month: -3.62,
    sinceAdded: 844,
    validation: {
      date: "2025-06-17",
      price: 16.78,
      priceDate: "2025-06-17",
      priceProvider: "eodhd",
      priceMethod: "first_trading_day_on_or_after_validation_date",
      priceStatus: "exact",
      anchorReliable: true,
      gainPct: 844.04,
      trigger: "AI optical revenue 与客户供货线索进入财报验证",
    },
    marketCap: "约百亿美元级",
    thesis:
      "收入验证较硬，激光瓶颈与 AI 光模块需求直接受益；短期最大问题是 ATM 稀释压力。",
    leadMetric: "AI optical revenue / long-term supply agreement / ATM 消化速度",
    scores: { validation: 78, scarcity: 70, wave: 86, mismatch: 76, time: 86 },
    metrics: [
      { label: "收入验证", value: "强", score: 82 },
      { label: "潜在 LTA", value: "待确认", score: 62 },
      { label: "ATM 压力", value: "$600M", score: 82, inverse: true },
      { label: "转收入速度", value: "快", score: 86 },
    ],
    risk: {
      dilution: 86,
      execution: 38,
      valuation: 74,
      export: 12,
      customer: 42,
    },
    sentiment: { searchSpike: 7.4, officialCoverage: 64, reportedMultiple: 5.8, socialCrowding: 82 },
  },
  {
    ticker: "MU",
    name: "Micron Technology",
    industry: "存储芯片",
    theme: "HBM / DRAM",
    stage: "财报爆发",
    price: 971,
    day: 5.14,
    month: 87.76,
    sinceAdded: 582,
    validation: {
      date: "2024-06-26",
      price: 142.36,
      priceDate: "2024-06-26",
      priceProvider: "businessquant_fintel",
      priceMethod: "validation_date_close_estimate",
      priceStatus: "manual_estimate",
      anchorReliable: true,
      gainPct: 582.07,
      trigger: "HBM sold-out、毛利与指引上修形成财报验证",
    },
    marketCap: "约 1T 美元",
    thesis:
      "HBM 与内存供需错配已经反映在财报，但竞争对手明确，剩余赔率低于早期阶段。",
    leadMetric: "HBM sold-out / gross margin / FY EPS 上修 / capex discipline",
    scores: { validation: 94, scarcity: 64, wave: 90, mismatch: 76, time: 92 },
    metrics: [
      { label: "财报验证", value: "极强", score: 94 },
      { label: "竞争格局", value: "三强", score: 54 },
      { label: "毛利率趋势", value: "上行", score: 82 },
      { label: "剩余赔率", value: "收窄", score: 58 },
    ],
    risk: {
      dilution: 8,
      execution: 22,
      valuation: 68,
      export: 28,
      customer: 26,
    },
    sentiment: { searchSpike: 8.1, officialCoverage: 91, reportedMultiple: 10, socialCrowding: 88 },
  },
  {
    ticker: "XFAB",
    name: "X-FAB",
    industry: "特色晶圆代工",
    theme: "SiC/GaN + Photonics",
    stage: "低谷反转",
    price: 10.76,
    day: -5.28,
    month: 71.07,
    sinceAdded: 71,
    validation: {
      date: "2026-04-30",
      price: 6.29,
      priceDate: "2026-04-30",
      priceProvider: "eodhd",
      priceMethod: "first_trading_day_on_or_after_validation_date",
      priceStatus: "exact",
      anchorReliable: true,
      gainPct: 71.07,
      trigger: "WBG 与 photonics 增速开始抵消传统业务拖累",
    },
    marketCap: "约 15 亿美元",
    thesis:
      "传统汽车/工业拖累估值，wide-bandgap 与 microsystems/photonics 是潜在 AI 电力与光子期权。",
    leadMetric: "wide-bandgap revenue / photonics revenue / capacity utilization",
    scores: { validation: 62, scarcity: 68, wave: 72, mismatch: 66, time: 58 },
    metrics: [
      { label: "WBG 增速", value: "+152%", score: 82 },
      { label: "Photonics 增速", value: "+42%", score: 70 },
      { label: "总收入", value: "-4%", score: 42 },
      { label: "AI 纯度", value: "中", score: 52 },
    ],
    risk: {
      dilution: 24,
      execution: 48,
      valuation: 38,
      export: 20,
      customer: 44,
    },
    sentiment: { searchSpike: 3.9, officialCoverage: 34, reportedMultiple: 1.8, socialCrowding: 46 },
  },
  {
    ticker: "CAMT",
    name: "Camtek",
    industry: "先进封装检测",
    theme: "HBM / 先进封装检测",
    stage: "订单验证",
    price: 171.66,
    day: -1.79,
    month: -10.56,
    sinceAdded: 42,
    validation: {
      date: "2025-12-10",
      price: 121.12,
      priceDate: "2025-12-10",
      priceProvider: "eodhd",
      priceMethod: "first_trading_day_on_or_after_validation_date",
      priceStatus: "exact",
      anchorReliable: true,
      gainPct: 41.73,
      trigger: "HBM/advanced packaging 检测订单提供需求验证",
    },
    marketCap: "约 80 亿美元",
    thesis:
      "HBM 与 advanced packaging 检测量测，订单验证强，确定性高，但赔率不如材料小票。",
    leadMetric: "HBM order / AI-related revenue / gross margin",
    scores: { validation: 88, scarcity: 72, wave: 82, mismatch: 70, time: 74 },
    metrics: [
      { label: "HBM 订单", value: "$260M", score: 88 },
      { label: "AI 收入占比", value: "约一半", score: 76 },
      { label: "估值压力", value: "中高", score: 64, inverse: true },
      { label: "收入节奏", value: "中", score: 68 },
    ],
    risk: {
      dilution: 10,
      execution: 30,
      valuation: 66,
      export: 20,
      customer: 36,
    },
    sentiment: { searchSpike: 2.9, officialCoverage: 36, reportedMultiple: 2.2, socialCrowding: 38 },
  },
];

const riskTriggerLibrary = {
  AXTI: [
    {
      level: "red",
      title: "需求证伪",
      monitor: "InP backlog、InP revenue、客户拉货节奏",
      stop: "InP backlog 连续两个季度下降，或收入没有跟随 backlog 转化。",
    },
    {
      level: "red",
      title: "出口许可",
      monitor: "中国出口许可、Tongmei 扩产、6-inch InP 进度",
      stop: "出口许可导致可确认收入延后超过一个季度，且管理层无法给出恢复时间。",
    },
    {
      level: "amber",
      title: "估值透支",
      monitor: "市值 / InP 年化收入 / backlog 覆盖倍数",
      stop: "股价继续创新高，但 backlog 和毛利率没有同步上修。",
    },
  ],
  SIVE: [
    {
      level: "red",
      title: "pipeline 证伪",
      monitor: "opportunity pipeline、backlog、production order",
      stop: "pipeline 两个季度没有转成 backlog / PO，且 photonics revenue 没有抬头。",
    },
    {
      level: "red",
      title: "融资风险",
      monitor: "现金余额、定增、可转债、现金 runway",
      stop: "融资后 runway 仍不足 4 个季度，或新增融资稀释超过 8%。",
    },
    {
      level: "amber",
      title: "热度卖点",
      monitor: "官方媒体报道涨幅倍数、搜索热度、X/Reddit 提及量",
      stop: "媒体集中报道十倍以上涨幅，同时 backlog 没有跟上。",
    },
  ],
  POET: [
    {
      level: "red",
      title: "PO 转化失败",
      monitor: "Lumilens PO、sampling、module revenue",
      stop: "PO 没有转成 shipment/revenue，且新客户 design win 缺席。",
    },
    {
      level: "red",
      title: "平台路线失败",
      monitor: "Optical Interposer 被客户量产采用的证据",
      stop: "主要客户选择传统方案或竞争平台，POET 无法进入量产 BOM。",
    },
  ],
  VECO: [
    {
      level: "red",
      title: "订单交付失败",
      monitor: "InP laser equipment shipment、客户验收、2027 revenue ramp",
      stop: ">$250M 订单交付节奏延后超过两个季度，或客户取消/重谈订单。",
    },
    {
      level: "amber",
      title: "设备周期滞后",
      monitor: "book-to-bill、shipment cadence、客户 capex",
      stop: "订单仍在，但收入确认慢到无法支撑估值扩张。",
    },
  ],
  AAOI: [
    {
      level: "red",
      title: "稀释压制",
      monitor: "ATM 使用量、股本增加、现金流",
      stop: "ATM 持续压制股价，且收入/毛利上修不足以抵消稀释。",
    },
    {
      level: "red",
      title: "需求证伪",
      monitor: "AI optical revenue、LTA、客户集中度",
      stop: "潜在长期供应协议没有落地，或光模块收入环比失速。",
    },
  ],
  MU: [
    {
      level: "red",
      title: "供需拐点",
      monitor: "HBM sold-out、DRAM ASP、库存天数、毛利率",
      stop: "毛利率停止上修，库存回升，同时 HBM 供给紧张叙事松动。",
    },
    {
      level: "amber",
      title: "竞争加剧",
      monitor: "SK Hynix / Samsung HBM4 产能、客户多源采购",
      stop: "竞争对手供给加速释放，MU 的价格/份额无法继续上修。",
    },
  ],
  XFAB: [
    {
      level: "red",
      title: "AI 纯度不足",
      monitor: "wide-bandgap revenue、photonics revenue、汽车/工业拖累",
      stop: "WBG/Photonics 增长不能抵消传统业务下滑，AI 重估逻辑失效。",
    },
  ],
  CAMT: [
    {
      level: "red",
      title: "HBM 订单放缓",
      monitor: "HBM 检测订单、AI revenue 占比、客户 capex",
      stop: "HBM 订单没有延续到新季度，或 AI 收入占比下降。",
    },
  ],
};

const contradictionRiskLibrary = {
  AXTI: "基本面与需求验证强，但需求验证后 1 个月涨幅若低于 1 倍，需优先排查出口许可、客户真实性或估值口径。",
  SIVE: "pipeline 快速增长但股价若不跟，需排查 pipeline 质量、融资压力或客户量产时间表。",
  POET: "有 PO 但股价不跟，需排查 PO 可取消性、量产能力和客户最终 BOM 位置。",
  VECO: "订单已验证但股价不跟，需排查收入确认周期、设备毛利和客户 capex 延后。",
  AAOI: "收入验证强但股价不跟，需排查 ATM 稀释、客户集中和 LTA 是否落地。",
  MU: "财报验证强但股价不跟，需排查 HBM 供给拐点、竞争对手扩产和毛利见顶。",
  XFAB: "WBG/Photonics 高增但股价不跟，需排查 AI 纯度不足或传统业务拖累。",
  CAMT: "HBM 订单强但股价不跟，需排查订单是否一次性、客户 capex 或估值透支。",
};

const portfolioPlan = {
  capital: 100000,
  currency: "U",
  startDate: "2026-06-01",
  targetCashPct: 10,
  pnlSeries: [0, 0, 0, 0, 0, 0],
  rules: [
    "组合不是一次性满仓：首批只按模型仓执行，剩余资金等 20D/50D、RSI、量能和公司验证信号共同触发。",
    "买入优先级：需求验证 = 基本面 > 性价比 > 风险；技术面只负责确认价格节奏，不推翻基本面证伪。",
    "强趋势票只低吸或突破后回踩，不在单日放量长阳时追满目标仓。",
    "任何公司专属红灯触发时，先降到观察仓；若需求被证伪，不用等技术反弹。",
  ],
  positions: [
    {
      ticker: "AXTI",
      role: "InP 上游材料主线",
      targetPct: 16,
      firstPct: 6,
      entryPrice: 103.16,
      status: "等出口许可和回踩确认",
      buyPlan: "首批只接 6%；若价格回踩 20D/50D 后收回 5D，且 InP backlog/收入没有走弱，再加到 10-12%。突破新高必须伴随订单或许可进展。",
      sellPlan: "InP backlog 连续两个季度下滑、出口许可拖延超过一个季度，或热度继续暴涨但毛利/收入不跟，降到观察仓。",
    },
    {
      ticker: "SIVE",
      role: "CPO/ELS 高 beta 回调仓",
      targetPct: 14,
      firstPct: 3,
      entryPrice: 68.95,
      status: "分批低吸，不追反弹",
      buyPlan: "先用 3% 建观察仓；若 RSI 回到 35-45 后止跌，或跌到 20D/50D 支撑附近并收盘站回 5D，再补 3-4%。只有 pipeline 转 backlog/PO 才加到目标仓。",
      sellPlan: "pipeline 两季不转 backlog/PO、融资稀释超过 8%，或媒体集中报道十倍涨幅但收入没有启动，直接降仓。",
    },
    {
      ticker: "VECO",
      role: "订单验证设备铲子",
      targetPct: 16,
      firstPct: 8,
      entryPrice: 57.64,
      status: "首批配置，等回踩加仓",
      buyPlan: "订单较硬，允许首批 8%；后续等 20D 回踩不破、或整理后放量突破前高，再加到 12-16%。设备收入慢，避免因短期财报收入滞后误杀。",
      sellPlan: ">$250M InP 设备订单交付延后两个季度以上，或客户 capex 重新谈判，减到 5% 以下。",
    },
    {
      ticker: "POET",
      role: "平台级光子期权仓",
      targetPct: 10,
      firstPct: 3,
      entryPrice: 12.29,
      status: "小仓等待 PO 转收入",
      buyPlan: "只用 3% 买期权属性；若 PO 转 shipment/revenue，且价格站稳 20D/50D 后放量，再加到 6-8%。没有收入验证前不满仓。",
      sellPlan: "Lumilens PO 没有交付收入，或主客户选择非 Optical Interposer 路线，退出主题仓。",
    },
    {
      ticker: "AAOI",
      role: "光模块收入验证仓",
      targetPct: 7,
      firstPct: 2,
      entryPrice: 158.41,
      status: "等 ATM 压力释放",
      buyPlan: "ATM 压力大，只做 2% 观察；等股价重新站上 20D 且成交量缩到常态，或 LTA/AI optical revenue 上修，再补到 5-7%。",
      sellPlan: "ATM 持续压制且收入/毛利上修不够，或 LTA 没有落地，降低到 0-2%。",
    },
    {
      ticker: "MU",
      role: "HBM 财报验证趋势仓",
      targetPct: 7,
      firstPct: 4,
      entryPrice: 971,
      status: "趋势持有，赔率约束",
      buyPlan: "只在 20D/50D 回踩后低吸，不追财报长阳；若 HBM sold-out 与 FY EPS 继续上修，维持 5-7%。",
      sellPlan: "毛利停止上修、库存回升，或 SK Hynix/Samsung 供给释放导致 HBM 价格预期松动，降到防守仓。",
    },
    {
      ticker: "XFAB",
      role: "低位反转观察仓",
      targetPct: 8,
      firstPct: 3,
      entryPrice: 10.76,
      status: "等放量确认 AI 纯度",
      buyPlan: "3% 低位观察；只有 WBG/Photonics 增速继续抵消传统业务下滑，且价格放量突破底部平台，才加到 6-8%。",
      sellPlan: "AI 纯度无法提升，传统汽车/工业继续拖累，或营收连续两个季度无改善，移出组合。",
    },
    {
      ticker: "CAMT",
      role: "先进封装检测确定性仓",
      targetPct: 12,
      firstPct: 5,
      entryPrice: 171.66,
      status: "等回踩确认",
      buyPlan: "HBM 订单验证强，先 5%；等 20D/50D 回踩不破或新订单继续上修，再补到 9-12%。确定性高但赔率低于材料小票。",
      sellPlan: "HBM 检测订单无法连续，AI revenue 占比下降，或估值扩张但订单不再上修，减到 4% 以下。",
    },
  ],
};

let weights = { ...baseWeights };
let selectedTicker = null;
let sortMode = "score";
let activePool = "watch";
let lastDailyRefresh = "06/01 18:31";
let quoteSource = "embedded-eodhd";
let validationEvents = [];
let decisionLog = [];

const storageKeys = {
  watchlist: "industrial-monitor.watchlist.v1",
  discovery: "industrial-monitor.discovery.v1",
  validation: "industrial-monitor.validation.v1",
  events: "industrial-monitor.events.v1",
  decisions: "industrial-monitor.decisions.v1",
};

const embeddedQuoteFallbacks = [
  {
    ticker: "AXTI",
    price: 103.16,
    dayChangePct: -10.84,
    monthChangePct: 30.22,
    validation: {
      price: 1.44,
      priceDate: "2025-05-14",
      method: "manual_verified_us_equity_close",
      provider: "yahoo_finance",
      status: "exact",
      reliable: true,
      gainPct: 7063.89,
    },
  },
  {
    ticker: "SIVE",
    price: 68.95,
    dayChangePct: -1.78,
    monthChangePct: 81.45,
    validation: {
      price: 4.78,
      priceDate: "2024-11-12",
      method: "validation_date_close_estimate",
      provider: "manual_estimate",
      status: "manual_estimate",
      reliable: true,
      gainPct: 1342.47,
    },
  },
  {
    ticker: "POET",
    price: 12.29,
    dayChangePct: -7.32,
    monthChangePct: 72.61,
    validation: {
      price: 7.45,
      priceDate: "2025-10-21",
      method: "first_trading_day_on_or_after_validation_date",
      provider: "eodhd",
      status: "exact",
      reliable: true,
      gainPct: 64.97,
    },
  },
  {
    ticker: "VECO",
    price: 57.64,
    dayChangePct: -2.52,
    monthChangePct: 15.63,
    validation: {
      price: 51.73,
      priceDate: "2026-04-24",
      method: "first_trading_day_on_or_after_validation_date",
      provider: "eodhd",
      status: "exact",
      reliable: true,
      gainPct: 11.42,
    },
  },
  {
    ticker: "AAOI",
    price: 158.41,
    dayChangePct: -6.28,
    monthChangePct: -3.62,
    validation: {
      price: 16.78,
      priceDate: "2025-06-17",
      method: "first_trading_day_on_or_after_validation_date",
      provider: "eodhd",
      status: "exact",
      reliable: true,
      gainPct: 844.04,
    },
  },
  {
    ticker: "MU",
    price: 971,
    dayChangePct: 5.14,
    monthChangePct: 87.76,
    validation: {
      price: 142.36,
      priceDate: "2024-06-26",
      method: "validation_date_close_estimate",
      provider: "businessquant_fintel",
      status: "manual_estimate",
      reliable: true,
      gainPct: 582.07,
    },
  },
  {
    ticker: "XFAB",
    price: 10.76,
    dayChangePct: -5.28,
    monthChangePct: 71.07,
    validation: {
      price: 6.29,
      priceDate: "2026-04-30",
      method: "first_trading_day_on_or_after_validation_date",
      provider: "eodhd",
      status: "exact",
      reliable: true,
      gainPct: 71.07,
    },
  },
  {
    ticker: "CAMT",
    price: 171.66,
    dayChangePct: -1.79,
    monthChangePct: -10.56,
    validation: {
      price: 121.12,
      priceDate: "2025-12-10",
      method: "first_trading_day_on_or_after_validation_date",
      provider: "eodhd",
      status: "exact",
      reliable: true,
      gainPct: 41.73,
    },
  },
];

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function getStoredJson(key) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

function setStoredJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Local files and privacy modes may block storage; JSON seeds remain the fallback.
  }
}

async function fetchJsonFile(path) {
  try {
    const response = await fetch(path, { cache: "no-store" });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

function payloadItems(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.items)) return payload.items;
  return null;
}

function mergeByTicker(baseItems, storedItems) {
  const merged = [...baseItems];
  for (const item of storedItems || []) {
    const key = item.ticker || item.symbol;
    if (!key) continue;
    const index = merged.findIndex((existing) => (existing.ticker || existing.symbol) === key);
    if (index >= 0) merged[index] = item;
    else merged.push(item);
  }
  return merged;
}

async function loadPersistentData() {
  const [watchlistPayload, discoveryPayload, validationPayload, eventsPayload, decisionsPayload] = await Promise.all([
    fetchJsonFile("./data/watchlist.json"),
    fetchJsonFile("./data/discovery-pool.json"),
    fetchJsonFile("./data/validation-pool.json"),
    fetchJsonFile("./data/events.json"),
    fetchJsonFile("./data/decision-log.json"),
  ]);

  const watchlistItems = payloadItems(watchlistPayload);
  const discoveryItems = payloadItems(discoveryPayload);
  const validationItems = payloadItems(validationPayload);
  const eventItems = payloadItems(eventsPayload);
  const decisionItems = payloadItems(decisionsPayload);

  if (watchlistItems) stocks = watchlistItems;
  if (discoveryItems) discoveryPool = discoveryItems;
  if (validationItems) validationPool = validationItems;
  if (eventItems) validationEvents = eventItems;
  if (decisionItems) decisionLog = decisionItems;

  stocks = mergeByTicker(stocks, getStoredJson(storageKeys.watchlist));
  discoveryPool = mergeByTicker(discoveryPool, getStoredJson(storageKeys.discovery));
  validationPool = mergeByTicker(validationPool, getStoredJson(storageKeys.validation));
  validationEvents = getStoredJson(storageKeys.events) || validationEvents;
  decisionLog = getStoredJson(storageKeys.decisions) || decisionLog;
}

function tierForScore(score, type = "normal") {
  if (type === "risk") {
    if (score >= 80) return { label: "高危", className: "tier-1", width: 100 };
    if (score >= 60) return { label: "危险", className: "tier-2", width: 75 };
    if (score >= 40) return { label: "一般", className: "tier-3", width: 50 };
    return { label: "低风险", className: "tier-4", width: 25 };
  }

  if (type === "emotion") {
    if (score >= 80) return { label: "全民皆知", className: "tier-1", width: 100 };
    if (score >= 60) return { label: "拥挤", className: "tier-2", width: 75 };
    if (score >= 40) return { label: "升温", className: "tier-3", width: 50 };
    return { label: "冷门", className: "tier-4", width: 25 };
  }

  if (type === "value") {
    if (score >= 75) return { label: "主仓", className: "tier-4", width: 100 };
    if (score >= 62) return { label: "跟踪", className: "tier-3", width: 75 };
    if (score >= 48) return { label: "期权", className: "tier-2", width: 50 };
    return { label: "规避", className: "tier-1", width: 25 };
  }

  if (type === "fundamental") {
    if (score >= 78) return { label: "极佳", className: "tier-4", width: 100 };
    if (score >= 62) return { label: "优秀", className: "tier-3", width: 75 };
    if (score >= 46) return { label: "普通", className: "tier-2", width: 50 };
    return { label: "排除", className: "tier-1", width: 25 };
  }

  if (type === "demand") {
    if (score >= 80) return { label: "财报验证", className: "tier-4", width: 100 };
    if (score >= 65) return { label: "订单线索", className: "tier-3", width: 75 };
    if (score >= 50) return { label: "仅叙事", className: "tier-2", width: 50 };
    return { label: "证伪", className: "tier-1", width: 25 };
  }

  if (score >= 75) return { label: "极强", className: "tier-4", width: 100 };
  if (score >= 60) return { label: "强", className: "tier-3", width: 75 };
  if (score >= 45) return { label: "中", className: "tier-2", width: 50 };
  return { label: "弱", className: "tier-1", width: 25 };
}

function metricTier(metric) {
  const score = metric.inverse ? 100 - metric.score : metric.score;
  return tierForScore(score);
}

function factorLevelForWeight(weight) {
  return factorLevels.reduce((best, item) => {
    return Math.abs(item.weight - weight) < Math.abs(best.weight - weight) ? item : best;
  }, factorLevels[0]);
}

function weightedScore(stock) {
  const totalWeight = Object.values(weights).reduce((sum, value) => sum + Number(value), 0);
  const score = factors.reduce((sum, factor) => {
    return sum + stock.scores[factor.key] * Number(weights[factor.key]);
  }, 0);
  return Math.round(score / totalWeight);
}

function fundamentalScore(stock) {
  return Math.round(
    clamp(
      stock.scores.wave * 0.25 +
        stock.scores.mismatch * 0.25 +
        stock.scores.time * 0.22 +
        stock.scores.scarcity * 0.28
    )
  );
}

function demandProbabilityScore(stock) {
  return Math.round(
    clamp(
      stock.scores.validation * 0.25 +
        stock.scores.scarcity * 0.25 +
        stock.scores.wave * 0.2 +
        stock.scores.mismatch * 0.2 +
        stock.scores.time * 0.1
    )
  );
}

function riskScore(stock) {
  const riskValues = Object.values(stock.risk);
  const baseRisk = riskValues.reduce((sum, value) => sum + value, 0) / riskValues.length;
  const heatRisk = sellHeatScore(stock) * 0.25;
  const validationOffset = Math.max(0, 70 - stock.scores.validation) * 0.45;
  return Math.round(clamp(baseRisk * 0.75 + heatRisk + validationOffset));
}

function upsideScore(stock) {
  const extensionPenalty = clamp(validationGain(stock) / 12, 0, 45);
  const validationBoost = stock.scores.validation > 70 ? 8 : 0;
  return Math.round(
    clamp(stock.scores.scarcity * 0.32 + stock.scores.wave * 0.28 + stock.scores.mismatch * 0.25 + validationBoost - extensionPenalty)
  );
}

function timeScore(stock) {
  return Math.round(stock.scores.time);
}

function sellHeatScore(stock) {
  const search = clamp((stock.sentiment.searchSpike / 10) * 100);
  const media = stock.sentiment.officialCoverage;
  const multiple = clamp((stock.sentiment.reportedMultiple / 10) * 100);
  const crowd = stock.sentiment.socialCrowding;
  return Math.round(search * 0.3 + media * 0.3 + multiple * 0.22 + crowd * 0.18);
}

function valueScore(stock) {
  const fundamental = fundamentalScore(stock);
  const demand = demandProbabilityScore(stock);
  const upside = upsideScore(stock);
  const time = timeScore(stock);
  const risk = riskScore(stock);
  return Math.round(clamp(demand * 0.32 + fundamental * 0.32 + upside * 0.18 + time * 0.1 - risk * 0.08));
}

function lightForStock(stock) {
  const risk = riskScore(stock);
  const heat = sellHeatScore(stock);
  const validation = stock.scores.validation;
  const hardRisk =
    stock.risk.dilution >= 85 ||
    stock.risk.export >= 85 ||
    (heat >= 82 && validation < 75) ||
    (stock.sentiment.officialCoverage >= 85 && stock.sentiment.searchSpike >= 7 && validationGain(stock) >= 500);

  if (hardRisk || risk >= 78) return "red";
  if (risk >= 55 || heat >= 70 || validation < 60) return "amber";
  return "green";
}

function actionForStock(stock) {
  const light = lightForStock(stock);
  const risk = riskScore(stock);
  const heat = sellHeatScore(stock);
  const demand = demandProbabilityScore(stock);
  const fundamental = fundamentalScore(stock);
  const value = valueScore(stock);
  const gain = validationGain(stock);
  const tech = technicalStatus(stock);

  if (demand < 50 || (risk >= 85 && demand < 70) || (stock.scores.validation < 55 && risk >= 75)) {
    return {
      label: "清仓",
      className: "action-clear",
      tone: "red",
      reason: "需求或公司专属风险已经破坏 thesis，先退出系统。",
    };
  }

  if (light === "red" || risk >= 65 || heat >= 82 || (gain >= 500 && heat >= 70) || (tech.level === "red" && gain >= 200)) {
    return {
      label: "减仓",
      className: "action-reduce",
      tone: "amber",
      reason: "风险、热度或验证后涨幅已经压过新增赔率。",
    };
  }

  if (demand >= 75 && fundamental >= 70 && value >= 62 && risk < 55 && heat < 75 && tech.level !== "red" && gain < 500) {
    return {
      label: "加仓",
      className: "action-add",
      tone: "green",
      reason: "验证、基本面和赔率仍匹配，技术面没有明显追高。",
    };
  }

  return {
    label: "持仓",
    className: "action-hold",
    tone: "blue",
    reason: "逻辑仍在，但价格、热度或验证节奏不足以主动加仓。",
  };
}

function currentDecisionSnapshot(stock) {
  const action = actionForStock(stock);
  const stats = portfolioStats();
  const fundamental = tierForScore(fundamentalScore(stock), "fundamental");
  const demand = tierForScore(demandProbabilityScore(stock), "demand");
  const risk = tierForScore(riskScore(stock), "risk");
  const emotion = tierForScore(sellHeatScore(stock), "emotion");
  const value = tierForScore(valueScore(stock), "value");
  const tech = technicalStatus(stock);

  return {
    date: portfolioPlan.startDate,
    ticker: stock.ticker,
    action: action.label,
    price: stock.price,
    reason: action.reason,
    source: "model_snapshot",
    fundamentalTier: fundamental.label,
    demandTier: demand.label,
    riskTier: risk.label,
    sentimentTier: emotion.label,
    valueTier: value.label,
    technicalStatus: tech.label,
    validationDate: stock.validation?.date || "",
    validationGain: validationGain(stock),
    portfolioExposure: `${stats.modelExposure}%`,
  };
}

function ensureBaselineDecisionLog() {
  let added = false;
  stocks.forEach((stock) => {
    const id = `baseline-${stock.ticker}-${portfolioPlan.startDate}`;
    const snapshot = currentDecisionSnapshot(stock);
    const baseline = {
      id,
      ...snapshot,
      source: "baseline_snapshot",
      reason: `组合启动基线：${snapshot.reason}`,
    };
    const existingIndex = decisionLog.findIndex((item) => item.id === id);
    if (existingIndex >= 0) {
      decisionLog[existingIndex] = {
        ...decisionLog[existingIndex],
        ...baseline,
        correctedAt: new Date().toISOString(),
        correctionReason: "使用 EODHD 真实当前价与验证日锚定价重算。",
      };
      added = true;
      return;
    }
    decisionLog.push(baseline);
    added = true;
  });

  if (added) setStoredJson(storageKeys.decisions, decisionLog);
}

function actionClassForLabel(label) {
  if (label === "加仓") return "action-add";
  if (label === "减仓") return "action-reduce";
  if (label === "清仓") return "action-clear";
  return "action-hold";
}

function scoreClass(score) {
  return tierForScore(score).className;
}

function formatMove(value) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value}%`;
}

function validationGain(stock) {
  const quotedGain = Number(stock.validation?.gainPct);
  if (Number.isFinite(quotedGain)) return Math.round(quotedGain);

  const anchorPrice = Number(stock.validation?.price);
  const currentPrice = Number(stock.price);
  if (Number.isFinite(anchorPrice) && Number.isFinite(currentPrice) && anchorPrice > 0) {
    return Math.round(((currentPrice / anchorPrice) - 1) * 100);
  }
  return stock.sinceAdded;
}

function validationAnchor(stock) {
  if (!stock.validation) return "验证入池日待补";
  const price = Number.isFinite(Number(stock.validation.price)) ? ` · 锚定价 ${stock.validation.price}` : "";
  const priceDate =
    stock.validation.priceDate && stock.validation.priceDate !== stock.validation.date
      ? ` · 交易日 ${stock.validation.priceDate}`
      : "";
  const provider = stock.validation.priceProvider ? ` · ${stock.validation.priceProvider}` : "";
  const reliability = stock.validation.anchorReliable === false ? " · 锚点不足" : "";
  return `${stock.validation.date}${priceDate}${price}${provider}${reliability}`;
}

function renderLogic(stock) {
  const primaryRisk = (riskTriggerLibrary[stock.ticker] || [])[0];
  const logic = [
    ["核心假设", stock.thesis],
    ["验证入池", `${validationAnchor(stock)} · ${stock.validation?.trigger || "等待明确订单线索、backlog、客户认证或财报验证。"}`],
    ["验证路径", stock.leadMetric],
    ["止损判断", primaryRisk ? `${primaryRisk.title}：${primaryRisk.stop}` : "只要领先指标不能进入收入或订单，股价上涨越多，红灯权重越高。"],
    ["卖出警报", "官方媒体开始集中报道数倍涨幅，且搜索热度暴涨，但财报验证没有同步抬升。"],
  ];

  document.querySelector("#logicStack").innerHTML = logic
    .map(
      ([title, text], index) => `
        <div class="logic-item">
          <div class="logic-index">${index + 1}</div>
          <div>
            <strong>${title}</strong>
            <p>${text}</p>
          </div>
        </div>
      `
    )
    .join("");
}

function renderFactorControls() {
  document.querySelector("#factorControls").innerHTML = factors
    .map(
      (factor) => {
        const activeLevel = factorLevelForWeight(weights[factor.key]);
        return `
        <div class="factor-row">
          <label>
            <span>${factor.label}</span>
            <span class="factor-value" id="value-${factor.key}">${activeLevel.label}</span>
          </label>
          <div class="tier-options" role="group" aria-label="${factor.label}">
            ${factorLevels
              .map(
                (level) => `
                  <button
                    type="button"
                    class="tier-button ${level.level === activeLevel.level ? "active" : ""}"
                    data-factor="${factor.key}"
                    data-weight="${level.weight}"
                    title="${level.help}"
                  >${level.label}</button>
                `
              )
              .join("")}
          </div>
        </div>
      `;
      }
    )
    .join("");

  document.querySelectorAll(".tier-button").forEach((button) => {
    button.addEventListener("click", () => {
      weights[button.dataset.factor] = Number(button.dataset.weight);
      renderFactorControls();
      render();
    });
  });
}

function renderRules() {
  document.querySelector("#hardRules").innerHTML = hardStopRules.map((rule) => `<li>${rule}</li>`).join("");
}

function renderScoreModels() {
  document.querySelector("#scoreModelCards").innerHTML = scoringModels
    .map(
      (model) => `
        <div class="model-card">
          <strong>${model.title}</strong>
          <p>${model.body}</p>
          <span class="formula">${model.formula}</span>
        </div>
      `
    )
    .join("");
}

function renderEntryCriteria() {
  document.querySelector("#entryCriteriaCards").innerHTML = entryCriteria
    .map(
      (criterion) => `
        <div class="model-card">
          <strong>${criterion.title}</strong>
          <p>${criterion.body}</p>
          <span class="formula">${criterion.formula}</span>
        </div>
      `
    )
    .join("");
}

function renderReviewCenter() {
  document.querySelector("#reviewCadenceCards").innerHTML = reviewCadence
    .map(
      (item) => `
        <div class="model-card">
          <strong>${item.title}</strong>
          <p>${item.body}</p>
          <span class="formula">${item.formula}</span>
        </div>
      `
    )
    .join("");

  document.querySelector("#reviewChecklistRows").innerHTML = reviewChecklist
    .map(
      (item) => `
        <tr>
          <td><strong>${item.module}</strong></td>
          <td>${item.cadence}</td>
          <td>${item.focus}</td>
          <td>${item.output}</td>
        </tr>
      `
    )
    .join("");

  document.querySelector("#errorAttributionCards").innerHTML = errorAttributions
    .map(
      (item) => `
        <div class="model-card">
          <strong>${item.title}</strong>
          <p>${item.body}</p>
          <span class="formula">${item.formula}</span>
        </div>
      `
    )
    .join("");

  renderDecisionLog();
}

function renderDecisionLog() {
  const rows = document.querySelector("#decisionLogRows");
  if (!rows) return;

  if (!decisionLog.length) {
    rows.innerHTML = `
      <tr>
        <td colspan="6">暂无决策记录。系统加载数据后会生成组合启动基线，后续每次手动入池都会写入日志。</td>
      </tr>
    `;
    return;
  }

  rows.innerHTML = [...decisionLog]
    .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")))
    .map((item) => {
      const gain = Number.isFinite(Number(item.validationGain)) ? formatMove(Number(item.validationGain)) : "--";
      const price = Number.isFinite(Number(item.price)) ? Number(item.price).toLocaleString("en-US") : "--";
      return `
        <tr>
          <td>${String(item.date || "--").slice(0, 10)}</td>
          <td><strong>${item.ticker || "--"}</strong></td>
          <td><span class="action-chip ${actionClassForLabel(item.action)}">${item.action || "--"}</span></td>
          <td>${price}</td>
          <td>${item.reason || "--"}</td>
          <td>
            <div class="decision-snapshot">
              <strong>${item.demandTier || "--"} · ${item.fundamentalTier || "--"} · ${item.valueTier || "--"}</strong>
              <span>风险 ${item.riskTier || "--"} · 情绪 ${item.sentimentTier || "--"} · 技术 ${item.technicalStatus || "--"}</span>
              <span>入池 ${item.validationDate || "--"} · 验证后 ${gain} · 仓位 ${item.portfolioExposure || "--"}</span>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");
}

function renderPipelineCenter() {
  document.querySelector("#globalScopeCards").innerHTML = globalScope
    .map(
      (item) => `
        <div class="model-card">
          <strong>${item.title}</strong>
          <p>${item.body}</p>
          <span class="formula">${item.formula}</span>
        </div>
      `
    )
    .join("");

  document.querySelector("#usdMetricCards").innerHTML = usdMetricFields
    .map(
      (item) => `
        <div class="model-card">
          <strong>${item.title}</strong>
          <p>${item.body}</p>
          <span class="formula">${item.formula}</span>
        </div>
      `
    )
    .join("");

  document.querySelector("#intakeStageCards").innerHTML = intakeStages
    .map(
      (item, index) => `
        <div class="stage-card">
          <span>${index + 1}</span>
          <strong>${item.title}</strong>
          <p>${item.body}</p>
          <em>${item.formula}</em>
        </div>
      `
    )
    .join("");

  document.querySelector("#weeklyScanRows").innerHTML = weeklyScanSteps
    .map(
      (item) => `
        <tr>
          <td><strong>${item.step}</strong></td>
          <td>${item.input}</td>
          <td>${item.filter}</td>
          <td>${item.output}</td>
        </tr>
      `
    )
    .join("");
}

function sortedStocks() {
  return [...stocks].sort((a, b) => {
    if (sortMode === "fundamental") return fundamentalScore(b) - fundamentalScore(a);
    if (sortMode === "demand") return demandProbabilityScore(b) - demandProbabilityScore(a);
    if (sortMode === "media") return sellHeatScore(b) - sellHeatScore(a);
    if (sortMode === "risk") return riskScore(b) - riskScore(a);
    if (sortMode === "move") return b.month - a.month;
    return valueScore(b) - valueScore(a);
  });
}

function poolCandidates() {
  return activePool === "validation" ? validationPool : discoveryPool;
}

function updatePoolChrome() {
  const titles = {
    watch: "自选股票",
    discovery: "发现池",
    validation: "验证池",
  };

  document.querySelector("#watchTitle").textContent = titles[activePool];
  document.querySelector("#watchPoolCount").textContent = stocks.length;
  document.querySelector("#discoveryPoolCount").textContent = discoveryPool.length;
  document.querySelector("#validationPoolCount").textContent = validationPool.length;

  document.querySelectorAll(".pool-tab").forEach((button) => {
    button.classList.toggle("active", button.dataset.pool === activePool);
  });
}

function renderPoolHead() {
  const headers =
    activePool === "watch"
      ? ["股票", "行业/领域", "核心追踪指标", "价格快照", "验证入池/涨幅", "基本面档", "兑现档", "性价比档", "风险档", "情绪档", "状态"]
      : ["股票", "国家/交易所", "行业/领域", "美元口径", "发现/验证线索", "核心追踪指标", "下一步", "操作"];

  document.querySelector("#poolHeadRow").innerHTML = headers.map((header) => `<th>${header}</th>`).join("");
}

function candidateAlreadyAdded(candidate) {
  return stocks.some((stock) => stock.ticker === candidate.symbol || stock.ticker === candidate.ticker);
}

function candidateToStock(candidate) {
  return {
    ticker: candidate.symbol,
    name: candidate.name,
    industry: candidate.industry,
    theme: candidate.theme,
    stage: candidate.stage,
    price: candidate.price || 0,
    day: candidate.day || 0,
    month: candidate.month || 0,
    sinceAdded: candidate.sinceAdded || 0,
    validation: candidate.validation,
    marketCap: candidate.marketCapUsd,
    thesis: candidate.thesis,
    leadMetric: candidate.leadMetric,
    scores: { ...candidate.scores },
    metrics: candidate.metrics.map((metric) => ({ ...metric })),
    risk: { ...candidate.risk },
    sentiment: { ...candidate.sentiment },
  };
}

function addCandidateToWatchlist(symbol) {
  const candidate = [...discoveryPool, ...validationPool].find((item) => item.symbol === symbol);
  if (!candidate || candidateAlreadyAdded(candidate)) return;
  const stock = candidateToStock(candidate);
  stocks.push(stock);
  setStoredJson(storageKeys.watchlist, stocks);
  const snapshot = currentDecisionSnapshot(stock);
  decisionLog.push({
    id: `manual-add-${symbol}-${new Date().toISOString()}`,
    ...snapshot,
    date: new Date().toISOString(),
    action: "加入自选",
    modelAction: snapshot.action,
    reason: `${candidate.stage} 手动加入自选，模型初始动作为「${snapshot.action}」。`,
    source: "manual_add",
    sourcePool: candidate.stage,
  });
  setStoredJson(storageKeys.decisions, decisionLog);
  activePool = "watch";
  selectedTicker = candidate.symbol;
  renderReviewCenter();
  render();
  openDrawer();
}

function renderCandidateRows() {
  document.querySelector("#watchRows").innerHTML = poolCandidates()
    .map((candidate) => {
      const added = candidateAlreadyAdded(candidate);
      const evidenceLabel = activePool === "validation" ? "验证线索" : "发现线索";
      return `
        <tr class="candidate-row">
          <td>
            <div class="ticker-cell">
              <strong>${candidate.name}</strong>
              <span class="ticker-inline">${candidate.symbol}</span>
            </div>
          </td>
          <td>
            <div class="ticker-cell">
              <span class="theme-tag">${candidate.country}</span>
              <span class="company">${candidate.exchange} · ${candidate.currency}</span>
            </div>
          </td>
          <td>
            <div class="ticker-cell">
              <span class="theme-tag">${candidate.industry}</span>
              <span class="company">${candidate.theme}</span>
            </div>
          </td>
          <td>
            <div class="usd-stack">
              <span>市值 ${candidate.marketCapUsd}</span>
              <span>收入 ${candidate.revenueUsd}</span>
              <span>盈利 ${candidate.profitUsd}</span>
            </div>
          </td>
          <td>
            <div class="candidate-note">
              <strong>${evidenceLabel}</strong>
              <p>${candidate.evidence}</p>
            </div>
          </td>
          <td>
            <span class="lead-text">${candidate.leadMetric}</span>
          </td>
          <td>
            <div class="candidate-note">
              <strong>${candidate.stage}</strong>
              <p>${candidate.nextCheck}</p>
            </div>
          </td>
          <td>
            <button class="add-watch-button" type="button" data-add-symbol="${candidate.symbol}" ${added ? "disabled" : ""}>
              ${added ? "已加入" : "加入自选"}
            </button>
          </td>
        </tr>
      `;
    })
    .join("");

  document.querySelectorAll("[data-add-symbol]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      addCandidateToWatchlist(button.dataset.addSymbol);
    });
  });
}

function renderRows() {
  updatePoolChrome();
  renderPoolHead();

  if (activePool !== "watch") {
    renderCandidateRows();
    return;
  }

  document.querySelector("#watchRows").innerHTML = sortedStocks()
    .map((stock) => {
      const score = valueScore(stock);
      const fundamental = fundamentalScore(stock);
      const demand = demandProbabilityScore(stock);
      const fundamentalTier = tierForScore(fundamental, "fundamental");
      const demandTier = tierForScore(demand, "demand");
      const valueTier = tierForScore(score, "value");
      const riskTier = tierForScore(riskScore(stock), "risk");
      const mediaTier = tierForScore(sellHeatScore(stock), "emotion");
      const action = actionForStock(stock);
      const active = stock.ticker === selectedTicker ? "active" : "";
      const gain = validationGain(stock);
      const gainWarning = demand >= 65 && fundamental >= 62 && gain < 100;
      const anchorReliable = stock.validation?.anchorReliable !== false;
      const anchorLabel = stock.validation?.price
        ? `${anchorReliable ? "锚点" : "代理锚点"} ${stock.validation.price}`
        : "锚点待补";
      return `
        <tr class="${active}" data-ticker="${stock.ticker}">
          <td>
            <div class="ticker-cell">
              <strong>${stock.name}</strong>
              <span class="ticker-inline">${stock.ticker}</span>
            </div>
          </td>
          <td>
            <div class="ticker-cell">
              <span class="theme-tag">${stock.industry}</span>
              <span class="company">${stock.theme}</span>
            </div>
          </td>
          <td>
            <span class="lead-text">${stock.leadMetric}</span>
          </td>
          <td>
            <div class="move-stack">
              <div class="move-line"><span>最新价</span><strong>${stock.price}</strong></div>
              <div class="move-line"><span>月度</span><strong class="${stock.month >= 0 ? "up" : "down"}">${formatMove(stock.month)}</strong></div>
              <div class="mini-bar"><span style="width:${clamp(Math.abs(stock.month))}%"></span></div>
            </div>
          </td>
          <td>
            <div class="gain-cell ${gain >= 500 || gainWarning ? "hot" : ""}">
              <strong>${formatMove(gain)}</strong>
              <span>${stock.validation?.date || "待补日期"}</span>
              <small class="${anchorReliable ? "" : "anchor-warning"}">${anchorLabel}</small>
              <em>${gainWarning ? "反常识" : gain >= 500 ? "警惕拥挤" : "验证入池"}</em>
            </div>
          </td>
          <td>
            <span class="score-pill ${fundamentalTier.className}">${fundamentalTier.label}</span>
          </td>
          <td>
            <span class="score-pill ${demandTier.className}">${demandTier.label}</span>
          </td>
          <td>
            <span class="score-pill ${valueTier.className}">${valueTier.label}</span>
          </td>
          <td>
            <span class="score-pill ${riskTier.className}">${riskTier.label}</span>
          </td>
          <td>
            <span class="score-pill ${mediaTier.className}">${mediaTier.label}</span>
          </td>
          <td>
            <div class="action-cell">
              <span class="action-chip ${action.className}">${action.label}</span>
              <small>${action.reason}</small>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");

  document.querySelectorAll("#watchRows tr").forEach((row) => {
    row.addEventListener("click", () => {
      selectedTicker = row.dataset.ticker;
      render();
      openDrawer();
    });
  });
}

function renderDetails(stock) {
  const light = lightForStock(stock);
  const action = actionForStock(stock);
  document.querySelector("#selectedTickerPill").textContent = stock.ticker;
  const actionPill = document.querySelector("#actionPill");
  actionPill.textContent = action.label;
  actionPill.className = `action-chip ${action.className}`;
  document.querySelector("#detailTicker").textContent = stock.ticker;
  document.querySelector("#detailName").textContent = `${stock.name} · ${stock.stage}`;
  document.querySelector("#actionScore").textContent = action.label;
  document.querySelector("#validationDate").textContent = stock.validation?.date || "--";
  document.querySelector("#validationMove").textContent = formatMove(validationGain(stock));
  document.querySelector("#fundamentalScore").textContent = tierForScore(fundamentalScore(stock), "fundamental").label;
  document.querySelector("#demandScore").textContent = tierForScore(demandProbabilityScore(stock), "demand").label;
  document.querySelector("#mediaScore").textContent = tierForScore(sellHeatScore(stock), "emotion").label;
  document.querySelector("#compositeScore").textContent = tierForScore(valueScore(stock), "value").label;

  const traffic = document.querySelector("#trafficLight");
  traffic.className = `traffic-light ${light}`;

  renderScoreBreakdown(stock);
  renderRiskTriggers(stock);

  document.querySelector("#leadMetrics").innerHTML = stock.metrics
    .map((metric) => {
      const tier = metricTier(metric);
      return `
        <div class="metric-row">
          <span>${metric.label}</span>
          <strong>${metric.value}</strong>
          <div class="bar-track"><span class="${tier.className}" style="width:${tier.width}%"></span></div>
        </div>
      `;
    })
    .join("");

  const sentiment = [
    { label: "搜索热度倍数", value: `${stock.sentiment.searchSpike}x`, score: clamp(stock.sentiment.searchSpike * 10), risk: true },
    { label: "官方媒体覆盖", value: stock.sentiment.officialCoverage, score: stock.sentiment.officialCoverage, risk: true },
    { label: "报道涨幅倍数", value: `${stock.sentiment.reportedMultiple}x`, score: clamp(stock.sentiment.reportedMultiple * 10), risk: true },
    { label: "社交拥挤度", value: stock.sentiment.socialCrowding, score: stock.sentiment.socialCrowding, risk: true },
  ];

  document.querySelector("#sentimentBars").innerHTML = sentiment
    .map((item) => {
      const tier = tierForScore(item.score, "emotion");
      return `
        <div class="metric-row">
          <span>${item.label}</span>
          <strong>${item.value}</strong>
          <div class="bar-track"><span class="${tier.className}" style="width:${tier.width}%"></span></div>
        </div>
      `;
    })
    .join("");

  renderAlerts(stock);
}

function renderScoreBreakdown(stock) {
  const rows = [
    { label: "基本面", value: fundamentalScore(stock), note: "行业 Beta / 错配 / 弹性 / 稀缺价值链", type: "fundamental" },
    { label: "需求兑现", value: demandProbabilityScore(stock), note: "领先指标能否进入财报", type: "demand" },
    { label: "剩余赔率", value: upsideScore(stock), note: "稀缺性和拥挤度后的空间", type: "normal" },
    { label: "媒体热度", value: sellHeatScore(stock), note: "越高越接近全民皆知", type: "emotion" },
    { label: "硬风险", value: riskScore(stock), note: "公司专属证伪逻辑", type: "risk" },
  ];

  document.querySelector("#scoreBreakdown").innerHTML = rows
    .map((row) => {
      const tier = tierForScore(row.value, row.type);
      return `
        <div class="metric-row">
          <span>${row.label} · ${row.note}</span>
          <strong>${tier.label}</strong>
          <div class="bar-track"><span class="${tier.className}" style="width:${tier.width}%"></span></div>
        </div>
      `;
    })
    .join("");
}

function renderRiskTriggers(stock) {
  const triggers = riskTriggerLibrary[stock.ticker] || [];
  document.querySelector("#riskTriggers").innerHTML = triggers
    .map(
      (trigger) => `
        <div class="alert ${trigger.level}">
          <strong>${trigger.title}</strong>
          <div>监控：${trigger.monitor}</div>
          <div>止损：${trigger.stop}</div>
        </div>
      `
    )
    .join("");
}

function colorForScore(score) {
  if (score >= 72) return "green";
  if (score >= 50) return "amber";
  return "red";
}

function inverseColor(score) {
  if (score >= 72) return "red";
  if (score >= 50) return "amber";
  return "green";
}

function riskColor(score) {
  if (score >= 78) return "red";
  if (score >= 55) return "amber";
  return "green";
}

function renderAlerts(stock) {
  const alerts = [];
  const heat = sellHeatScore(stock);
  const risk = riskScore(stock);
  const fundamental = fundamentalScore(stock);
  const demand = demandProbabilityScore(stock);

  if (stock.risk.dilution >= 80) {
    alerts.push(["red", "稀释红线：ATM/融资压力已经足以压制短期赔率。"]);
  }
  if (stock.risk.export >= 75) {
    alerts.push(["red", "出口许可红线：关键材料/产能交付受政策约束。"]);
  }
  if (heat >= 80 && stock.scores.validation < 75) {
    alerts.push(["red", "热度卖点：媒体报道涨幅与搜索热度已领先于财报验证。"]);
  }
  if (validationGain(stock) >= 500 && stock.sentiment.officialCoverage >= 80) {
    alerts.push(["amber", "拥挤警报：官方报道开始替代基本面成为边际买盘来源。"]);
  }
  if (fundamental >= 62 && demand >= 65 && validationGain(stock) < 100) {
    alerts.push(["amber", `反常识警报：基本面与需求验证都达标，但需求验证后 1 个月涨幅低于 1 倍。${contradictionRiskLibrary[stock.ticker] || "需要提高风险等级并排查未知问题。"}`]);
  }
  if (stock.scores.validation >= 80 && risk < 55) {
    alerts.push(["green", "验证优先：领先指标仍能被资本逐季追踪。"]);
  }
  if (!alerts.length) {
    alerts.push(["amber", "等待新数据：下一次财报或订单公告决定信号方向。"]);
  }

  document.querySelector("#alerts").innerHTML = alerts
    .map(([level, text]) => `<div class="alert ${level}">${text}</div>`)
    .join("");
}

function formatCurrency(value) {
  return `${Math.round(value).toLocaleString("en-US")} U`;
}

function formatSignedPct(value, digits = 2) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(digits)}%`;
}

function daysSince(dateString) {
  const start = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(start.getTime())) return 0;
  const today = new Date();
  const elapsed = today.getTime() - start.getTime();
  return Math.max(0, Math.floor(elapsed / 86400000));
}

function stockForTicker(ticker) {
  return stocks.find((stock) => stock.ticker === ticker);
}

function portfolioStats() {
  const positions = portfolioPlan.positions
    .map((position) => ({ ...position, stock: stockForTicker(position.ticker) }))
    .filter((position) => position.stock);

  const targetExposure = positions.reduce((sum, position) => sum + position.targetPct, 0);
  const modelExposure = positions.reduce((sum, position) => sum + position.firstPct, 0);
  const invested = (portfolioPlan.capital * modelExposure) / 100;

  const currentValue = positions.reduce((sum, position) => {
    const entry = Number(position.entryPrice || position.stock.price);
    const price = Number(position.stock.price);
    if (!Number.isFinite(entry) || !Number.isFinite(price) || entry <= 0) {
      return sum + (portfolioPlan.capital * position.firstPct) / 100;
    }
    return sum + ((portfolioPlan.capital * position.firstPct) / 100) * (price / entry);
  }, 0);

  const profit = currentValue - invested;
  const pnlOnCapital = (profit / portfolioPlan.capital) * 100;
  const pnlOnInvested = invested ? (profit / invested) * 100 : 0;

  return {
    positions,
    targetExposure,
    modelExposure,
    targetCash: portfolioPlan.targetCashPct,
    triggerCash: 100 - modelExposure,
    invested,
    currentValue,
    profit,
    pnlOnCapital,
    pnlOnInvested,
  };
}

function sparklinePoints(values) {
  const width = 220;
  const height = 58;
  const padding = 8;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  return values
    .map((value, index) => {
      const x = values.length === 1 ? width / 2 : (index / (values.length - 1)) * width;
      const y = height - padding - ((value - min) / range) * (height - padding * 2);
      return `${Number(x.toFixed(1))},${Number(y.toFixed(1))}`;
    })
    .join(" ");
}

function technicalStatus(stock) {
  const tech = stock.technicals;

  if (tech && Number.isFinite(Number(tech.rsi14))) {
    const rsi = Number(tech.rsi14);
    const dist20 = Number(tech.distanceToSma20Pct);
    const dist50 = Number(tech.distanceToSma50Pct);
    const volumeRatio = Number(tech.volumeRatio20);
    const readable = [
      `RSI ${rsi.toFixed(0)}`,
      Number.isFinite(dist20) ? `距20D ${formatSignedPct(dist20, 1)}` : null,
      Number.isFinite(dist50) ? `距50D ${formatSignedPct(dist50, 1)}` : null,
      Number.isFinite(volumeRatio) ? `量能 ${volumeRatio.toFixed(1)}x` : null,
    ]
      .filter(Boolean)
      .join(" · ");

    if (rsi >= 74 || dist20 >= 18) {
      return { level: "red", label: "追高区", text: `${readable}；只等回踩或基本面上修。` };
    }
    if (rsi >= 35 && rsi <= 48 && dist20 <= 3 && dist50 > -15) {
      return { level: "green", label: "低吸观察", text: `${readable}；等收盘止跌或站回 5D。` };
    }
    if (dist20 >= -4 && dist20 <= 8 && rsi >= 45 && rsi <= 65) {
      return { level: "green", label: "趋势健康", text: `${readable}；回踩不破可加。` };
    }
    if (dist50 < -15 || rsi < 30) {
      return { level: "amber", label: "破位修复", text: `${readable}；先等二次确认，不急着加。` };
    }
    return { level: "amber", label: "等待确认", text: `${readable}；下一根放量方向决定节奏。` };
  }

  if (stock.day <= -3 && stock.month >= 80) {
    return { level: "green", label: "强势回调", text: `日内 ${formatMove(stock.day)}，月度 ${formatMove(stock.month)}；先等止跌，不一次性抄满。` };
  }
  if (stock.month >= 180) {
    return { level: "red", label: "高位延伸", text: `月度 ${formatMove(stock.month)}；只允许小仓或等 20D/50D 回踩。` };
  }
  if (stock.day >= 5 && stock.month >= 50) {
    return { level: "red", label: "放量追涨", text: `日内 ${formatMove(stock.day)}；等回踩或新订单确认。` };
  }
  if (stock.month <= 35) {
    return { level: "amber", label: "低位构筑", text: `月度 ${formatMove(stock.month)}；等放量突破平台再加仓。` };
  }
  return { level: "amber", label: "等待日线", text: "接入 EODHD 日线后自动显示 RSI、20D/50D 和量能比。" };
}

function renderPortfolio() {
  const stats = portfolioStats();
  const pnlText = formatSignedPct(stats.pnlOnCapital);
  const mini = document.querySelector("#openPortfolio");
  const curve = document.querySelector("#portfolioCurve");

  document.querySelector("#portfolioPnl").textContent = pnlText;
  mini.classList.toggle("loss", stats.pnlOnCapital < 0);
  mini.classList.toggle("gain", stats.pnlOnCapital > 0);
  if (curve) {
    curve.setAttribute("points", sparklinePoints([...portfolioPlan.pnlSeries, stats.pnlOnCapital]));
  }
  document.querySelector("#portfolioExposure").textContent = `${stats.modelExposure}%`;
  document.querySelector("#portfolioCash").textContent = `${stocks.length}只`;
  document.querySelector("#portfolioActionMix").textContent = `${daysSince(portfolioPlan.startDate)}d`;

  document.querySelector("#portfolioSubtitle").textContent =
    `从 ${portfolioPlan.startDate} 开始跟踪，当前为首批模型仓，价格按日频更新。`;

  const summary = [
    ["启动资金", formatCurrency(portfolioPlan.capital)],
    ["目标投入", `${stats.targetExposure}% · ${formatCurrency((portfolioPlan.capital * stats.targetExposure) / 100)}`],
    ["当前模型仓", `${stats.modelExposure}% · ${formatCurrency(stats.invested)}`],
    ["待触发现金", `${stats.triggerCash}% · ${formatCurrency((portfolioPlan.capital * stats.triggerCash) / 100)}`],
    ["总资金盈亏", `${pnlText} · ${formatCurrency(stats.profit)}`],
    ["持仓盈亏", formatSignedPct(stats.pnlOnInvested)],
  ];

  document.querySelector("#portfolioSummary").innerHTML = summary
    .map(
      ([label, value]) => `
        <div>
          <span>${label}</span>
          <strong>${value}</strong>
        </div>
      `
    )
    .join("");

  document.querySelector("#portfolioRows").innerHTML = stats.positions
    .map((position) => {
      const stock = position.stock;
      const tech = technicalStatus(stock);
      const action = actionForStock(stock);
      const riskTier = tierForScore(riskScore(stock), "risk");
      const demandTier = tierForScore(demandProbabilityScore(stock), "demand");
      return `
        <tr>
          <td>
            <div class="ticker-cell">
              <strong>${position.ticker}</strong>
              <span class="company">${stock.name}</span>
            </div>
          </td>
          <td>
            <div class="allocation-stack">
              <strong>${position.role}</strong>
              <span class="action-chip ${action.className}">${action.label}</span>
              <span>${demandTier.label} · ${riskTier.label}</span>
              <span>验证 ${stock.validation?.date || "待补"}</span>
            </div>
          </td>
          <td>
            <div class="allocation-stack">
              <strong>${position.targetPct}% · ${formatCurrency((portfolioPlan.capital * position.targetPct) / 100)}</strong>
              <span>目标仓位</span>
            </div>
          </td>
          <td>
            <div class="allocation-stack">
              <strong>${position.firstPct}% · ${formatCurrency((portfolioPlan.capital * position.firstPct) / 100)}</strong>
              <span>${position.status}</span>
            </div>
          </td>
          <td>
            <span class="tech-chip ${tech.level}">${tech.label}</span>
            <p class="plan-text">${position.buyPlan}</p>
            <p class="tech-text">${tech.text}</p>
          </td>
          <td>
            <p class="plan-text">${position.sellPlan}</p>
          </td>
        </tr>
      `;
    })
    .join("");

  document.querySelector("#portfolioRules").innerHTML = portfolioPlan.rules
    .map((rule) => `<div class="alert amber">${rule}</div>`)
    .join("");
}

function renderSummary() {
  const redCount = stocks.filter((stock) => lightForStock(stock) === "red").length;
  const heatCount = stocks.filter((stock) => sellHeatScore(stock) >= 80).length;
  const greenCount = stocks.filter((stock) => lightForStock(stock) === "green").length;
  const global = document.querySelector("#globalSignal");

  document.querySelector("#stockCount").textContent = stocks.length;
  document.querySelector("#redCount").textContent = redCount;
  document.querySelector("#heatCount").textContent = heatCount;
  document.querySelector("#lastRefresh").textContent = `最近更新：${lastDailyRefresh} · ${quoteSource}`;

  if (redCount >= 3) {
    global.textContent = "拥挤";
    global.className = "status-chip red";
  } else if (greenCount >= 4) {
    global.textContent = "可跟踪";
    global.className = "status-chip green";
  } else {
    global.textContent = "分化";
    global.className = "status-chip amber";
  }
}

function openDrawer() {
  const drawer = document.querySelector("#detailDrawer");
  drawer.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");
}

function closeDrawer() {
  const drawer = document.querySelector("#detailDrawer");
  drawer.classList.remove("open");
  drawer.setAttribute("aria-hidden", "true");
}

function openModal(id) {
  const modal = document.querySelector(`#${id}`);
  if (!modal) return;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal(id) {
  const modal = document.querySelector(`#${id}`);
  if (!modal) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

async function loadDailyQuotes() {
  try {
    const response = await fetch("./data/quotes.json", { cache: "no-store" });
    if (!response.ok) {
      applyQuotesToStocks(embeddedQuoteFallbacks);
      quoteSource = "embedded-eodhd";
      render();
      return;
    }
    const payload = await response.json();
    if (!payload || !Array.isArray(payload.quotes)) {
      applyQuotesToStocks(embeddedQuoteFallbacks);
      quoteSource = "embedded-eodhd";
      render();
      return;
    }

    applyQuotesToStocks(payload.quotes);

    if (payload.updatedAt) {
      lastDailyRefresh = new Date(payload.updatedAt).toLocaleString("zh-CN", {
        hour12: false,
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    quoteSource = payload.source || "local";
    render();
  } catch {
    applyQuotesToStocks(embeddedQuoteFallbacks);
    quoteSource = "embedded-eodhd";
    render();
  }
}

function applyQuotesToStocks(quotes) {
  for (const quote of quotes) {
    const stock = stocks.find((item) => item.ticker === quote.ticker);
    if (!stock) continue;
    if (Number.isFinite(Number(quote.price))) stock.price = Number(quote.price);
    if (Number.isFinite(Number(quote.dayChangePct))) stock.day = Number(quote.dayChangePct);
    if (Number.isFinite(Number(quote.monthChangePct))) stock.month = Number(quote.monthChangePct);
    if (Number.isFinite(Number(quote.volume))) stock.volume = Number(quote.volume);
    if (quote.technicals) stock.technicals = quote.technicals;
    if (quote.validation) {
      if (Number.isFinite(Number(quote.validation.gainPct))) {
        stock.sinceAdded = Math.round(Number(quote.validation.gainPct));
      }
      stock.validation = {
        ...(stock.validation || {}),
        price: quote.validation.price,
        priceDate: quote.validation.priceDate,
        priceMethod: quote.validation.method,
        priceProvider: quote.validation.provider,
        priceSourceUrl: quote.validation.sourceUrl,
        priceStatus: quote.validation.status,
        priceGapDays: quote.validation.gapDays,
        anchorReliable: quote.validation.reliable,
        gainPct: quote.validation.gainPct,
        tolerancePct: quote.validation.tolerancePct,
        note: quote.validation.note,
      };
    }
  }
}

function render() {
  renderRows();
  const stock = stocks.find((item) => item.ticker === selectedTicker);
  if (stock) {
    renderLogic(stock);
    renderDetails(stock);
  }
  renderSummary();
  renderPortfolio();
}

document.querySelector("#sortMode").addEventListener("change", (event) => {
  sortMode = event.target.value;
  activePool = "watch";
  renderRows();
});

document.querySelectorAll(".pool-tab").forEach((button) => {
  button.addEventListener("click", () => {
    activePool = button.dataset.pool;
    closeDrawer();
    renderRows();
  });
});

document.querySelector("#resetWeights").addEventListener("click", () => {
  weights = { ...baseWeights };
  renderFactorControls();
  render();
});

document.querySelector("#openFramework").addEventListener("click", () => openModal("frameworkModal"));
document.querySelector("#openSettings").addEventListener("click", () => openModal("settingsModal"));
document.querySelector("#openReview").addEventListener("click", () => openModal("reviewModal"));
document.querySelector("#openPipeline").addEventListener("click", () => openModal("pipelineModal"));
document.querySelector("#openPortfolio").addEventListener("click", () => openModal("portfolioModal"));
document.querySelector("#closeDetail").addEventListener("click", closeDrawer);
document.querySelector("#closeDetailButton").addEventListener("click", closeDrawer);
document.querySelectorAll("[data-close-modal]").forEach((button) => {
  button.addEventListener("click", () => closeModal(button.dataset.closeModal));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeDrawer();
    closeModal("frameworkModal");
    closeModal("settingsModal");
    closeModal("reviewModal");
    closeModal("pipelineModal");
    closeModal("portfolioModal");
  }
});

renderFactorControls();
renderRules();
renderEntryCriteria();
renderScoreModels();
renderReviewCenter();
renderPipelineCenter();
loadPersistentData().then(async () => {
  await loadDailyQuotes();
  ensureBaselineDecisionLog();
  renderReviewCenter();
  render();
});

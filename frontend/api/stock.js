const yf = require("yahoo-finance2").default;

function formatSymbol(symbol) {
    if (symbol.endsWith(".SA")) return symbol;
    if (/^[a-zA-Z0-9]+$/.test(symbol) && /\d$/.test(symbol)) {
        return symbol.toUpperCase() + ".SA";
    }
    return symbol.toUpperCase();
}

function getPeriodRange(period) {
    const now = new Date();
    let start = new Date(now);
    switch (period) {
        case "1mo":
            start.setMonth(now.getMonth() - 1);
            break;
        case "3mo":
            start.setMonth(now.getMonth() - 3);
            break;
        case "6mo":
            start.setMonth(now.getMonth() - 6);
            break;
        case "1y":
            start.setFullYear(now.getFullYear() - 1);
            break;
        default:
            start.setMonth(now.getMonth() - 1);
    }
    return {
        period1: start,
        period2: now
    };
}

module.exports = async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        res.status(200).end();
        return;
    }

    const symbol = req.query.symbol;
    const period = req.query.period || "1mo";

    if (!symbol) {
        res.status(400).json({ error: "Símbolo não informado." });
        return;
    }

    const yfSymbol = formatSymbol(symbol);

    try {
        const { period1, period2 } = getPeriodRange(period);
        const chart = await yf.chart(yfSymbol, { period1, period2, interval: "1d" });
        const hist = chart.quotes || [];

        const adjClose = hist.map(item => item.adjclose ?? item.close);
        const changes = hist.map((item, index) => {
            if (index === 0) return 0;
            const prevClose = hist[index - 1].close;
            return ((item.close - prevClose) / prevClose) * 100;
        });

        const avgVolume = hist.reduce((sum, item) => sum + item.volume, 0) / hist.length;
        const volumeRelativo = hist.map(item => item.volume / avgVolume);

        const vwap = hist.map(item => {
            const priceAvg = (item.high + item.low + item.close) / 3;
            return (priceAvg * item.volume) / item.volume || 0;
        });

        const typicalPrice = hist.map(item => (item.high + item.low + item.close) / 3);

        const ticker = await yf.quoteSummary(yfSymbol, { modules: ["price", "summaryDetail", "summaryProfile"] });

        res.json({
            dates: hist.map(item => item.date * 1000),
            open: hist.map(item => item.open),
            high: hist.map(item => item.high),
            low: hist.map(item => item.low),
            close: hist.map(item => item.close),
            volume: hist.map(item => item.volume),
            adjClose,
            changePercent: changes,
            volumeRelativo,
            vwap,
            typicalPrice,
            info: {
                longName: ticker.price.longName,
                shortName: ticker.price.shortName,
                sector: ticker.summaryProfile?.sector,
                industry: ticker.summaryProfile?.industry,
                marketCap: ticker.price.marketCap,
                currency: ticker.price.currency,
                beta: ticker.summaryDetail?.beta,
                dividendYield: ticker.summaryDetail?.dividendYield,
                dividendRate: ticker.summaryDetail?.dividendRate,
                payoutRatio: ticker.summaryDetail?.payoutRatio,
                previousClose: ticker.summaryDetail?.previousClose,
                forwardPE: ticker.summaryDetail?.forwardPE,
                pegRatio: ticker.summaryDetail?.pegRatio,
                fiftyTwoWeekHigh: ticker.summaryDetail?.fiftyTwoWeekHigh,
                fiftyTwoWeekLow: ticker.summaryDetail?.fiftyTwoWeekLow,
                eps: ticker.defaultKeyStatistics?.trailingEps,
                roe: ticker.financialData?.returnOnEquity,
                profitMargin: ticker.financialData?.profitMargins,
                debtToEquity: ticker.financialData?.debtToEquity,
                freeCashflow: ticker.financialData?.freeCashflow,
                fullTimeEmployees: ticker.summaryProfile?.fullTimeEmployees,
                website: ticker.summaryProfile?.website
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao buscar dados para o ticker." });
    }
};
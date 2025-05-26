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

const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/api/stock/:symbol", async (req, res) => {
    const { symbol } = req.params;
    const period = req.query.period || "1mo";
    const yfSymbol = formatSymbol(symbol);
    try {
        const { period1, period2 } = getPeriodRange(period);
        const chart = await yf.chart(yfSymbol, {
            period1,
            period2,
            interval: "1d"
        });
        const hist = chart.quotes || [];

        const ticker = await yf.quoteSummary(yfSymbol, { modules: ["price", "summaryDetail", "summaryProfile"] });

        res.json({
            dates: hist.map(item => new Date(item.date * 1000).toISOString().slice(0, 10)),
            open: hist.map(item => item.open),
            high: hist.map(item => item.high),
            low: hist.map(item => item.low),
            close: hist.map(item => item.close),
            volume: hist.map(item => item.volume),
            info: {
                longName: ticker.price.longName,
                sector: ticker.summaryProfile?.sector,
                industry: ticker.summaryProfile?.industry,
                marketCap: ticker.price.marketCap,
                beta: ticker.summaryDetail?.beta,
                dividendYield: ticker.summaryDetail?.dividendYield,
                previousClose: ticker.summaryDetail?.previousClose,
                fiftyTwoWeekHigh: ticker.summaryDetail?.fiftyTwoWeekHigh,
                fiftyTwoWeekLow: ticker.summaryDetail?.fiftyTwoWeekLow,
                website: ticker.summaryProfile?.website,
                shortName: ticker.price.shortName,
                currency: ticker.price.currency,
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao buscar dados para o ticker." });
    }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Node backend running at http://localhost:${PORT}`);
});
import React, { useState, useEffect } from "react";
import axios from "axios";
import StockChart from "./components/StockChart";
import CompanyInfo from "./components/CompanyInfo";

const defaultTickers = [
  "AAPL", "MSFT", "GOOGL", "AMZN", "TSLA",
  "PETR4", "VALE3", "ITUB4", "LOGG3", "B3SA3"
];

export default function App() {
  const [ticker, setTicker] = useState(defaultTickers[0]);
  const [period, setPeriod] = useState("1mo");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [loadedTicker, setLoadedTicker] = useState(defaultTickers[0]);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("bg-gray-900", "text-white");
      document.body.classList.remove("bg-white", "text-black");
    } else {
      document.body.classList.add("bg-white", "text-black");
      document.body.classList.remove("bg-gray-900", "text-white");
    }
  }, [darkMode]);

  async function fetchStock(symbol, periodToFetch = period) {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const resp = await axios.get(
        `https://yahoo-finance-five.vercel.app/api/stock?symbol=${symbol}&period=${periodToFetch}`
      );
      setData(resp.data);
      setLoadedTicker(symbol);
    } catch {
      setError("Error fetching data. Check the ticker.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (ticker) fetchStock(defaultTickers[0], period);
  }, [period]);

  const labels = {
      name: "Name",
      sector: "Sector",
      industry: "Industry",
      marketCap: "Market Cap",
      beta: "Beta",
      dividendYield: "Dividend Yield",
      dividendRate: "Dividend Rate",
      payoutRatio: "Payout Ratio",
      previousClose: "Previous Close",
      forwardPE: "Forward P/E",
      pegRatio: "PEG Ratio",
      eps: "EPS (TTM)",
      roe: "ROE",
      profitMargin: "Profit Margin",
      debtToEquity: "Debt/Equity",
      freeCashflow: "Free Cash Flow",
      weekHigh: "52 Week High",
      weekLow: "52 Week Low",
      fullTimeEmployees: "Full-Time Employees",
      website: "Website",
      companyInfo: "Company Information"
  };

  const periodLabels = {
    "1mo": "1 Month",
    "3mo": "3 Months",
    "6mo": "6 Months",
    "1y": "1 Year",
    "5y": "5 Years",
    "max": "All"
  };

  return (
    <div className={`min-h-screen p-6 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      <header className="max-w-5xl mx-auto mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <h1 className="text-3xl font-bold">Actions Panel</h1>
        <button
          className={`px-3 py-1 rounded ${darkMode ? "bg-yellow-400 text-gray-900" : "bg-gray-800 text-white"}`}
          onClick={() => setDarkMode(dm => !dm)}
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </header>

      <div className="max-w-5xl mx-auto mb-4 flex gap-2">
        <input
          type="text"
          className={`px-3 py-2 rounded border w-full ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-black"}`}
          placeholder="Enter the ticker, e.g. AAPL or LOGG3"
          value={ticker}
          onChange={e => setTicker(e.target.value.toUpperCase())}
        />
        <button
          onClick={() => fetchStock(ticker, period)}
          className={`px-4 py-2 rounded font-semibold ${darkMode ? "bg-blue-600 text-white" : "bg-blue-400 text-black"}`}
          disabled={!ticker}
        >
          Search
        </button>
      </div>

      <div className="max-w-5xl mx-auto mb-6 flex gap-2 flex-wrap">
        {defaultTickers.map(item => (
          <button
            key={item}
            className={`px-3 py-1 rounded border ${darkMode ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-gray-100 text-black"}`}
            onClick={() => {
              setTicker(item);
              fetchStock(item, period);
            }}
          >
            {item}
          </button>
        ))}
      </div>

      {loading && <p className="text-center font-semibold my-6">Carregando...</p>}
      {error && <p className="text-center text-red-500 font-semibold my-6">{error}</p>}

      {data && data.info && (
        <CompanyInfo info={data.info} labels={labels} darkMode={darkMode} />
      )}

      {!error && (
        <div className="max-w-5xl mx-auto mb-6 flex gap-2">
          {Object.entries(periodLabels).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setPeriod(key)}
              className={`px-3 py-1 rounded ${
                period === key
                  ? "font-bold border-b-2 border-blue-500"
                  : darkMode
                    ? "bg-gray-800 text-white"
                    : "bg-gray-200 text-black"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {data && (
        <StockChart
          data={data}
          darkMode={darkMode}
          title={`History (${loadedTicker} - ${periodLabels[period] || period})`}
          closeLabel="Closing"
          volumeLabel="Volume"
        />
      )}
    </div>
  );
}
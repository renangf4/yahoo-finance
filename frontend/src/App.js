import React, { useState, useEffect } from "react";
import axios from "axios";
import StockChart from "./components/StockChart";
import CompanyInfo from "./components/CompanyInfo";

const defaultTickers = [
  "AAPL", "MSFT", "GOOGL", "AMZN", "TSLA",
  "PETR4", "VALE3", "ITUB4", "LOGG3", "B3SA3"
];

export default function App() {
  const [ticker, setTicker] = useState("");
  const [period, setPeriod] = useState("1mo");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(true);

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
        `http://localhost:8000/api/stock/${symbol}?period=${periodToFetch}`
      );
      setData(resp.data);
    } catch {
      setError("Erro ao buscar dados. Verifique o ticker.");
    } finally {
      setLoading(false);
    }
  }

  // Atualiza gráfico quando mudar o período e já houver ticker buscado
  useEffect(() => {
    if (ticker) fetchStock(ticker, period);
    // eslint-disable-next-line
  }, [period]);

  // Labels fixos para CompanyInfo
  const labels = {
    name: "Nome",
    sector: "Setor",
    industry: "Indústria",
    marketCap: "Market Cap",
    beta: "Beta",
    dividendYield: "Dividend Yield",
    previousClose: "Fechamento Anterior",
    weekHigh: "Máximo 52 Semanas",
    weekLow: "Mínimo 52 Semanas",
    website: "Site",
    companyInfo: "Informações da Empresa"
  };

  return (
    <div className={`min-h-screen p-6 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      <header className="max-w-5xl mx-auto mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <h1 className="text-3xl font-bold">Painel de Ações</h1>
        <button
          className={`px-3 py-1 rounded ${darkMode ? "bg-yellow-400 text-gray-900" : "bg-gray-800 text-white"}`}
          onClick={() => setDarkMode(dm => !dm)}
        >
          {darkMode ? "Modo Claro" : "Modo Escuro"}
        </button>
      </header>

      <div className="max-w-5xl mx-auto mb-4 flex gap-2">
        <input
          type="text"
          className={`px-3 py-2 rounded border w-full ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-black"}`}
          placeholder="Digite o ticker, ex: AAPL ou LOGG3"
          value={ticker}
          onChange={e => setTicker(e.target.value.toUpperCase())}
        />
        <button
          onClick={() => fetchStock(ticker, period)}
          className={`px-4 py-2 rounded font-semibold ${darkMode ? "bg-blue-600 text-white" : "bg-blue-400 text-black"}`}
          disabled={!ticker}
        >
          Buscar
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

      <div className="max-w-5xl mx-auto mb-6 flex gap-2">
        {[
          { key: "1mo", label: "1 Mês" },
          { key: "3mo", label: "3 Meses" },
          { key: "6mo", label: "6 Meses" },
          { key: "1y", label: "1 Ano" },
          { key: "5y", label: "5 Anos" },
          { key: "max", label: "Tudo" }
        ].map(opt => (
          <button
            key={opt.key}
            onClick={() => setPeriod(opt.key)}
            className={`px-3 py-1 rounded ${period === opt.key
              ? "font-bold border-b-2 border-blue-500"
              : darkMode
                ? "bg-gray-800 text-white"
                : "bg-gray-200 text-black"
              }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {data && (
        <StockChart
          data={data}
          darkMode={darkMode}
          title={`Histórico (${period})`}
          closeLabel="Fechamento"
          volumeLabel="Volume"
        />
      )}
    </div>
  );
}
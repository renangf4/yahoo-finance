import React from "react";

// Função para formatar moeda corretamente
function formatCurrency(value, currency = "BRL") {
    if (value === undefined || value === null) return "—";
    // Para BRL usa pt-BR, para USD/EUR usa en-US, etc
    const locale =
        currency === "BRL" ? "pt-BR"
            : currency === "USD" ? "en-US"
                : currency === "EUR" ? "de-DE"
                    : "en-US";
    return value.toLocaleString(locale, {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
    });
}

export default function CompanyInfo({ info, labels, darkMode }) {
    // Pega a moeda retornada pela API, se não vier assume BRL
    const currency = info.currency || "BRL";
    return (
        <div className={`w-full max-w-5xl mx-auto mb-6 p-4 rounded-lg shadow-lg ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
            <h2 className="text-2xl font-bold mb-4">{labels.companyInfo} - {info.longName || '—'}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className={`p-4 rounded-lg shadow ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                    <span className="font-semibold block mb-1">{labels.name}</span>
                    <span>{info.longName || '—'}</span>
                </div>
                <div className={`p-4 rounded-lg shadow ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                    <span className="font-semibold block mb-1">{labels.sector}</span>
                    <span>{info.sector || '—'}</span>
                </div>
                <div className={`p-4 rounded-lg shadow ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                    <span className="font-semibold block mb-1">{labels.industry}</span>
                    <span>{info.industry || '—'}</span>
                </div>
                <div className={`p-4 rounded-lg shadow ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                    <span className="font-semibold block mb-1">{labels.marketCap}</span>
                    <span>{info.marketCap ? formatCurrency(info.marketCap, currency) : '—'}</span>
                </div>
                <div className={`p-4 rounded-lg shadow ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                    <span className="font-semibold block mb-1">{labels.beta}</span>
                    <span>{info.beta ?? '—'}</span>
                </div>
                <div className={`p-4 rounded-lg shadow ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                    <span className="font-semibold block mb-1">{labels.dividendYield}</span>
                    <span>{info.dividendYield ? (info.dividendYield * 100).toFixed(2) + '%' : '—'}</span>
                </div>
                <div className={`p-4 rounded-lg shadow ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                    <span className="font-semibold block mb-1">{labels.previousClose}</span>
                    <span>{info.previousClose ? formatCurrency(info.previousClose, currency) : '—'}</span>
                </div>
                <div className={`p-4 rounded-lg shadow ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                    <span className="font-semibold block mb-1">{labels.weekHigh}</span>
                    <span>{info.fiftyTwoWeekHigh ? formatCurrency(info.fiftyTwoWeekHigh, currency) : '—'}</span>
                </div>
                <div className={`p-4 rounded-lg shadow ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                    <span className="font-semibold block mb-1">{labels.weekLow}</span>
                    <span>{info.fiftyTwoWeekLow ? formatCurrency(info.fiftyTwoWeekLow, currency) : '—'}</span>
                </div>
                <div className={`p-4 rounded-lg shadow col-span-full ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                    <span className="font-semibold block mb-1">{labels.website}</span>
                    {info.website ? (
                        <a href={info.website} target="_blank" rel="noreferrer" className="text-blue-400 underline break-all">{info.website}</a>
                    ) : '—'}
                </div>
            </div>
        </div>
    );
}
import React from "react";

function formatCurrency(value, currency = "BRL") {
    if (value === undefined || value === null) return "—";
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

function formatNumber(n) {
    if (n === undefined || n === null) return "—";
    return n.toLocaleString();
}

export default function CompanyInfo({ info, labels, darkMode }) {
    const currency = info.currency || "BRL";
    return (
        <div className={`w-full max-w-5xl mx-auto mb-6 p-5 rounded-lg shadow-lg ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
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
                    <span className="font-semibold block mb-1">{labels.dividendRate}</span>
                    <span>{info.dividendRate ?? '—'}</span>
                </div>
                <div className={`p-4 rounded-lg shadow ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                    <span className="font-semibold block mb-1">{labels.payoutRatio}</span>
                    <span>{info.payoutRatio ? (info.payoutRatio * 100).toFixed(2) + '%' : '—'}</span>
                </div>
                <div className={`p-4 rounded-lg shadow ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                    <span className="font-semibold block mb-1">{labels.previousClose}</span>
                    <span>{info.previousClose ? formatCurrency(info.previousClose, currency) : '—'}</span>
                </div>
                <div className={`p-4 rounded-lg shadow ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                    <span className="font-semibold block mb-1">{labels.forwardPE}</span>
                    <span>{info.forwardPE ?? '—'}</span>
                </div>
                <div className={`p-4 rounded-lg shadow ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                    <span className="font-semibold block mb-1">{labels.pegRatio}</span>
                    <span>{info.pegRatio ?? '—'}</span>
                </div>
                <div className={`p-4 rounded-lg shadow ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                    <span className="font-semibold block mb-1">{labels.eps}</span>
                    <span>{info.eps ?? '—'}</span>
                </div>
                <div className={`p-4 rounded-lg shadow ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                    <span className="font-semibold block mb-1">{labels.roe}</span>
                    <span>{info.roe ? (info.roe * 100).toFixed(2) + '%' : '—'}</span>
                </div>
                <div className={`p-4 rounded-lg shadow ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                    <span className="font-semibold block mb-1">{labels.profitMargin}</span>
                    <span>{info.profitMargin ? (info.profitMargin * 100).toFixed(2) + '%' : '—'}</span>
                </div>
                <div className={`p-4 rounded-lg shadow ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                    <span className="font-semibold block mb-1">{labels.debtToEquity}</span>
                    <span>{info.debtToEquity ?? '—'}</span>
                </div>
                <div className={`p-4 rounded-lg shadow ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                    <span className="font-semibold block mb-1">{labels.freeCashflow}</span>
                    <span>{info.freeCashflow ? formatCurrency(info.freeCashflow, currency) : '—'}</span>
                </div>
                <div className={`p-4 rounded-lg shadow ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                    <span className="font-semibold block mb-1">{labels.weekHigh}</span>
                    <span>{info.fiftyTwoWeekHigh ? formatCurrency(info.fiftyTwoWeekHigh, currency) : '—'}</span>
                </div>
                <div className={`p-4 rounded-lg shadow ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                    <span className="font-semibold block mb-1">{labels.weekLow}</span>
                    <span>{info.fiftyTwoWeekLow ? formatCurrency(info.fiftyTwoWeekLow, currency) : '—'}</span>
                </div>
                <div className={`p-4 rounded-lg shadow ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                    <span className="font-semibold block mb-1">{labels.fullTimeEmployees}</span>
                    <span>{info.fullTimeEmployees ? formatNumber(info.fullTimeEmployees) : '—'}</span>
                </div>
                <div className={`p-4 rounded-lg shadow ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                    <span className="font-semibold block mb-1">{labels.website}</span>
                    {info.website ? (
                        <a href={info.website} target="_blank" rel="noreferrer" className="text-blue-400 underline break-all">{info.website}</a>
                    ) : '—'}
                </div>
            </div>
        </div>
    );
}
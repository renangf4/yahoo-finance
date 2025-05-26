import React from "react";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";
import dayjs from "dayjs";

// Função para formatar moeda
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

// Função para formatar volume (sem símbolo de moeda, só separador)
function formatVolume(value) {
    if (value === undefined || value === null) return "—";
    return value.toLocaleString("en-US");
}

export default function StockChart({
    data,
    darkMode,
    title = "Histórico",
    closeLabel = "Fechamento",
    volumeLabel = "Volume"
}) {
    const currency = data?.info?.currency || "BRL";

    // Formata datas para o eixo X
    const chartData = data?.dates?.map((date, i) => ({
        date: dayjs(date).format(data.dates.length > 90 ? "MM/YYYY" : "DD/MM/YYYY"),
        close: data.close[i],
        volume: data.volume[i],
    })) || [];

    // Customiza Tooltip para aplicar máscara de moeda e de volume
    function CustomTooltip({ active, payload, label }) {
        if (active && payload && payload.length) {
            return (
                <div style={{
                    background: darkMode ? "#1f2937" : "#fff",
                    color: darkMode ? "#fff" : "#222",
                    border: "1px solid #ccc",
                    borderRadius: "6px",
                    padding: "12px"
                }}>
                    <div><strong>{label}</strong></div>
                    <div>{closeLabel}: {formatCurrency(payload[0].value, currency)}</div>
                    <div>{volumeLabel}: {formatVolume(payload[1].value)}</div>
                </div>
            );
        }
        return null;
    }

    return (
        <div className={`max-w-5xl mx-auto p-6 rounded shadow ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
            <h2 className="text-xl font-bold mb-4">{title}</h2>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#444" : "#eee"} />
                    <XAxis
                        dataKey="date"
                        stroke={darkMode ? "#fff" : "#222"}
                        minTickGap={20}
                        angle={-45}
                        textAnchor="end"
                        height={70}
                    />
                    <YAxis
                        yAxisId="left"
                        orientation="left"
                        stroke="#8884d8"
                        tickFormatter={val => formatCurrency(val, currency)}
                    />
                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        stroke="#82ca9d"
                        tickFormatter={formatVolume}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="close"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                        name={closeLabel}
                    />
                    <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="volume"
                        stroke="#82ca9d"
                        name={volumeLabel}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
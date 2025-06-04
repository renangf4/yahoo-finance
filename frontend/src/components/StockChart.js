import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import dayjs from "dayjs";

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

function formatVolume(value) {
    if (value === undefined || value === null) return "—";
    return value.toLocaleString("en-US");
}

const metrics = [
    { key: 'close', label: 'Close', color: '#1E88E5', type: 'line', format: formatCurrency },
    { key: 'open', label: 'Open', color: '#FFC107', type: 'line', format: formatCurrency },
    { key: 'low', label: 'Min', color: '#E53935', type: 'line', format: formatCurrency },
    { key: 'high', label: 'Max', color: '#43A047', type: 'line', format: formatCurrency },
    { key: 'adjClose', label: 'Adj Close', color: '#8E24AA', type: 'line', format: formatCurrency },
    { key: 'volume', label: 'Volume', color: '#82ca9d', type: 'column', format: formatVolume },
    { key: 'changePercent', label: '% Change', color: '#F06292', type: 'column', format: v => v.toFixed(2) + '%' },
    { key: 'volumeRelativo', label: 'Vol Rel', color: '#26A69A', type: 'column', format: v => v.toFixed(2) },
    { key: 'vwap', label: 'VWAP', color: '#FF7043', type: 'line', format: formatCurrency }
];

function SingleMetricChart({ data, metric, currency, darkMode, title }) {
    const seriesData = (data?.dates || []).map((timestamp, i) => {
        const t = (typeof timestamp === "number" && timestamp > 1e13)
            ? Math.floor(timestamp / 1000)
            : timestamp;
        const y = data[metric.key]?.[i];
        return (typeof t === "number" && y !== undefined) ? [t, y] : null;
    }).filter(Boolean);

    const options = {
        chart: {
            backgroundColor: darkMode ? "#1f2937" : "#fff",
            style: { color: darkMode ? "#fff" : "#222" },
            height: 350,
        },
        title: {
            text: `${title} - ${metric.label}`,
            style: { color: darkMode ? "#fff" : "#222" }
        },
        xAxis: {
            type: 'datetime',
            labels: { style: { color: darkMode ? "#fff" : "#222" } }
        },
        yAxis: {
            title: { text: metric.label, style: { color: metric.color } },
            labels: {
                formatter: function () {
                    return metric.key === 'volume'
                        ? metric.format(this.value)
                        : metric.format(this.value, currency);
                },
                style: { color: metric.color }
            },
        },
        legend: {
            itemStyle: {
            color: darkMode ? "#fff" : "#333",
            fontWeight: "normal"
            }
        },
        tooltip: {
            backgroundColor: darkMode ? "#1f2937" : "#fff",
            style: { color: darkMode ? "#fff" : "#222" },
            formatter: function () {
                const date = dayjs(this.x).format("DD/MM/YYYY");
                return `
                    <b>${date}</b><br/>
                    ${metric.label}: <b>${
                        metric.key === 'volume'
                            ? metric.format(this.y)
                            : metric.format(this.y, currency)
                    }</b>
                `;
            }
        },
        series: [{
            name: metric.label,
            type: metric.type,
            data: seriesData,
            color: metric.color
        }],
        credits: { enabled: false }
    };
    return (
        <div className={`p-4`}>
            <div className={`rounded shadow ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
                <HighchartsReact highcharts={Highcharts} options={options} />
            </div>
        </div>
    );
}

export default function StockChart({
    data,
    darkMode,
    title = "Histórico"
}) {
    const currency = data?.info?.currency || "BRL";
    if (!data || !data.dates || data.dates.length === 0) {
        return <div>Nenhum dado para mostrar.</div>
    }
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {metrics.map(metric => (
                <SingleMetricChart
                    key={metric.key}
                    data={data}
                    metric={metric}
                    currency={currency}
                    darkMode={darkMode}
                    title={title}
                />
            ))}
        </div>
    );
}
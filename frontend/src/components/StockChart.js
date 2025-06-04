import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import dayjs from "dayjs";

// Para funcionar com datas em timestamp (milissegundos) vindos da API
// Se data.dates já é timestamp, não precisa de parse, só validamos se é número
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
    { key: 'close', label: 'Fechamento', color: '#8884d8', type: 'line', format: formatCurrency },
    { key: 'open', label: 'Abertura', color: '#FF9800', type: 'line', format: formatCurrency },
    { key: 'high', label: 'Máxima', color: '#4CAF50', type: 'line', format: formatCurrency },
    { key: 'low', label: 'Mínima', color: '#F44336', type: 'line', format: formatCurrency },
    { key: 'volume', label: 'Volume', color: '#82ca9d', type: 'column', format: formatVolume },
];

function SingleMetricChart({ data, metric, currency, darkMode, title }) {
    // data.dates já é timestamp em ms
    const seriesData = (data?.dates || []).map((timestamp, i) => {
        const y = data[metric.key]?.[i];
        return (typeof timestamp === "number" && y !== undefined) ? [timestamp, y] : null;
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
    // 1/2 coluna (usando grid: grid-cols-1 md:grid-cols-2)
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
    // grid-cols-1 em mobile, grid-cols-2 (duas colunas) em md+
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
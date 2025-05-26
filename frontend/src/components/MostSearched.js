import React from "react";

export default function MostSearched({ mostSearchedTickers, setTicker, setSuggestions, fetchStock, darkMode, t }) {
    return (
        <section className="max-w-xl mx-auto mt-12 mb-12">
            <h2 className="text-xl font-semibold mb-2">{t.mostSearched}</h2>
            <ul className="flex flex-wrap gap-2">
                {mostSearchedTickers.map(item => (
                    <li
                        key={item}
                        className={`cursor-pointer rounded px-3 py-1 border ${darkMode ? "border-gray-600 hover:bg-blue-600 hover:text-white" : "border-gray-300 hover:bg-blue-400 hover:text-black"}`}
                        onClick={() => {
                            setTicker(item);
                            setSuggestions([]);
                            fetchStock(item);
                        }}
                    >
                        {item}
                    </li>
                ))}
            </ul>
        </section>
    );
}
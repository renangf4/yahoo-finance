import React from "react";

export default function SearchBox({ ticker, setTicker, suggestions, setSuggestions, t, darkMode }) {
    return (
        <div className="max-w-xl mx-auto mb-6 relative">
            <input
                type="text"
                value={ticker}
                onChange={e => setTicker(e.target.value)}
                placeholder={t.searchPlaceholder}
                className={`border rounded px-3 py-2 w-full ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-black border-gray-300"}`}
                autoComplete="off"
                aria-label={t.searchPlaceholder}
            />
            {suggestions.length > 0 && (
                <ul className={`absolute z-10 shadow-md rounded w-full max-h-48 overflow-y-auto ${darkMode ? "bg-gray-700 text-white" : "bg-white text-black"}`}>
                    {suggestions.map(item => (
                        <li
                            key={item}
                            className="px-3 py-1 hover:bg-blue-500 hover:text-white cursor-pointer"
                            onClick={() => {
                                setTicker(item);
                                setSuggestions([]);
                            }}
                        >
                            {item}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
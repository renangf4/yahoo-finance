from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Query
import yfinance as yf

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def format_symbol(symbol: str):
    # Se já terminou com .SA, não faz nada
    if symbol.endswith('.SA'):
        return symbol
    # Se for só letras/números e parece B3, adiciona .SA
    if symbol.isalnum() and symbol[-1].isdigit():
        return symbol.upper() + '.SA'
    return symbol.upper()

@app.get("/api/stock/{symbol}")
async def get_stock(symbol: str, period: str = Query("1mo")):
    yf_symbol = format_symbol(symbol)
    ticker = yf.Ticker(yf_symbol)
    hist = ticker.history(period=period)
    info = ticker.info
    return {
        "dates": hist.index.strftime('%Y-%m-%d').tolist(),
        "open": hist["Open"].tolist(),
        "high": hist["High"].tolist(),
        "low": hist["Low"].tolist(),
        "close": hist["Close"].tolist(),
        "volume": hist["Volume"].tolist(),
        "info": {
            "longName": info.get("longName"),
            "sector": info.get("sector"),
            "industry": info.get("industry"),
            "marketCap": info.get("marketCap"),
            "beta": info.get("beta"),
            "dividendYield": info.get("dividendYield"),
            "previousClose": info.get("previousClose"),
            "fiftyTwoWeekHigh": info.get("fiftyTwoWeekHigh"),
            "fiftyTwoWeekLow": info.get("fiftyTwoWeekLow"),
            "website": info.get("website"),
            "shortName": info.get("shortName"),
            "currency": info.get("currency"),  # <-- Adicione esta linha!
        }
    }
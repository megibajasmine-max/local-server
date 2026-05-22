import sys
import json
import yfinance as yf

def get_stock_data():
    try:
        # Ensure an argument (the ticker symbol) was sent by server.js
        if len(sys.argv) < 2:
            print(json.dumps({"error": "No ticker symbol provided to Python script."}))
            return

        # 1. Catch the ticker symbol (e.g. "AAPL") from the command line array
        ticker_symbol = sys.argv[1].upper()
        
        # 2. Tap into the yfinance engine
        ticker = yf.Ticker(ticker_symbol)
        
        # Fetch the most recent 1-day history bracket
        history = ticker.history(period="1d")
        
        if history.empty:
            print(json.dumps({"error": f"Ticker '{ticker_symbol}' not found or has no recent data."}))
            return

        # 3. Pull out the latest actual closing trade value 
        current_price = history['Close'].iloc[-1]
        currency_code = ticker.info.get('currency', 'USD')
        
        # 4. Wrap everything up into a clean data dictionary
        output_data = {
            "ticker": ticker_symbol,
            "price": round(float(current_price), 2),
            "currency": currency_code
        }
        
        # 5. Output via stdout. This is how server.js intercepts the response payload!
        print(json.dumps(output_data))

    except Exception as e:
        # If anything breaks (network drop, bad asset tracking code), pass it out safely
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    get_stock_data()
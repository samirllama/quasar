import { websocketClient } from "@polygon.io/client-js";

const apiKey = import.meta.env.VITE_POLYGON_API_KEY;

// WebSocket client for live streaming stocks
export const stocksWS = websocketClient(apiKey, 'wss://delayed.polygon.io').stocks();

stocksWS.onmessage = ({ response }: { response: string }) => {
    const [message] = JSON.parse(response);

    stocksWS.send('{"action":"subscribe", "params":"AM.MSFT,A.MSFT"}');

    switch (message.ev) {
        case "AM":
            // your trade message handler
            break;
        case "A":
            // your trade message handler
            break;
    }
};

stocksWS.send({ action: "subscribe", params: "T.MSFT" });


/**
*
* * Usage:

const LiveTicker: React.FC = () => {
    useEffect(() => {
        polygonStocksWS.connect(); // Connect and subscribe

        polygonStocksWS.on("open", () => {
            console.log("WebSocket connected");
            polygonStocksWS.subscribe(["T.AAPL"]); // "T." prefix = trades
        });

        polygonStocksWS.on("message", (message) => {
            console.log("WS message:", message);
            // message is parsed JSON array of events
            // e.g. [{ ev: "T", sym: "AAPL", p: 172.5, s: 100, t: 1670000000 }]
        });

        polygonStocksWS.on("error", (err) => { console.error("WS error:", err) });

        polygonStocksWS.on("close", () => { console.log("WebSocket closed") });

        return () => {
            polygonStocksWS.unsubscribe(["T.AAPL"]);
            polygonStocksWS.disconnect();
        };
    }, []);

    return <h2>Streaming AAPL Trades (check console)</h2>;
};

*/

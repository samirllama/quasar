//src/lib/polygon.ts
import { restClient, websocketClient } from "@polygon.io/client-js";

const apiKey = import.meta.env.VITE_POLYGON_API_KEY as string;


// REST client for historical/aggregated data
export const polygonRest = restClient(apiKey, "https://api.polygon.io");


// WebSocket client for live streaming (stocks, forex, etc.)
export const polygonWS = websocketClient(apiKey);


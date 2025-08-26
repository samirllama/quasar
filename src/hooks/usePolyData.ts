import { useState, useEffect } from 'react';
import { polygonRest } from '../lib/polygon';
import { PolygonWebSocket } from '../lib/poly-websocket';
import type { Candle, Stock, NewsItem, TimeFrame } from '../types';
import { GetStocksAggregatesTimespanEnum } from '@polygon.io/client-js';

const wsClient = new PolygonWebSocket(import.meta.env.VITE_POLYGON_API_KEY);

export function useStockData(symbol: string) {
    const [stock, setStock] = useState<Stock | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchStockData() {
            try {
                setLoading(true);
                const [details, quote] = await Promise.all([
                    polygonRest.getTicker(symbol),
                    polygonRest.getLastStocksQuote(symbol)
                ]);

                const prevClose = await polygonRest.getPreviousStocksAggregates(symbol);

                setStock({
                    symbol,
                    name: details.results?.name || symbol,
                    price: quote.results?.p || 0,
                    change: (quote.results?.p || 0) - (prevClose.results?.[0]?.c || 0),
                    changePercent: ((quote.results?.p || 0) - (prevClose.results?.[0]?.c || 0)) / (prevClose.results?.[0]?.c || 1) * 100,
                    volume: prevClose.results?.[0]?.v || 0,
                    high: prevClose.results?.[0]?.h || 0,
                    low: prevClose.results?.[0]?.l || 0,
                    open: prevClose.results?.[0]?.o || 0,
                    prevClose: prevClose.results?.[0]?.c || 0,
                    marketCap: details.results?.market_cap,
                });
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch stock data');
            } finally {
                setLoading(false);
            }
        }

        fetchStockData();
    }, [symbol]);

    return { stock, loading, error };
}

export function useCandles(symbol: string, timeframe: TimeFrame) {
    const [candles, setCandles] = useState<Candle[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCandles() {
            try {
                setLoading(true);
                const now = new Date();
                const { from, to, timespan, multiplier } = getTimeframeParams(timeframe, now);

                const response = await polygonRest.getStocksAggregates(
                    symbol,
                    multiplier,
                    timespan,
                    from,
                    to
                );

                setCandles(response.results || []);
            } catch (error) {
                console.error('Error fetching candles:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchCandles();
    }, [symbol, timeframe]);

    return { candles, loading };
}

export function useRealtimePrice(symbol: string) {
    const [price, setPrice] = useState<number | null>(null);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        wsClient.connect().then(() => {
            setConnected(true);
            wsClient.subscribe(symbol, (data) => {
                if (data.ev === 'T') {
                    setPrice(data.p);
                }
            });
        });

        return () => {
            wsClient.unsubscribe(symbol);
        };
    }, [symbol]);

    return { price, connected };
}

export function useNews(symbol: string) {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchNews() {
            try {
                setLoading(true);
                const response = await polygonRest.listNews(symbol);
                setNews(response.results || []);
            } catch (error) {
                console.error('Error fetching news:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchNews();
    }, [symbol]);

    return { news, loading };
}

function getTimeframeParams(timeframe: TimeFrame, now: Date) {
    const to = now.toISOString().split('T')[0];
    let from: string;
    let timespan: GetStocksAggregatesTimespanEnum;
    let multiplier = 1;

    switch (timeframe) {
        case '1D':
            from = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            timespan = GetStocksAggregatesTimespanEnum.Minute;
            multiplier = 5;
            break;
        case '1W':
            from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            timespan = GetStocksAggregatesTimespanEnum.Hour;
            break;
        case '1M':
            from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            timespan = GetStocksAggregatesTimespanEnum.Day;
            break;
        case '3M':
            from = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            timespan = GetStocksAggregatesTimespanEnum.Day;
            break;
        case '1Y':
            from = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            timespan = GetStocksAggregatesTimespanEnum.Week;
            break;
        default:
            from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            timespan = GetStocksAggregatesTimespanEnum.Day;
    }

    return { from, to, timespan, multiplier };
}

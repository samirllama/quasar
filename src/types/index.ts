export interface Stock {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    volume: number;
    high: number;
    low: number;
    open: number;
    prevClose: number;
    marketCap?: number;
    pe?: number;
}

export interface Candle {
    t: number; // timestamp
    o: number; // open
    h: number; // high
    l: number; // low
    c: number; // close
    v: number; // volume
    vw?: number; // volume weighted
    n?: number; // number of trades
}

export interface NewsItem {
    id: string;
    publisher: {
        name: string;
        homepage_url?: string;
    };
    title: string;
    author?: string;
    published_utc: string;
    article_url: string;
    tickers: string[];
    description?: string;
}

export interface Aggregate {
    t: number; // timestamp (ms)
    o: number;
    h: number;
    l: number;
    c: number;
    v: number;
}
export interface TechnicalIndicator {
    name: string;
    value: number;
    signal?: 'buy' | 'sell' | 'neutral';
    description?: string;
}

export interface PortfolioItem {
    symbol: string;
    shares: number;
    avgCost: number;
    currentPrice: number;
    value: number;
    gain: number;
    gainPercent: number;
}

export type TimeFrame = '1D' | '1W' | '1M' | '3M' | '1Y';

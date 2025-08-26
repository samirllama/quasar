import type { Candle } from '../types';

export function calculateRSI(candles: Candle[], period: number = 14): number {
    if (candles.length < period + 1) return 50;

    let gains = 0;
    let losses = 0;

    for (let i = 1; i <= period; i++) {
        const change = candles[i].c - candles[i - 1].c;
        if (change > 0) gains += change;
        else losses -= change;
    }

    const avgGain = gains / period;
    const avgLoss = losses / period;

    if (avgLoss === 0) return 100;

    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
}

export function calculateMACD(candles: Candle[]): {
    macd: number;
    signal: number;
    histogram: number;
} {
    const closes = candles.map(c => c.c);
    const ema12 = calculateEMA(closes, 12);
    const ema26 = calculateEMA(closes, 26);
    const macdLine = ema12[ema12.length - 1] - ema26[ema26.length - 1];
    const signal = calculateEMA([macdLine], 9)[0];

    return {
        macd: macdLine,
        signal,
        histogram: macdLine - signal
    };
}

export function calculateSMA(values: number[], period: number): number[] {
    const sma: number[] = [];
    for (let i = period - 1; i < values.length; i++) {
        const sum = values.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
        sma.push(sum / period);
    }
    return sma;
}

export function calculateEMA(values: number[], period: number): number[] {
    const ema: number[] = [];
    const multiplier = 2 / (period + 1);

    // Start with SMA
    const sma = values.slice(0, period).reduce((a, b) => a + b, 0) / period;
    ema.push(sma);

    for (let i = period; i < values.length; i++) {
        const value = (values[i] * multiplier) + (ema[ema.length - 1] * (1 - multiplier));
        ema.push(value);
    }

    return ema;
}

export function calculateBollingerBands(candles: Candle[], period: number = 20): {
    upper: number[];
    middle: number[];
    lower: number[];
} {
    const closes = candles.map(c => c.c);
    const sma = calculateSMA(closes, period);
    const upper: number[] = [];
    const lower: number[] = [];

    for (let i = period - 1; i < closes.length; i++) {
        const slice = closes.slice(i - period + 1, i + 1);
        const mean = sma[i - period + 1];
        const variance = slice.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / period;
        const stdDev = Math.sqrt(variance);

        upper.push(mean + (stdDev * 2));
        lower.push(mean - (stdDev * 2));
    }

    return { upper, middle: sma, lower };
}

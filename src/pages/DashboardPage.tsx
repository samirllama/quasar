// src/components/layout/DashboardGrid.tsx

import React, { useState, useEffect } from "react";
import styles from "./dashboard-grid.module.scss";
import StockTicker from "../features/live-ticker";
import { polygonRest } from "../lib/polygon";
import { GetStocksAggregatesTimespanEnum } from "@polygon.io/client-js";

interface Aggregate {
  t: number; // timestamp (ms)
  o: number; // open
  h: number; // high
  l: number; // low
  c: number; // close
  v: number; // volume
}

const DashboardGrid: React.FC = () => {
  const [bars, setBars] = useState<Aggregate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAggregates() {
      try {
        const res = await polygonRest.getStocksAggregates(
          "AAPL",
          1,
          GetStocksAggregatesTimespanEnum.Day,
          "2025-08-01",
          "2025-08-25"
        );
        setBars(res?.results ?? []);
      } catch (err) {
        console.error("Polygon API error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAggregates();
  }, []);

  return (
    <div className={styles.dashboardGrid}>
      <div className={`${styles.gridItem} ${styles.header}`}>
        <h2>Dashboard Header</h2>
      </div>

      <div className={styles.gridItem}>
        <h2>AAPL Aggregates</h2>
        {loading ? (
          <p>Loading…</p>
        ) : (
          <ul>
            {bars.map((bar) => (
              <li key={bar.t}>
                {new Date(bar.t).toLocaleDateString()} → O:{bar.o} H:{bar.h} L:
                {bar.l} C:{bar.c} V:{bar.v}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className={`${styles.gridItem} ${styles.liveTicker}`}>
        <h2>Stock Ticker</h2>
        <StockTicker updates={updated} />
      </div>
      <div className={`${styles.gridItem} ${styles.mainChart}`}>
        <h2> Candle Charts</h2>
        {/* <CandlestickChart /> */}
      </div>

      <div className={`${styles.gridItem} ${styles.tradePanel}`}>
        <h2> Trade Panel component</h2>
        {/* <TradePanel /> */}
      </div>
    </div>
  );
};

export default DashboardGrid;

const updated = [
  { price: 170, timestamp: Date.now(), symbol: "AAPL" },
  { price: 100, timestamp: 1756071844022, symbol: "GOOG" },
  { price: 300, timestamp: 1756069644022, symbol: "TSLA" },
];

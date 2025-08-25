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
        <h2>Dashboard</h2>
      </div>

      <div className={`${styles.gridItem} ${styles.stocksAggregates}`}>
        <h2 className={styles.itemHeader}>AAPL Aggregates</h2>
        {loading ? (
          <p>Loading…</p>
        ) : (
          <ul className={styles.dataList}>
            {/* Header row */}
            <li className={`${styles.dataListItem} ${styles.dataListHeader}`}>
              <span className={styles.date}>date</span>
              <span className={styles.dataValue}>open</span>
              <span className={styles.dataValue}>high</span>
              <span className={styles.dataValue}>low</span>
              <span className={styles.dataValue}>close</span>
              <span className={styles.dataValue}>volume</span>
            </li>

            {bars.map((bar) => (
              <li key={bar.t} className={styles.dataListItem}>
                <span className={styles.date}>
                  {new Date(bar.t).toLocaleDateString()}
                </span>
                <span className={styles.dataValue}>{bar.o}</span>
                <span className={styles.dataValue}>{bar.h}</span>
                <span className={styles.dataValue}>{bar.l}</span>
                <span className={styles.dataValue}>{bar.c}</span>
                <span className={styles.dataValue}>{bar.v.toFixed(0)}</span>
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
        <h2> Trade Panel </h2>
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

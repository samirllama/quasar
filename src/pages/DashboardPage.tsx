// src/components/layout/DashboardGrid.tsx

import React from "react";
import styles from "./dashboard-grid.module.scss";
import StockTicker from "../features/live-ticker";

const updated = [
  { price: 170, timestamp: Date.now(), symbol: "AAPL" },
  { price: 100, timestamp: 1756071844022, symbol: "GOOG" },
  { price: 300, timestamp: 1756069644022, symbol: "TSLA" },
];

const DashboardGrid: React.FC = () => {
  return (
    <div className={styles.dashboardGrid}>
      <div className={`${styles.gridItem} ${styles.header}`}>
        <h2>Dashboard Header</h2>
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

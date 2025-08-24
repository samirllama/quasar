import React, { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import styles from "./LiveTicker.module.scss";

const MOCK_SYMBOLS = {
  TSLA: { price: 250, timestamp: 1756069144022 },
  AAPL: { price: 150, timestamp: 1756069644022 },
  GOOG: { price: 105, timestamp: 1756070844022 },
};

export const StockTicker = ({ updates }) => {
  const [symbols, setSymbols] = useState(MOCK_SYMBOLS);

  useEffect(() => {
    if (!updates?.length) return;

    setSymbols((prevSyms) => {
      const nextSyms = { ...prevSyms };
      for (const u of updates) {
        const prevEntry = nextSyms[u.symbol];
        nextSyms[u.symbol] = {
          price: u.price,
          timestamp: u.timestamp,
          prevPrice: prevEntry.price,
        };
      }
      return nextSyms;
    });
  }, [updates]);

  const rows = useMemo(() => {
    return Object.entries(symbols)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([symbol, { price, prevPrice, timestamp }]) => {
        const direction =
          prevPrice !== undefined
            ? price > prevPrice
              ? "up"
              : price < prevPrice
              ? "down"
              : "same"
            : "same";
        return { symbol, price, prevPrice, timestamp, direction };
      });
  }, [symbols]);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th className={styles.cell_header}>symbol</th>
            <th className={styles.cell_header}>price</th>
            <th className={styles.cell_header}>updated</th>
          </tr>
        </thead>

        <tbody>
          {rows.map(({ symbol, price, direction, timestamp }) => {
            const priceClasses = clsx(styles.price, {
              [styles.up]: direction === "up",
              [styles.down]: direction === "down",
            });
            return (
              <tr key={symbol}>
                <td className={styles.cell}>{symbol}</td>
                <td className={priceClasses}>{price.toFixed(2)}</td>
                <td className={styles.cell}>{timeAgo(timestamp)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

// Utility: show freshness in "seconds ago"
function timeAgo(timestamp) {
  const delta = Math.floor((Date.now() - timestamp) / 1000);
  if (delta < 1) return "just now";
  if (delta < 60) return `${delta}s ago`;
  const mins = Math.floor(delta / 60);
  return `${mins}m ago`;
}

"use client";
import React, { useEffect, useRef, useState } from "react";
import { createChart, LineSeries } from "lightweight-charts";

export const ranges = {
  // Forex Pairs
  "EUR/USD": { min: 0.95, max: 1.25 },
  "GBP/USD": { min: 1.15, max: 1.45 },
  "USD/JPY": { min: 100, max: 160 },
  "USD/CHF": { min: 0.85, max: 1.10 },
  "AUD/USD": { min: 0.60, max: 0.85 },
  "NZD/USD": { min: 0.55, max: 0.75 },
  "USD/CAD": { min: 1.20, max: 1.45 },

  // Commodities
  "XAU/USD": { min: 1800, max: 2700 },
  "XAG/USD": { min: 18, max: 35 },
  USOIL: { min: 40, max: 120 },
  UKOIL: { min: 45, max: 125 },
  NATGAS: { min: 1.5, max: 10.0 },
  COPPER: { min: 3.0, max: 5.0 },
  WHEAT: { min: 4.0, max: 12.0 },
  CORN: { min: 3.0, max: 8.0 },

  // Cryptos
  "BTC/USD": { min: 15000, max: 100000 },
  "ETH/USD": { min: 1000, max: 5000 },

  // Indices
  US30: { min: 25000, max: 45000 },
  NAS100: { min: 10000, max: 20000 },
  SPX500: { min: 3000, max: 6000 },
  GER30: { min: 10000, max: 20000 },
  FRA40: { min: 4000, max: 8000 },
};

type Props = {
  asset: keyof typeof ranges;
};

export default function RealtimeLineChart({ asset }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const lineSeriesRef = useRef<any>(null);
  const intervalRef = useRef<any>(null);
  const priceLineRef = useRef<any>(null);

  const [currentPrice, setCurrentPrice] = useState<number>(0);

  // --- asset range setup
  const { min, max } = ranges[asset] ?? { min: 1, max: 2 };
  const volatility = 0.01; // tweak per asset type (relative movement)

  let lastTime = Math.floor(Date.now() / 1000);
  let lastValue =
    min + (max - min) * Math.random(); // start somewhere inside range

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      layout: {
        textColor: "white",
        background: { type: "solid", color: "transparent" },
      },
      width: containerRef.current.clientWidth,
      height: 400,
      crosshair: { mode: 1 },
    });

    const lineSeries = chart.addSeries(LineSeries, {
      color: "#26a69a",
      lineWidth: 2,
    });

    chartRef.current = chart;
    lineSeriesRef.current = lineSeries;

    // seed data
    const seedData: any[] = [];
    for (let i = 500; i >= 0; i--) {
      const time = lastTime - i * 60;
      const value = clamp(
        lastValue * (1 + (Math.random() - 0.5) * volatility),
        min,
        max
      );
      seedData.push({ time, value });
      lastValue = value;
    }
    lineSeries.setData(seedData);
    setCurrentPrice(lastValue);

    // add price line
    priceLineRef.current = lineSeries.createPriceLine({
      price: lastValue,
      color: "#ff9800",
      lineWidth: 2,
      lineStyle: 2,
      axisLabelVisible: true,
      title: "Current",
    });

    // realtime updates
    intervalRef.current = setInterval(() => {
      lastTime += 60;
      const changePercent = (Math.random() - 0.5) * volatility * 2;
      let value = lastValue * (1 + changePercent);
      value = clamp(value, min, max);
      lastValue = value;

      const point = { time: lastTime, value };
      lineSeries.update(point);
      setCurrentPrice(value);

      if (priceLineRef.current) {
        lineSeries.removePriceLine(priceLineRef.current);
      }
      priceLineRef.current = lineSeries.createPriceLine({
        price: value,
        color: "#ff9800",
        lineWidth: 2,
        lineStyle: 2,
        axisLabelVisible: true,
        title: "Current",
      });
    }, 1000);

    const handleResize = () => {
      chart.applyOptions({ width: containerRef.current!.clientWidth });
    };
    window.addEventListener("resize", handleResize);

    return () => {
      clearInterval(intervalRef.current);
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [asset]); // rerun when asset changes

  return (
    <div style={{ color: "white", fontFamily: "system-ui, sans-serif" }}>
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 8,
          overflow: "hidden",
        }}
      />

      <div
        style={{
          display: "flex",
          marginTop: 12,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <strong>{asset} Price:</strong>{" "}
          {currentPrice.toFixed(5)}
        </div>
      </div>
    </div>
  );
}

// helper clamp
function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max));
}

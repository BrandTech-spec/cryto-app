"use client";
import React, { useEffect, useRef, useState } from "react";
import { createChart, LineSeries } from "lightweight-charts";
import { useIsMobile } from "@/hooks/use-mobile";
import { useUserContext } from "@/context/AuthProvider";

// === Chart Ranges & Volatility ===
export const ranges = {
  // Forex Pairs
  "EUR/USD": { min: 0.95, max: 1.25, volatility: 0.002 },
  "GBP/USD": { min: 1.15, max: 1.45, volatility: 0.0025 },
  "USD/JPY": { min: 100, max: 160, volatility: 0.0015 },
  "USD/CHF": { min: 0.85, max: 1.10, volatility: 0.002 },
  "AUD/USD": { min: 0.60, max: 0.85, volatility: 0.002 },
  "NZD/USD": { min: 0.55, max: 0.75, volatility: 0.002 },
  "USD/CAD": { min: 1.20, max: 1.45, volatility: 0.002 },

  // Commodities
  "XAU/USD": { min: 1800, max: 2700, volatility: 0.003 },
  "XAG/USD": { min: 18, max: 35, volatility: 0.004 },
  USOIL: { min: 40, max: 120, volatility: 0.005 },
  UKOIL: { min: 45, max: 125, volatility: 0.005 },
  NATGAS: { min: 1.5, max: 10.0, volatility: 0.01 },
  COPPER: { min: 3.0, max: 5.0, volatility: 0.004 },
  WHEAT: { min: 4.0, max: 12.0, volatility: 0.005 },
  CORN: { min: 3.0, max: 8.0, volatility: 0.005 },

  // Cryptos
  "BTC/USD": { min: 15000, max: 100000, volatility: 0.02 },
  "ETH/USD": { min: 1000, max: 5000, volatility: 0.015 },

  // Indices
  US30: { min: 25000, max: 45000, volatility: 0.0015 },
  NAS100: { min: 10000, max: 20000, volatility: 0.002 },
  SPX500: { min: 3000, max: 6000, volatility: 0.0015 },
  GER30: { min: 10000, max: 20000, volatility: 0.0015 },
  FRA40: { min: 4000, max: 8000, volatility: 0.0015 },
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
  const isMobile = useIsMobile();
  const { setTradeData } = useUserContext();

  const { min, max, volatility } = ranges["BTC/USD"] ?? {
    min: 1,
    max: 2,
    volatility: 0.01,
  };

  let lastTime = Math.floor(Date.now() / 1000);
  let lastValue = min + (max - min) * Math.random();

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      layout: {
        textColor: "white",
        background: { type: "solid", color: "transparent" },
      },
      width: containerRef.current.clientWidth,
      height: 400,
      grid: {
        vertLines: { color: "rgba(255, 255, 255, 0.03)", style: 0, visible: true },
        horzLines: { color: "rgba(255, 255, 255, 0.03)", style: 0, visible: true },
      },
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

      const open = lastValue;
      const changePercent = (Math.random() - 0.5) * volatility * 2;
      let close = open * (1 + changePercent);
      close = clamp(close, min, max);
      lastValue = close;

      const point = { time: lastTime, value: close };
      lineSeries.update(point);
      setCurrentPrice(close);

      if (priceLineRef.current) {
        lineSeries.removePriceLine(priceLineRef.current);
      }
      priceLineRef.current = lineSeries.createPriceLine({
        price: close,
        color: "#ff9800",
        lineWidth: 2,
        lineStyle: 2,
        axisLabelVisible: true,
        title: "Current",
      });

      setTradeData({
        open_price: open,
        close_price: close,
        price_changes: close - open,
        percentage_changes: ((close - open) / open) * 100,
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
  }, [asset]);

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
    </div>
  );
}

// helper
function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max));
}

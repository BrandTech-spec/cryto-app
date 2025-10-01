"use client";
import React, { useEffect, useRef, useState } from "react";
import { AreaSeries, createChart, LineSeries } from "lightweight-charts";
import { useIsMobile } from "@/hooks/use-mobile";
import { useUserContext } from "@/context/AuthProvider";

// === Chart Ranges ===
export const ranges = {
  "EUR/USD": { min: 0.95, max: 1.25 },
  "GBP/USD": { min: 1.15, max: 1.45 },
  "USD/JPY": { min: 100, max: 160 },
  "USD/CHF": { min: 0.85, max: 1.10 },
  "AUD/USD": { min: 0.6, max: 0.85 },
  "NZD/USD": { min: 0.55, max: 0.75 },
  "USD/CAD": { min: 1.2, max: 1.45 },
  "XAU/USD": { min: 1800, max: 2700 },
  "XAG/USD": { min: 18, max: 35 },
  USOIL: { min: 40, max: 120 },
  UKOIL: { min: 45, max: 125 },
  NATGAS: { min: 1.5, max: 10.0 },
  COPPER: { min: 3.0, max: 5.0 },
  WHEAT: { min: 4.0, max: 12.0 },
  CORN: { min: 3.0, max: 8.0 },
  "BTC/USD": { min: 15000, max: 100000 },
  "ETH/USD": { min: 1000, max: 5000 },
  US30: { min: 25000, max: 45000 },
  NAS100: { min: 10000, max: 20000 },
  SPX500: { min: 3000, max: 6000 },
  GER30: { min: 10000, max: 20000 },
  FRA40: { min: 4000, max: 8000 },
};

type Props = {
  asset: keyof typeof ranges;
};

export default function RealtimeLineAreaChart({ asset }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const lineSeriesRef = useRef<any>(null);
  const areaSeriesRef = useRef<any>(null);
  const intervalRef = useRef<any>(null);

  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const { min, max } = ranges[asset] ?? { min: 1, max: 2 };
  const isMobile = useIsMobile();
  const { setTradeData } = useUserContext();

  useEffect(() => {
    if (!containerRef.current) return;

    let lastValue = randomInRange(min, max);

    const chart = createChart(containerRef.current, {
      layout: {
        textColor: "white",
        background: { type: "solid", color: "transparent" },
      },
      width: containerRef.current.clientWidth,
      height:400,
      grid: {
        vertLines: { color: "rgba(255,255,255,0.05)", visible: true },
        horzLines: { color: "rgba(255,255,255,0.05)", visible: true },
      },
    });

    const lineSeries = chart.addSeries(LineSeries, {
      color: "#26a69a",
      lineWidth: 2,
    });

    const areaSeries = chart.addSeries(AreaSeries, {
      topColor: "rgba(38,166,154,0.4)",
      bottomColor: "rgba(38,166,154,0)",
      lineColor: "#26a69a",
      lineWidth: 2,
    });

    chartRef.current = chart;
    lineSeriesRef.current = lineSeries;
    areaSeriesRef.current = areaSeries;

    chart.applyOptions({
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        tickMarkFormatter: (time: number) => {
          const date = new Date(time * 1000); // UNIX → Date
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          const hours = String(date.getHours()).padStart(2, "0");
          const minutes = String(date.getMinutes()).padStart(2, "0");
          return `${month}/${day} ${hours}:${minutes}`;
        },
      },
    });

    // === Seed initial history ===
    const seedData: any[] = [];
    const now = Math.floor(Date.now() / 1000);
    for (let i = 500; i >= 0; i--) {
      const time = now - i * 60; // 1-min intervals
      lastValue = clamp(
        lastValue * (1 + (Math.random() - 0.5) * 0.01),
        min,
        max
      );
      seedData.push({ time, value: lastValue });
    }

    lineSeries.setData(seedData);
    areaSeries.setData(seedData);
    setCurrentPrice(lastValue);

    // === Realtime updates ===
    intervalRef.current = setInterval(() => {
      const time = Math.floor(Date.now() / 1000);
      const open = lastValue;

      const close = clamp(
        open * (1 + (Math.random() - 0.5) * 0.01 * 2),
        min,
        max
      );
      lastValue = close;

      const point = { time, value: close };
      lineSeries.update(point);
      areaSeries.update(point);

      setTradeData({
        open_price: open,
        close_price: close,
        price_changes: close - open,
        percentage_changes: ((close - open) / open) * 100,
      });

      setCurrentPrice(close);
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

// === Helpers ===
function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max));
}
function randomInRange(min: number, max: number) {
  return min + Math.random() * (max - min);
}

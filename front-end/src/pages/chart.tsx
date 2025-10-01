"use client";
import React, { useEffect, useRef, useState } from "react";
import { CandlestickSeries, createChart } from "lightweight-charts";
import { useUserContext } from "@/context/AuthProvider";
import { useIsMobile } from "@/hooks/use-mobile";
import { ranges } from "@/constants";

// --- Synthetic Data Generator ---
function generateData(
  currency: keyof typeof ranges,
  numberOfCandles = 500,
  updatesPerCandle = 5,
  startAt = 100
) {
  const { min, max } = ranges[currency];
  const step = (max - min) / 500; // avg drift size

  const createCandle = (val: number, time: number) => ({
    time,
    open: val,
    high: val,
    low: val,
    close: val,
  });

  const updateCandle = (candle: any, val: number) => ({
    time: candle.time,
    close: val,
    open: candle.open,
    low: Math.min(candle.low, val),
    high: Math.max(candle.high, val),
  });

  const numberOfPoints = numberOfCandles * updatesPerCandle;
  const initialData: any[] = [];
  const realtimeUpdates: any[] = [];

  let previousValue = min + Math.random() * (max - min);
  let lastCandle: any;

  // start from "now"
  const now = Math.floor(Date.now() / 1000);

  for (let i = 0; i < numberOfPoints; ++i) {
    // time increments by 1 min per candle
    const time = now - numberOfPoints/2 * 60 + i * 60;

    // simulate drift
    let value = previousValue + (Math.random() - 0.5) * step * 10;
    value = Math.min(max, Math.max(min, value));
    previousValue = value;

    if (i % updatesPerCandle === 0) {
      const candle = createCandle(value, time);
      lastCandle = candle;
      if (i >= startAt) realtimeUpdates.push(candle);
    } else {
      const newCandle = updateCandle(lastCandle, value);
      lastCandle = newCandle;
      if (i >= startAt) {
        realtimeUpdates.push(newCandle);
      } else if ((i + 1) % updatesPerCandle === 0) {
        initialData.push(newCandle);
      }
    }
  }

  return { initialData, realtimeUpdates };
}

// generator helper
function* getNextRealtimeUpdate(realtimeData: any[]) {
  for (const d of realtimeData) yield d;
  return null;
}

// --- React component ---
export default function RealtimeChartWiderCandles({asset}:{asset:string}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<any>(null);
  const seriesRef = useRef<any>(null);
  const intervalRef = useRef<any>(null);

  const [openPrice, setOpenPrice] = useState<number | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [priceChange, setPriceChange] = useState<number>(0);
  const [priceChangePercent, setPriceChangePercent] = useState<number>(0);
  const [barSpacing, setBarSpacing] = useState(12);

  const isMobile = useIsMobile();
  const { setTradeData } = useUserContext();

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
        vertLines: { color: "rgba(255,255,255,0.03)", visible: true },
        horzLines: { color: "rgba(255,255,255,0.03)", visible: true },
      },
    });

    const series = chart.addSeries(CandlestickSeries, {
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderVisible: false,
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
    });

    chartRef.current = chart;
    seriesRef.current = series;

    chart.timeScale().applyOptions({
      barSpacing,
      rightOffset: 5,
    });

    const data = generateData(asset, 2500, 20, 1000);
    series.setData(data.initialData);

    chart.timeScale().fitContent();
    chart.timeScale().scrollToPosition(5);

    const realtimeGenerator = getNextRealtimeUpdate(data.realtimeUpdates);

    intervalRef.current = setInterval(() => {
      const next = realtimeGenerator.next();
      if (next.done) {
        clearInterval(intervalRef.current);
        return;
      }
      const candle = next.value;
      series.update(candle);

      setOpenPrice(candle.open);
      setCurrentPrice(candle.close);
      setPriceChange(candle.close - candle.open);
      setPriceChangePercent(((candle.close - candle.open) / candle.open) * 100);

      setTradeData({
        open_price: candle.open,
        close_price: candle.close,
        price_changes: candle.close - candle.open,
        percentage_changes:
          ((candle.close - candle.open) / candle.open) * 100,
      });
    }, 1000);

    const onResize = () => {
      chart.applyOptions({ width: containerRef.current!.clientWidth });
    };
    window.addEventListener("resize", onResize);

    return () => {
      clearInterval(intervalRef.current);
      window.removeEventListener("resize", onResize);
      chart.remove();
    };
  }, []);

  useEffect(() => {
    if (!chartRef.current) return;
    chartRef.current.timeScale().applyOptions({ barSpacing });
    chartRef.current.timeScale().scrollToPosition(5);
  }, [barSpacing]);

  return (
    <div
      className="relative"
      style={{ color: "white", fontFamily: "system-ui, sans-serif" }}
    >
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

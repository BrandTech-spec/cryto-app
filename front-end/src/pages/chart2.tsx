"use client";
import React, { useEffect, useRef, useState } from "react";
import { AreaSeries, createChart, LineSeries } from "lightweight-charts";

export default function RealtimeLineAreaChart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const lineSeriesRef = useRef<any>(null);
  const areaSeriesRef = useRef<any>(null);
  const intervalRef = useRef<any>(null);

  const [currentPrice, setCurrentPrice] = useState<number>(1.1); // start for EUR/USD
  const [chartType, setChartType] = useState<"line" | "area">("line");

  // --- random walk config
  let lastTime = Math.floor(Date.now() / 1000);
  let lastValue = 1.1; // EUR/USD-ish
  const volatility = 0.002; // 0.2% movement per step (forex scale)

  // create chart
  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      layout: {
        textColor: "white",
        background: { type: "solid", color: "#1e1e1e" },
      },
      width: containerRef.current.clientWidth,
      height: 600,
    });
   
    // create both line and area series
    const lineSeries = chart.addSeries(LineSeries, { color: "#26a69a", lineWidth: 2 })

    const areaSeries = chart.addSeries(AreaSeries, {
        topColor: "rgba(38, 166, 154, 0.4)",
        bottomColor: "rgba(38, 166, 154, 0)",
        lineColor: "#26a69a",
        lineWidth: 2,
      });

    chartRef.current = chart;
    lineSeriesRef.current = lineSeries;
    areaSeriesRef.current = areaSeries;

    // seed with some initial history
    const seedData: any[] = [];
    for (let i = 5000; i >= 0; i--) {
      const time = lastTime - i * 60;
      const value =
        lastValue * (1 + (Math.random() - 0.5) * volatility * 20);
      seedData.push({ time, value });
      lastValue = value;
    }
    lineSeries.setData(seedData);
    areaSeries.setData(seedData);

    // start realtime updates
    intervalRef.current = setInterval(() => {
      lastTime += 60; // +1 minute
      const changePercent = (Math.random() - 0.5) * volatility * 2;
      const value = lastValue * (1 + changePercent);
      lastValue = value;

      const point = { time: lastTime, value };
      lineSeries.update(point);
      areaSeries.update(point);
      setCurrentPrice(value);
    }, 1000); // 1 update per second

    const handleResize = () => {
      chart.applyOptions({ width: containerRef.current!.clientWidth });
    };
    window.addEventListener("resize", handleResize);

    return () => {
      clearInterval(intervalRef.current);
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, []);

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
          <strong>Current Price:</strong>{" "}
          {currentPrice.toFixed(5)} {/* 5 decimals for forex */}
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button
            style={buttonStyle}
            onClick={() => setChartType("line")}
          >
            Line
          </button>
          <button
            style={buttonStyle}
            onClick={() => setChartType("area")}
          >
            Area
          </button>
        </div>
      </div>
    </div>
  );
}

const buttonStyle: React.CSSProperties = {
  padding: "6px 12px",
  borderRadius: 6,
  cursor: "pointer",
  background: "rgba(40,44,52,1)",
  color: "white",
  border: "none",
};

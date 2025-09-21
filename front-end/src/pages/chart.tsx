import React, { useEffect, useRef, useState } from "react";
import { CandlestickSeries, createChart } from "lightweight-charts";
import { Button } from "@/components/ui/button";
import { Activity, BarChart3, CandlestickChart, TrendingDown, TrendingUp, Volume2 } from "lucide-react";
import { useCreateHistory, useCreateNotification, useCreateTransaction, useGetLastHistory, useLastTransaction } from "@/lib/query/api";
import { Transaction } from "@/lib/appwrite/appWriteConfig";
import { useUserContext } from "@/context/AuthProvider";

// --- Synthetic Data Generator ---
let randomFactor = 25 + Math.random() * 25;
const samplePoint = (i: number) =>
  i *
    (0.5 +
      Math.sin(i / 1) * 0.2 +
      Math.sin(i / 2) * 0.4 +
      Math.sin(i / randomFactor) * 0.8 +
      Math.sin(i / 50) * 0.5) +
  200 +
  i * 2;

function generateData(
  numberOfCandles = 500,
  updatesPerCandle = 5,
  startAt = 100
) {
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

  randomFactor = 25 + Math.random() * 25;
  const date = new Date(Date.UTC(2018, 0, 1, 12, 0, 0, 0));
  const numberOfPoints = numberOfCandles * updatesPerCandle;
  const initialData: any[] = [];
  const realtimeUpdates: any[] = [];
  let lastCandle: any;
  let previousValue = samplePoint(-1);

  for (let i = 0; i < numberOfPoints; ++i) {
    if (i % updatesPerCandle === 0) {
      date.setUTCDate(date.getUTCDate() + 1);
    }
    const time = date.getTime() / 1000;
    let value = samplePoint(i);
    const diff = (value - previousValue) * Math.random();
    value = previousValue + diff;
    previousValue = value;

    if (i % updatesPerCandle === 0) {
      const candle = createCandle(value, time);
      lastCandle = candle;
      if (i >= startAt) {
        realtimeUpdates.push(candle);
      }
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

const {user} = useUserContext()
//----Get initial Timer-----
const {data:last_hist, isPending:isFinding} = useGetLastHistory(user?.user_id)
const {mutateAsync:createHistory, isPending:isCreating} = useCreateHistory()
const {data:transaction} = useLastTransaction(user?.user_id)

const history = async() =>{
    const  payload = {
        
    }
    try {
        await createHistory(payload)
        
    } catch (error) {
        console.log(error);
        
    }
}
 const calculateTransactionCountdown = async(transaction: Transaction | null) => {
  console.log("Transaction input:", transaction);

  if (!transaction || !transaction?.$createdAt || !transaction?.time) {
    console.warn("❌ Missing data:", {
      hasTransaction: !!transaction,
      createdAt: transaction?.$createdAt,
      time: transaction?.time,
    });
    return null;
  }

  const createdAt = new Date(transaction.$createdAt);
  const durationInSeconds = transaction.time;
  const expirationTime = new Date(createdAt.getTime() + (durationInSeconds * 1000));
  const currentTime = new Date();

  // Check if the transaction has expired
 if (currentTime >= expirationTime) {
    if (last_hist.trade_id === transaction.$id) {
       return { isExpired: true, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0, formatted: "00:00:00" };
    }else{
        await history()
    }
}


  // Calculate remaining time in milliseconds
  const remainingMs = expirationTime.getTime() - currentTime.getTime();
  
  // Convert to hours, minutes, seconds
  const hours = Math.floor(remainingMs / (1000 * 60 * 60));
  const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);

  return {
    hours,
    minutes,
    seconds,
    totalSeconds: Math.floor(remainingMs / 1000),
    formatted: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
    isExpired: false,
  };
};

const [countdown, setCountdown] = React.useState(() => calculateTransactionCountdown(transaction));


React.useEffect(() => {
  if (!transaction || !transaction?.$createdAt || !transaction?.time) {
    setCountdown(null);
    return;
  }

  // Update countdown immediately
  setCountdown(calculateTransactionCountdown(transaction));

  // Set up interval to update every second
  const interval = setInterval(() => {
    const newCountdown = calculateTransactionCountdown(transaction);
    setCountdown(newCountdown);
    
    // Clear interval if transaction has expired
    if (!newCountdown) {
      clearInterval(interval);
    }
  }, 1000);

  return () => clearInterval(interval);
}, [transaction?.$id, transaction?.$createdAt, transaction?.time]);

// --- React component ---
export default function RealtimeChartWiderCandles() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<any>(null);
  const seriesRef = useRef<any>(null);
  const intervalRef = useRef<any>(null);

  const [barSpacing, setBarSpacing] = useState(12);

  // price states
  const [openPrice, setOpenPrice] = useState<number | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [priceChange, setPriceChange] = useState<number>(0);
  const [priceChangePercent, setPriceChangePercent] = useState<number>(0);
  const [chartType, setChartType] = useState<'candlestick' | 'line' | 'area'>('candlestick');

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      layout: {
        textColor: "white",
        background: { type: "solid", color: "#1e1e1e" },
      },
      width: containerRef.current.clientWidth,
      height: 610,
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

    const data = generateData(2500, 20, 1000);
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

      // update prices from last candle
      setOpenPrice(candle.open);
      setCurrentPrice(candle.close);
      setPriceChange(candle.close - candle.open);
      setPriceChangePercent(((candle.close - candle.open) / candle.open) * 100);
    }, 500);

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
    <div className="relative" style={{ color: "white", fontFamily: "system-ui, sans-serif" }}>
        {/* Chart Header */}
      <div className="flex absolute top-0 z-50  items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-bold text-foreground">Intel OTC</h2>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-mono font-bold text-foreground">
              ${currentPrice?.toFixed(2)}
            </span>
           
          </div>
        </div>

        {/* Chart Controls 
        <div className="flex items-center space-x-2">
          <Button 
            variant={chartType === 'candlestick' ? 'trading' : 'ghost'} 
            size="sm"
            onClick={() => setChartType('candlestick')}
          >
            <CandlestickChart className="w-4 h-4" />
          </Button>
          <Button 
            variant={chartType === 'line' ? 'trading' : 'ghost'} 
            size="sm"
            onClick={() => setChartType('line')}
          >
            <Activity className="w-4 h-4" />
          </Button>
          <Button 
            variant={chartType === 'area' ? 'trading' : 'ghost'} 
            size="sm"
            onClick={() => setChartType('area')}
          >
            <BarChart3 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Volume2 className="w-4 h-4" />
          </Button>
        </div>*/}
      </div>
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 8,
          overflow: "hidden",
        }}
      />
      <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
        <div>
          <strong>Open Price:</strong> {openPrice?.toFixed(2)}
        </div>
        <div>
          <strong>Current Price:</strong> {currentPrice?.toFixed(2)}
        </div>
        <div>
          <strong>Change:</strong>{" "}
          {priceChange.toFixed(2)} ({priceChangePercent.toFixed(2)}%)
        </div>
        <div style={{ marginLeft: "auto" }}>
          <label style={{ fontSize: 13, marginBottom: 6 }}>
            Candle width: <strong>{barSpacing}px</strong>
          </label>
          <input
            type="range"
            min={4}
            max={40}
            value={barSpacing}
            onChange={(e) => setBarSpacing(Number(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
}

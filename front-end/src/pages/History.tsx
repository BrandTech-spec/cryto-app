import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface Position {
  id: string;
  pair: string;
  type: "buy" | "sell";
  volume: number;
  openPrice: number;
  currentPrice: number;
  profit: number;
}

const mockPositions: Position[] = [
  {
    id: "1",
    pair: "EURUSD",
    type: "buy",
    volume: 500.00,
    openPrice: 0.96823,
    currentPrice: 0.96891,
    profit: 34000.00
  },
  {
    id: "2",
    pair: "EURUSD",
    type: "buy",
    volume: 500.00,
    openPrice: 0.96823,
    currentPrice: 0.96891,
    profit: 34000.00
  },
  {
    id: "3",
    pair: "EURUSD",
    type: "buy",
    volume: 500.00,
    openPrice: 0.96823,
    currentPrice: 0.96891,
    profit: 34000.00
  },
  {
    id: "4",
    pair: "EURUSD",
    type: "buy",
    volume: 500.00,
    openPrice: 0.96823,
    currentPrice: 0.96891,
    profit: 34000.00
  },
  {
    id: "5",
    pair: "EURUSD",
    type: "buy",
    volume: 500.00,
    openPrice: 0.96820,
    currentPrice: 0.96891,
    profit: 35500.00
  },
  {
    id: "6",
    pair: "EURUSD",
    type: "buy",
    volume: 500.00,
    openPrice: 0.96824,
    currentPrice: 0.96891,
    profit: 33500.00
  },
  {
    id: "7",
    pair: "EURUSD",
    type: "buy",
    volume: 500.00,
    openPrice: 0.96823,
    currentPrice: 0.96891,
    profit: 34000.00
  },
  {
    id: "8",
    pair: "EURUSD",
    type: "buy",
    volume: 500.00,
    openPrice: 0.96825,
    currentPrice: 0.96891,
    profit: 33500.00
  },
  {
    id: "9",
    pair: "EURUSD",
    type: "buy",
    volume: 500.00,
    openPrice: 0.96832,
    currentPrice: 0.96891,
    profit: 29500.00
  }
];

const accountData = {
  balance: 5000000.00,
  equity: 5322500.00,
  margin: 4841325.00,
  freeMargin: 481175.00,
  marginLevel: 109.94
};

const History = () => {
  const [activeTab, setActiveTab] = useState("positions");

  return (
    <div className="min-h-screen bg-background">
      {/* Balance Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold">322 500.00 USD</div>
          </div>
          <Button size="icon" variant="ghost" className="text-white hover:bg-white/20">
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Account Summary */}
      <div className="bg-black text-white px-4 py-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-300">Balance:</span>
            <span className="text-white font-medium">{accountData.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Equity:</span>
            <span className="text-white font-medium">{accountData.equity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Margin:</span>
            <span className="text-white font-medium">{accountData.margin.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Free margin:</span>
            <span className="text-white font-medium">{accountData.freeMargin.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Margin level (%):</span>
            <span className="text-white font-medium">{accountData.marginLevel}</span>
          </div>
        </div>
      </div>

      {/* Positions Section */}
      <div className="bg-black text-white px-4 py-4">
        <h2 className="text-lg font-semibold mb-4">Positions</h2>
        <div className="space-y-2">
          {mockPositions.map((position) => (
            <div key={position.id} className="bg-gray-900 rounded p-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{position.pair}</span>
                    <span className="text-blue-400 text-sm">{position.type} {position.volume.toFixed(2)}</span>
                  </div>
                  <div className="text-gray-400 text-sm mt-1">
                    {position.openPrice.toFixed(5)} → {position.currentPrice.toFixed(5)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-blue-400 font-bold text-lg">
                    {position.profit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default History;
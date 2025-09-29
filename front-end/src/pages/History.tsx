import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useCurrentUser, useUserHistory, useUserNotifications, useUserTransactions } from "@/lib/query/api";
import { useUserContext } from "@/context/AuthProvider";

interface Position {
  id: string;
  pair: string;
  type: "buy" | "sell";
  volume: number;
  openPrice: number;
  currentPrice: number;
  profit: number;
}

interface Transaction {
  id: string;
  amount: number;
  status: "completed" | "pending" | "failed";
  transaction_type: "deposit" | "withdrawal";
  date: string;
  method?: string;
  reference?: string;
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

const mockDeposits: Transaction[] = [
  {
    id: "d1",
    amount: 10000.00,
    status: "completed",
    transaction_type: "deposit",
    date: "2024-01-15",
    method: "Bank Transfer",
    reference: "DEP001234"
  },
  {
    id: "d2",
    amount: 5000.00,
    status: "completed",
    transaction_type: "deposit",
    date: "2024-01-10",
    method: "Credit Card",
    reference: "DEP001235"
  },
  {
    id: "d3",
    amount: 15000.00,
    status: "pending",
    transaction_type: "deposit",
    date: "2024-01-20",
    method: "Wire Transfer",
    reference: "DEP001236"
  },
  {
    id: "d4",
    amount: 2500.00,
    status: "completed",
    transaction_type: "deposit",
    date: "2024-01-08",
    method: "Bank Transfer",
    reference: "DEP001237"
  },
  {
    id: "d5",
    amount: 7500.00,
    status: "failed",
    transaction_type: "deposit",
    date: "2024-01-12",
    method: "Credit Card",
    reference: "DEP001238"
  }
];

const mockWithdrawals: Transaction[] = [
  {
    id: "w1",
    amount: 3000.00,
    status: "completed",
    transaction_type: "withdrawal",
    date: "2024-01-18",
    method: "Bank Transfer",
    reference: "WTH001234"
  },
  {
    id: "w2",
    amount: 1500.00,
    status: "pending",
    transaction_type: "withdrawal",
    date: "2024-01-22",
    method: "Wire Transfer",
    reference: "WTH001235"
  },
  {
    id: "w3",
    amount: 5000.00,
    status: "completed",
    transaction_type: "withdrawal",
    date: "2024-01-14",
    method: "Bank Transfer",
    reference: "WTH001236"
  },
  {
    id: "w4",
    amount: 2000.00,
    status: "failed",
    transaction_type: "withdrawal",
    date: "2024-01-16",
    method: "Wire Transfer",
    reference: "WTH001237"
  },
  {
    id: "w5",
    amount: 4500.00,
    status: "completed",
    transaction_type: "withdrawal",
    date: "2024-01-11",
    method: "Bank Transfer",
    reference: "WTH001238"
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-400";
      case "pending":
        return "text-yellow-400";
      case "failed":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case "completed":
        return `${baseClasses} bg-green-900 text-green-400`;
      case "pending":
        return `${baseClasses} bg-yellow-900 text-yellow-400`;
      case "failed":
        return `${baseClasses} bg-red-900 text-red-400`;
      default:
        return `${baseClasses} bg-gray-900 text-gray-400`;
    }
  };

  const {user} = useUserContext()
  const {data:transactions_history, } = useUserHistory(user?.user_id)
   const {data} = useCurrentUser()

  const {data:notifications, isPending} = useUserNotifications(user?.user_id)
  const deposits = notifications?.filter((data) => data?.type === "deposit")
    const withdrawals = notifications?.filter((data) => data?.type === "withdraw")

 //  const last_index= transactions_history?.length-1
  // const last_profit = transactions_history[last_index ]?.profit
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800">
      {/* Account Summary */}
      <div className="text-white px-4 py-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-300">Total Balance:</span>
            <span className="text-white font-medium">${data?.available_balance}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Last Trade Profit:</span>
            <span className="text-white font-medium">$0</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="text-white px-4 py-2">
        <div className="flex bg-slate-800 rounded-lg p-1">
          <button
            onClick={() => setActiveTab("positions")}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "positions"
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:text-white"
            }`}
          >
            Positions
          </button>
          <button
            onClick={() => setActiveTab("deposits")}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "deposits"
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:text-white"
            }`}
          >
            Deposits
          </button>
          <button
            onClick={() => setActiveTab("withdrawals")}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "withdrawals"
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:text-white"
            }`}
          >
            Withdrawals
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="text-white px-4 py-4">
        {activeTab === "positions" && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Positions</h2>
            <div className="space-y-2">
              {transactions_history?.map((position) => (
                <div key={position?.$id} className="bg-slate-800 border border-slate-700 rounded p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{position?.currency}</span>
                        <span className="text-blue-400 text-sm">{position.type} {/*position.volume.toFixed(2)*/}</span>
                      </div>
                      <div className="text-gray-400 text-sm mt-1">
                        {position.open_price} → {position.close_price}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-blue-400 font-bold text-lg">
                        {position?.profit?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "deposits" && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Deposits</h2>
            <div className="space-y-2">
              {deposits?.map((deposit) => (
                <div key={deposit.id} className="bg-slate-800 border border-slate-700 rounded p-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-green-400">
                          +${deposit.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        <span className={getStatusBadge(deposit.status)}>
                          {deposit.status}
                        </span>
                      </div>
                      <div className="text-gray-400 text-sm">
                        <div>{deposit.method}</div>
                        <div className="flex justify-between mt-1">
                          <span>Ref: {deposit?.withdrawal_wallet}</span>
                          <span>{deposit.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "withdrawals" && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Withdrawals</h2>
            <div className="space-y-2">
              {withdrawals?.map((withdrawal) => (
                <div key={withdrawal.id} className="bg-slate-800 border border-slate-700 rounded p-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-red-400">
                          -${withdrawal.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        <span className={getStatusBadge(withdrawal.status)}>
                          {withdrawal.status}
                        </span>
                      </div>
                      <div className="text-gray-400 text-sm">
                        <div></div>
                        <div className="flex justify-between mt-1">
                          <span>Ref: {withdrawal?.withdrawal_wallet}</span>
                          <span>{withdrawal?.$createdAt?.split('T')[0]}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
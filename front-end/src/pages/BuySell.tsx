import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";
import { ChevronDown, MoreHorizontal, Settings, TrendingUp } from "lucide-react";

import { useId } from "react"
import { withMask } from "use-mask-input"

import { Label } from "@/components/ui/label"
import { useUserContext } from "@/context/AuthProvider";
import { useCreateTransaction, useLastTransaction } from "@/lib/query/api";
import { Transaction } from "@/lib/appwrite/appWriteConfig";

interface OrderData {
  price: number;
  amount: number;
  priceStr: string;
  amountStr: string;
}

// Helper function to format price
const formatPrice = (price: number) => {
  return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// Helper function to format amount
const formatAmount = (amount: number) => {
  return amount.toFixed(5);
};

// Helper function to generate random price movement
const getRandomPriceChange = () => {
  return (Math.random() - 0.5) * 10; // ±5 USDT movement
};

// Helper function to generate random amount change
const getRandomAmountChange = () => {
  return (Math.random() - 0.5) * 0.1; // Small amount changes
};

// Initial order book data
const initialOrderBookData: OrderData[] = [
  { price: 118079.32, amount: 0.00041, priceStr: "118,079.32", amountStr: "0.00041" },
  { price: 118078.70, amount: 0.00005, priceStr: "118,078.70", amountStr: "0.00005" },
  { price: 118076.70, amount: 0.00013, priceStr: "118,076.70", amountStr: "0.00013" },
  { price: 118076.10, amount: 0.03197, priceStr: "118,076.10", amountStr: "0.03197" },
  { price: 118076.09, amount: 0.00272, priceStr: "118,076.09", amountStr: "0.00272" },
  { price: 118075.99, amount: 0.13586, priceStr: "118,075.99", amountStr: "0.13586" },
  { price: 118075.98, amount: 12.94900, priceStr: "118,075.98", amountStr: "12.94900" },
];

const initialLowerOrderData: OrderData[] = [
  { price: 118075.97, amount: 1.32234, priceStr: "118,075.97", amountStr: "1.32234" },
  { price: 118075.95, amount: 0.00310, priceStr: "118,075.95", amountStr: "0.00310" },
  { price: 118075.88, amount: 0.00118, priceStr: "118,075.88", amountStr: "0.00118" },
  { price: 118075.20, amount: 0.00630, priceStr: "118,075.20", amountStr: "0.00630" },
  { price: 118075.19, amount: 0.00047, priceStr: "118,075.19", amountStr: "0.00047" },
  { price: 118074.71, amount: 0.00005, priceStr: "118,074.71", amountStr: "0.00005" },
  { price: 118073.85, amount: 0.00135, priceStr: "118,073.85", amountStr: "0.00135" },
];

const TradingInterface = () => {
  const [orderType, setOrderType] = useState<"buy" | "sell">("buy");

  // Buy form states
  const [buyOrderType, setBuyOrderType] = useState("limit");
  const [buyPrice, setBuyPrice] = useState("118075.97");
  const [buyAmount, setBuyAmount] = useState("");
  const [buyTotal, setBuyTotal] = useState("");
  const [buySliderValue, setBuySliderValue] = useState([25]);
  const [buyTakeProfit, setBuyTakeProfit] = useState(false);
  const [buyIceberg, setBuyIceberg] = useState(false);

  // Sell form states
  const [sellOrderType, setSellOrderType] = useState("limit");
  const [sellPrice, setSellPrice] = useState("118075.97");
  const [sellAmount, setSellAmount] = useState("");
  const [sellTotal, setSellTotal] = useState("");
  const [sellSliderValue, setSellSliderValue] = useState([25]);
  const [sellTakeProfit, setSellTakeProfit] = useState(false);
  const [sellIceberg, setSellIceberg] = useState(false);

  
  const [timeValue, setTimeValue] = useState('');
  const [error, setError] = useState('');
  const {user} = useUserContext()
  // Time duration states
  const [buyDuration, setBuyDuration] = useState("01:00:00");
  const [sellDuration, setSellDuration] = useState("01:00:00");

  function hmsToSeconds(hms: string): number {
    const [hours, minutes, seconds] = hms.split(":").map(Number);
  
    if ([hours, minutes, seconds].some(isNaN)) {
      throw new Error("Invalid time format. Expected hh:mm:ss");
    }
  
    return hours * 3600 + minutes * 60 + seconds;
  }
  
  // Function to convert time format (hh:mm:ss) to seconds
  const timeToSeconds = (timeString) => {
    if (!timeString || typeof timeString !== 'string') return 0;

    const parts = timeString.split(':');
    if (parts.length !== 3) return 0;

    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    const seconds = parseInt(parts[2], 10);

    // Check for invalid numbers
    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) return 0;

    // Validate ranges
    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59 || seconds < 0 || seconds > 59) {
      return 0;
    }

    return hours * 3600 + minutes * 60 + seconds;
  };

  // Function to validate time format
  const validateTimeFormat = (timeString) => {
    if (!timeString || typeof timeString !== 'string') return false;

    const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
    return timeRegex.test(timeString);
  };

  // Real-time data states
  const [selectedPair, setSelectedPair] = useState("btc-usdt");
  const [orderBookData, setOrderBookData] = useState<OrderData[]>(initialOrderBookData);
  const [lowerOrderData, setLowerOrderData] = useState<OrderData[]>(initialLowerOrderData);
  const [currentPrice, setCurrentPrice] = useState(118075.98);
  const [priceChange, setPriceChange] = useState(0.60);
  const [balance, setBalance] = useState(2250.48858595);
  const [btcBalance] = useState(0.01905);

  const {mutateAsync:createTransaction, isPending:isCreating} = useCreateTransaction()
  const {data:transaction} = useLastTransaction(user?.user_id)


   const calculateTransactionCountdown = (transaction: Transaction | null) => {
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
    return { isExpired: true, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0, formatted: "00:00:00" };
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

  // Submit handlers
  const handleBuySubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateTimeFormat(buyDuration)) {
      alert("Please enter a valid time format (HH:MM:SS)");
      return;
    }

    const orderData = {
      orderType: buyOrderType,
      price: buyPrice,
      amount: buyAmount,
      total: buyTotal,
      sliderValue: buySliderValue[0],
      duration: buyDuration,
      durationInSeconds: timeToSeconds(timeValue),
      takeProfit: buyTakeProfit,
      iceberg: buyIceberg
    };

    const formData = {
      user_id: user.user_id,
      amount:parseFloat(buyAmount),
      currency: priceChange,
      time: timeToSeconds(timeValue),
      type: timeValue ?    'auto' : 'manual',
      profite: user.profite,
      current_state: 'buy' 
    }
  }


  const handleSellSubmit = async(e: React.FormEvent) => {
    e.preventDefault();

    

    const orderData = {
      orderType: sellOrderType,
      price: sellPrice,
      amount: sellAmount,
      total: sellTotal,
      sliderValue: sellSliderValue[0],
      duration: sellDuration,
      durationInSeconds: timeToSeconds(sellDuration),
      takeProfit: sellTakeProfit,
      iceberg: sellIceberg
    };

    const formData = {
      user_id: user.user_id,
      amount:parseFloat(sellAmount),
      currency: selectedPair,
      time: timeToSeconds(timeValue),
      type: timeValue ?    'auto' : 'manual',
      profite: user.profite,
      current_state: 'sell' 
    }

    try {

     const create = await createTransaction(formData)
      
    } catch (error) {
      console.log(error);
      
    }
  };

  // Update slider amounts
  useEffect(() => {
    const maxBuyAmount = balance / parseFloat(buyPrice || "1");
    const sliderAmount = (maxBuyAmount * buySliderValue[0]) / 100;
    setBuyAmount(sliderAmount.toFixed(5));
    setBuyTotal((sliderAmount * parseFloat(buyPrice || "0")).toFixed(2));
  }, [buySliderValue, buyPrice, balance]);

  useEffect(() => {
    const sliderAmount = (btcBalance * sellSliderValue[0]) / 100;
    setSellAmount(sliderAmount.toFixed(5));
    setSellTotal((sliderAmount * parseFloat(sellPrice || "0")).toFixed(2));
  }, [sellSliderValue, sellPrice, btcBalance]);

  // Update prices and amounts in real time
  useEffect(() => {
    const interval = setInterval(() => {
      // Update current price
      setCurrentPrice(prev => {
        const change = getRandomPriceChange();
        const newPrice = prev + change;
        const safePrice = Math.max(newPrice, 100000);

        // Update form prices to follow market
        setBuyPrice(formatPrice(safePrice));
        setSellPrice(formatPrice(safePrice));

        return safePrice;
      });

      // Update price change percentage
      setPriceChange(prev => {
        const change = (Math.random() - 0.5) * 0.2;
        return Math.max(-5, Math.min(5, prev + change));
      });

      // Update order book data
      setOrderBookData(prevData =>
        prevData.map(order => {
          const priceChange = getRandomPriceChange();
          const amountChange = getRandomAmountChange();
          const newPrice = Math.max(order.price + priceChange, 100000);
          const newAmount = Math.max(order.amount + amountChange, 0.00001);

          return {
            ...order,
            price: newPrice,
            amount: newAmount,
            priceStr: formatPrice(newPrice),
            amountStr: formatAmount(newAmount)
          };
        })
      );

      // Update lower order data
      setLowerOrderData(prevData =>
        prevData.map(order => {
          const priceChange = getRandomPriceChange();
          const amountChange = getRandomAmountChange();
          const newPrice = Math.max(order.price + priceChange, 100000);
          const newAmount = Math.max(order.amount + amountChange, 0.00001);

          return {
            ...order,
            price: newPrice,
            amount: newAmount,
            priceStr: formatPrice(newPrice),
            amountStr: formatAmount(newAmount)
          };
        })
      );

      // Update balance slightly
      setBalance(prev => {
        const change = (Math.random() - 0.5) * 10;
        return Math.max(prev + change, 0);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);


  /// TIME  INPUTE

  


  // Validate time format HH:MM:SS
  const validateTime = (value) => {
    if (!value) return true; // Allow empty value

    const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5]?[0-9]):([0-5]?[0-9])$/;
    return timeRegex.test(value);
  };

  // Format input as user types
  const formatTimeInput = (value) => {
    // Remove any non-digit characters except colons
    const cleaned = value.replace(/[^\d:]/g, '');

    // Auto-add colons at appropriate positions
    let formatted = cleaned;
    if (cleaned.length >= 2 && cleaned.indexOf(':') === -1) {
      formatted = cleaned.substring(0, 2) + ':' + cleaned.substring(2);
    }
    if (cleaned.length >= 5 && cleaned.split(':').length === 2) {
      const parts = formatted.split(':');
      if (parts[1].length >= 2) {
        formatted = parts[0] + ':' + parts[1].substring(0, 2) + ':' + parts[1].substring(2);
      }
    }

    // Limit to HH:MM:SS format (8 characters max)
    return formatted.substring(0, 8);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    const formattedValue = formatTimeInput(value);

    const time = setTimeValue(formattedValue);
    console.log(timeValue);
    
    // Validate the input
    if (formattedValue && !validateTime(formattedValue)) {
      setError('Please enter a valid time in HH:MM:SS format');
    } else {
      setError('');
    }
  };

  const handleSubmit = () => {
    if (validateTime(timeValue)) {
      console.log('Time submitted:', timeValue);
      alert(`Time entered: ${timeValue || 'No time entered'}`);
    }
  };


  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
        {/* Left side - Order Book */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
              <Select value={selectedPair} onValueChange={setSelectedPair}>
      <SelectTrigger className="w-32 border-0 bg-transparent p-0 h-auto">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="btc-usdt">BTC/USDT</SelectItem>
        <SelectItem value="eth-usdt">ETH/USDT</SelectItem>
        <SelectItem value="ada-usdt">ADA/USDT</SelectItem>
      </SelectContent>
    </Select>
                <Badge variant={priceChange >= 0 ? "default" : "destructive"} className={priceChange >= 0 ? "bg-green-600 hover:bg-green-700 text-white" : "bg-red-600 hover:bg-red-700 text-white"}>
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
                </Badge>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Chart View</DropdownMenuItem>
                  <DropdownMenuItem>Export Data</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left text-gray-400 text-xs py-2">Price  (USDT)</th>
                  <th className="text-right text-gray-400 text-xs py-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {orderBookData.map((order, index) => (
                  <tr key={index} className="border-b border-gray-700 hover:bg-gray-700/20">
                    <td className="font-mono text-sm text-red-400 py-1">
                      {order.priceStr}
                    </td>
                    <td className="text-right font-mono text-sm text-gray-400 py-1">
                      {order.amountStr}
                    </td>
                  </tr>
                ))}

                {/* Current Price Highlight */}
                <tr className="bg-gray-700/30 border-b border-gray-700">
                  <td className="py-3">
                    <span className={`text-lg font-mono font-bold ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {formatPrice(currentPrice)}
                    </span>
                  </td>
                  <td className="text-right text-sm text-gray-400 py-3">
                    ≈ ${formatPrice(currentPrice)}
                  </td>
                </tr>

                {lowerOrderData.map((order, index) => (
                  <tr key={index} className="border-b border-gray-700 hover:bg-gray-700/20">
                    <td className="font-mono text-sm text-green-400 py-1">
                      {order.priceStr}
                    </td>
                    <td className="text-right font-mono text-sm text-gray-400 py-1">
                      {order.amountStr}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Right side - Trading Panel */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            {/* Buy/Sell Tabs */}
            <Tabs value={orderType} onValueChange={(value) => setOrderType(value as "buy" | "sell")} className="mb-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger
                  value="buy"
                  className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
                >
                  Buy
                </TabsTrigger>
                <TabsTrigger
                  value="sell"
                  className="data-[state=active]:bg-red-600 data-[state=active]:text-white"
                >
                  Sell
                </TabsTrigger>
              </TabsList>

              <TabsContent value="buy" className="mt-6">
                <div className="space-y-4">
                  {/* Order Type */}
                  <div>
                    <Select value={buyOrderType} onValueChange={setBuyOrderType}>
                      <SelectTrigger className="w-24 border-0 bg-transparent p-0 h-auto">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="limit">Limit</SelectItem>
                        <SelectItem value="market">Market</SelectItem>
                        <SelectItem value="stop-limit">Stop-Limit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price Input */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm text-gray-400">Price (USDT)</label>
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                        +
                      </Button>
                    </div>
                    <Input
                      value={buyPrice}
                      onChange={(e) => setBuyPrice(e.target.value)}
                      className="font-mono"
                    />
                  </div>


                  {/* Amount Slider */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm text-gray-400">Amount Percentag{countdown?.formatted} </label>
                      <span className="text-sm text-gray-400">{buySliderValue[0]}%</span>
                    </div>
                    <Slider
                      value={buySliderValue}
                      onValueChange={setBuySliderValue}
                      max={100}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                      <span>0%</span>
                      <span>25%</span>
                      <span>50%</span>
                      <span>75%</span>
                      <span>100%</span>
                    </div>
                  </div>

                  {/* Duration Input */}

                  <div>
                    <label htmlFor="timeInput" className="block text-sm font-medium text-gray-300 mb-2">
                      Enter time (HH:MM:SS)
                    </label>
                    <input
                      id="timeInput"
                      type="text"
                      value={timeValue}
                      onChange={handleChange}
                      placeholder="12:30:45"
                      className={`w-full px-4 py-2 bg-gray-700 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-colors text-white placeholder-gray-400 ${error ? 'border-red-500' : 'border-gray-600'
                        }`}
                      maxLength={8}
                    />
                    {error && (
                      <p className="text-red-400 text-sm mt-1">{error}</p>
                    )}
                    <p className="text-gray-400 text-sm mt-1">
                      Format: Hours:Minutes:Seconds (e.g., 14:30:25)
                    </p>
                  </div>

                  {/* Total Input */}
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Total (USDT)</label>
                    <Input
                      value={buyTotal}
                      onChange={(e) => setBuyTotal(e.target.value)}
                      className="font-mono"
                      placeholder="0"
                    />
                  </div>

                  <Separator />

                  {/* Advanced Options */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={buyTakeProfit}
                        onCheckedChange={setBuyTakeProfit}
                      />
                      <label className="text-sm">Take Profit / Stop Loss</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={buyIceberg}
                        onCheckedChange={setBuyIceberg}
                      />
                      <label className="text-sm">Iceberg Order</label>
                    </div>
                  </div>

                  <Separator />

                  {/* Balance Information */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Available Balance</span>
                      <Badge variant="secondary" className="font-mono">
                        {balance.toFixed(2)} USDT 💰
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Max Buy</span>
                      <span className="font-mono">{(balance / currentPrice).toFixed(5)} BTC</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Est. Fee</span>
                      <span className="font-mono">-- BTC</span>
                    </div>
                  </div>

                  {/* Buy Button */}
                  <Button onClick={handleBuySubmit} className="w-full bg-green-600 hover:bg-green-700 text-white" size="lg">
                    Buy BTC
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="sell" className="mt-6">
                <div className="space-y-4">
                  {/* Order Type */}
                  <div>
                    <Select value={sellOrderType} onValueChange={setSellOrderType}>
                      <SelectTrigger className="w-24 border-0 bg-transparent p-0 h-auto">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="limit">Limit</SelectItem>
                        <SelectItem value="market">Market</SelectItem>
                        <SelectItem value="stop-limit">Stop-Limit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price Input */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm text-gray-400">Price (USDT)</label>
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                        +
                      </Button>
                    </div>
                    <Input
                      value={sellPrice}
                      onChange={(e) => setSellPrice(e.target.value)}
                      className="font-mono"
                    />
                  </div>

                 

                  {/* Amount Slider */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm text-gray-400">Amount Percentage</label>
                      <span className="text-sm text-gray-400">{sellSliderValue[0]}%</span>
                    </div>
                    <Slider
                      value={sellSliderValue}
                      onValueChange={setSellSliderValue}
                      max={100}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                      <span>0%</span>
                      <span>25%</span>
                      <span>50%</span>
                      <span>75%</span>
                      <span>100%</span>
                    </div>
                  </div>

                  {/* Duration Input */}

                  <div>
                    <label htmlFor="timeInput" className="block text-sm font-medium text-gray-300 mb-2">
                      Enter time (HH:MM:SS)
                    </label>
                    <input
                      id="timeInput"
                      type="text"
                      value={timeValue}
                      onChange={handleChange}
                      placeholder="12:30:45"
                      className={`w-full px-4 py-2 bg-gray-700 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-colors text-white placeholder-gray-400 ${error ? 'border-red-500' : 'border-gray-600'
                        }`}
                      maxLength={8}
                    />
                    {error && (
                      <p className="text-red-400 text-sm mt-1">{error}</p>
                    )}
                    <p className="text-gray-400 text-sm mt-1">
                      Format: Hours:Minutes:Seconds (e.g., 14:30:25)
                    </p>
                  </div>

                  {/* Total Input */}
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Total (USDT)</label>
                    <Input
                      value={sellTotal}
                      onChange={(e) => setSellTotal(e.target.value)}
                      className="font-mono"
                      placeholder="0"
                    />
                  </div>

                 
                  <Separator />

                  {/* Advanced Options */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={sellTakeProfit}
                        onCheckedChange={setSellTakeProfit}
                      />
                      <label className="text-sm">Take Profit / Stop Loss</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={sellIceberg}
                        onCheckedChange={setSellIceberg}
                      />
                      <label className="text-sm">Iceberg Order</label>
                    </div>
                  </div>

                  <Separator />

                  {/* Balance Information */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Available Balance</span>
                      <Badge variant="secondary" className="font-mono">
                        {btcBalance} BTC 💰
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Max Sell</span>
                      <span className="font-mono">{btcBalance} BTC</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Est. Fee</span>
                      <span className="font-mono">-- USDT</span>
                    </div>
                  </div>

                  {/* Sell Button */}
                  <Button onClick={handleSellSubmit} className="w-full bg-red-600 hover:bg-red-700 text-white" size="lg">
                    Sell BTC
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TradingInterface
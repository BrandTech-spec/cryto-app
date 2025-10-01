
interface ConverterFieldProps {
  className?: string;
  isLast?: boolean;
  defaultValue: number;
  balance: string;
  defaultCoin: string;
  coins: {
    id: string;
    name: string;
    image: string;
  }[];
}
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
import { useCreateTransaction, useCurrentUser, useLastTransaction, useUpdateUser } from "@/lib/query/api";
import { Transaction } from "@/lib/appwrite/appWriteConfig";
import { options } from "@/constants";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";


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
  { price: 118075.98, amount: 12.94900,priceStr: "118,075.98",amountStr: "12.94900" },
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

export function Converter() {
  const [orderType, setOrderType] = useState<"buy" | "sell">("buy");

  // Buy form states
  const [buyOrderType, setBuyOrderType] = useState("limit");
  const [buyPrice, setBuyPrice] = useState("0");
  const [buyAmount, setBuyAmount] = useState("");
  const [buyTotal, setBuyTotal] = useState("");
  const [buySliderValue, setBuySliderValue] = useState([25]);
  const [buyTakeProfit, setBuyTakeProfit] = useState(false);
  const [buyIceberg, setBuyIceberg] = useState(false);

  // Sell form states
  const [sellOrderType, setSellOrderType] = useState("limit");
  const [sellPrice, setSellPrice] = useState("0");
  const [sellAmount, setSellAmount] = useState("");
  const [sellTotal, setSellTotal] = useState("");
  const [sellSliderValue, setSellSliderValue] = useState([25]);
  const [sellTakeProfit, setSellTakeProfit] = useState(false);
  const [sellIceberg, setSellIceberg] = useState(false);


  const [timeValue, setTimeValue] = useState('');
  const [error, setError] = useState('');
  const { user } = useUserContext()
  // Time duration states
  const [buyDuration, setBuyDuration] = useState("01:00:00");
  const [sellDuration, setSellDuration] = useState("01:00:00");
  const {data:currentUser} = useCurrentUser()

  const {mutateAsync:updateUser} = useUpdateUser()
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
  const navigate = useNavigate()
  const { mutateAsync: createTransaction, isPending: isCreating } = useCreateTransaction()
  const { data: transaction } = useLastTransaction(user?.user_id)


  const [timeLeft, setTimeLeft] = useState<string | null>(null);

  const calculateTimeLeft = () => {
    const currentTime = new Date().getTime();
    const createdAtTime = new Date(transaction?.$createdAt).getTime();
    const targetTime = createdAtTime + transaction?.time * 1000; // combine createdAt and time to get the target time

    if (currentTime < targetTime) {
      const timeDifference = targetTime - currentTime;

      const hours = Math.floor(timeDifference / (1000 * 60 * 60));
      const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

      // Return time in hh:mm:ss format
      setTimeLeft(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
    } else {
      setTimeLeft(null);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      calculateTimeLeft();
    }, 1000);

    // Initial calculation
    calculateTimeLeft();

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [transaction?.$createdAt, transaction?.time]);

  // Submit handlers
  const handleBuySubmit = async (e: React.FormEvent) => {
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
      amount: parseFloat(buyPrice),
      currency: selectedAsset,
      time: timeToSeconds(timeValue),
      type: timeValue ? 'auto' : 'manual',
      profite: user.profite,
      current_state: 'buy',
      takeProfit: buyTakeProfit,
      iceberg: buyIceberg
    }

    if (parseInt(buyPrice) < 5 ) {
      return toast.error('can not trade lessthan $5 ')
    }

    if ( currentUser?.available_balance < parseInt(buyPrice) ) {
      return toast.error('insufficient balance please top-up to contineu trading ')
    }

    const data = {
      userId:user?.user_id,
      payload:{
        amount:currentUser?.available_balance - parseFloat(buyAmount),
      }
    }
    try {

      const create = await createTransaction(formData)

      await updateUser(data)
      if (create) {
        navigate("/chart")
      }
    } catch (error) {
      console.log(error);

    }
  }


  const handleSellSubmit = async (e: React.FormEvent) => {
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



    if (parseInt(sellPrice) < 5 ) {
      return toast.error('can not trade lessthan $5 ')
    }


    if ( currentUser?.available_balance < parseInt(sellPrice) ) {
      return toast.error('insufficient balance please top-up to contineu trading ')
    }

    const formData = {
      user_id: user.user_id,
      amount: parseFloat(sellPrice),
      currency: selectedAsset,
      time: timeToSeconds(timeValue),
      type: timeValue ? 'auto' : 'manual',
      profite: user.profite,
      current_state: 'sell',
      takeProfit:sellTakeProfit,
      iceberg:sellIceberg
    }

    const data = {
      userId:user?.user_id,
      payload:{
        amount:currentUser?.available_balance - parseFloat(sellAmount),
      }
    }
    try {

      const create = await createTransaction(formData)
       await updateUser(data)
     
      if (create) {
        navigate("/chart")
      }

    } catch (error) {
      console.log(error);

    }
  };

  // Update slider amounts
  useEffect(() => {
    const maxBuyAmount = balance / parseFloat(buyPrice || "1");
    
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
  const [selectedAsset, setSelectedAsset] = useState('EUR/USD');
  const [isOpen, setIsOpen] = useState(false);
  const handleSelect = (asset) => {
    setSelectedAsset(asset);
    setIsOpen(false);
  };

 

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-4"> 
        {/* Right side - Trading Panel */}
        <Card className="bg-slate-800 border-slate-700 shadow-2xl shadow-slate-900/50 border-border/50">
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

                  {/* Total Input */}
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Total (USDT)</label>
                    <Input
                      value={currentUser?.available_balance - ( buyPrice ? parseInt(buyPrice) : 0)}
                       readOnly
                      className="font-mono"
                      placeholder="0"
                    />
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

                  {/* Amount Slider */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm text-gray-400">Amount Percentag{timeLeft} </label>
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
                        {currentUser?.available_balance} USDT 
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">fee</span>
                      <span className="font-mono">0</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">commodity</span>
                      <span className="font-mono">{selectedAsset}</span>
                    </div>
                  </div>

                  {/* Buy Button */}
                  <Button disabled={isCreating || buySliderValue[0] < 100 } onClick={handleBuySubmit} className="w-full bg-green-600 hover:bg-green-700 text-white" size="lg">
                    Trade
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

                  {/* Total Input */}
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Total (USDT)</label>
                    <Input
                      value={currentUser?.available_balance - ( buyPrice ? parseInt(buyPrice) : 0)}
                      className="font-mono"
                      placeholder="0"
                    />
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
                      {currentUser?.available_balance}
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">fee</span>
                      <span className="font-mono">0</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">commodity</span>
                      <span className="font-mono">{selectedAsset}</span>
                    </div>
                  </div>

                  {/* Sell Button */}
                  <Button disabled={isCreating || sellSliderValue[0] < 100} onClick={handleSellSubmit} className="w-full bg-red-600 hover:bg-red-700 text-white" size="lg">
                    Trade
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      
    </div>
  );
}

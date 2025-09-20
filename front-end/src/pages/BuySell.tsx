import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ChevronDown, MoreHorizontal, Settings, TrendingUp } from "lucide-react";
import { useTransactionCountdown } from "@/lib/utils";
import { useUserContext } from "@/context/AuthProvider";
import { useLastTransaction } from "@/lib/query/api";

interface OrderData {
  price: number;
  amount: number;
  priceStr: string;
  amountStr: string;
}

// Form schema for trading orders
const tradingFormSchema = z.object({
  orderType: z.enum(["limit", "market", "stop-limit"]),
  price: z.string().min(1, "Price is required"),
  amount: z.string().min(1, "Amount is required"),
  total: z.string().optional(),
  tradeDuration: z.string().default("1h"),
  customDuration: z.string().optional(),
  takeProfitStopLoss: z.boolean().default(false),
  icebergOrder: z.boolean().default(false),
});

type TradingFormData = z.infer<typeof tradingFormSchema>;

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
  const [price, setPrice] = useState("118075.97");
  const [amount, setAmount] = useState("");
  const [total, setTotal] = useState("");
  

  const {user} = useUserContext()
  const {data:last_transaction, isPending} = useLastTransaction(user.user_id)

  const {
    hours,
    minutes,
    seconds,
    totalSeconds,
    formatted,
    isExpired
  } = useTransactionCountdown(last_transaction)
  
  // Form instances for Buy and Sell
  const buyForm = useForm<TradingFormData>({
    resolver: zodResolver(tradingFormSchema),
    defaultValues: {
      orderType: "limit",
      price: "118075.97",
      amount: "",
      total: "",
      tradeDuration: "1h",
      customDuration: "",
      takeProfitStopLoss: false,
      icebergOrder: false,
    },
  });

  const sellForm = useForm<TradingFormData>({
    resolver: zodResolver(tradingFormSchema),
    defaultValues: {
      orderType: "limit",
      price: "118075.97",
      amount: "",
      total: "",
      tradeDuration: "1h",
      customDuration: "",
      takeProfitStopLoss: false,
      icebergOrder: false,
    },
  });

  // Submit handlers
  const onBuySubmit = (data: TradingFormData) => {
    console.log("Buy Order Submitted:", data);
    // Process buy order here
    alert(`Buy Order: ${data.amount} BTC at ${data.price} USDT`);
  };

  const onSellSubmit = (data: TradingFormData) => {
    console.log("Sell Order Submitted:", data);
    // Process sell order here
    alert(`Sell Order: ${data.amount} BTC at ${data.price} USDT`);
  };
  
  // Real-time data states
  const [orderBookData, setOrderBookData] = useState<OrderData[]>(initialOrderBookData);
  const [lowerOrderData, setLowerOrderData] = useState<OrderData[]>(initialLowerOrderData);
  const [currentPrice, setCurrentPrice] = useState(118075.98);
  const [priceChange, setPriceChange] = useState(0.60);
  const [balance, setBalance] = useState(2250.48858595);

  // Update prices and amounts in real time
  useEffect(() => {
    const interval = setInterval(() => {
      // Update current price
      setCurrentPrice(prev => {
        const change = getRandomPriceChange();
        const newPrice = prev + change;
        return Math.max(newPrice, 100000); // Minimum price safety
      });

      // Update price change percentage
      setPriceChange(prev => {
        const change = (Math.random() - 0.5) * 0.2; // ±0.1% change
        return Math.max(-5, Math.min(5, prev + change)); // Keep between -5% and 5%
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
        const change = (Math.random() - 0.5) * 10; // ±5 USDT change
        return Math.max(prev + change, 0);
      });

      // Update price input to follow current price
      setPrice(formatPrice(currentPrice));
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [currentPrice]);

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
        {/* Left side - Order Book */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Select defaultValue="btc-usdt">
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
            {/* Order Book Table */}
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-400 text-xs">Price (USDT)</TableHead>
                  <TableHead className="text-right text-gray-400 text-xs">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderBookData.map((order, index) => (
                  <TableRow key={index} className="border-gray-700 hover:bg-gray-700/20">
                    <TableCell className="font-mono text-sm text-red-400 py-1">
                      {order.priceStr}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm text-gray-400 py-1">
                      {order.amountStr}
                    </TableCell>
                  </TableRow>
                ))}
                
                {/* Current Price Highlight */}
                <TableRow className="bg-gray-700/30 border-gray-700">
                  <TableCell className="py-3">
                    <span className={`text-lg font-mono font-bold ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {formatPrice(currentPrice)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right text-sm text-gray-400 py-3">
                    ≈ ${formatPrice(currentPrice)}
                  </TableCell>
                </TableRow>

                {lowerOrderData.map((order, index) => (
                  <TableRow key={index} className="border-gray-700 hover:bg-gray-700/20">
                    <TableCell className="font-mono text-sm text-green-400 py-1">
                      {order.priceStr}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm text-gray-400 py-1">
                      {order.amountStr}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
                <Form {...buyForm}>
                  <form onSubmit={buyForm.handleSubmit(onBuySubmit)} className="space-y-4">
                    {/* Order Type */}
                    <FormField
                      control={buyForm.control}
                      name="orderType"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger className="w-24 border-0 bg-transparent p-0 h-auto">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="limit">Limit</SelectItem>
                                <SelectItem value="market">Market</SelectItem>
                                <SelectItem value="stop-limit">Stop-Limit</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {/* Price Input */}
                    <FormField
                      control={buyForm.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex justify-between items-center">
                            <FormLabel className="text-sm text-gray-400">Price (USDT)</FormLabel>
                            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                              +
                            </Button>
                          </div>
                          <FormControl>
                            <Input {...field} className="font-mono" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Total Input */}
                    <FormField
                      control={buyForm.control}
                      name="total"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm text-gray-400">Total (USDT)</FormLabel>
                          <FormControl>
                            <Input {...field} className="font-mono" placeholder="0" />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <Separator />

                    {/* Trade Duration */}
                   

                    {/* Advanced Options */}
                    <div className="space-y-3">
                      <FormField
                        control={buyForm.control}
                        name="takeProfitStopLoss"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <FormLabel className="text-sm">Take Profit / Stop Loss</FormLabel>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={buyForm.control}
                        name="icebergOrder"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <FormLabel className="text-sm">Iceberg Order</FormLabel>
                          </FormItem>
                        )}
                      />
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
                     <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white" size="lg">
                       Buy BTC
                     </Button>
                  </form>
                </Form>
              </TabsContent>
              
              <TabsContent value="sell" className="mt-6">
                <Form {...sellForm}>
                  <form onSubmit={sellForm.handleSubmit(onSellSubmit)} className="space-y-4">
                    {/* Order Type */}
                    <FormField
                      control={sellForm.control}
                      name="orderType"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger className="w-24 border-0 bg-transparent p-0 h-auto">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="limit">Limit</SelectItem>
                                <SelectItem value="market">Market</SelectItem>
                                <SelectItem value="stop-limit">Stop-Limit</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {/* Price Input */}
                    <FormField
                      control={sellForm.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex justify-between items-center">
                            <FormLabel className="text-sm text-gray-400">Price (USDT)</FormLabel>
                            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                              +
                            </Button>
                          </div>
                          <FormControl>
                            <Input {...field} className="font-mono" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                   

                    {/* Total Input */}
                    <FormField
                      control={sellForm.control}
                      name="total"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm text-gray-400">Total (USDT)</FormLabel>
                          <FormControl>
                            <Input {...field} className="font-mono" placeholder="0" />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <Separator />

                    {/* Trade Duration */}
                    

                    {/* Advanced Options */}
                    <div className="space-y-3">
                      <FormField
                        control={sellForm.control}
                        name="takeProfitStopLoss"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <FormLabel className="text-sm">Take Profit / Stop Loss</FormLabel>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={sellForm.control}
                        name="icebergOrder"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <FormLabel className="text-sm">Iceberg Order</FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>

                    <Separator />

                    {/* Balance Information */}
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Available Balance</span>
                        <Badge variant="secondary" className="font-mono">
                          0.01905 BTC 💰
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Max Sell</span>
                        <span className="font-mono">0.01905 BTC</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Est. Fee</span>
                        <span className="font-mono">-- USDT</span>
                      </div>
                    </div>

                   

                    {/* Sell Button */}
                     <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white" size="lg">
                       Sell BTC
                     </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TradingInterface;
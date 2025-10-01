import React, { useCallback, useEffect, useState } from 'react';
import { TrendingUp, ChevronLeft, Bookmark, AlignHorizontalDistributeCenter, ChartSpline, ChartNoAxesCombined } from 'lucide-react';
import RealtimeChartWiderCandles from './chart';
import RealtimeLineAreaChart from './chart2';
import RealtimeLineChart from '@/components/LineChart';
import { Transaction } from '@/lib/appwrite/appWriteConfig';
import { generateTradePrice } from '@/lib/utils';
import { useCreateHistory, useGetLastHistory, useLastTransaction, useUpdateTransactions } from '@/lib/query/api';
import { useUserContext } from '@/context/AuthProvider';
import CountDown from '@/components/CountDown';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { getHistoryById, getLastTransaction } from '@/lib/appwrite/api';

const TradingChart = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1H');
  const [selectedTab, setSelectedTab] = useState(0);
const [reCall, setReCall] = useState(false)
const [lastTransaction, setLastTransaction] = useState<Models.Document | null>(null)

const [trad, setTrad] = useState("")
  const {user,tradeData} = useUserContext()
  const {data:last_hist, isPending:isFinding} = useGetLastHistory(user?.user_id)
const {mutateAsync:createHistory, isPending:isCreating} = useCreateHistory()
const {data:transaction} = useLastTransaction(user?.user_id)
const {mutateAsync:updateTransaction} = useUpdateTransactions()
const fetch = async () => {
  try {
    const transaction_id = await getLastTransaction(user?.user_id)
    if (!transaction_id) return null
    setLastTransaction(transaction_id)

  
  } catch (error) {
    console.log(error);
  }
}

useEffect(() => {

  fetch()
  console.log("I AM BEING RECALL");
  
}, [])
   const history = async () => {
    const payload = {
      user_id:user?.user_id,
      trade_id: lastTransaction?.$id,
      open_price: tradeData?.open_price,
      close_price: tradeData?.close_price,
      profit: lastTransaction?.profite,
      amount: lastTransaction?.amount,
      type: lastTransaction?.current_stat,
      currency: lastTransaction?.currency
    };

    const data={
      tradeId:lastTransaction?.$id,
      data:{
        stop_counting:true,
        $createdAt:Date.now()
      }
    }

    try {
      const his = await createHistory(payload);
      if (his) {
          const update =  await updateTransaction(data)
          if (update) {
            setReCall(true)
            return toast.success("success")
          }
        
       
      
      };
      return toast.error("failed");
    } catch (error) {
      console.log(error);
    }
  }

 


console.log(transaction)

//const prices =  generateTradePrice(transaction?.currency, transaction?.type)

 

  let icons = [AlignHorizontalDistributeCenter ,ChartNoAxesCombined , ChartSpline]
  return (
    <div className="bg-gradient-to-br from-slate-900 min-h-screen via-slate-900 to-slate-800 text-white   ">
      {/* Status Bar */}


      {/* Header */}
      <div className="flex items-center justify-between px-4 mb-6">
        <div className="flex items-center gap-2">
          <div>
            <p className="text-xs text-gray-400 font-semibold">{transaction?.currency}</p>
          </div>
        </div>
        <Button disabled={isCreating || transaction?.stop_counting} onClick={() => history()} className='bg-blue-900 rounded-md'>
           Take Profite
        </Button>
      </div>

      {/* Price */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">${tradeData.close_price?.toFixed(2)} </h1>
        <p className={` text-sm ${ tradeData.open_price?.toFixed(2) <= tradeData.close_price?.toFixed(2) ? 'text-green-500' : "text-red-500" }`} >▼ ${tradeData.price_changes?.toFixed(2)} ({tradeData.percentage_changes?.toFixed(2)}%)</p>
      </div>
      <CountDown 
        call={reCall}   
        createdAt={transaction?.$createdAt} 
        time={transaction?.time} creatHistory={history} 
        lastHistory_id={last_hist?.$id} 
        lastTrade_id={transaction?.$id} 
        stopCounting={transaction?.stop_counting} // ✅ pass from parent
      />
      
      {/* Tabs */}
      <div className="flex bg-gray-900 gap-3 px-2 rounded-lg p-1 mb-6">
        {icons.map((Tab, i) => (
          <button
            key={i}
            onClick={() => setSelectedTab(i)}
            className={`flex-1 flex items-center  justify-center py-2 text-sm font-medium rounded-md transition-all ${
              i === selectedTab ? 'bg-slate-800 border-slate-700 shadow-2xl shadow-slate-900/50' : 'bg-transparent text-gray-400'
            }`}
          >
             < Tab className='w-6 h-6' />
          </button>
        ))}
      </div>

      {/* Chart Container */}
      <div className="bg-transparent rounded-2xl p-4 mb-6 h-auto relative">

       {
         selectedTab === 0 ?  <RealtimeChartWiderCandles asset={transaction?.currency || "BTC/USD"} /> : selectedTab === 1 ? <RealtimeLineAreaChart asset={transaction?.currency || "BTC/USD"}/> : <RealtimeLineChart asset={transaction?.currency || "BTC/USD"} /> 
       }
        
       
      </div>

     
    </div>
  );
};

export default TradingChart;
import React, { useEffect, useState } from 'react';
import { TrendingUp, ChevronLeft, Bookmark, AlignHorizontalDistributeCenter, ChartSpline, ChartNoAxesCombined } from 'lucide-react';
import RealtimeChartWiderCandles from './chart';
import RealtimeLineAreaChart from './chart2';
import RealtimeLineChart from '@/components/LineChart';
import { Transaction } from '@/lib/appwrite/appWriteConfig';
import { generateTradePrice } from '@/lib/utils';
import { useCreateHistory, useGetLastHistory, useLastTransaction } from '@/lib/query/api';
import { useUserContext } from '@/context/AuthProvider';
import CountDown from '@/components/CountDown';
import { toast } from 'sonner';

const TradingChart = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1H');
  const [selectedTab, setSelectedTab] = useState(0);

  const {user,tradeData} = useUserContext()
  const {data:last_hist, isPending:isFinding} = useGetLastHistory(user?.user_id)
const {mutateAsync:createHistory, isPending:isCreating} = useCreateHistory()
const {data:transaction} = useLastTransaction(user?.user_id)

  const history = async () => {

    const payload = {
      trade_id: transaction?.$id,            // Required, max size 250
      open_price: tradeData?.open_price,   // Nullable
      close_price: tradeData?.close_price,  // Nullable
      profit: transaction?.profite, // Defaults to 0
      amount: transaction?.amount,  // Defaults to 0
      type: transaction?.time,
      currency: transaction.currency
    }

    console.log(payload);
    
    try {
    let his =  await createHistory(payload)
    if (his) {
     return toast.success("success")
    }
 return toast.error("faid")

    } catch (error) {
      console.log(error);

    }
  }

console.log(transaction)

//const prices =  generateTradePrice(transaction?.currency, transaction?.type)

 

  let icons = [AlignHorizontalDistributeCenter ,ChartNoAxesCombined , ChartSpline]
  return (
    <div className="bg-gradient-to-br from-slate-900 min-h-screen via-slate-900 to-slate-800 text-white  border border-gray-800 ">
      {/* Status Bar */}


      {/* Header */}
      <div className="flex items-center justify-between px-4 mb-6">
        <div className="flex items-center gap-2">
          
          <div>
            
            <p className="text-xs text-gray-400 font-semibold">{transaction?.currency}</p>
          </div>
        </div>
        <Bookmark className="w-6 h-6" />
      </div>

      {/* Price */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">${tradeData.close_price} </h1>
        <p className={` text-sm ${ tradeData.open_price <= tradeData.close_price ? 'text-green-500' : "text-red-500" }`} >▼ ${tradeData.price_changes} ({tradeData.percentage_changes?.toFixed(2)}%)</p>
      </div>
      <CountDown createdAt={transaction?.$createdAt} time={transaction?.time} creatHistory={history} lastHistory_id={last_hist?.$id} lastTrade_id={transaction?.$id} />
      
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
      <div className="bg-gray-900 rounded-2xl p-4 mb-6 h-auto relative">

       {
         selectedTab === 0 ?  <RealtimeChartWiderCandles asset={transaction?.currency} /> : selectedTab === 1 ? <RealtimeLineAreaChart asset={transaction?.currency}/> : <RealtimeLineChart asset={transaction?.currency} /> 
       }
        
       
      </div>

     
    </div>
  );
};

export default TradingChart;
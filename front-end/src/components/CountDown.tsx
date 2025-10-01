import { useUserContext } from '@/context/AuthProvider';
import { createHistory, getHistoryById, getLastNotification, getLastTransaction } from '@/lib/appwrite/api';
import { Transaction } from '@/lib/appwrite/appWriteConfig';
import { useCurrentUser, useUpdateUser } from '@/lib/query/api';
import { generateTradePrice } from '@/lib/utils';
import { Models } from 'appwrite';
import { X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner';



interface CountdownProps {
  createdAt: string;
  time: number; // in seconds
  lastTrade_id: string,
  lastHistory_id: string,
  call:boolean,
  stopCounting:boolean,
  creatHistory?: () => Promise<void>
}



const CountDown: React.FC<CountdownProps> = React.memo(({
  createdAt,
  time,
  lastTrade_id,
  lastHistory_id,
  call,
  stopCounting,
  creatHistory
}) => {
  const [lastHistory, setLastHistory] = useState<Models.Document | null>(null)
  const [lastTransaction, setLastTransaction] = useState<Models.Document | null>(null)
  const [timeLeft, setTimeLeft] = useState<string | null>(null);
  const {user,tradeData} = useUserContext()
  const hasCreatedHistory = useRef(false);
  const {data:currentUser} = useCurrentUser()

  const {mutateAsync:updateUser} = useUpdateUser()
  const fetch = async () => {
    try {
      const transaction_id = await getLastTransaction(user?.user_id)
      if (!transaction_id) return null
      setLastTransaction(transaction_id)

      const history_id = await getHistoryById(user?.user_id)
      if (!history_id) return null
      setLastHistory(history_id)
    } catch (error) {
      console.log(error);
    }
  }

  const history = async () => {
   
    const {
      takeProfit,
      iceberg
    } = lastTransaction

    const payload = {
      trade_id: lastTransaction.$id,
      user_id:user?.user_id,
      open_price: tradeData?.open_price,
      close_price: tradeData?.close_price,
      profit: currentUser?.profite , // fixed typo
      amount: lastTransaction?.amount,
      type: lastTransaction?.current_state,
      currency: lastTransaction?.currency,
    };

    console.log("Creating history with payload:", payload);

    try {
      const his = await createHistory(payload);
      const data = {
      userId:currentUser?.id,
      payload:{
        available_balance: currentUser?.available_balance + currentUser?.profite
      }
    }
      if (his) {
        await updateUser(data)
        return  toast("End of Trade", {
        description:`${his?.open_price >  his?.clode_price && lastTransaction?.current_state==='buy' ?  <X  /> : 'yes' }` + 'price changes' + ` ${ his?.open_price} → ${his?.clode_price}  `,
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
        
      });
    }
      return toast.error("failed");
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {

    fetch()

    if (lastTransaction?.$id !== lastHistory?.trade_id) {
      history()
    }
    console.log("I AM BEING RECALL");
    
  }, [stopCounting])

  const calculateTimeLeft = async () => {
    if (!lastTransaction?.$createdAt || !lastTransaction?.time) {
      setTimeLeft(null);
      return;
    }

    const currentTime = new Date().getTime();
    const createdAtTime = new Date(lastTransaction.$createdAt).getTime();
    const targetTime = createdAtTime + lastTransaction?.time * 1000;
    const timeDifference = targetTime - currentTime;
    if (currentTime < targetTime && !stopCounting) {
      
        console.log("THIS IS THE TIME DIFFERENCE:", timeDifference,lastTransaction);
        
      const hours = Math.floor(timeDifference / (1000 * 60 * 60));
      const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

      setTimeLeft(
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      );

    } else if (currentTime >= targetTime && !hasCreatedHistory.current  ) {
      
      setTimeLeft(null);
    }

    

    if (timeDifference < 1000 && !hasCreatedHistory.current && currentTime < targetTime) {
       await history()
       hasCreatedHistory.current = true
       console.log("HISTORY HAS BEEN CREATED");
    }
  };

  useEffect(() => {
    if (!lastTransaction?.$createdAt || !lastTransaction?.time || stopCounting || call) return;

    const intervalId = setInterval(() => {
      calculateTimeLeft();
    }, 1000);

    calculateTimeLeft();

    return () => clearInterval(intervalId);
  }, [lastTransaction?.$createdAt, lastTransaction?.time,stopCounting, call]);

  return (
    <div className="flex w-full items-center justify-between font-mono px-4 py-3 bg-slate-800 border border-border/50 mb-6">
      <div>Time Left</div>
      <div>{timeLeft || '00:00:00'}</div>
    </div>
  );
});


export default CountDown;





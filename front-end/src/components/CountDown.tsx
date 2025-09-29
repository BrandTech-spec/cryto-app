import { createHistory } from '@/lib/appwrite/api';
import { Transaction } from '@/lib/appwrite/appWriteConfig';
import { generateTradePrice } from '@/lib/utils';
import { Models } from 'appwrite';
import React, { useEffect, useState } from 'react'



interface CountdownProps {
    createdAt: string;
    time: number; // in seconds
    lastTrade_id:string,
    lastHistory_id:string,
    creatHistory:() => Promise<void>
  }



const CountDown: React.FC<CountdownProps> = React.memo(({
  createdAt,
  time,
  lastTrade_id,
  lastHistory_id,
  creatHistory
}) => {
  const [timeLeft, setTimeLeft] = useState<string | null>(null);

  const calculateTimeLeft = async () => {
    const currentTime = new Date().getTime();
    const createdAtTime = new Date(createdAt).getTime();
    const targetTime = createdAtTime + time * 1000;

    if (currentTime < targetTime) {
      const timeDifference = targetTime - currentTime;

      const hours = Math.floor(timeDifference / (1000 * 60 * 60));
      const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

      setTimeLeft(
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      );
    } else {
      await creatHistory(); // careful — avoid calling this multiple times!
      setTimeLeft(null);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      calculateTimeLeft();
    }, 1000);

    calculateTimeLeft();

    return () => clearInterval(intervalId);
  }, [createdAt, time]);

  return (
    <div className="flex w-full items-center justify-between font-mono px-4 py-3 bg-slate-800 border border-border/50 mb-6">
      <div>Time Left</div>
      <div>{timeLeft || '00:00:00'}</div>
    </div>
  );
});

export default CountDown;

import { useEffect, useState } from "react";
import { ArrowUpRight, Send, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useUserContext } from "@/context/AuthProvider";
import { useCreateNotification, useCurrentUser, useLastNotification } from "@/lib/query/api";
import { toast } from "sonner";

const Withdrawal = () => {
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
 // const [isLoading, setIsLoading] = useState(false);

  const availableBalance = 12543.67;
  const minWithdrawal = 50;

  const [countdown, setCountdown] = useState(null);
  const [canWithdraw, setCanWithdraw] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [withdrawalForm, setWithdrawalForm] = useState({
    amount: '',
    wallet: '',
    body: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const {user } = useUserContext()
  // Function to fetch last notification (mock implementation)
  console.log(user);
  
  const {data, isPending} = useLastNotification(user?.user_id)
  const {mutateAsync:createNotification, isPending:isLoading } = useCreateNotification()


type Countdown = {
  hours: number;
  minutes: number;
  seconds: number;
} | null;

function getCountdownOrNull(isoDate: string): Countdown {
  const inputDate = new Date(isoDate);
  const now = new Date();

  const msIn24Hours = 24 * 60 * 60 * 1000;
  const elapsed = now.getTime() - inputDate.getTime();

  if (elapsed >= msIn24Hours) {
    return null;
  }

  const remainingMs = msIn24Hours - elapsed;

  const hours = Math.floor(remainingMs / (1000 * 60 * 60));
  const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);

  return { hours, minutes, seconds };
}

function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

type CountdownTimerProps = {
  isoDate: string;
};

const {data:currentUser} = useCurrentUser()

  useEffect(() => {
    const interval = setInterval(() => {
      const timeLeft = getCountdownOrNull(data?.$createdAt);
      setCountdown(timeLeft);

      if (timeLeft === null) {
        clearInterval(interval); // Stop updating after 24h
      }
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [data?.$createdAt]);

 
  const handleWithdrawal = async() =>{

    const formData={
      user_id: user?.user_id, // Size 100, required
      body: "",   // Size 500, required
      type: "withdraw", // Optional (can be null)
      amount:parseFloat(amount) ,  // Min: 0, default 0
      withdrawal_wallet: address.trim(), // Size 200, optional (can be null)
      sentAt:  new Date().toISOString(),
    }

    if (parseFloat(amount) < 50 ) {
      return toast.error('can not withdraw lessthan $50 ')
    }

    if ( currentUser?.available_balance < parseFloat(amount) ) {
      return toast.error('insufficient balance please top-up to contineu trading ')
    }

    try {
    const notification =  await createNotification(formData)

    if (!notification) {
     return toast.error('failed to send notification')
    }
    toast.success('success')

 
    

    } catch (error) {
      console.log(error);
      toast.error('failed to send notification')
      
    }
  }

  return (
    <div className="container bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Withdraw Funds
        </h1>
        <p className="text-muted-foreground mt-2">
          Transfer your crypto to an external wallet
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Balance Info */}
        <Card className="bg-slate-800 border-slate-700 shadow-2xl shadow-slate-900/50 border border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Available Balance</p>
                <p className="text-2xl font-bold text-foreground">${currentUser?.available_balance.toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <ArrowUpRight className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Withdrawal Form */}
        <Card className="bg-slate-800 border-slate-700 shadow-2xl shadow-slate-900/50 border border-border/50">
          <CardHeader>
            <CardTitle className="text-foreground">Withdrawal Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-foreground">Amount (USD)</Label>
              <Input
                type="text"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-foreground"
              />
              <p className="text-xs text-muted-foreground">
                Minimum withdrawal: ${minWithdrawal}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-foreground">Wallet Address</Label>
              <Input
                id="address"
                placeholder="Enter destination wallet address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="text-foreground"
              />
            </div>

            <Alert className="bg-red-900/40 border-red-400">
              <AlertCircle className="h-4 w-4 text-crypto-orange" />
              <AlertDescription className="text-crypto-orange">
                {
                  countdown && countdown !== null ? <div> time left to the next withdrawal {pad(countdown.hours)}:{pad(countdown.minutes)}:{pad(countdown.seconds) || "00:00:00"}</div> : "Double-check your wallet address. Transactions cannot be reversed."
                }
                Double-check your wallet address. Transactions cannot be reversed.
              </AlertDescription>
            </Alert>

            <Button 
              onClick={handleWithdrawal}
              disabled={isLoading || countdown}
              className="w-full"
            >
              {isLoading ? (
                <>Processing...</>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Withdrawal Request
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="bg-slate-800 border-slate-700 shadow-2xl shadow-slate-900/50 border border-border/50">
          <CardContent className="p-4">
            <h3 className="font-semibold text-foreground mb-2">Processing Information</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Withdrawals are processed within 24 hours</li>
              <li>• A confirmation email will be sent to verify the request</li>
              <li>• Network fees may apply depending on the blockchain</li>
              <li>• Minimum withdrawal amount: ${minWithdrawal}</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Withdrawal;
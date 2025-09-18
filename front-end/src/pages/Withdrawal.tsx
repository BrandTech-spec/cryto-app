import { useState } from "react";
import { ArrowUpRight, Send, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const Withdrawal = () => {
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const availableBalance = 12543.67;
  const minWithdrawal = 50;
  const networkFee = 1;

  const handleWithdrawal = async () => {
    if (!user) return;
    
    if (!amount || !address) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const withdrawAmount = parseFloat(amount);
    if (withdrawAmount < minWithdrawal) {
      toast({
        title: "Error",
        description: `Minimum withdrawal amount is $${minWithdrawal}`,
        variant: "destructive",
      });
      return;
    }

    if (withdrawAmount > availableBalance) {
      toast({
        title: "Error",
        description: "Insufficient balance",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Get user profile for username
      const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single();

      // Create withdrawal transaction
      const { data: transaction, error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'withdrawal',
          amount: withdrawAmount,
          status: 'pending',
          description: `Withdrawal request for ${withdrawAmount} USDT to ${address}`
        })
        .select()
        .single();

      if (transactionError) throw transactionError;

      // Send confirmation email
      const { error: emailError } = await supabase.functions.invoke('send-transaction-email', {
        body: {
          transactionId: transaction.id,
          transactionType: 'withdrawal',
          userEmail: user.email,
          username: profile?.username || 'User',
          amount: withdrawAmount,
          currency: 'USDT',
          status: 'pending',
          walletAddress: address,
          networkFee: networkFee
        }
      });

      if (emailError) {
        console.error('Email error:', emailError);
        // Don't fail the transaction if email fails
      }

      setAmount("");
      setAddress("");
      toast({
        title: "Withdrawal Request Submitted",
        description: "Confirmation email has been sent to your registered email address",
      });
    } catch (error) {
      console.error('Withdrawal error:', error);
      toast({
        title: "Error",
        description: "Failed to submit withdrawal request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
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
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Available Balance</p>
                <p className="text-2xl font-bold text-foreground">${availableBalance.toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <ArrowUpRight className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Withdrawal Form */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="text-foreground">Withdrawal Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-foreground">Amount (USD)</Label>
              <Input
                id="amount"
                type="number"
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

            <Alert className="bg-crypto-orange/10 border-crypto-orange/20">
              <AlertCircle className="h-4 w-4 text-crypto-orange" />
              <AlertDescription className="text-crypto-orange">
                Double-check your wallet address. Transactions cannot be reversed.
              </AlertDescription>
            </Alert>

            <Button 
              onClick={handleWithdrawal}
              disabled={isLoading}
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
        <Card className="bg-gradient-card border-border/50">
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
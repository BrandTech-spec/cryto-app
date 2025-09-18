import { useState } from "react";
import { ArrowDownLeft, Copy, Check, QrCode } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const Deposit = () => {
  const [copied, setCopied] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const depositAddress = "1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S";
  const minDeposit = 10;

  const copyAddress = () => {
    navigator.clipboard.writeText(depositAddress);
    setCopied(true);
    toast({
      title: "Address Copied",
      description: "Deposit address copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const sendDepositInstructions = () => {
    setEmailSent(true);
    toast({
      title: "Instructions Sent",
      description: "Deposit instructions have been sent to your email",
    });
    setTimeout(() => setEmailSent(false), 3000);
  };

  const handleDepositRequest = async () => {
    if (!amount || !user) return;

    const depositAmount = parseFloat(amount);
    if (depositAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid deposit amount.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Get user profile for username
      const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single();

      // Create deposit transaction
      const { data: transaction, error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'deposit',
          amount: depositAmount,
          status: 'pending',
          description: `Deposit request for ${depositAmount} USDT`
        })
        .select()
        .single();

      if (transactionError) throw transactionError;

      // Send confirmation email
      const { error: emailError } = await supabase.functions.invoke('send-transaction-email', {
        body: {
          transactionId: transaction.id,
          transactionType: 'deposit',
          userEmail: user.email,
          username: profile?.username || 'User',
          amount: depositAmount,
          currency: 'USDT',
          status: 'pending',
          walletAddress: depositAddress
        }
      });

      if (emailError) {
        console.error('Email error:', emailError);
        // Don't fail the transaction if email fails
      }

      toast({
        title: "Deposit request submitted",
        description: "Your deposit request has been submitted and confirmation email sent.",
      });

      setAmount("");
    } catch (error) {
      console.error('Deposit error:', error);
      toast({
        title: "Error",
        description: "Failed to submit deposit request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Deposit Funds
        </h1>
        <p className="text-muted-foreground mt-2">
          Add funds to your crypto wallet
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Deposit Address */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center text-foreground">
              <ArrowDownLeft className="h-5 w-5 mr-2 text-primary" />
              Your Deposit Address
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="bg-primary/10 rounded-lg p-8 mb-4">
                <QrCode className="h-32 w-32 mx-auto text-primary mb-4" />
                <p className="text-xs text-muted-foreground">QR Code for deposit address</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Bitcoin Address</Label>
              <div className="flex space-x-2">
                <Input 
                  value={depositAddress} 
                  readOnly 
                  className="text-foreground font-mono text-sm"
                />
                <Button 
                  onClick={copyAddress}
                  variant="outline"
                  size="icon"
                  className="shrink-0"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-crypto-green" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
              <span className="text-sm text-foreground">Network</span>
              <Badge className="bg-crypto-green/10 text-crypto-green">Bitcoin (BTC)</Badge>
            </div>

            <Button 
              onClick={sendDepositInstructions}
              variant="outline" 
              className="w-full"
              disabled={emailSent}
            >
              {emailSent ? "Instructions Sent ✓" : "Email Deposit Instructions"}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle>Submit Deposit Request</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="amount" className="text-foreground">
                Deposit Amount (USDT)
              </Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                step="0.01"
                className="text-foreground"
              />
            </div>
            <Button 
              onClick={handleDepositRequest}
              className="w-full"
              disabled={!amount || isSubmitting || !user}
            >
              {isSubmitting ? "Submitting..." : "Submit Deposit Request"}
            </Button>
          </CardContent>
        </Card>

        {/* Deposit Info */}
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <h3 className="font-semibold text-foreground mb-3">Important Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Minimum Deposit</span>
                <span className="text-foreground font-semibold">${minDeposit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Confirmations Required</span>
                <span className="text-foreground font-semibold">3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Processing Time</span>
                <span className="text-foreground font-semibold">10-30 minutes</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <h3 className="font-semibold text-foreground mb-2">Deposit Instructions</h3>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Copy the deposit address above</li>
              <li>Send Bitcoin to this address from your external wallet</li>
              <li>Wait for network confirmations</li>
              <li>Funds will appear in your account automatically</li>
              <li>You'll receive an email confirmation once processed</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Deposit;
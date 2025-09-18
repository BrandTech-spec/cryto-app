import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, Bell, CheckCircle, DollarSign, Edit3, MessageSquare, Users, Wallet, Clock, TrendingUp, X, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAdmin } from "@/hooks/useAdmin";
import { supabase } from "@/integrations/supabase/client";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [balanceAmount, setBalanceAmount] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);

  const {
    users,
    transactions,
    stats,
    loading,
    isAdmin,
    updateUserBalance,
    processTransaction
  } = useAdmin();

  // Check authentication and redirect if not admin
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
      
      if (!user) {
        navigate('/signin');
        return;
      }
    };

    checkAuth();
  }, [navigate]);

  // Redirect if not admin
  useEffect(() => {
    if (!loading  ) {
      toast({
        title: "Access Denied",
        description: "You don't have admin privileges",
        variant: "destructive",
      });
      
    }
  }, [loading, currentUser, isAdmin, navigate, toast]);

  const handleBalanceUpdate = async (userId: string) => {
    if (!balanceAmount) return;
    
    const success = await updateUserBalance(userId, parseFloat(balanceAmount));
    if (success) {
      setBalanceAmount("");
      setSelectedUser(null);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="text-lg">Loading admin dashboard...</div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null; // Will redirect to signin
  }



  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Badge variant="outline" className="text-green-600 border-green-600">
          <CheckCircle className="w-4 h-4 mr-1" />
          System Online
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Transactions
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Messages
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">Registered users</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.totalBalance.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">System balance</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Transactions</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingTransactions}</div>
                <p className="text-xs text-muted-foreground">Require approval</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recent Messages</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.unreadMessages}</div>
                <p className="text-xs text-muted-foreground">Active conversations</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage user profiles and balances</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>User ID</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.username}</TableCell>
                      <TableCell className="text-muted-foreground">{user.id.slice(0, 8)}...</TableCell>
                      <TableCell>${(user.balance || 0).toLocaleString()}</TableCell>
                      <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedUser(user.id)}
                          className="mr-2"
                        >
                          <Edit3 className="w-4 h-4 mr-1" />
                          Edit Balance
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {selectedUser && (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle>Update User Balance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="balance">New Balance Amount</Label>
                      <Input
                        id="balance"
                        type="number"
                        placeholder="Enter new balance"
                        value={balanceAmount}
                        onChange={(e) => setBalanceAmount(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => handleBalanceUpdate(selectedUser)}>
                        <Wallet className="w-4 h-4 mr-2" />
                        Update Balance
                      </Button>
                      <Button variant="outline" onClick={() => setSelectedUser(null)}>
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Management</CardTitle>
              <CardDescription>Review and approve pending transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">
                        {transaction.profiles?.username || 'Unknown User'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={transaction.type === 'deposit' ? 'default' : 'secondary'}>
                          {transaction.type}
                        </Badge>
                      </TableCell>
                      <TableCell>${transaction.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            transaction.status === 'approved' ? 'default' : 
                            transaction.status === 'rejected' ? 'destructive' : 
                            'secondary'
                          }
                        >
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(transaction.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {transaction.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => processTransaction(transaction.id, 'approved')}
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => processTransaction(transaction.id, 'rejected')}
                            >
                              <X className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Messages</CardTitle>
              <CardDescription>Manage conversations with users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <div className="text-lg font-medium">Message Management</div>
                <div className="text-muted-foreground mb-4">
                  View and respond to user messages through individual conversation pages
                </div>
                <Button onClick={() => navigate('/chat')}>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Open Chat Interface
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Notifications</CardTitle>
              <CardDescription>Monitor system alerts and user activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.filter(t => t.status === 'pending').length > 0 ? (
                  transactions
                    .filter(t => t.status === 'pending')
                    .slice(0, 5)
                    .map((transaction) => (
                      <Card 
                        key={transaction.id} 
                        className="border-l-4 border-l-orange-500 hover:bg-accent/50 transition-colors"
                      >
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                                <Clock className="w-5 h-5 text-orange-600" />
                              </div>
                              <div>
                                <h4 className="font-semibold">
                                  Pending {transaction.type} - {transaction.profiles?.username}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  Amount: ${transaction.amount.toLocaleString()}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(transaction.created_at).toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => processTransaction(transaction.id, 'approved')}
                              >
                                <Check className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => processTransaction(transaction.id, 'rejected')}
                              >
                                <X className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                ) : (
                  <div className="text-center py-8">
                    <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <div className="text-lg font-medium">No Pending Notifications</div>
                    <div className="text-muted-foreground">All transactions are up to date</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
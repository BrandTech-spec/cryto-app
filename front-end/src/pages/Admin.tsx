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
import { useGetAllUser, useUpdateUser } from "@/lib/query/api";
import { User } from "@/lib/appwrite/appWriteConfig";
import { Models } from "appwrite";
import  { MessageIconWithCounter } from "@/components/Avatar";
import { useUserContext } from "@/context/AuthProvider";
import { set } from "date-fns";
import { toast } from "sonner";

const Admin = () => {
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [balanceAmount, setBalanceAmount] = useState("");
  const [profite, setProfite] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { user } = useUserContext()
  // Check authentication and redirect if not admin
  const { data: users, isPending } = useGetAllUser()
  const { mutateAsync: update, isPending: isUpdating } = useUpdateUser()
  // Redirect if not admin

  const handleBalanceUpdate = async (userId: string) => {
    if (!balanceAmount || !profite) return;
    const formData = {
      userId,
      payload:{
        profite:parseFloat(profite),
        amount:parseFloat(balanceAmount)
      }
    }

    try {

     const u =  await update(formData)
     toast.error("user succefully updated")

    } catch (error) {
      console.log(error);
      toast.error("some thing went wrong please try again")

    } finally {
      setBalanceAmount("");
      setSelectedUser(null);
      setProfite('')
    }

  };





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
          
        </TabsList>

        {/*<TabsContent value="overview" className="space-y-4">
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
        </TabsContent>*/}

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage user profiles and balances</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
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
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>User ID</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Profite</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users?.map((user) => (
                    <TableRow key={user.$id}>
                      <TableCell className="font-medium">{user?.user_name}</TableCell>
                      <TableCell className="text-muted-foreground">{"user_" + user.$id.slice(0, 4).toLocaleUpperCase()}...</TableCell>
                      <TableCell>${(user?.available_balance || 0).toLocaleString()}</TableCell>
                      <TableCell>{user?.profite}</TableCell>
                      <TableCell><div> <MessageIconWithCounter /></div> </TableCell>
                      <TableCell><MessageIconWithCounter /></TableCell>
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
              {/*<div className="space-y-4">
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
              </div>*/}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
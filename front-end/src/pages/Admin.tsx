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
import { AlertTriangle, Bell, CheckCircle, DollarSign, Edit3, MessageSquare, Users, Wallet, Clock, TrendingUp, X, Check, Copy, ArrowDownLeft, MessageCircleMore, BellIcon } from "lucide-react";
import { useGetAllUser, useGetSpecialData, useUpdateSpecialData, useUpdateUser } from "@/lib/query/api";
import { COLLECTION_ID_MESSAGES, DATABASE_ID, databases, NOTIFICATION_COLLECTION_ID, User } from "@/lib/appwrite/appWriteConfig";
import { Models, Query } from "appwrite";
import { MessageIconWithCounter } from "@/components/Avatar";
import { useUserContext } from "@/context/AuthProvider";
import { set } from "date-fns";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import EmailSenderForm from "@/components/EmailSender";

function AlertDialogDemo({ userId, profite, setProfite, balanceAmount, setBalanceAmount, user_balance, user_profile }: { userId: string, profite, setProfite: (p: string) => void, balanceAmount: string, setBalanceAmount: (p: string) => void, user_balance: number, user_profile: number }) {
  const { mutateAsync: update, isPending: isUpdating } = useUpdateUser()

  const getValues = () => {
    setBalanceAmount(user_balance)
    setProfite(user_profile)
  }



  console.log("THESE ARE THE VALUES", user_balance, user_profile);


  const handleBalanceUpdate = async () => {
    if (!balanceAmount || !profite) return;
    const formData = {
      userId,
      payload: {
        profite: parseFloat(profite),
        available_balance: parseFloat(balanceAmount)
      }
    }

    try {

      const u = await update(formData)
      toast.error("user succefully updated")

    } catch (error) {
      console.log(error);
      toast.error("some thing went wrong please try again")

    } finally {
      setBalanceAmount("");
      setProfite('')
    }

  };


  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="mr-2"
          onClick={getValues}
        >
          <Edit3 className="w-4 h-4 mr-1" />
          Edit Balance
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Update User Balance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="balance">New Balance Amount</Label>
                <Input
                  defaultValue={user_balance}
                  id="balance"
                  type="number"
                  placeholder="Enter new balance"
                  value={balanceAmount}
                  onChange={(e) => setBalanceAmount(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="balance">profite</Label>
                <Input
                  defaultValue={user_profile}
                  id="balance"
                  type="number"
                  placeholder="Enter new balance"
                  value={profite}
                  onChange={(e) => setProfite(e.target.value)}
                />
              </div>

            </CardContent>
          </Card>

        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleBalanceUpdate}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}



const Admin = () => {
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [balanceAmount, setBalanceAmount] = useState("");
  const [profite, setProfite] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { user } = useUserContext()
  // const [count, setCount] = useState(0)
  // Check authentication and redirect if not admin
  const { data: users, isPending } = useGetAllUser()
  // Redirect if not admin


  const { data } = useGetSpecialData()
  const [address, setAddress] = useState("")
  const [currency, setCurrency] = useState()
  const [copied, setCopied] = useState(false);
  const copyAddress = () => {
    if (!data || !data?.transaction_code) {
      toast.error("failed to copy");
    }
    navigator.clipboard.writeText(data?.transaction_code);
    setCopied(true);
    toast.success("Deposit address copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const { mutateAsync: updatingSpecialData, isPending: isUpdating } = useUpdateSpecialData()


  const updateSData = async () => {


    if (!address || address.length === 0 || address === null || address === undefined) {
      return toast.error("Bitcoin Address can not be empty")
    }

    const payload = {
      dataId: data?.$id,
      payload: { transaction_code: address.trim(),currency }
    }
    try {
      const update = await updatingSpecialData(payload)

      if (update) {
        return toast.success("Bitcoin Address successfully update")
      }
    } catch (error) {
      console.log(error);
      toast.error("something went wrong please try again")
    } finally {
      setAddress("")
    }
  }
  const route = (to: string) => {
    navigate(to)
  }

  const [messageCounts, setMessageCounts] = useState<Record<string, number>>({})
  const [notCount, setNotCount] = useState({})
  useEffect(() => {
    if (!users) return

    const fetchCounts = async () => {
      const newCounts: Record<string, number> = {}
      const notCounts: Record<string, number> = {}
      for (const u of users) {
        try {
          const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTION_ID_MESSAGES,
            [
              Query.equal("sender_id", u.user_id),
              Query.isNull("readAt")
            ]
          )
          newCounts[u.user_id] = response.total // ✅ Appwrite gives total count
        } catch (err) {
          console.error("Error fetching count for", u.user_id, err)
          newCounts[u.user_id] = 0
        }
      }

      for (const u of users) {
        try {
          const response = await databases.listDocuments(
            DATABASE_ID,
            NOTIFICATION_COLLECTION_ID,
            [
              Query.equal("user_id", u.user_id),
              Query.isNull("readAt")
            ]
          )
          notCounts[u.user_id] = response.total // ✅ Appwrite gives total count
        } catch (err) {
          console.error("Error fetching count for", u.user_id, err)
          notCounts[u.user_id] = 0
        }
      }

      setMessageCounts(newCounts)
      setNotCount(notCounts)
    }

    fetchCounts()
  }, [users])



  const geNotificationCount = async () => {
        for (const u of users) {
      try {
        const response = await databases.updateDocument(
          DATABASE_ID,
          NOTIFICATION_COLLECTION_ID,
          u?.$id,
          {
            readAt: Date.now()
          }
        )

      } catch (err) {
        console.error("Error fetching count for", u.user_id, err)

      }
    }
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

          <TabsTrigger value="emails" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Email
          </TabsTrigger>

        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">


            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0 Users</div>
                <p className="text-xs text-muted-foreground">System balance</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center text-foreground">
                  <ArrowDownLeft className="h-5 w-5 mr-2 text-primary" />
                  Your Deposit Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">


                <div className="space-y-2">
                  <Label className="text-foreground">Wallet Address</Label>
                  <div className="flex space-x-2">
                    <Input
                      value={data?.transaction_code}
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


                <Input
                  defaultChecked={data?.transaction_code}
                  placeholder="transaction Code"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="text-foreground font-mono text-sm"
                />

                <Input
                  value={currency}
                  placeholder=" current wallet "
                  onChange={(e) => setCurrency(e.target.value)}
                  className="text-foreground font-mono text-sm"
                />


                <Button
                  onClick={() => updateSData()}
                  variant="outline"
                  className="w-full bg-blue-600"
                >

                  {
                    isUpdating ? " updating Bitcoin Address..." : "Submit"
                  }

                </Button>
              </CardContent>
            </Card>


          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card className="bg-transparent">
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
                    <TableHead>Profite</TableHead>
                    <TableHead>email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>chat</TableHead>
                    <TableHead>notification</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users?.map((user) => {
                    

                    return (
                      <TableRow key={user.$id}>
                        <TableCell className="font-medium">{user?.user_name}</TableCell>
                        <TableCell className="text-muted-foreground">{"user_" + user.$id.slice(0, 4).toLocaleUpperCase()}...</TableCell>
                        <TableCell>${(user?.available_balance || 0).toLocaleString()}</TableCell>
                        <TableCell>{user?.profite}</TableCell>
                        <TableCell>{user?.email || 'unset'}</TableCell>
                        <TableCell>{user?.phone || 'unset'}</TableCell>
                        <TableCell>{user?.address || 'unset'}</TableCell>
                        <TableCell>
                          <MessageIconWithCounter
                            count={messageCounts[user.user_id] || 0}
                            to={`chat/${user.user_id}`}
                            onClick={() => route(`/chat/${user.user_id}`)}
                            Icon={MessageCircleMore}
                          />
                        </TableCell>

                        <TableCell> <MessageIconWithCounter count={notCount[user.user_id] || 0} to={`chat/${user?.user_id}`} onClick={() => route(`/notifications/${user?.user_id}`)} Icon={BellIcon} />
                        </TableCell>
                        <TableCell>
                          < AlertDialogDemo user_profile={user?.profite} user_balance={user?.available_balance} profite={profite} setProfite={setProfite} balanceAmount={balanceAmount} setBalanceAmount={setBalanceAmount} userId={user?.$id} />
                        </TableCell>
                      </TableRow>
                    )
                  })}

                </TableBody>
              </Table>


            </CardContent>
          </Card>
        </TabsContent>



        <TabsContent value="emails" className="space-y-4">
          <EmailSenderForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
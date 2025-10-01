import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Bell, CheckCircle, AlertTriangle, DollarSign, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCurrentUser, useGetCurrentUserById, useUpdateNotification, useUserNotifications } from "@/lib/query/api";
import { useUserContext } from "@/context/AuthProvider";
import { updateSpecialData } from "@/lib/appwrite/api";
import { toast } from "sonner";
import { COLLECTION_ID_MESSAGES, DATABASE_ID, databases, NOTIFICATION_COLLECTION_ID } from "@/lib/appwrite/appWriteConfig";
import { useEffect } from "react";

const UserNotifications = () => {
 // const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useUserContext();
  const {data, isPending} = useUserNotifications(user?.user_id)
  const {notId} = useParams()
  // Mock user data - replace with real data from backend
  const users = [
    { id: "1", name: "John Doe", email: "john@example.com" },
    { id: "2", name: "Jane Smith", email: "jane@example.com" },
    { id: "3", name: "Mike Johnson", email: "mike@example.com" },
  ];

  const userId = "1"

  // Mock notifications for this user - replace with real data from backend
  const userNotifications = [
    { id: "1", type: "withdrawal", amount: 2500, timestamp: "2024-01-20 15:30", status: "pending", description: "Withdrawal to external wallet" },
    { id: "2", type: "deposit", amount: 5000, timestamp: "2024-01-19 14:20", status: "approved", description: "Bitcoin deposit confirmation" },
    { id: "3", type: "withdrawal", amount: 1500, timestamp: "2024-01-18 11:45", status: "pending", description: "Withdrawal to bank account" },
    { id: "4", type: "deposit", amount: 3000, timestamp: "2024-01-17 09:30", status: "approved", description: "Ethereum deposit confirmation" },
  ];

 // const currentUser = users.find(user => user.id === userId);


 const {mutateAsync:updateNotification} =  useUpdateNotification()

  const handleNotificationAction = async(notificationId: string, action: "approve" | "reject") => {
    const payload = {
      notId:notificationId,
      data:{
        status: action === "approve" ? "completed" : 'failed'
      }
    }

    try {
    let not =  await updateNotification(payload)
     if (not) {
      toast.success("success")
     }

    } catch (error) {
      console.log(error);
       toast.success("failed to update notification")
    }
  };

   const {data:currentUser} = useGetCurrentUserById(user?.user_id)
  
    const {data:notifications, isPending:isLoading} = useUserNotifications(notId)
   const getResetNotificationCount = async () => {
     const userMessages = notifications.filter((m) => m.readAt === null )
 

       for (const u of userMessages) {
         try {
           const response = await databases.updateDocument(
             DATABASE_ID,
             NOTIFICATION_COLLECTION_ID,
             u?.$id,
             {
              readAt: new Date().toISOString()

             }
           )
 
         } catch (err) {
           console.error("Error fetching count for", u.user_id, err)
 
         }
       
     } 
   }

   useEffect(() => {
     getResetNotificationCount()
   }, [])
   
  if (!currentUser) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6 text-center">
            <p>User not found</p>
            <Button onClick={() => navigate("/admin")} className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Admin
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container   space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate("/admin")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Admin
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{currentUser.user_name}</h1>
            <p className="text-muted-foreground">{currentUser.email}</p>
          </div>
        </div>
      </div>

      <Card className="bg-transparent ">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications for {currentUser.user_name}
          </CardTitle>
          <CardDescription>Review and manage transaction requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications?.map((notification) => (
              <Card  key={notification.id} className=" bg-slate-800 border border-border/50 border-l-4 border-l-primary">
                <CardContent className="pt-4">
                  <div className="flex max-md:flex-col max-md:gap-3 items-center justify-between">
                    <div className="flex items-center gap-3">
                      {notification.type === "withdrawal" ? (
                        <AlertTriangle className="w-6 h-6 text-destructive" />
                      ) : (
                        <DollarSign className="w-6 h-6 text-success" />
                      )}
                      <div>
                        <h4 className="font-semibold">
                          {notification.type === "withdrawal" ? "Withdrawal Request" : "Deposit Confirmation"}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                           {currentUser.user_name} requestes a {notification?.type} of  ${notification.amount.toLocaleString()} at {notification.description}
                        </p>
                        <p className="text-xs text-muted-foreground">{notification.timestamp}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {notification.status === "pending" ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleNotificationAction(notification.$id, "approve")}
                            className="text-success border-success hover:bg-success hover:text-success-foreground"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleNotificationAction(notification.$id, "reject")}
                            className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                          >
                            <AlertTriangle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      ) : (
                        <Badge variant="default" className="text-success border-success">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {notification.status}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserNotifications;
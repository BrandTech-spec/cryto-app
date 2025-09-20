import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, Send, Paperclip, Phone, Video } from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useRealtimeChat } from "@/hooks/useRealtimeChat";
import { supabase } from "@/integrations/supabase/client";
import { client, COLLECTION_ID_MESSAGES, DATABASE_ID, databases, ID } from "@/lib/appwrite/appWriteConfig";
import { Query } from "appwrite";
import { useUserContext } from "@/context/AuthProvider";
import { useGetSpecialData, useUpdateSpecialData } from "@/lib/query/api";

type Messages = {
  reciever_id:string,
  sender_id:string,
  reply:string,
  body:string,
  sentAt:string,
  readAt:string
}

const Chat = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [reply, setReply] = useState('')
  const [messageBody, setMessageBody] = useState('')
  const [messages, setMessages] = useState([])
  const {user} = useUserContext()
  const {data:special, isPending} = useGetSpecialData()

  const {userId} = useParams()

  useEffect(() => {
      getMessages();
    
      const unsubscribe = client.subscribe(`databases.${DATABASE_ID}.collections.${COLLECTION_ID_MESSAGES}.documents`, response => {

          if(response.events.includes("databases.*.collections.*.documents.*.create")){
              console.log('A MESSAGE WAS CREATED')
              setMessages(prevState => [response.payload, ...prevState])
          }

          if(response.events.includes("databases.*.collections.*.documents.*.delete")){
              console.log('A MESSAGE WAS DELETED!!!')
              setMessages(prevState => prevState.filter(message => message.$id !== response.payload.$id))
          }
      });

      console.log('unsubscribe:', unsubscribe)
    
      return () => {
        unsubscribe();
      };
    }, []);


  const getMessages = async () => {
      const response = await databases.listDocuments(
          DATABASE_ID,
          COLLECTION_ID_MESSAGES,
          [
              Query.orderDesc('$createdAt'),
              Query.limit(100),
          ]
      )
      console.log(response.documents)
      setMessages(response.documents)
  }

  const handleSubmit = async (e) => {
      e.preventDefault()
      console.log('MESSAGE:', messageBody)

      

      const payload = {
        reciever_id:userId === user.user_id ? special.message_id : userId,
        sender_id:userId === user.user_id ? userId : special.message_id ,
        reply:reply,
        body:message,
        sentAt:new Date().toISOString,
        
      }

      const response = await databases.createDocument(
              DATABASE_ID, 
              COLLECTION_ID_MESSAGES, 
              ID.unique(), 
              payload,
             
          )

      console.log('RESPONSE:', response)

      // setMessages(prevState => [response, ...prevState])

      setMessageBody('')

  }

  const deleteMessage = async (id) => {
      await databases.deleteDocument(DATABASE_ID, COLLECTION_ID_MESSAGES, id);
      //setMessages(prevState => prevState.filter(message => message.$id !== message_id))
   } 


  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border p-4 flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <Avatar className="h-10 w-10">
          <AvatarImage src="/placeholder.svg" />
          <AvatarFallback>CS</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">Customer Support</h3>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-muted-foreground">Online • Avg response: 2 min</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="ghost" size="icon">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Video className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        {isPending ? (
          <div className="flex justify-center py-8">
            <div className="text-muted-foreground">Loading messages...</div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => {
              const isCurrentUser = msg.sender_id === user?.$id;
              const isAdmin = msg.is_admin;
              
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${isCurrentUser ? "flex-row-reverse" : ""}`}
                >
                  {!isCurrentUser && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>{isAdmin ? "CS" : "U"}</AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className={`max-w-[80%] ${isCurrentUser ? "text-right" : ""}`}>
                    <div
                      className={`rounded-2xl px-4 py-3 ${
                        isCurrentUser
                          ? "bg-primary text-primary-foreground ml-auto"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 px-2">
                      {new Date(msg.created_at).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>

    

      {/* Message Input */}
      <div className="bg-card border-t border-border p-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Paperclip className="h-5 w-5" />
          </Button>
          
          <div className="flex-1 relative">
            <Input
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="pr-12"
            />
            <Button
              size="icon"
              onClick={handleSendMessage}
              className="absolute right-1 top-1 h-8 w-8"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
       
       
      </div>
    </div>
  );
};

export default Chat;
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
  reciever_id: string,
  sender_id: string,
  reply: string,
  body: string,
  sentAt: string,
  readAt: string
}

const Chat = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [reply, setReply] = useState('')
  const [messageBody, setMessageBody] = useState('')
  const [messages, setMessages] = useState([])
  const { user } = useUserContext()
  const { data: special, isPending } = useGetSpecialData()

  const { userId } = useParams()

  useEffect(() => {
    getMessages();
    getResetMessageCount()
    const unsubscribe = client.subscribe(`databases.${DATABASE_ID}.collections.${COLLECTION_ID_MESSAGES}.documents`, response => {

      if (response.events.includes("databases.*.collections.*.documents.*.create")) {
        console.log('A MESSAGE WAS CREATED')
        setMessages(prevState => [response.payload, ...prevState])
      }

      if (response.events.includes("databases.*.collections.*.documents.*.delete")) {
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
        Query.or([
          Query.equal("sender_id", userId),
          Query.equal("reciever_id", userId)
        ])
      ]
    )
    console.log(response.documents)
    setMessages(response.documents)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('MESSAGE:', messageBody)



    const payload = {
      reciever_id: userId === user.user_id ? special.message_id : userId,
      sender_id: userId === user.user_id ? userId : user?.user_id,
      reply: reply,
      body: message,
      sentAt: new Date(),

    }

    try {
      const response = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID_MESSAGES,
        ID.unique(),
        payload,

      )

      console.log('RESPONSE:', response)

    } catch (error) {
      console.log(error);

    } finally {

      setMessage('')
    }



    // setMessages(prevState => [response, ...prevState])


  }

  const getResetMessageCount = async () => {
    const userMessages = messages.filter((m) => m.readAt === null && m.sender_id !== userId)
    const adminMessage = messages.filter((m) => m.readAt === null && m.sender_id === userId)

    if (user?.user_id === userId) {
      for (const u of userMessages) {
        try {
          const response = await databases.updateDocument(
            DATABASE_ID,
            COLLECTION_ID_MESSAGES,
            u?.$id,
            {
              readAt: Date.now()
            }
          )

        } catch (err) {
          console.error("Error fetching count for", u.user_id, err)

        }
      }
    } else {
      for (const u of adminMessage) {
        try {
          const response = await databases.updateDocument(
            DATABASE_ID,
            COLLECTION_ID_MESSAGES,
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
  }


  const deleteMessage = async (id) => {
    await databases.deleteDocument(DATABASE_ID, COLLECTION_ID_MESSAGES, id);
    //setMessages(prevState => prevState.filter(message => message.$id !== message_id))
  }

  const sorted_messages = messages.sort((a, b) => new Date(a.$createdAt) - new Date(b.$createdAt));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 flex flex-col">
      {/* Header */}
      <div className=" border-b fixed bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 top-0 z-50 inset-x-0 border-border p-4 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-2)}
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
      <ScrollArea className="flex-1 px-4 py-28 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800" ref={scrollRef}>
        {isPending ? (
          <div className="flex justify-center py-8">
            <div className="text-muted-foreground">Loading messages...</div>
          </div>
        ) : (
          <div className="space-y-4">
            {sorted_messages?.map((msg) => {
              const isCurrentUser = msg.sender_id === user?.user_id;
              const isAdmin = msg.is_admin;

              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${isCurrentUser ? "flex-row-reverse" : ""}`}
                >
                  {!isCurrentUser && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" />
                      <AvatarFallback>{isAdmin ? "CS" : "U"}</AvatarFallback>
                    </Avatar>
                  )}

                  <div className={`max-w-[80%] ${isCurrentUser ? "text-right" : ""}`}>
                    <div
                      className={`rounded-2xl px-4 py-3 ${isCurrentUser
                          ? "bg-primary text-primary-foreground ml-auto"
                          : "bg-muted text-foreground"
                        }`}
                    >
                      <p className="text-sm">{msg.body}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 px-2">
                      {new Date(msg.$createdAt).toLocaleTimeString([], {
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
      <div className=" border-t fixed bottom-0 inset-x-0 z-50 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 border-border p-4">
        <div className="flex items-center gap-2">


          <div className="flex-1  relative">
            <Input
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSubmit(e)}
              className="pr-12 bg-transparent"
            />
            <Button
              size="icon"
              onClick={handleSubmit}
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
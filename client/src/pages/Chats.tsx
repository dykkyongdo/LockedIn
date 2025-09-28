import React, { useState, useEffect } from "react";
import { MessageCircle, ArrowLeft, Building, MapPin, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { AppHeader } from "@/components/layout/app-header";

interface Chat {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  companyLogo?: string;
  location: string;
  salary: {
    min: number;
    max: number;
  };
  lastMessage: {
    content: string;
    timestamp: string;
    sender: 'applicant' | 'employer';
  };
  unreadCount: number;
  status: 'active' | 'closed';
}

interface User {
  name: string;
  avatar?: string;
}

export default function Chats() {
  const [user, setUser] = useState<User>({ name: "User", avatar: "" });
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);

  // Load user data from localStorage
  useEffect(() => {
    const loadUserData = () => {
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        try {
          const parsedProfile = JSON.parse(savedProfile);
          setUser({
            name: parsedProfile.name || "User",
            avatar: parsedProfile.photo || ""
          });
        } catch (error) {
          console.error('Error loading user profile:', error);
        }
      }
    };

    loadUserData();
  }, []);

  // Mock chat data - in a real app, this would come from an API
  useEffect(() => {
    const mockChats: Chat[] = [
      {
        id: "1",
        jobId: "1",
        jobTitle: "Full Stack Developer",
        companyName: "TechCorp",
        companyLogo: undefined,
        location: "San Francisco, CA",
        salary: { min: 80000, max: 120000 },
        lastMessage: {
          content: "Hi! Thanks for your interest in our Full Stack Developer position. We'd love to learn more about your experience with React and Node.js.",
          timestamp: "2 hours ago",
          sender: 'employer'
        },
        unreadCount: 2,
        status: 'active'
      },
      {
        id: "2",
        jobId: "2",
        jobTitle: "Product Manager",
        companyName: "StartupXYZ",
        companyLogo: undefined,
        location: "New York, NY",
        salary: { min: 90000, max: 130000 },
        lastMessage: {
          content: "Hello! I'm excited about the Product Manager role. I have 3 years of experience in product strategy and would love to discuss how I can contribute to your team.",
          timestamp: "1 day ago",
          sender: 'applicant'
        },
        unreadCount: 0,
        status: 'active'
      },
      {
        id: "3",
        jobId: "3",
        jobTitle: "Data Scientist",
        companyName: "DataFlow Inc",
        companyLogo: undefined,
        location: "Seattle, WA",
        salary: { min: 95000, max: 140000 },
        lastMessage: {
          content: "Thank you for reaching out! We're impressed with your background in machine learning. Let's schedule a call to discuss the role further.",
          timestamp: "3 days ago",
          sender: 'employer'
        },
        unreadCount: 1,
        status: 'active'
      }
    ];

    setChats(mockChats);
    
    // If there's a chatId in the URL, select that chat
    const urlParams = new URLSearchParams(window.location.search);
    const chatId = urlParams.get('chatId');
    if (chatId) {
      setSelectedChat(chatId);
    }
  }, []);

  const selectedChatData = selectedChat ? chats.find(chat => chat.id === selectedChat) : null;

  const handleBackToSeeking = () => {
    window.location.href = "/seeking";
  };

  const formatTime = (timestamp: string) => {
    return timestamp;
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader user={user} onProfileClick={() => window.location.href = "/profile"} />
      
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToSeeking}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Jobs
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Messages</h1>
                <p className="text-muted-foreground">Connect with potential employers</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chat List */}
            <div className="lg:col-span-1">
              <Card className="p-4 shadow-card border-0">
                <h2 className="font-semibold text-lg mb-4">Conversations</h2>
                <div className="space-y-3">
                  {chats.map((chat) => (
                    <div
                      key={chat.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedChat === chat.id
                          ? "bg-gradient-subtle border border-electric-purple/20"
                          : "hover:bg-muted/50"
                      }`}
                      onClick={() => setSelectedChat(chat.id)}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={chat.companyLogo} />
                          <AvatarFallback className="bg-gradient-primary text-white">
                            <Building className="h-5 w-5" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-sm truncate">{chat.companyName}</h3>
                            {chat.unreadCount > 0 && (
                              <Badge variant="destructive" className="text-xs">
                                {chat.unreadCount}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate mb-1">
                            {chat.jobTitle}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {chat.lastMessage.content}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatTime(chat.lastMessage.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Chat View */}
            <div className="lg:col-span-2">
              {selectedChatData ? (
                <Card className="h-[600px] flex flex-col shadow-card border-0">
                  {/* Chat Header */}
                  <div className="p-4 border-b border-border">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={selectedChatData.companyLogo} />
                        <AvatarFallback className="bg-gradient-primary text-white">
                          <Building className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold">{selectedChatData.companyName}</h3>
                        <p className="text-sm text-muted-foreground">{selectedChatData.jobTitle}</p>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <div className="flex items-center gap-1 mb-1">
                          <MapPin className="h-3 w-3" />
                          {selectedChatData.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          ${selectedChatData.salary.min.toLocaleString()} - ${selectedChatData.salary.max.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 p-4 overflow-y-auto">
                    <div className="space-y-4">
                      {/* First message */}
                      <div className={`flex ${selectedChatData.lastMessage.sender === 'applicant' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-lg ${
                          selectedChatData.lastMessage.sender === 'applicant'
                            ? 'bg-gradient-primary text-white'
                            : 'bg-muted'
                        }`}>
                          <p className="text-sm">{selectedChatData.lastMessage.content}</p>
                          <p className={`text-xs mt-1 ${
                            selectedChatData.lastMessage.sender === 'applicant'
                              ? 'text-white/70'
                              : 'text-muted-foreground'
                          }`}>
                            {formatTime(selectedChatData.lastMessage.timestamp)}
                          </p>
                        </div>
                      </div>

                      {/* Placeholder for more messages */}
                      <div className="text-center text-muted-foreground text-sm py-8">
                        <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>Start a conversation!</p>
                        <p className="text-xs">More messages will appear here as you chat.</p>
                      </div>
                    </div>
                  </div>

                  {/* Message Input (placeholder) */}
                  <div className="p-4 border-t border-border">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Type your message..."
                        className="flex-1 px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        disabled
                      />
                      <Button disabled size="sm">
                        Send
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Messaging functionality coming soon!
                    </p>
                  </div>
                </Card>
              ) : (
                <Card className="h-[600px] flex items-center justify-center shadow-card border-0">
                  <div className="text-center text-muted-foreground">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
                    <p>Choose a chat from the list to start messaging</p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

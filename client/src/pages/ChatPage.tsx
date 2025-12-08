import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import ConversationItem from "@/components/ConversationItem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PanelLeft, Search, Plus } from "lucide-react";
import { useState } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface Conversation {
  id: string;
  title: string;
  preview: string;
  timestamp: string;
}

export default function ChatPage({ userType }: { userType: "internal" | "client" }) {
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeConversation, setActiveConversation] = useState("1");
  const [searchQuery, setSearchQuery] = useState("");

  const mockConversations: Conversation[] = [
    {
      id: "1",
      title: "Investment Account Features",
      preview: "What are the key features of our premium investment...",
      timestamp: "2 hours ago",
    },
    {
      id: "2",
      title: "Compliance Review Fees",
      preview: "Can you explain the fee structure for internal...",
      timestamp: "Yesterday",
    },
    {
      id: "3",
      title: "Market Analysis Q4 2024",
      preview: "Provide a comprehensive market analysis...",
      timestamp: "3 days ago",
    },
  ];

  const conversationMessages: Record<string, Message[]> = {
    "1": [
      {
        id: "1",
        role: "user",
        content: "What are the key features of our premium investment account?",
        timestamp: "2:34 PM",
      },
      {
        id: "2",
        role: "assistant",
        content: "Our premium investment account offers diversified portfolio management, low-fee index funds, automated rebalancing, and dedicated financial advisor access. You'll also get priority customer support and exclusive market insights.",
        timestamp: "2:34 PM",
      },
    ],
    "2": [
      {
        id: "1",
        role: "user",
        content: "Can you explain the fee structure for internal compliance reviews?",
        timestamp: "Yesterday",
      },
      {
        id: "2",
        role: "assistant",
        content: "Internal compliance reviews are conducted quarterly at $2,500 per review. This includes documentation audit, process verification, regulatory alignment check, and detailed compliance report. Additional ad-hoc reviews are $1,200 each.",
        timestamp: "Yesterday",
      },
    ],
    "3": [
      {
        id: "1",
        role: "user",
        content: "Provide a comprehensive market analysis for Q4 2024",
        timestamp: "3 days ago",
      },
      {
        id: "2",
        role: "assistant",
        content: "Q4 2024 market analysis shows strong performance in tech sector (+12%), moderate growth in healthcare (+6%), and volatility in energy markets (-3%). Key indicators suggest continued inflation control and stable interest rates through year-end.",
        timestamp: "3 days ago",
      },
      {
        id: "3",
        role: "user",
        content: "What are the key risk factors to watch?",
        timestamp: "3 days ago",
      },
      {
        id: "4",
        role: "assistant",
        content: "Key risks include geopolitical tensions affecting energy prices, potential supply chain disruptions in Q1 2025, and Federal Reserve policy changes. Monitor cryptocurrency volatility and emerging market currency fluctuations as secondary indicators.",
        timestamp: "3 days ago",
      },
    ],
  };

  const [messages, setMessages] = useState<Message[]>(conversationMessages["1"]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationTitle, setConversationTitle] = useState("Investment Account Features");

  const handleSendMessage = (message: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI response after 1 second
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Thank you for your question. I'm processing your request and will provide a detailed response shortly.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleConversationClick = (conversationId: string) => {
    setActiveConversation(conversationId);
    const conversation = mockConversations.find(c => c.id === conversationId);
    if (conversation) {
      setConversationTitle(conversation.title);
      // Load messages for this specific conversation
      setMessages(conversationMessages[conversationId] || []);
    }
  };

  const handleNewConversation = () => {
    setActiveConversation("");
    setConversationTitle("New Conversation");
    setMessages([]);
  };

  return (
    <div className="flex h-full" data-testid="page-chat">
      {showSidebar && (
        <div className="w-80 border-r flex flex-col bg-card">
          <div className="p-4 border-b space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Conversations</h2>
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={handleNewConversation}
                data-testid="button-new-conversation"
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                data-testid="input-search-conversations"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {mockConversations.map((conv) => (
              <ConversationItem
                key={conv.id}
                {...conv}
                isActive={activeConversation === conv.id}
                onClick={() => handleConversationClick(conv.id)}
              />
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            {!showSidebar && (
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setShowSidebar(true)}
                data-testid="button-toggle-sidebar"
              >
                <PanelLeft className="w-5 h-5" />
              </Button>
            )}
            <div>
              <h1 className="font-semibold">{conversationTitle}</h1>
              <p className="text-xs text-muted-foreground">Active conversation</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                role={msg.role}
                content={msg.content}
                timestamp={msg.timestamp}
                userType={userType}
              />
            ))}
          </div>
        </div>

        <ChatInput
          onSend={handleSendMessage}
          isLoading={isLoading}
          showAttachment={userType === "internal"}
        />
      </div>
    </div>
  );
}

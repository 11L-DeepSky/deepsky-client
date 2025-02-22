
import React, { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";

interface Message {
  id: number;
  text: string;
  time: string;
  audioUrl?: string;
}

const MessageFeed = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { toast } = useToast();

  const fetchResponse = async (userMessage: string) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) throw new Error('Failed to get AI response');

      const data = await response.json();
      return data.text;
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get AI response",
      });
      return null;
    }
  };

  const addMessage = async (text: string) => {
    const newMessage = {
      id: Date.now(),
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, newMessage]);

    // Get AI response
    const aiResponse = await fetchResponse(text);
    if (aiResponse) {
      const aiMessage = {
        id: Date.now(),
        text: aiResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, aiMessage]);
    }
  };

  useEffect(() => {
    // Initial system message
    addMessage("Systems initialized");
  }, []);

  return (
    <div className="space-y-2 h-full overflow-auto">
      {messages.map((message) => (
        <div
          key={message.id}
          className="bg-black/20 p-3 rounded-md backdrop-blur-sm"
        >
          <div className="flex justify-between items-start">
            <p className="text-sm text-gray-300">{message.text}</p>
            <span className="text-xs text-gray-500">{message.time}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageFeed;

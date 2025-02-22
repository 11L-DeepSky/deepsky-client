
import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface RadarDot {
  x: number;
  y: number;
  size: number;
  type: 'BIRD' | 'SMALL_PLANE' | 'BIG_PLANE';
}

interface Message {
  id: number;
  text: string;
  time: string;
  audioUrl?: string;
  radarDots?: RadarDot[];
}

interface Props {
  onRadarUpdate?: (dots: RadarDot[]) => void;
}

const MessageFeed = forwardRef(({ onRadarUpdate }: Props, ref) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const fetchResponse = async (userMessage: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('chat', {
        body: { message: userMessage }
      });

      if (error) throw error;
      return data;
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
    const response = await fetchResponse(text);
    if (response) {
      const aiMessage = {
        id: Date.now(),
        text: response.text || "No threats detected",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        audioUrl: response.audio,
        radarDots: response.radarDots
      };
      setMessages(prev => [...prev, aiMessage]);

      // Update radar
      if (onRadarUpdate) {
        onRadarUpdate(response.radarDots || []);
      }

      // Automatically play audio response
      if (audioRef.current && response.audio) {
        audioRef.current.src = response.audio;
        audioRef.current.play().catch(console.error);
      }
    }
  };

  // Expose addMessage method to parent components
  useImperativeHandle(ref, () => ({
    addMessage
  }));

  return (
    <div className="space-y-2 h-full overflow-auto">
      <audio ref={audioRef} className="hidden" />
      {messages.map((message) => (
        <div
          key={message.id}
          className="bg-black/20 p-3 rounded-md backdrop-blur-sm"
        >
          <div className="flex justify-between items-start">
            <p className="text-sm text-gray-300">{message.text}</p>
            <span className="text-xs text-gray-500">{message.time}</span>
          </div>
          {message.audioUrl && (
            <button
              onClick={() => {
                if (audioRef.current) {
                  audioRef.current.src = message.audioUrl;
                  audioRef.current.play().catch(console.error);
                }
              }}
              className="mt-2 text-xs text-blue-400 hover:text-blue-300"
            >
              Play Audio
            </button>
          )}
        </div>
      ))}
    </div>
  );
});

MessageFeed.displayName = 'MessageFeed';

export default MessageFeed;

import React, {forwardRef, useImperativeHandle, useRef, useState} from 'react';
import {useToast} from "@/hooks/use-toast";
import {supabase} from "@/integrations/supabase/client";
import {RadarDot} from "@/types.ts";

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

const MessageFeed = forwardRef(({onRadarUpdate}: Props, ref) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const {toast} = useToast();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const fetchResponse = async (userMessage: string, imageUrl: string) => {
    try {
      const {data, error} = await supabase.functions.invoke('chat', {
        body: {
          message: userMessage,
          imageUrl: imageUrl
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        return null;
      }

      if (!data) {
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };

  const addMessage = async (text: string, imageUrl: string) => {
    console.log('addMessage called with:', {text, imageUrl});
    setIsLoading(true);

    // Get AI response without showing the input message
    const response = await fetchResponse(text, imageUrl);
    setIsLoading(false);

    if (response) {
      const aiMessage = {
        id: Date.now(),
        text: response.text || "No threats detected",
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', second: '2-digit'}),
        audioUrl: response.audio,
        radarDots: response.radarDots
      };
      setMessages(prev => [aiMessage, ...prev]); // Add new messages at the beginning

      // Update radar
      if (onRadarUpdate) {
        onRadarUpdate(response.radarDots || []);
      }

      // Always play audio if available
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
      <audio ref={audioRef} className="hidden"/>

      {isLoading && (
        <div className="bg-black/20 p-3 rounded-md backdrop-blur-sm animate-pulse">
          <div className="flex justify-between items-start">
            <div className="w-3/4 h-4 bg-gray-700 rounded"></div>
            <div className="w-1/6 h-3 bg-gray-700 rounded"></div>
          </div>
        </div>
      )}

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

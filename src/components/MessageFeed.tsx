
import React from 'react';

const messages = [
  { id: 1, text: "System check complete", time: "10:45" },
  { id: 2, text: "Navigation systems online", time: "10:46" },
  { id: 3, text: "Weather conditions optimal", time: "10:47" },
];

const MessageFeed = () => {
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

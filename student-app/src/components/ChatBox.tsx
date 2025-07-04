import React, { useState } from 'react';
import '../css/ChatBox.css';

interface Message {
  text: string;
  timestamp: string;
}

const ChatBox: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    if (newMessage.trim() === '') return;

    const message: Message = {
      text: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chatbox-container">
      <div className="chatbox-messages">
        {messages.length === 0 && <p className="chatbox-placeholder">No messages yet</p>}
        {messages.map((msg, index) => (
          <div key={index} className="chatbox-message">
            <span>{msg.text}</span>
            <small>{msg.timestamp}</small>
          </div>
        ))}
      </div>

      <div className="chatbox-input">
        <textarea
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default ChatBox;

// components/ChatComponent.tsx
"use client";

import { useState } from "react";

interface Message {
  sender: "user" | "bot";
  content: string;
}

export default function ChatComponent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { sender: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const res = await fetch("/api/lex", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: userMessage.content }),
      });

      const data = await res.json();

      const botMessage: Message = { sender: "bot", content: data.reply || "No response" };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage: Message = { sender: "bot", content: "Failed to get a response." };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="flex flex-col items-center p-4">
      <div className="w-full max-w-md h-96 overflow-y-auto border p-4 rounded-lg bg-white shadow">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 p-2 rounded ${
              msg.sender === "user" ? "bg-blue-200 self-end text-right" : "bg-gray-200 self-start text-left"
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>

      <div className="flex w-full max-w-md mt-4">
        <input
          type="text"
          className="flex-1 border rounded-l-lg p-2"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-r-lg"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}

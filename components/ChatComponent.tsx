"use client";

import { useState, useRef, useEffect } from "react";
import { X, MessageCircleIcon, Bot, Trash, Send } from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "bot";
  content: string;
}

export default function ChatComponent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [openChat, setOpenChat] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [language, setLanguage] = useState<"english" | "hindi">("english");

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      sender: "user",
      content: input.trim(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(false);

    try {
      const res = await fetch("/api/lex", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: userMessage.content, language }), // ✅ Now sending language also
      });

      const data = await res.json();

      const botMessage: Message = {
        id: crypto.randomUUID(),
        sender: "bot",
        content:
          data.reply ||
          (language === "hindi" ? "कोई उत्तर नहीं मिला" : "No response"),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const lastMessageIsUser =
    messages.length > 0 && messages[messages.length - 1].sender === "user";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div>
      <button
        onClick={() => setOpenChat(!openChat)}
        className="fixed md:bottom-4 bottom-16 right-4 z-40"
      >
        <div className="bg-gray-900 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 text-gray-50 rounded-full p-3 shadow-lg cursor-pointer hover:bg-gray-800 transition-colors">
          {openChat ? (
            <X className="w-6 h-6" />
          ) : (
            <MessageCircleIcon className="w-6 h-6" />
          )}
        </div>
      </button>

      {openChat && (
        <div className="fixed md:bottom-20 bottom-28 z-40 right-4 w-[400px] max-w-[90%] bg-white shadow-2xl rounded-2xl dark:bg-gray-900 flex flex-col">
          <header className="flex items-center justify-between px-4 py-3 bg-white dark:border-b border-gray-500 shadow rounded-t-2xl dark:bg-gray-900">
            <div className="flex items-center gap-2">
              <Bot className="w-9 h-9 p-1.5 dark:text-white text-black" />
              <div className="text-md dark:text-white text-black font-medium">
                Oasis Bot
              </div>
            </div>

            <select
              value={language}
              onChange={(e) =>
                setLanguage(e.target.value as "english" | "hindi")
              }
              className="text-sm p-1 rounded dark:bg-gray-800 dark:text-white"
            >
              <option value="english">English</option>
              <option value="hindi">हिंदी</option>
            </select>
          </header>

          <div
            className="flex-1 max-h-[400px] overflow-y-auto p-4 space-y-4"
            ref={scrollRef}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`p-2 rounded-lg max-w-[80%] ${
                  message.sender === "user"
                    ? "ml-auto bg-blue-200 text-right"
                    : "mr-auto bg-gray-200 text-left"
                }`}
              >
                {message.content}
              </div>
            ))}

            {isLoading && lastMessageIsUser && (
              <div className="p-2 rounded-lg bg-gray-200 text-left mr-auto max-w-[80%]">
                {language === "hindi" ? "सोच रहे हैं..." : "Thinking..."}
              </div>
            )}

            {error && (
              <div className="p-2 rounded-lg bg-red-200 text-left mr-auto max-w-[80%]">
                {language === "hindi"
                  ? "त्रुटि हुई। कृपया पुनः प्रयास करें।"
                  : "An error occurred. Please try again."}
              </div>
            )}

            {!error && messages.length === 0 && (
              <div className="dark:text-white text-black mx-8 flex h-full flex-col items-center justify-center gap-3 text-center">
                <Bot size={28} />
                <p>Hi, I&apos;m your Oasis Bot</p>
                <p>
                  {language === "hindi"
                    ? "मुझसे Oasis से जुड़े किसी भी सवाल के बारे में पूछें!"
                    : "Ask me any question related to Oasis and I'll try to help!"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {language === "hindi"
                    ? "अपना संदेश नीचे लिखें!"
                    : "Type your message below!"}
                </p>
              </div>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white p-4 flex items-center gap-2 shadow rounded-b-2xl dark:bg-gray-900"
          >
            <button
              type="button"
              className="dark:text-white text-black flex w-10 flex-none items-center justify-center"
              title="Clear chat"
              onClick={() => setMessages([])}
            >
              <Trash size={24} />
            </button>
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={
                language === "hindi"
                  ? "अपना संदेश लिखें..."
                  : "Type your message..."
              }
              ref={inputRef}
              className="flex-1 border rounded-lg p-2 dark:bg-gray-800 dark:text-white"
            />
            <button
              type="submit"
              disabled={input.length === 0}
              title="Submit message"
              className="flex items-center justify-center"
            >
              <Send className="dark:text-white text-black h-5 w-5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

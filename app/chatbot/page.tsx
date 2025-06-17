"use client";
import { useState, useEffect, useRef } from "react";

export default function ChatPage() {
  const [messages, setMessages] = useState<{ sender: "user" | "bot"; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // On mount, fetch last session from backend and set greeting
  useEffect(() => {
    if (!initialized) {
      fetch("http://localhost:8000/last_session")
        .then((res) => res.json())
        .then((data) => {
          if (data.user_id && data.session_id) {
            setUserId(data.user_id);
            setSessionId(data.session_id);
            setMessages([
              {
                sender: "bot",
                text: `Welcome back, ${data.user_id}! What would you like to discuss today?`,
              },
            ]);
          } else {
            setMessages([
              {
                sender: "bot",
                text:
                  "Hello! I'm your AI assistant. Please tell me your name so I can remember you for future conversations.",
              },
            ]);
          }
          setInitialized(true);
        })
        .catch(() => {
          setMessages([
            {
              sender: "bot",
              text:
                "Hello! I'm your AI assistant. Please tell me your name so I can remember you for future conversations.",
            },
          ]);
          setInitialized(true);
        });
    }
  }, [initialized]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Focus input after every AI response
  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].sender === "bot" && inputRef.current) {
      inputRef.current.focus();
    }
  }, [messages]);

  // Helper to extract name from first message
  function extractName(msg: string): string {
    const lower = msg.toLowerCase();
    if (lower.includes("name is")) {
      return msg.substring(lower.indexOf("name is") + 8).split(" ")[0].replace(/[.,!?]/g, "");
    } else if (lower.includes("i'm")) {
      return msg.substring(lower.indexOf("i'm") + 4).split(" ")[0].replace(/[.,!?]/g, "");
    } else if (lower.includes("i am")) {
      return msg.substring(lower.indexOf("i am") + 5).split(" ")[0].replace(/[.,!?]/g, "");
    } else {
      return msg.split(" ")[0].replace(/[.,!?]/g, "");
    }
  }

  const sendMessage = async () => {
    if (!input.trim()) return;
    let currentUserId = userId;
    let isFirstUserMsg = !userId;
    let newMessages = [...messages, { sender: "user" as const, text: input }];
    setMessages(newMessages);
    setLoading(true);

    // If first message, extract name
    if (isFirstUserMsg) {
      currentUserId = extractName(input);
      setUserId(currentUserId);
    }

    // Send to backend
    const res = await fetch("http://localhost:8000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: input,
        user_id: currentUserId || "User",
        session_id: sessionId,
      }),
    });
    const data = await res.json();
    setMessages((msgs) => [...msgs, { sender: "bot" as const, text: data.reply }]);
    setSessionId(data.session_id);
    setInput("");
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-row bg-[#ADEED9]">
      {/* Sidebar placeholder (25% width) */}
      <div className="hidden md:flex flex-col w-1/4 min-h-screen bg-[#0ABAB5] p-6">
        {/* You can add sidebar content/components here */}
        <h2 className="text-white text-xl font-bold mb-4">Sidebar</h2>
        {/* ...sidebar content... */}
      </div>
      {/* Chat area (75% width) */}
      <div className="flex-1 flex flex-col min-h-screen">
        <div className="w-full h-full rounded-lg shadow-lg p-6 flex flex-col justify-center flex-1" style={{ backgroundColor: '#EBFFD8' }}>
          <h1 className="text-2xl font-bold mb-4 text-center" style={{ color: '#0ABAB5' }}>AI Chat</h1>
          <div className="mb-4 flex-1 max-h-[60vh] overflow-y-auto border border-gray-200 rounded p-4" style={{ backgroundColor: '#ADEED9' }}>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`mb-4 flex items-center gap-3 ${msg.sender === "user" ? "justify-end flex-row-reverse" : "justify-start"}`}
              >
                {/* Square Avatar */}
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-[#f3f4f6] rounded-md border border-gray-300">
                  <img
                    src={msg.sender === "user" ? "/user.png" : "/robot.png"}
                    alt={msg.sender === "user" ? "User" : "Bot"}
                    className="w-10 h-10 object-cover object-center"
                    style={{ display: 'block' }}
                  />
                </div>
                {/* Chat bubble */}
                <div
                  className={`px-5 py-3 rounded-xl max-w-[75%] text-base font-medium shadow-md ${
                    msg.sender === "user"
                      ? "rounded-br-none"
                      : "rounded-bl-none"
                  }`}
                  style={{
                    minWidth: '80px',
                    backgroundColor: msg.sender === "user" ? '#56DFCF' : '#FFEDF3',
                    color: msg.sender === "user" ? '#0A3A36' : '#B23A48',
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-3 justify-start mb-4">
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-[#f3f4f6] rounded-md border border-gray-300">
                  <img
                    src="/robot.png"
                    alt="Bot"
                    className="w-10 h-10 object-cover object-center"
                    style={{ display: 'block' }}
                  />
                </div>
                <div className="px-5 py-3 rounded-xl max-w-[75%] text-base font-medium rounded-bl-none shadow-md animate-pulse" style={{ minWidth: '80px', backgroundColor: '#FFEDF3', color: '#B23A48' }}>
                  Bot is typing...
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-2 mt-auto">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 bg-white"
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="text-white px-4 py-2 rounded hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: '#0ABAB5' }}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
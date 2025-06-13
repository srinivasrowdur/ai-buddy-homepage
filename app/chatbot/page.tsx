"use client";
import { useState, useEffect } from "react";

export default function ChatPage() {
  const [messages, setMessages] = useState<{ sender: "user" | "bot"; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#ADEED9] py-8">
      <div className="w-full max-w-xl bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">AI Chat</h1>
        <div className="mb-4 min-h-[300px] max-h-[400px] overflow-y-auto border border-gray-200 rounded p-4 bg-gray-50">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`mb-2 flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-[80%] text-sm ${
                  msg.sender === "user"
                    ? "bg-purple-100 text-purple-900"
                    : "bg-green-100 text-green-900"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {loading && <div className="text-gray-400 text-center">Bot is typing...</div>}
        </div>
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
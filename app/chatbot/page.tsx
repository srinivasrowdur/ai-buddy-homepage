"use client";
import { useState, useEffect, useRef } from "react";
import { useUserEmail } from "@/hooks/use-user-email";
import ProfileButton from "@/components/ProfileButton";

export default function ChatPage() {
  const [profileOpen, setProfileOpen] = useState(false);
  // For dark mode toggle
  const [darkMode, setDarkMode] = useState(false);

  // Apply dark mode to body
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (darkMode) {
        document.body.classList.add("dark");
      } else {
        document.body.classList.remove("dark");
      }
    }
  }, [darkMode]);
  const [messages, setMessages] = useState<{ sender: "user" | "bot"; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [sessions, setSessions] = useState<{ session_id: string; title: string; created_at: string }[]>([]);
  const [isNewSession, setIsNewSession] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const userEmail = useUserEmail();

  // Helper to extract name from first message
  function extractName(msg: string): string {
    const lower = msg.toLowerCase();
    if (lower.includes("name is")) {
      return msg.substring(lower.indexOf("name is") + 8).split(" ")[0].replace(/[.,!?]/g, "");
    } else if (lower.includes("i'm")) {
      return msg.substring(lower.indexOf("i'm") + 4).split(" ")[0].replace(/[.,!?]/g, "");
    } else if (lower.includes("i am")) {
      return msg.substring(lower.indexOf("i am") + 5).split(" ")[0].replace(/[.,!?]/g, "");
    } else if (lower.includes("this is")) {
      return msg.substring(lower.indexOf("this is") + 8).split(" ")[0].replace(/[.,!?]/g, "");
    } else {
      return msg.split(" ")[0].replace(/[.,!?]/g, "");
    }
  }

  // Store and retrieve user's name
  const [userName, setUserName] = useState<string | null>(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user_name");
      if (stored) setUserName(stored);
    }
  }, []);

  // On mount, fetch last session from backend and set greeting
  useEffect(() => {
    if (!initialized) {
      fetch("http://localhost:8000/last_session")
        .then((res) => res.json())
        .then((data) => {
          setUserId(data.user_id || null);
          setSessionId(data.session_id || null);
          if (userName) {
            setMessages([
              {
                sender: "bot",
                text: `Welcome back, ${userName}! What would you like to discuss today?`,
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
  }, [initialized, userName]);

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

  // Fetch chat sessions for sidebar
  useEffect(() => {
    if (userEmail) {
      console.log('Fetching sessions for user_id:', userEmail);
      fetch(`http://localhost:8000/sessions?user_id=${encodeURIComponent(userEmail)}`)
        .then((res) => res.json())
        .then((data) => {
          console.log('Sessions fetched:', data);
          setSessions(data);
        });
    }
  }, [userEmail]);

  // After sending a message, refresh chat history
  const refreshSessions = () => {
    if (userEmail) {
      fetch(`http://localhost:8000/sessions?user_id=${encodeURIComponent(userEmail)}`)
        .then((res) => res.json())
        .then((data) => setSessions(data));
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !userEmail) return;
    let currentUserId = userEmail;
    let isFirstUserMsg = !userName;
    let newMessages = [...messages, { sender: "user" as const, text: input }];
    setMessages(newMessages);
    setLoading(true);
    if (isFirstUserMsg) {
      const extracted = extractName(input);
      setUserName(extracted);
      if (typeof window !== "undefined") {
        localStorage.setItem("user_name", extracted);
      }
    }
    // Send to backend
    const res = await fetch("http://localhost:8000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: input,
        user_id: currentUserId,
        session_id: isNewSession ? null : sessionId,
      }),
    });
    const data = await res.json();
    setMessages((msgs) => [...msgs, { sender: "bot" as const, text: data.reply }]);
    setSessionId(data.session_id);
    setIsNewSession(false);
    setInput("");
    setLoading(false);
    refreshSessions();
  };

  // Function to load messages for a session
  const loadSession = async (session_id: string) => {
    if (!userEmail) return;
    setLoading(true);
    const res = await fetch(`http://localhost:8000/session_messages?user_id=${encodeURIComponent(userEmail)}&session_id=${encodeURIComponent(session_id)}`);
    const data = await res.json();
    setMessages(data.map((m: any) => ({ sender: m.sender, text: m.text })));
    setSessionId(session_id);
    setLoading(false);
  };

  // Finalize chat title on page unload
  useEffect(() => {
    const finalizeTitle = async () => {
      if (userEmail && sessionId) {
        try {
          await fetch("http://localhost:8000/finalize_title", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: userEmail, session_id: sessionId }),
          });
        } catch (e) {
          // Ignore errors on unload
        }
      }
    };
    window.addEventListener("beforeunload", finalizeTitle);
    return () => {
      finalizeTitle();
      window.removeEventListener("beforeunload", finalizeTitle);
    };
  }, [userEmail, sessionId]);

  return (
    <div className="min-h-screen flex flex-row bg-[#ADEED9] dark:bg-[#181C1F] transition-colors duration-300">
      {/* Sidebar placeholder (25% width) */}
      <div className="hidden md:flex flex-col w-1/4 min-h-screen bg-[#0ABAB5] dark:bg-[#23272A] p-6 transition-colors duration-300 border-r-2 border-[#7CF8E6] dark:border-[#3DE1C7]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white dark:text-[#ADEED9] text-xl font-bold">Chat History</h2>
        </div>
        <button
          className="mb-4 px-3 py-2 rounded"
          style={{ backgroundColor: '#FFEDF3', color: '#0ABAB5', fontWeight: 'bold', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}
          onClick={async () => {
            setMessages([]);
            setSessionId(null);
            setIsNewSession(true);
            setInput("");
            setLoading(false);
            if (userName) {
              setMessages([
                {
                  sender: "bot",
                  text: `Welcome back, ${userName}! What would you like to discuss today?`,
                },
              ]);
            } else {
              setMessages([
                {
                  sender: "bot",
                  text: "Hello! I'm your AI assistant. Please tell me your name so I can remember you for future conversations.",
                },
              ]);
            }
            refreshSessions();
          }}
        >
          + New Chat
        </button>
        <div className="flex-1 overflow-y-auto">
          {sessions.length === 0 && <div className="text-[#B23A48]/70">No conversations yet.</div>}
          {sessions.map((s) => (
            <div
              key={s.session_id}
              className="flex items-stretch group w-full mb-2 rounded-lg overflow-hidden transition-colors duration-300 border border-[#0ABAB5] dark:border-[#2D8C7F] bg-[#FFEDF3] dark:bg-[#23272A] shadow-sm"
              style={{ height: 48, minHeight: 48 }}
            >
              <button
                className="flex-1 text-left px-3 py-0 font-medium transition truncate flex items-center bg-transparent border-none outline-none shadow-none h-full min-h-0"
                style={{ height: '100%', color: '#0ABAB5' }}
                onClick={() => loadSession(s.session_id)}
              >
                <span className="truncate font-semibold" style={{ color: '#0ABAB5' }}>{s.title}</span>
              </button>
              <button
                className="flex items-center justify-center bg-red-400 hover:bg-red-500 transition border-none outline-none rounded-none h-full min-h-0"
                style={{ width: 48, height: '100%' }}
                title="Delete chat"
                onClick={async (e) => {
                  e.stopPropagation();
                  if (!window.confirm('Delete this chat session?')) return;
                  const resp = await fetch(`http://localhost:8000/delete_session`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      user_id: userEmail,
                      session_id: s.session_id,
                    }),
                  });
                  if (resp.ok) {
                    setSessions((prev) => prev.filter(sess => sess.session_id !== s.session_id));
                    if (sessionId === s.session_id) {
                      setMessages([]);
                      setSessionId(null);
                    }
                  } else {
                    alert('Failed to delete session.');
                  }
                }}
              >
                <img src="/trash.svg" alt="Delete" className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
      {/* Chat area (75% width) */}
      <div className="flex-1 flex flex-col min-h-screen relative">
        {/* Floating Home & Profile Buttons (only one instance!) */}
        <div className="fixed top-3 right-4 z-50 flex flex-row gap-2 items-start">
          {/* Home button */}
          <button
            className="flex items-center justify-center h-10 w-10 rounded-full shadow-lg bg-white hover:bg-[#ADEED9] border-2 border-[#0ABAB5] transition-colors duration-200"
            style={{ boxShadow: '0 4px 16px 0 rgba(10,186,181,0.15)' }}
            onClick={() => window.location.href = '/'}
            title="Go to Home"
          >
            <img src="/house-door.svg" alt="Home" className="w-6 h-6 text-[#0ABAB5]" style={{ color: '#0ABAB5' }} />
          </button>
          {/* Use the shared ProfileButton component for consistency and to avoid duplicate logic */}
          <div className="h-10 flex items-center">
            <ProfileButton />
          </div>
        </div>
        <div className="w-full h-full rounded-lg shadow-lg p-6 flex flex-col justify-center flex-1 bg-[#EBFFD8] dark:bg-[#23272A] transition-colors duration-300">
          <h1 className="text-2xl font-bold mb-4 text-center text-[#0ABAB5] dark:text-[#ADEED9]">AI Chat</h1>
          <div className="mb-4 flex-1 max-h-[60vh] overflow-y-auto border border-gray-200 dark:border-[#23272A] rounded p-4 bg-[#ADEED9] dark:bg-[#181C1F] transition-colors duration-300">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`mb-4 flex items-center gap-3 ${msg.sender === "user" ? "justify-end flex-row-reverse" : "justify-start"}`}
              >
                {/* Square Avatar */}
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-[#f3f4f6] dark:bg-[#23272A] rounded-md border border-gray-300 dark:border-[#444]">
                  <img
                    src={msg.sender === "user" ? "/user.png" : "/robot.png"}
                    alt={msg.sender === "user" ? "User" : "Bot"}
                    className="w-10 h-10 object-cover object-center"
                    style={{ display: 'block' }}
                  />
                </div>
                {/* Chat bubble */}
                <div
                  className={`px-5 py-3 rounded-xl max-w-[75%] text-base font-medium shadow-md transition-colors duration-300 ${
                    msg.sender === "user"
                      ? "rounded-br-none bg-[#56DFCF] text-[#0A3A36] dark:bg-[#2D8C7F] dark:text-[#ADEED9]"
                      : "rounded-bl-none bg-[#FFEDF3] text-[#B23A48] dark:bg-[#23272A] dark:text-[#FFEDF3]"
                  }`}
                  style={{ minWidth: '80px' }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-3 justify-start mb-4">
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-[#f3f4f6] dark:bg-[#23272A] rounded-md border border-gray-300 dark:border-[#444]">
                  <img
                    src="/robot.png"
                    alt="Bot"
                    className="w-10 h-10 object-cover object-center"
                    style={{ display: 'block' }}
                  />
                </div>
                <div className="px-5 py-3 rounded-xl max-w-[75%] text-base font-medium rounded-bl-none shadow-md animate-pulse transition-colors duration-300 bg-[#FFEDF3] text-[#B23A48] dark:bg-[#23272A] dark:text-[#FFEDF3]" style={{ minWidth: '80px' }}>
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
              className="flex-1 border border-gray-300 dark:border-[#444] rounded px-3 py-2 focus:outline-none focus:ring-2 bg-[#FFEDF3] dark:bg-[#23272A] text-[#0A3A36] dark:text-[#ADEED9] transition-colors duration-300"
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="px-4 py-2 rounded hover:opacity-90 disabled:opacity-50 bg-[#0ABAB5] dark:bg-[#2D8C7F] text-white transition-colors duration-300"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
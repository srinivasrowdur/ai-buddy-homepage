"use client";
import { useState, useEffect } from "react";
import { useUserEmail } from "@/hooks/use-user-email";

export default function ProfileButton() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const userEmail = useUserEmail();

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (darkMode) {
        document.body.classList.add("dark");
      } else {
        document.body.classList.remove("dark");
      }
    }
  }, [darkMode]);

  return (
    <div className="relative" data-profile-button>
      <button
        className="flex items-center justify-center w-10 h-10 rounded-full shadow-lg bg-white hover:bg-[#ADEED9] border-2 border-[#0ABAB5] transition-colors duration-200"
        style={{ boxShadow: '0 4px 16px 0 rgba(10,186,181,0.15)' }}
        title="User Profile"
        onClick={() => setProfileOpen((v) => !v)}
        tabIndex={0}
        aria-haspopup="true"
        aria-expanded={profileOpen}
      >
        <img src="/user.png" alt="Profile" className="w-6 h-6 rounded-full object-cover" />
      </button>
      {profileOpen && (
        <div
          className="absolute right-0 mt-3 w-64 bg-white dark:bg-[#222] rounded-xl shadow-2xl border border-[#0ABAB5] flex flex-col items-center p-6 animate-fade-in z-[101]"
          style={{ minHeight: 180 }}
          role="dialog"
          aria-modal="true"
        >
          <img src="/user.png" alt="Profile" className="w-16 h-16 rounded-full object-cover mb-2 border-2 border-[#0ABAB5]" />
          <div className="text-center text-base font-semibold text-[#0ABAB5] dark:text-[#ADEED9] mb-3" style={{ wordBreak: 'break-all' }}>
            {userEmail || 'No email'}
          </div>
          <div className="flex flex-row items-center justify-center mt-2 w-full gap-2">
            <span className="text-sm font-medium text-[#0ABAB5] dark:text-[#ADEED9]">Dark Mode</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={darkMode}
                onChange={() => setDarkMode((d) => !d)}
              />
              <div className="w-10 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#0ABAB5] dark:bg-gray-700 rounded-full peer peer-checked:bg-[#0ABAB5] transition-colors duration-200"></div>
              <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full shadow-md transition-transform duration-200 peer-checked:translate-x-4"></div>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}

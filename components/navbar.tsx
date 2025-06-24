"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import LoginDialog from "./login-dialog"
import SignupDialog from "./signup-dialog"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isSignupOpen, setIsSignupOpen] = useState(false)

  return (
    <header className="bg-[#0ABAB5] border-b border-[#56DFCF] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-[#FFEDF3]">AI Buddy</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/explore" className="text-[#FFEDF3] hover:text-[#56DFCF] font-semibold transition-colors">Explore</Link>
            <Link href="/how-it-works" className="text-[#FFEDF3] hover:text-[#56DFCF] font-semibold transition-colors">How It Works</Link>
            <Link href="/pricing" className="text-[#FFEDF3] hover:text-[#56DFCF] font-semibold transition-colors">Pricing</Link>
            <Link href="/blog" className="text-[#FFEDF3] hover:text-[#56DFCF] font-semibold transition-colors">Blog</Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Button className="bg-[#FFEDF3] text-[#0ABAB5] hover:bg-[#ADEED9] font-bold" onClick={() => setIsLoginOpen(true)}>Log In</Button>
            <Button className="bg-[#FFEDF3] text-[#0ABAB5] hover:bg-[#ADEED9] font-bold" onClick={() => setIsSignupOpen(true)}>Sign Up</Button>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-[#FFEDF3] hover:text-[#56DFCF] hover:bg-[#ADEED9]"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#0ABAB5]">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/explore"
              className="block px-3 py-2 rounded-md text-base font-medium text-[#FFEDF3] hover:text-[#0ABAB5] hover:bg-[#56DFCF]"
              onClick={() => setIsMenuOpen(false)}
            >
              Explore
            </Link>
            <Link
              href="/how-it-works"
              className="block px-3 py-2 rounded-md text-base font-medium text-[#FFEDF3] hover:text-[#0ABAB5] hover:bg-[#56DFCF]"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link
              href="/pricing"
              className="block px-3 py-2 rounded-md text-base font-medium text-[#FFEDF3] hover:text-[#0ABAB5] hover:bg-[#56DFCF]"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="/blog"
              className="block px-3 py-2 rounded-md text-base font-medium text-[#FFEDF3] hover:text-[#0ABAB5] hover:bg-[#56DFCF]"
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-[#56DFCF]">
            <div className="flex items-center px-5">
              <div className="flex-shrink-0 w-full">
                <Button className="w-full bg-[#FFEDF3] text-[#0ABAB5] hover:bg-[#ADEED9] font-bold mb-2" onClick={() => setIsLoginOpen(true)}>
                  Log In
                </Button>
                <Button className="w-full bg-[#FFEDF3] text-[#0ABAB5] hover:bg-[#ADEED9] font-bold" onClick={() => setIsSignupOpen(true)}>Sign Up</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <LoginDialog 
        open={isLoginOpen} 
        onOpenChange={setIsLoginOpen}
        onSwitchToSignup={() => setIsSignupOpen(true)}
      />
      <SignupDialog 
        open={isSignupOpen} 
        onOpenChange={setIsSignupOpen}
        onSwitchToLogin={() => setIsLoginOpen(true)}
      />
    </header>
  )
}

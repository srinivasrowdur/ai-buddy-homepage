"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import ProfileButton from "@/components/ProfileButton"
import { Menu, X } from "lucide-react"
import LoginDialog from "./login-dialog"
import SignupDialog from "./signup-dialog"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isSignupOpen, setIsSignupOpen] = useState(false)

  return (
    <header className="bg-[#0ABAB5] border-b border-[#56DFCF] sticky top-0 z-50 dark:bg-[#10151A]">
      <div className="w-full px-4 sm:px-6 lg:px-8 relative h-16 flex items-center dark:text-[#0ABAB5]">
        <div className="flex items-center flex-shrink-0">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-[#FFEDF3] dark:bg-gradient-to-r dark:from-[#0ABAB5] dark:to-[#56DFCF] dark:bg-clip-text dark:text-transparent">AI Buddy</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-8 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Link href="/explore" className="text-[#FFEDF3] hover:text-[#56DFCF] font-semibold transition-colors dark:text-[#0ABAB5] dark:hover:text-[#56DFCF]">Explore</Link>
          <Link href="/how-it-works" className="text-[#FFEDF3] hover:text-[#56DFCF] font-semibold transition-colors dark:text-[#0ABAB5] dark:hover:text-[#56DFCF]">How It Works</Link>
          <Link href="/pricing" className="text-[#FFEDF3] hover:text-[#56DFCF] font-semibold transition-colors dark:text-[#0ABAB5] dark:hover:text-[#56DFCF]">Pricing</Link>
          <Link href="/blog" className="text-[#FFEDF3] hover:text-[#56DFCF] font-semibold transition-colors dark:text-[#0ABAB5] dark:hover:text-[#56DFCF]">Blog</Link>
        </nav>

        <div className="hidden md:flex items-center gap-4 absolute top-1/2 right-4 transform -translate-y-1/2">
          <Button className="bg-[#FFEDF3] text-[#0ABAB5] hover:bg-[#ADEED9] font-bold h-10 px-4 border border-[#EBFFD8] dark:bg-transparent dark:text-[#0ABAB5] dark:border-[#0ABAB5] dark:hover:bg-[#0ABAB5] dark:hover:text-white" onClick={() => setIsLoginOpen(true)}>Log In</Button>
          <Button className="bg-[#FFEDF3] text-[#0ABAB5] hover:bg-[#ADEED9] font-bold h-10 px-4 border border-[#EBFFD8] dark:bg-transparent dark:text-[#0ABAB5] dark:border-[#0ABAB5] dark:hover:bg-[#0ABAB5] dark:hover:text-white" onClick={() => setIsSignupOpen(true)}>Sign Up</Button>
          <div className="h-10 flex items-center p-0">
            <div className="border border-[#EBFFD8] rounded-full bg-white h-10 w-10 flex items-center justify-center shadow dark:border-[#0ABAB5] dark:bg-[#10151A]">
              <ProfileButton />
            </div>
          </div>
        </div>

        <div className="md:hidden absolute right-4 top-1/2 transform -translate-y-1/2">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="inline-flex items-center justify-center p-2 rounded-md text-[#FFEDF3] hover:text-[#56DFCF] hover:bg-[#ADEED9] dark:text-[#0ABAB5] dark:hover:text-[#56DFCF] dark:hover:bg-[#10151A]"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#0ABAB5] dark:bg-[#10151A]">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/explore"
              className="block px-3 py-2 rounded-md text-base font-medium text-[#FFEDF3] hover:text-[#0ABAB5] hover:bg-[#56DFCF] dark:text-[#0ABAB5] dark:hover:text-[#10151A] dark:hover:bg-[#56DFCF]"
              onClick={() => setIsMenuOpen(false)}
            >
              Explore
            </Link>
            <Link
              href="/how-it-works"
              className="block px-3 py-2 rounded-md text-base font-medium text-[#FFEDF3] hover:text-[#0ABAB5] hover:bg-[#56DFCF] dark:text-[#0ABAB5] dark:hover:text-[#10151A] dark:hover:bg-[#56DFCF]"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link
              href="/pricing"
              className="block px-3 py-2 rounded-md text-base font-medium text-[#FFEDF3] hover:text-[#0ABAB5] hover:bg-[#56DFCF] dark:text-[#0ABAB5] dark:hover:text-[#10151A] dark:hover:bg-[#56DFCF]"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="/blog"
              className="block px-3 py-2 rounded-md text-base font-medium text-[#FFEDF3] hover:text-[#0ABAB5] hover:bg-[#56DFCF] dark:text-[#0ABAB5] dark:hover:text-[#10151A] dark:hover:bg-[#56DFCF]"
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-[#56DFCF] dark:border-[#0ABAB5]">
            <div className="flex items-center px-5">
              <div className="flex-shrink-0 w-full">
                <Button className="w-full bg-[#FFEDF3] text-[#0ABAB5] hover:bg-[#ADEED9] font-bold mb-2 dark:bg-transparent dark:text-[#0ABAB5] dark:border-[#0ABAB5] dark:hover:bg-[#0ABAB5] dark:hover:text-white" onClick={() => setIsLoginOpen(true)}>
                  Log In
                </Button>
                <Button className="w-full bg-[#FFEDF3] text-[#0ABAB5] hover:bg-[#ADEED9] font-bold dark:bg-transparent dark:text-[#0ABAB5] dark:border-[#0ABAB5] dark:hover:bg-[#0ABAB5] dark:hover:text-white" onClick={() => setIsSignupOpen(true)}>
                  Sign Up</Button>
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

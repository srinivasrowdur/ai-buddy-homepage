"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, Mail, Lock, User, Github } from "lucide-react"

interface SignupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSwitchToLogin?: () => void
}

export default function SignupDialog({ open, onOpenChange, onSwitchToLogin }: SignupDialogProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      alert("Please fill in all fields.")
      return
    }
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!")
      return
    }

    setIsLoading(true)
    try {
      // Call backend API for signup
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Signup failed")
      onOpenChange(false)
      // Reset form
      setFormData({ name: "", email: "", password: "", confirmPassword: "" })
    } catch (err: any) {
      alert(err.message || "Signup failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialSignup = (provider: string) => {
    console.log(`Sign up with ${provider}`)
    // Handle social signup logic here
  }

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Join AI Buddy today
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Create your account and start building amazing AI companions
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Social Signup Buttons */}
          <div className="grid gap-3">
            <Button
              variant="outline"
              onClick={() => handleSocialSignup("google")}
              className="w-full"
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </Button>

            <Button
              variant="outline"
              onClick={() => handleSocialSignup("github")}
              className="w-full"
            >
              <Github className="mr-2 h-4 w-4" />
              Continue with GitHub
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or create account with email</span>
            </div>
          </div>

          {/* Sign up Form */}
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Full name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => updateFormData("name", e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="signup-email" className="text-sm font-medium">
                Email address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="signup-password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => updateFormData("password", e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="confirm-password" className="text-sm font-medium">
                Confirm password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-start space-x-2 text-sm">
              <input type="checkbox" className="rounded border-gray-300 mt-1" required />
              <span className="text-gray-600">
                I agree to the{" "}
                <button type="button" className="text-purple-600 hover:text-purple-700 font-medium">
                  Terms of Service
                </button>{" "}
                and{" "}
                <button type="button" className="text-purple-600 hover:text-purple-700 font-medium">
                  Privacy Policy
                </button>
              </span>
            </div>

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          {/* Sign in link */}
          <div className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <button
              onClick={() => {
                onOpenChange(false)
                onSwitchToLogin?.()
              }}
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              Sign in
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
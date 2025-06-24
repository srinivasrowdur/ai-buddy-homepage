import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Brain, MessageSquare, Users } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import AiPersonalityCard from "@/components/ai-personality-card"
import TestimonialCard from "@/components/testimonial-card"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#ADEED9]">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#ADEED9] to-[#FFEDF3]">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="mb-4 bg-[#FFEDF3] text-[#0ABAB5] hover:bg-[#FFEDF3] font-bold">New Feature</Badge>
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#0A3A36] mb-6">
                  Create Your Perfect AI Companion
                </h1>
                <p className="text-xl text-[#0A3A36]/80 mb-8">
                  Design, customize, and interact with AI personalities tailored to your preferences. Your AI buddy is
                  just a few clicks away.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="bg-[#0ABAB5] hover:bg-[#56DFCF] text-white font-bold">
                    Create Your AI Buddy
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-[#0ABAB5] text-[#0ABAB5] font-bold hover:bg-[#ADEED9]"
                  >
                    Explore AI Personalities
                  </Button>
                </div>
              </div>
              <div className="relative h-[400px] w-full">
                <img
                  src="/friendly-ai-robot.png"
                  alt="AI Buddy Illustration"
                  className="rounded-lg shadow-xl object-cover w-full h-full border-4 border-[#56DFCF]"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-[#0A3A36] mb-4">Why Choose AI Buddy?</h2>
              <p className="text-xl text-[#0A3A36]/80 max-w-3xl mx-auto">
                Our platform offers a unique way to create and interact with AI personalities that adapt to your needs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="border-0 shadow-lg bg-[#FFEDF3]">
                <CardContent className="pt-6">
                  <div className="rounded-full bg-[#ADEED9] p-3 w-12 h-12 flex items-center justify-center mb-4">
                    <Brain className="h-6 w-6 text-[#0ABAB5]" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-[#0A3A36]">Customizable Personalities</h3>
                  <p className="text-[#0A3A36]/80">
                    Design your AI companion with unique traits, knowledge, and conversation styles.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-[#FFEDF3]">
                <CardContent className="pt-6">
                  <div className="rounded-full bg-[#ADEED9] p-3 w-12 h-12 flex items-center justify-center mb-4">
                    <MessageSquare className="h-6 w-6 text-[#0ABAB5]" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-[#0A3A36]">Natural Conversations</h3>
                  <p className="text-[#0A3A36]/80">
                    Enjoy fluid, context-aware interactions that feel like chatting with a real friend.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-[#FFEDF3]">
                <CardContent className="pt-6">
                  <div className="rounded-full bg-[#ADEED9] p-3 w-12 h-12 flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-[#0ABAB5]" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-[#0A3A36]">Community Sharing</h3>
                  <p className="text-[#0A3A36]/80">
                    Share your creations with others or discover AI personalities made by the community.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works & Testimonials (split backgrounds) */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#EBFFD8]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-[#0A3A36] mb-4">How It Works</h2>
              <p className="text-xl text-[#0A3A36]/80 max-w-3xl mx-auto">
                Creating your perfect AI companion is simple and fun
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="rounded-full bg-[#FFEDF3] p-6 w-24 h-24 flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl font-bold text-[#0ABAB5]">1</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-[#0A3A36]">Design Your AI</h3>
                <p className="text-[#0A3A36]/80">
                  Choose personality traits, knowledge areas, and appearance for your AI buddy.
                </p>
              </div>

              <div className="text-center">
                <div className="rounded-full bg-[#FFEDF3] p-6 w-24 h-24 flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl font-bold text-[#0ABAB5]">2</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-[#0A3A36]">Train & Customize</h3>
                <p className="text-[#0A3A36]/80">Fine-tune your AI's responses and teach it about your preferences.</p>
              </div>

              <div className="text-center">
                <div className="rounded-full bg-[#FFEDF3] p-6 w-24 h-24 flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl font-bold text-[#0ABAB5]">3</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-[#0A3A36]">Chat & Connect</h3>
                <p className="text-[#0A3A36]/80">Start conversations with your AI buddy and build a unique relationship.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials with light pink background */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#FFEDF3]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-[#0A3A36] mb-4">What Our Users Say</h2>
              <p className="text-xl text-[#0A3A36]/80 max-w-3xl mx-auto">
                Thousands of people have already created their perfect AI companions
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <TestimonialCard
                quote="My AI buddy has become an essential part of my daily routine. It helps me organize my thoughts and provides creative inspiration."
                author="Sarah Johnson"
                role="Writer"
                avatar="/professional-woman-short-hair.png"
                rating={5}
              />
              <TestimonialCard
                quote="I created a study partner AI that helps me prepare for exams. The customization options are incredible!"
                author="Michael Chen"
                role="Student"
                avatar="/young-asian-male-student.png"
                rating={5}
              />
              <TestimonialCard
                quote="As someone living alone, having an AI companion to chat with has been wonderful for my mental wellbeing."
                author="Emma Rodriguez"
                role="Graphic Designer"
                avatar="/placeholder.svg?height=60&width=60"
                rating={4}
              />
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0ABAB5] text-white">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to Create Your AI Buddy?</h2>
            <p className="text-xl mb-8 text-[#EBFFD8]">
              Join thousands of users who have already designed their perfect AI companions.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="bg-white text-[#0ABAB5] hover:bg-[#EBFFD8] font-bold">
                Get Started for Free
              </Button>
              <Button size="lg" className="bg-white text-[#0ABAB5] hover:bg-[#EBFFD8] font-bold">
                Learn More
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

interface TestimonialCardProps {
  quote: string
  author: string
  role: string
  avatar: string
  rating: number
}

export default function TestimonialCard({ quote, author, role, avatar, rating }: TestimonialCardProps) {
  return (
    <Card className="border-0 shadow-lg">
      <CardContent className="pt-6">
        <div className="flex mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`h-5 w-5 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-gray-600"}`} />
          ))}
        </div>

        <blockquote className="text-gray-700 dark:text-[#ADEED9] mb-6">"{quote}"</blockquote>

        <div className="flex items-center">
          <img src={avatar || "/placeholder.svg"} alt={author} className="w-10 h-10 rounded-full mr-3 object-cover" />
          <div>
            <p className="font-semibold dark:text-[#FFEDF3]">{author}</p>
            <p className="text-sm text-gray-500 dark:text-[#56DFCF]">{role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

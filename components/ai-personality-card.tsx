import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"

interface AiPersonalityCardProps {
  name: string
  description: string
  avatar: string
  tags: string[]
  rating: number
  createdBy: string
}

export default function AiPersonalityCard({
  name,
  description,
  avatar,
  tags,
  rating,
  createdBy,
}: AiPersonalityCardProps) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardContent className="p-0">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-3"></div>
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <img
              src={avatar || "/placeholder.svg"}
              alt={`${name} avatar`}
              className="w-16 h-16 rounded-full object-cover border-2 border-purple-200"
            />
            <div>
              <h3 className="text-xl font-bold">{name}</h3>
              <div className="flex items-center text-yellow-500">
                <Star className="h-4 w-4 fill-current" />
                <span className="ml-1 text-sm">{rating.toFixed(1)}</span>
              </div>
            </div>
          </div>

          <p className="text-gray-600 mb-4">{description}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                {tag}
              </Badge>
            ))}
          </div>

          <p className="text-sm text-gray-500">Created by {createdBy}</p>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 px-6 py-4">
        <Button className="w-full bg-purple-600 hover:bg-purple-700">Chat with {name}</Button>
      </CardFooter>
    </Card>
  )
}

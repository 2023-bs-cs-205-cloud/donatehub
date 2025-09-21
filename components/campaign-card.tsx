import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Calendar } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Campaign {
  id: string
  title: string
  description: string
  goal_amount: number
  current_amount: number
  category: string
  image_url: string
  end_date: string
  profiles: {
    full_name: string
    organization_name: string
  }
}

interface CampaignCardProps {
  campaign: Campaign
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  const progressPercentage = (campaign.current_amount / campaign.goal_amount) * 100
  const daysLeft = Math.ceil((new Date(campaign.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48">
        <Image
          src={campaign.image_url || "/placeholder.svg?height=200&width=400"}
          alt={campaign.title}
          fill
          className="object-cover"
        />
        <div className="absolute top-4 left-4">
          <Badge variant="secondary" className="bg-white/90 text-gray-800">
            {campaign.category}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-3">
        <h3 className="font-semibold text-lg line-clamp-2">{campaign.title}</h3>
        <p className="text-sm text-gray-600">by {campaign.profiles.organization_name || campaign.profiles.full_name}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600 line-clamp-3">{campaign.description}</p>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">${campaign.current_amount.toLocaleString()}</span>
            <span className="text-gray-500">of ${campaign.goal_amount.toLocaleString()}</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex justify-between text-xs text-gray-500">
            <span>{Math.round(progressPercentage)}% funded</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {daysLeft > 0 ? `${daysLeft} days left` : "Ended"}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Link href={`/campaigns/${campaign.id}`} className="w-full">
          <Button className="w-full bg-blue-600 hover:bg-blue-700">View Campaign</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

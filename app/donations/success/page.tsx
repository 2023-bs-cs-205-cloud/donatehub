import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Heart, Share2 } from "lucide-react"
import Link from "next/link"

export default async function DonationSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ amount?: string; campaign?: string; transaction?: string }>
}) {
  const params = await searchParams

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-900">Thank You! 🎭</CardTitle>
            <p className="text-gray-600">Your DEMO donation has been processed successfully</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                ${params.amount ? Number.parseFloat(params.amount).toLocaleString() : "0"}
              </div>
              <p className="text-sm text-gray-600">has been donated to this campaign (DEMO)</p>
              {params.transaction && (
                <p className="text-xs text-gray-500 mt-2 font-mono">Transaction ID: {params.transaction}</p>
              )}
            </div>

            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
              <div className="flex items-center gap-2 text-green-800 mb-2">
                <Heart className="w-4 h-4" />
                <span className="font-medium">Demo Impact 🎭</span>
              </div>
              <p className="text-sm text-green-700">
                This is a demonstration of the donation process. In a real application, your generous donation would
                make a real difference in the lives of those who need it most.
              </p>
            </div>

            <div className="space-y-3">
              <Link href={params.campaign ? `/campaigns/${params.campaign}` : "/campaigns"} className="block">
                <Button className="w-full bg-transparent" variant="outline">
                  View Campaign
                </Button>
              </Link>
              <Link href="/campaigns" className="block">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Discover More Campaigns</Button>
              </Link>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-500 mb-2">Help spread the word</p>
              <Button variant="ghost" size="sm" className="text-blue-600">
                <Share2 className="w-4 h-4 mr-1" />
                Share this campaign
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

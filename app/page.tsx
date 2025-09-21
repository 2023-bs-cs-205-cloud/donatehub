import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Heart, Users, Target, TrendingUp, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default async function HomePage() {
  const supabase = await createClient()

  // Get featured campaigns
  const { data: campaigns } = await supabase
    .from("campaigns")
    .select(
      `
      *,
      profiles!campaigns_ngo_id_fkey (
        full_name,
        organization_name
      )
    `,
    )
    .eq("status", "active")
    .order("current_amount", { ascending: false })
    .limit(3)

  // Get platform statistics
  const { data: stats } = await supabase.rpc("get_platform_stats")

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Heart className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">DonateHub</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/campaigns" className="text-gray-600 hover:text-gray-900">
                Campaigns
              </Link>
              <Link href="/auth/login">
                <Button variant="outline" className="bg-transparent">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-blue-600 hover:bg-blue-700">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6 text-balance">
            Empowering Change Through <span className="text-blue-600">Compassionate Giving</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto text-pretty">
            Connect with meaningful causes, support trusted NGOs, and track your impact. Join thousands of donors making
            a real difference in communities worldwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/campaigns">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Heart className="w-5 h-5 mr-2" />
                Start Donating
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="lg" variant="outline" className="bg-transparent">
                Create Campaign
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="p-4 bg-green-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Target className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">$2.5M+</div>
              <p className="text-gray-600">Total Raised</p>
            </div>
            <div className="text-center">
              <div className="p-4 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">15K+</div>
              <p className="text-gray-600">Active Donors</p>
            </div>
            <div className="text-center">
              <div className="p-4 bg-purple-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Heart className="w-8 h-8 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">500+</div>
              <p className="text-gray-600">Campaigns Funded</p>
            </div>
            <div className="text-center">
              <div className="p-4 bg-orange-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">200+</div>
              <p className="text-gray-600">Partner NGOs</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Campaigns */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Campaigns</h2>
            <p className="text-lg text-gray-600">Support these urgent causes making a difference today</p>
          </div>

          {campaigns && campaigns.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {campaigns.map((campaign) => {
                const progressPercentage = (campaign.current_amount / campaign.goal_amount) * 100
                const daysLeft = Math.ceil(
                  (new Date(campaign.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
                )

                return (
                  <Card key={campaign.id} className="overflow-hidden hover:shadow-lg transition-shadow">
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

                    <CardContent className="p-6">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{campaign.title}</h3>
                      <p className="text-sm text-gray-600 mb-1">
                        by {campaign.profiles.organization_name || campaign.profiles.full_name}
                      </p>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3">{campaign.description}</p>

                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">${campaign.current_amount.toLocaleString()}</span>
                          <span className="text-gray-500">of ${campaign.goal_amount.toLocaleString()}</span>
                        </div>
                        <Progress value={progressPercentage} className="h-2" />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>{Math.round(progressPercentage)}% funded</span>
                          <span>{daysLeft > 0 ? `${daysLeft} days left` : "Ended"}</span>
                        </div>
                        <Link href={`/campaigns/${campaign.id}`} className="block">
                          <Button className="w-full bg-blue-600 hover:bg-blue-700">Support This Cause</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No featured campaigns available at the moment.</p>
            </div>
          )}

          <div className="text-center">
            <Link href="/campaigns">
              <Button variant="outline" size="lg" className="bg-transparent">
                View All Campaigns
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How DonateHub Works</h2>
            <p className="text-lg text-gray-600">Simple steps to make a meaningful impact</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="p-4 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Discover Causes</h3>
              <p className="text-gray-600">
                Browse verified campaigns from trusted NGOs and find causes that resonate with your values.
              </p>
            </div>
            <div className="text-center">
              <div className="p-4 bg-green-100 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Make Your Donation</h3>
              <p className="text-gray-600">
                Contribute any amount securely and leave a message of support for the cause you care about.
              </p>
            </div>
            <div className="text-center">
              <div className="p-4 bg-purple-100 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Track Your Impact</h3>
              <p className="text-gray-600">
                Follow campaign progress and see how your contributions are making a real difference in communities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Make a Difference?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join our community of compassionate donors and help create positive change in the world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                <Heart className="w-5 h-5 mr-2" />
                Start Your Journey
              </Button>
            </Link>
            <Link href="/campaigns">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
              >
                Explore Campaigns
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-6 h-6 text-blue-400" />
                <span className="text-xl font-bold">DonateHub</span>
              </div>
              <p className="text-gray-400">Empowering change through compassionate giving.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Donors</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/campaigns" className="hover:text-white">
                    Browse Campaigns
                  </Link>
                </li>
                <li>
                  <Link href="/donations/history" className="hover:text-white">
                    Donation History
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For NGOs</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/campaigns/create" className="hover:text-white">
                    Create Campaign
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/ngo" className="hover:text-white">
                    NGO Dashboard
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 DonateHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

import { useState, useEffect, useCallback } from 'react'
import { blink } from './blink/client'
import { User, CampaignPost, DailyReward, WeeklyLeaderboard, Campaign } from './types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Button } from './components/ui/button'
import { Badge } from './components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import { Progress } from './components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar'
import { Input } from './components/ui/input'
import { Textarea } from './components/ui/textarea'
import { Trophy, TrendingUp, Camera, Video, Share2, Heart, Eye, Gift, Coins, Star, Upload, Users, Calendar, Award, DollarSign } from 'lucide-react'
import CampaignFunding from './components/CampaignFunding'

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [userPosts, setUserPosts] = useState<CampaignPost[]>([])
  const [dailyRewards, setDailyRewards] = useState<DailyReward[]>([])
  const [weeklyLeaderboard, setWeeklyLeaderboard] = useState<WeeklyLeaderboard[]>([])
  const [selectedCampaign, setSelectedCampaign] = useState<string>('')
  const [postContent, setPostContent] = useState('')
  const [postType, setPostType] = useState<'image' | 'video' | 'text'>('text')

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  const loadData = useCallback(async () => {
    try {
      // For now, we'll use mock data since we need to create database tables first
      const mockCampaigns = [
        {
          id: 'camp_1',
          candidateName: 'Adebayo Ogundimu',
          partyName: 'Progressive Alliance Party',
          position: 'Governor - Lagos State',
          supportersCount: 1250,
          isActive: "1",
          createdAt: new Date().toISOString()
        },
        {
          id: 'camp_2',
          candidateName: 'Fatima Abdullahi',
          partyName: 'People\'s Democratic Movement',
          position: 'Senator - Kano North',
          supportersCount: 890,
          isActive: "1",
          createdAt: new Date().toISOString()
        },
        {
          id: 'camp_3',
          candidateName: 'Chukwuma Okafor',
          partyName: 'New Nigeria Party',
          position: 'House of Representatives - Anambra East',
          supportersCount: 650,
          isActive: "1",
          createdAt: new Date().toISOString()
        }
      ]

      setCampaigns(mockCampaigns)

      // Mock user posts
      const mockPosts = [
        {
          id: 'post_1',
          userId: user?.id,
          campaignId: 'camp_1',
          type: 'text' as const,
          content: 'Supporting Adebayo for a digital Lagos! #VoteArena #Lagos2025',
          likes: 45,
          shares: 12,
          views: 230,
          pointsEarned: 10,
          createdAt: new Date(Date.now() - 86400000).toISOString() // Yesterday
        },
        {
          id: 'post_2',
          userId: user?.id,
          campaignId: 'camp_2',
          type: 'image' as const,
          content: 'Fatima\'s vision for women empowerment resonates with me!',
          likes: 78,
          shares: 25,
          views: 450,
          pointsEarned: 25,
          createdAt: new Date(Date.now() - 172800000).toISOString() // 2 days ago
        }
      ]

      setUserPosts(mockPosts)

      // Mock daily rewards
      const mockRewards = [
        {
          id: 'reward_1',
          userId: user?.id,
          rank: 3,
          amount: 2500,
          claimed: "0",
          date: new Date().toISOString()
        }
      ]

      setDailyRewards(mockRewards)

      // Mock leaderboard
      const mockLeaderboard = [
        {
          id: 'leader_1',
          userId: 'user_123',
          userName: 'Kemi Adebayo',
          totalPoints: 2850,
          totalPosts: 45,
          totalEngagement: 1200
        },
        {
          id: 'leader_2',
          userId: 'user_456',
          userName: 'Ibrahim Musa',
          totalPoints: 2650,
          totalPosts: 38,
          totalEngagement: 980
        },
        {
          id: 'leader_3',
          userId: user?.id || 'current_user',
          userName: user?.displayName || user?.email || 'You',
          totalPoints: 2400,
          totalPosts: 35,
          totalEngagement: 850
        },
        {
          id: 'leader_4',
          userId: 'user_789',
          userName: 'Chioma Okoro',
          totalPoints: 2200,
          totalPosts: 32,
          totalEngagement: 720
        },
        {
          id: 'leader_5',
          userId: 'user_101',
          userName: 'Yusuf Hassan',
          totalPoints: 2000,
          totalPosts: 28,
          totalEngagement: 650
        }
      ]

      setWeeklyLeaderboard(mockLeaderboard)
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }, [user?.id, user?.displayName, user?.email])

  useEffect(() => {
    if (user?.id) {
      loadData()
    }
  }, [user?.id, loadData])

  const createCampaignPost = async () => {
    if (!selectedCampaign || !postContent.trim()) return

    try {
      // Create mock post since we don't have database tables yet
      const newPost = {
        id: `post_${Date.now()}`,
        userId: user?.id,
        campaignId: selectedCampaign,
        type: postType,
        content: postContent,
        likes: 0,
        shares: 0,
        views: 0,
        pointsEarned: calculatePostPoints(postType),
        createdAt: new Date().toISOString()
      }

      setUserPosts(prev => [newPost, ...prev])
      setPostContent('')
      
      // Award points for posting
      await updateUserPoints(calculatePostPoints(postType))
    } catch (error) {
      console.error('Error creating post:', error)
    }
  }

  const calculatePostPoints = (type: 'image' | 'video' | 'text') => {
    const basePoints = { text: 10, image: 25, video: 50 }
    return basePoints[type]
  }

  const updateUserPoints = async (points: number) => {
    // This would update user points in the database
    console.log(`Awarded ${points} points to user`)
  }

  const claimDailyReward = async (rewardId: string) => {
    try {
      // Update mock data since we don't have database tables yet
      setDailyRewards(prev => 
        prev.map(reward => 
          reward.id === rewardId ? { ...reward, claimed: "1" } : reward
        )
      )
    } catch (error) {
      console.error('Error claiming reward:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg font-medium">Loading VoteArena...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-primary">Welcome to VoteArena</CardTitle>
            <CardDescription>Nigeria's Gamified Political Platform</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => blink.auth.login()} className="w-full">
              Sign In to Start Earning
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const todayRewards = dailyRewards.filter(r => 
    new Date(r.date).toDateString() === new Date().toDateString()
  )

  const userRank = weeklyLeaderboard.findIndex(u => u.userId === user.id) + 1

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-primary">VoteArena</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-accent text-black">
                <Coins className="w-4 h-4 mr-1" />
                {user.points || 0} Points
              </Badge>
              <Avatar>
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.displayName?.[0] || user.email[0]}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Rewards Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Gift className="w-5 h-5 mr-2" />
                Daily Rewards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦20,000</div>
              <p className="text-green-100">Shared among top 10 daily</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Weekly Jackpot
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦100,000</div>
              <p className="text-yellow-100">Top 5 weekly winners</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Your Rank
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">#{userRank || 'Unranked'}</div>
              <p className="text-blue-100">This week's position</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="campaign" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="campaign">Campaign</TabsTrigger>
            <TabsTrigger value="funding">Funding</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="posts">My Posts</TabsTrigger>
          </TabsList>

          {/* Campaign Tab */}
          <TabsContent value="campaign" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Camera className="w-5 h-5 mr-2" />
                  Spread Campaign & Earn
                </CardTitle>
                <CardDescription>
                  Post campaign content to earn points and compete for daily/weekly rewards
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Select Campaign</label>
                  <select 
                    value={selectedCampaign}
                    onChange={(e) => setSelectedCampaign(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Choose a campaign to support</option>
                    {campaigns.map(campaign => (
                      <option key={campaign.id} value={campaign.id}>
                        {campaign.candidateName} - {campaign.partyName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Post Type</label>
                  <div className="flex space-x-2">
                    <Button 
                      variant={postType === 'text' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPostType('text')}
                    >
                      Text (10 pts)
                    </Button>
                    <Button 
                      variant={postType === 'image' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPostType('image')}
                    >
                      <Camera className="w-4 h-4 mr-1" />
                      Image (25 pts)
                    </Button>
                    <Button 
                      variant={postType === 'video' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPostType('video')}
                    >
                      <Video className="w-4 h-4 mr-1" />
                      Video (50 pts)
                    </Button>
                  </div>
                </div>

                <Textarea
                  placeholder="Write your campaign post content..."
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  rows={4}
                />

                {postType !== 'text' && (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">Upload your {postType} file</p>
                  </div>
                )}

                <Button 
                  onClick={createCampaignPost}
                  disabled={!selectedCampaign || !postContent.trim()}
                  className="w-full"
                >
                  Post & Earn {calculatePostPoints(postType)} Points
                </Button>
              </CardContent>
            </Card>

            {/* Active Campaigns */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {campaigns.map(campaign => (
                <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{campaign.candidateName}</CardTitle>
                    <CardDescription>{campaign.partyName} - {campaign.position}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-4 h-4 mr-1" />
                        {campaign.supportersCount} supporters
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => setSelectedCampaign(campaign.id)}
                      >
                        Support
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Campaign Funding Tab */}
          <TabsContent value="funding">
            <CampaignFunding user={user} />
          </TabsContent>

          {/* Rewards Tab */}
          <TabsContent value="rewards" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Today's Rewards */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Today's Rewards
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {todayRewards.length > 0 ? (
                    <div className="space-y-3">
                      {todayRewards.map(reward => (
                        <div key={reward.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium">Rank #{reward.rank}</div>
                            <div className="text-sm text-gray-600">₦{reward.amount.toLocaleString()}</div>
                          </div>
                          <Button 
                            size="sm"
                            disabled={Number(reward.claimed) > 0}
                            onClick={() => claimDailyReward(reward.id)}
                          >
                            {Number(reward.claimed) > 0 ? 'Claimed' : 'Claim'}
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">No rewards available today. Keep posting to earn!</p>
                  )}
                </CardContent>
              </Card>

              {/* Reward Rules */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="w-5 h-5 mr-2" />
                    How to Win
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Daily Rewards (₦20,000)</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Top 10 daily posters share ₦20,000</li>
                      <li>• More posts = higher ranking</li>
                      <li>• Videos worth 50pts, Images 25pts, Text 10pts</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Weekly Jackpot (₦100,000)</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Top 5 weekly performers</li>
                      <li>• Based on total engagement & posts</li>
                      <li>• Resets every Monday</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="w-5 h-5 mr-2" />
                  Weekly Leaderboard
                </CardTitle>
                <CardDescription>
                  Top campaign spreaders competing for ₦100,000 weekly prize
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {weeklyLeaderboard.map((entry, index) => (
                    <div 
                      key={entry.id} 
                      className={`flex items-center justify-between p-4 rounded-lg ${
                        entry.userId === user.id ? 'bg-primary/10 border border-primary' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          index < 3 ? 'bg-accent text-black' : 'bg-gray-200'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium">{entry.userName}</div>
                          <div className="text-sm text-gray-600">
                            {entry.totalPosts} posts • {entry.totalEngagement} engagement
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-primary">{entry.totalPoints} pts</div>
                        {index < 5 && (
                          <div className="text-xs text-green-600">Prize Winner!</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Posts Tab */}
          <TabsContent value="posts">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Share2 className="w-5 h-5 mr-2" />
                  My Campaign Posts
                </CardTitle>
                <CardDescription>
                  Track your posts and earnings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userPosts.map(post => (
                    <div key={post.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="outline" className="capitalize">
                          {post.type}
                        </Badge>
                        <div className="text-sm text-gray-600">
                          +{post.pointsEarned} points
                        </div>
                      </div>
                      <p className="text-gray-800 mb-3">{post.content}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Heart className="w-4 h-4 mr-1" />
                          {post.likes}
                        </div>
                        <div className="flex items-center">
                          <Share2 className="w-4 h-4 mr-1" />
                          {post.shares}
                        </div>
                        <div className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          {post.views}
                        </div>
                        <div className="ml-auto">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                  {userPosts.length === 0 && (
                    <p className="text-center text-gray-600 py-8">
                      No posts yet. Start spreading campaigns to earn rewards!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default App
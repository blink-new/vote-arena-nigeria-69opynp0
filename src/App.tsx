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
import { Trophy, TrendingUp, Camera, Video, Share2, Heart, Eye, Gift, Coins, Star, Upload, Users, Calendar, Award, DollarSign, MapPin } from 'lucide-react'
import CampaignFunding from './components/CampaignFunding'
import StateRegistration from './components/StateRegistration'

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
  const [userRegistration, setUserRegistration] = useState<any>(null)
  const [showStateRegistration, setShowStateRegistration] = useState(false)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
      
      // Check if user needs to complete state registration
      if (state.user && !state.isLoading) {
        const savedRegistration = localStorage.getItem(`registration_${state.user.id}`)
        if (savedRegistration) {
          setUserRegistration(JSON.parse(savedRegistration))
        } else {
          setShowStateRegistration(true)
        }
      }
    })
    return unsubscribe
  }, [])

  const loadData = useCallback(async () => {
    try {
      // Generate state-specific campaigns based on user registration
      const getStateCampaigns = () => {
        if (!userRegistration) return []
        
        const stateName = userRegistration.state.name
        const stateCode = userRegistration.state.code
        
        const campaignTemplates = {
          'LA': [
            { name: 'Adebayo Ogundimu', party: 'Progressive Alliance Party', position: 'Governor', supporters: 1250 },
            { name: 'Kemi Adebayo', party: 'People\'s Democratic Movement', position: 'Senator - Lagos Central', supporters: 890 },
            { name: 'Tunde Bakare', party: 'New Nigeria Party', position: 'House of Reps - Surulere', supporters: 650 }
          ],
          'KN': [
            { name: 'Fatima Abdullahi', party: 'All Progressives Congress', position: 'Governor', supporters: 2100 },
            { name: 'Ibrahim Musa', party: 'People\'s Democratic Party', position: 'Senator - Kano North', supporters: 1450 },
            { name: 'Aisha Garba', party: 'New Nigeria Party', position: 'House of Reps - Kano Municipal', supporters: 980 }
          ],
          'RI': [
            { name: 'Chioma Okoro', party: 'People\'s Democratic Party', position: 'Governor', supporters: 1800 },
            { name: 'Emeka Nwosu', party: 'All Progressives Congress', position: 'Senator - Rivers East', supporters: 1200 },
            { name: 'Grace Amadi', party: 'Labour Party', position: 'House of Reps - Port Harcourt', supporters: 750 }
          ]
        }
        
        const defaultCampaigns = [
          { name: 'Local Candidate A', party: 'Progressive Alliance', position: 'Governor', supporters: 800 },
          { name: 'Local Candidate B', party: 'Democratic Movement', position: 'Senator', supporters: 600 },
          { name: 'Local Candidate C', party: 'New Party', position: 'House of Reps', supporters: 400 }
        ]
        
        const templates = campaignTemplates[stateCode as keyof typeof campaignTemplates] || defaultCampaigns
        
        return templates.map((template, index) => ({
          id: `camp_${stateCode}_${index + 1}`,
          candidateName: template.name,
          partyName: template.party,
          position: `${template.position} - ${stateName} State`,
          supportersCount: template.supporters,
          isActive: "1",
          createdAt: new Date().toISOString()
        }))
      }

      const mockCampaigns = getStateCampaigns()

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
  }, [user?.id, user?.displayName, user?.email, userRegistration])

  useEffect(() => {
    if (user?.id) {
      loadData()
    }
  }, [user?.id, loadData, userRegistration])

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

  const handleRegistrationComplete = (registrationData: any) => {
    // Save registration data to localStorage (in real app, this would go to database)
    localStorage.setItem(`registration_${user?.id}`, JSON.stringify(registrationData))
    setUserRegistration(registrationData)
    setShowStateRegistration(false)
    
    // Update user points with welcome bonus
    if (user) {
      setUser(prev => prev ? { ...prev, points: (prev.points || 0) + 100 } : null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen naija-hero-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 naija-gradient rounded-full flex items-center justify-center mx-auto mb-6 pulse-glow">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-xl font-bold text-white bebas-font">Loading VoteArena...</p>
          <p className="text-yellow-300 roboto-font">Preparing your democracy game...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen naija-hero-bg flex items-center justify-center p-4">
        <Card className="w-full max-w-lg bg-white/95 backdrop-blur-sm arena-glow">
          <CardHeader className="text-center space-y-4">
            <div className="w-16 h-16 naija-gradient rounded-full flex items-center justify-center mx-auto">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-4xl font-bold naija-text-gradient bebas-font">
              Welcome to VoteArena!
            </CardTitle>
            <CardDescription className="text-lg roboto-font">
              Nigeria's First Gamified Political Platform
            </CardDescription>
            <div className="text-center space-y-2">
              <p className="text-yellow-600 font-bold bebas-font text-xl">Play, Win, and Shape Naija's Future!</p>
              <p className="text-gray-600 roboto-font">
                Oga, join the ultimate democracy game! Earn cash, scholarships, and jobs by supporting your favorite candidates.
              </p>
            </div>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="font-bold text-green-600 bebas-font">₦20,000</div>
                <div className="text-gray-600">Daily Rewards</div>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <div className="font-bold text-yellow-600 bebas-font">₦100,000</div>
                <div className="text-gray-600">Weekly Jackpot</div>
              </div>
            </div>
            <Button 
              onClick={() => blink.auth.login()} 
              className="w-full btn-naija text-lg py-4 bebas-font"
              size="lg"
            >
              🚀 Sign In & Start Earning Now!
            </Button>
            <p className="text-xs text-gray-500 roboto-font">
              Vote. Earn. Win. - Join thousands of Nigerians already earning!
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show state registration if user hasn't completed it
  if (showStateRegistration) {
    return <StateRegistration onRegistrationComplete={handleRegistrationComplete} />
  }

  const todayRewards = dailyRewards.filter(r => 
    new Date(r.date).toDateString() === new Date().toDateString()
  )

  const userRank = weeklyLeaderboard.findIndex(u => u.userId === user.id) + 1

  return (
    <div className="min-h-screen naija-hero-bg">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 naija-gradient rounded-full flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold naija-text-gradient bebas-font">VoteArena</h1>
              <span className="text-sm text-gray-600 roboto-font hidden sm:block">Win Big in Naija's Democracy Game!</span>
            </div>
            <div className="flex items-center space-x-4">
              {userRegistration && (
                <Badge variant="outline" className="hidden sm:flex">
                  <MapPin className="w-4 h-4 mr-1" />
                  {userRegistration.state.name}
                </Badge>
              )}
              <Badge className="points-badge">
                <Coins className="w-4 h-4 mr-1" />
                {user.points || 0} Points
              </Badge>
              <Avatar>
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-primary text-white">{user.displayName?.[0] || user.email[0]}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Welcome Section */}
        <div className="text-center mb-8 arena-glow py-16">
          <h1 className="text-5xl md:text-7xl font-bold text-white bebas-font mb-4">
            Welcome to VoteArena!
          </h1>
          <h2 className="text-2xl md:text-3xl text-yellow-300 roboto-font mb-6">
            Play, Win, and Shape Naija's Future!
          </h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8 roboto-font">
            {userRegistration ? (
              `Welcome to ${userRegistration.state.name} State! Join thousands of voters earning rewards by supporting your local candidates. Your voice matters!`
            ) : (
              'Oga, join the ultimate democracy game in Lagos, Kano, and Rivers! Vote for candidates, earn cash, VST tokens, or jobs, and make your voice count. Beta launches Q3 2025!'
            )}
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold text-yellow-300 bebas-font">₦20,000</div>
              <div className="text-sm text-white/80">Daily Rewards</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold text-yellow-300 bebas-font">₦100,000</div>
              <div className="text-sm text-white/80">Weekly Jackpot</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold text-yellow-300 bebas-font">₦500,000</div>
              <div className="text-sm text-white/80">Scholarships</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold text-yellow-300 bebas-font">#{userRank || 'Join'}</div>
              <div className="text-sm text-white/80">Your Rank</div>
            </div>
          </div>
          
          <div className="text-center space-y-4">
            <p className="text-yellow-300 font-bold bebas-font text-xl italic">Vote. Earn. Win.</p>
            <p className="text-white/70 text-sm roboto-font">
              Join thousands of Nigerians already earning rewards for political engagement
            </p>
          </div>
        </div>

        {/* Win Big in the Reward Arena */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-white bebas-font mb-4">Win Big in the Reward Arena</h2>
          <p className="text-lg text-white/80 roboto-font max-w-2xl mx-auto">
            Oga, no be small thing! Share campaign posts, climb the leaderboard, and win amazing prizes that will change your life!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="reward-card text-white bg-gradient-to-r from-green-500 to-green-600 card-hover">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center bebas-font">
                <Gift className="w-5 h-5 mr-2" />
                Win Bag of Rice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦80,000</div>
              <p className="text-green-100 text-sm">Share candidate posts on X to win a 50kg bag of rice. No hunger for your hustle!</p>
            </CardContent>
          </Card>

          <Card className="reward-card text-white bg-gradient-to-r from-yellow-500 to-yellow-600 card-hover">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center bebas-font">
                <Award className="w-5 h-5 mr-2" />
                Win Scholarship
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦500,000</div>
              <p className="text-yellow-100 text-sm">Top voters in Lagos, Kano, and Rivers win scholarships for school fees. Education na power!</p>
            </CardContent>
          </Card>

          <Card className="reward-card text-white bg-gradient-to-r from-blue-500 to-blue-600 card-hover">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center bebas-font">
                <DollarSign className="w-5 h-5 mr-2" />
                Win Monthly Salary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦100,000</div>
              <p className="text-blue-100 text-sm">Climb the leaderboard to win a monthly salary for a year. Your vote pays your bills!</p>
            </CardContent>
          </Card>

          <Card className="reward-card text-white bg-gradient-to-r from-purple-500 to-purple-600 card-hover">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center bebas-font">
                <TrendingUp className="w-5 h-5 mr-2" />
                Win Empowerment & Employment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦200,000</div>
              <p className="text-purple-100 text-sm">Engage with Honourables to win training programs or jobs to boost your career!</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="campaign" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="campaign">Campaign</TabsTrigger>
            <TabsTrigger value="funding">Funding</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="posts">My Posts</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>

          {/* Campaign Tab */}
          <TabsContent value="campaign" className="space-y-6">
            {/* Post and Earn Section - Featured */}
            <Card className="post-earn-card">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl bebas-font naija-text-gradient flex items-center justify-center">
                  <Camera className="w-6 h-6 mr-2" />
                  Post & Earn 10 Points!
                </CardTitle>
                <CardDescription className="text-lg roboto-font">
                  Oga, spread campaign content and win big rewards! Share posts on X, earn points, and compete for daily ₦20,000 and weekly ₦100,000 prizes!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-white/50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-green-600 bebas-font">10+</div>
                    <div className="text-sm text-gray-600">Points per post</div>
                  </div>
                  <div className="bg-white/50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-yellow-600 bebas-font">₦20K</div>
                    <div className="text-sm text-gray-600">Daily rewards</div>
                  </div>
                  <div className="bg-white/50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-blue-600 bebas-font">₦100K</div>
                    <div className="text-sm text-gray-600">Weekly jackpot</div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 roboto-font">Select Campaign to Support</label>
                  <select 
                    value={selectedCampaign}
                    onChange={(e) => setSelectedCampaign(e.target.value)}
                    className="w-full p-3 border-2 border-yellow-200 rounded-lg focus:border-yellow-400 roboto-font"
                  >
                    <option value="">Choose a candidate to support</option>
                    {campaigns.map(campaign => (
                      <option key={campaign.id} value={campaign.id}>
                        {campaign.candidateName} - {campaign.partyName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3 roboto-font">Choose Your Post Type & Earn Points</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Button 
                      variant={postType === 'text' ? 'default' : 'outline'}
                      className={`h-auto p-4 flex flex-col items-center space-y-2 ${postType === 'text' ? 'btn-naija' : 'border-2 border-yellow-200 hover:border-yellow-400'}`}
                      onClick={() => setPostType('text')}
                    >
                      <div className="text-2xl bebas-font">10 PTS</div>
                      <div className="text-sm">Text Post</div>
                      <div className="text-xs opacity-75">Quick & Easy</div>
                    </Button>
                    <Button 
                      variant={postType === 'image' ? 'default' : 'outline'}
                      className={`h-auto p-4 flex flex-col items-center space-y-2 ${postType === 'image' ? 'btn-naija' : 'border-2 border-yellow-200 hover:border-yellow-400'}`}
                      onClick={() => setPostType('image')}
                    >
                      <Camera className="w-6 h-6" />
                      <div className="text-2xl bebas-font">25 PTS</div>
                      <div className="text-sm">Image Post</div>
                      <div className="text-xs opacity-75">More Engaging</div>
                    </Button>
                    <Button 
                      variant={postType === 'video' ? 'default' : 'outline'}
                      className={`h-auto p-4 flex flex-col items-center space-y-2 ${postType === 'video' ? 'btn-naija' : 'border-2 border-yellow-200 hover:border-yellow-400'}`}
                      onClick={() => setPostType('video')}
                    >
                      <Video className="w-6 h-6" />
                      <div className="text-2xl bebas-font">50 PTS</div>
                      <div className="text-sm">Video Post</div>
                      <div className="text-xs opacity-75">Maximum Impact</div>
                    </Button>
                  </div>
                </div>

                <Textarea
                  placeholder="Write your campaign post content... e.g., 'Supporting Adebayo for a digital Lagos! #VoteArena #Lagos2025'"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  rows={4}
                  className="border-2 border-yellow-200 focus:border-yellow-400 roboto-font"
                />

                {postType !== 'text' && (
                  <div className="border-2 border-dashed border-yellow-300 rounded-lg p-6 text-center bg-yellow-50">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
                    <p className="text-sm text-gray-700 roboto-font">Upload your {postType} file to earn {calculatePostPoints(postType)} points</p>
                    <p className="text-xs text-gray-600 mt-1">Max file size: 10MB</p>
                  </div>
                )}

                <Button 
                  onClick={createCampaignPost}
                  disabled={!selectedCampaign || !postContent.trim()}
                  className="w-full btn-naija text-lg py-4 bebas-font"
                  size="lg"
                >
                  🚀 Post & Earn {calculatePostPoints(postType)} Points Now!
                </Button>

                {/* How it Works */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-bold text-blue-800 mb-2 bebas-font">How to Win Big:</h4>
                  <ul className="text-sm text-blue-700 space-y-1 roboto-font">
                    <li>• Post campaign content to earn 10-50 points</li>
                    <li>• Share on X (Twitter) for bonus engagement</li>
                    <li>• Top 10 daily posters share ₦20,000</li>
                    <li>• Top 5 weekly performers win ₦100,000</li>
                    <li>• More posts = higher ranking = bigger rewards!</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Active Campaigns */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white bebas-font text-center">
                {userRegistration ? (
                  `${userRegistration.state.name} State Candidates - Choose & Start Earning!`
                ) : (
                  'Choose Your Candidate & Start Earning!'
                )}
              </h3>
              {userRegistration && (
                <div className="text-center mb-6">
                  <Badge className="bg-green-600 text-white px-4 py-2 text-sm">
                    <MapPin className="w-4 h-4 mr-2" />
                    Registered in {userRegistration.state.name} State • {userRegistration.state.voters} voters
                  </Badge>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {campaigns.map(campaign => (
                  <Card key={campaign.id} className="card-hover bg-white/95 backdrop-blur-sm">
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-3 mb-2">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="naija-gradient text-white font-bold">
                            {campaign.candidateName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg bebas-font">{campaign.candidateName}</CardTitle>
                          <Badge variant="outline" className="text-xs">{campaign.partyName}</Badge>
                        </div>
                      </div>
                      <CardDescription className="roboto-font">{campaign.position}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-gray-600 roboto-font">
                          <Users className="w-4 h-4 mr-2 text-green-600" />
                          {campaign.supportersCount} supporters already earning
                        </div>
                        <Button 
                          className="w-full btn-naija bebas-font"
                          onClick={() => setSelectedCampaign(campaign.id)}
                        >
                          Support & Start Earning
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
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

          {/* About Tab */}
          <TabsContent value="about" className="space-y-6">
            {/* About VoteArena */}
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl bebas-font naija-text-gradient">
                  About VoteArena
                </CardTitle>
                <CardDescription className="text-lg roboto-font">
                  Nigeria's First Gamified Political Engagement Platform
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto roboto-font">
                  VoteArena is Nigeria's first gamified platform for political engagement, rewarding 87M voters with VST tokens, cash, scholarships, and jobs. From Lagos to Kano to Rivers, we make democracy fun and impactful. Join us!
                </p>
                
                {/* Key Features */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-green-50 p-6 rounded-lg">
                    <h4 className="text-xl font-bold text-green-700 mb-3 bebas-font">For Voters</h4>
                    <ul className="space-y-2 text-gray-700 roboto-font">
                      <li>• Earn cash rewards for political engagement</li>
                      <li>• Win scholarships worth ₦500,000</li>
                      <li>• Get monthly salaries for top performers</li>
                      <li>• Access job opportunities from politicians</li>
                      <li>• Participate in Q&A gaming experiences</li>
                    </ul>
                  </div>
                  <div className="bg-yellow-50 p-6 rounded-lg">
                    <h4 className="text-xl font-bold text-yellow-700 mb-3 bebas-font">For Politicians</h4>
                    <ul className="space-y-2 text-gray-700 roboto-font">
                      <li>• Reach millions of Nigerian voters</li>
                      <li>• Run targeted campaign content</li>
                      <li>• Engage supporters through rewards</li>
                      <li>• Host live podcast sessions</li>
                      <li>• Raise campaign funds securely</li>
                    </ul>
                  </div>
                </div>

                {/* Coverage Areas */}
                <div className="bg-blue-50 p-6 rounded-lg text-center">
                  <h4 className="text-xl font-bold text-blue-700 mb-3 bebas-font">Coverage Areas</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg">
                      <h5 className="font-bold text-blue-600 bebas-font">Lagos State</h5>
                      <p className="text-sm text-gray-600">Economic hub with millions of voters</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <h5 className="font-bold text-blue-600 bebas-font">Kano State</h5>
                      <p className="text-sm text-gray-600">Northern Nigeria's political center</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <h5 className="font-bold text-blue-600 bebas-font">Rivers State</h5>
                      <p className="text-sm text-gray-600">Oil-rich region with active politics</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Meet the Founder */}
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl bebas-font naija-text-gradient">
                  Meet the Founder
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-w-md mx-auto text-center">
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarImage src="/images/larry-headshot.png" alt="Founder" />
                    <AvatarFallback className="naija-gradient text-white text-2xl font-bold">
                      RB
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-bold text-gray-800 bebas-font">
                    Raheem Larry Babatunde
                  </h3>
                  <p className="text-gray-600 mb-3 roboto-font">Founder & CEO</p>
                  <p className="text-gray-700 roboto-font">
                    Lagos-based visionary with 5+ years in fintech and community startups, driving VoteArena to empower Nigeria's 87M voters through gamified political engagement.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contact & Social */}
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl bebas-font naija-text-gradient">
                  Connect With Us
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-center">
                    <h4 className="font-bold text-gray-800 mb-3 bebas-font">Contact Information</h4>
                    <div className="space-y-2 text-gray-600 roboto-font">
                      <p>📍 10 Adeola Odeku, Victoria Island, Lagos</p>
                      <p>📧 info@votearena.ng</p>
                      <p>📞 +234-123-456-789</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <h4 className="font-bold text-gray-800 mb-3 bebas-font">Follow Us</h4>
                    <div className="space-y-2 text-gray-600 roboto-font">
                      <p>🐦 @VoteArenaNG on Twitter</p>
                      <p>📸 @votearenang on Instagram</p>
                      <p>💬 WhatsApp Support Available</p>
                    </div>
                  </div>
                </div>
                
                <div className="text-center mt-6 pt-6 border-t">
                  <p className="text-sm text-gray-600 roboto-font">
                    © 2025 VoteArena Nigeria Ltd. All rights reserved.
                  </p>
                  <p className="text-xs text-gray-500 mt-2 roboto-font">
                    Beta launching Q3 2025 • Making democracy fun and rewarding for all Nigerians
                  </p>
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
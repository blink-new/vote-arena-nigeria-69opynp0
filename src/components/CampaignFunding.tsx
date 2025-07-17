import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Progress } from './ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { 
  DollarSign, 
  Target, 
  Users, 
  TrendingUp, 
  Calendar,
  Gift,
  Coins,
  Award,
  CheckCircle,
  Clock,
  Share2,
  Heart,
  Eye
} from 'lucide-react'
import { blink } from '../blink/client'

interface CampaignFund {
  id: string
  candidateName: string
  partyName: string
  position: string
  description: string
  imageUrl?: string
  targetAmount: number
  currentAmount: number
  contributorsCount: number
  rewardPool: number
  dailyRewardPool: number
  weeklyRewardPool: number
  isActive: boolean
  endDate: string
  createdAt: string
}

interface FundContribution {
  id: string
  campaignId: string
  candidateName: string
  amount: number
  rewardPoolAllocation: number
  dailyPoolAllocation: number
  weeklyPoolAllocation: number
  createdAt: string
}

interface SupporterActivity {
  id: string
  userId: string
  campaignId: string
  activityType: 'post' | 'share' | 'like' | 'comment'
  pointsEarned: number
  rewardEligible: boolean
  createdAt: string
}

export default function CampaignFunding({ user }: { user: any }) {
  const [campaignFunds, setCampaignFunds] = useState<CampaignFund[]>([])
  const [contributions, setContributions] = useState<FundContribution[]>([])
  const [supporterActivities, setSupporterActivities] = useState<SupporterActivity[]>([])
  const [loading, setLoading] = useState(true)
  
  // Funding form state
  const [selectedCampaign, setSelectedCampaign] = useState('')
  const [fundAmount, setFundAmount] = useState('')
  const [rewardPercentage, setRewardPercentage] = useState(70) // 70% to reward pool, 30% to campaign
  
  // Create campaign form state
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newCampaign, setNewCampaign] = useState({
    candidateName: '',
    partyName: '',
    position: '',
    description: '',
    targetAmount: '',
    endDate: ''
  })

  useEffect(() => {
    loadCampaignData()
  }, [])

  const loadCampaignData = async () => {
    try {
      setLoading(true)
      
      // Mock data for now since we can't create tables
      const mockCampaignFunds: CampaignFund[] = [
        {
          id: 'camp_1',
          candidateName: 'Adebayo Ogundimu',
          partyName: 'Progressive Alliance Party',
          position: 'Governor - Lagos State',
          description: 'Building a digital Lagos with youth empowerment and job creation',
          targetAmount: 50000000, // ₦50M
          currentAmount: 12500000, // ₦12.5M
          contributorsCount: 45,
          rewardPool: 8750000, // ₦8.75M (70% of contributions)
          dailyRewardPool: 2625000, // 30% of reward pool
          weeklyRewardPool: 6125000, // 70% of reward pool
          isActive: true,
          endDate: '2025-02-15',
          createdAt: '2025-01-01'
        },
        {
          id: 'camp_2',
          candidateName: 'Fatima Abdullahi',
          partyName: 'People\'s Democratic Movement',
          position: 'Senator - Kano North',
          description: 'Empowering women and youth through education and entrepreneurship',
          targetAmount: 25000000, // ₦25M
          currentAmount: 8200000, // ₦8.2M
          contributorsCount: 32,
          rewardPool: 5740000, // ₦5.74M
          dailyRewardPool: 1722000,
          weeklyRewardPool: 4018000,
          isActive: true,
          endDate: '2025-02-20',
          createdAt: '2025-01-05'
        },
        {
          id: 'camp_3',
          candidateName: 'Chukwuma Okafor',
          partyName: 'New Nigeria Party',
          position: 'House of Representatives - Anambra East',
          description: 'Infrastructure development and technology advancement',
          targetAmount: 15000000, // ₦15M
          currentAmount: 4800000, // ₦4.8M
          contributorsCount: 28,
          rewardPool: 3360000, // ₦3.36M
          dailyRewardPool: 1008000,
          weeklyRewardPool: 2352000,
          isActive: true,
          endDate: '2025-02-25',
          createdAt: '2025-01-10'
        }
      ]

      const mockContributions: FundContribution[] = [
        {
          id: 'cont_1',
          campaignId: 'camp_1',
          candidateName: 'Adebayo Ogundimu',
          amount: 5000000,
          rewardPoolAllocation: 3500000,
          dailyPoolAllocation: 1050000,
          weeklyPoolAllocation: 2450000,
          createdAt: '2025-01-15'
        }
      ]

      setCampaignFunds(mockCampaignFunds)
      setContributions(mockContributions)
      
    } catch (error) {
      console.error('Error loading campaign data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFundCampaign = async () => {
    if (!selectedCampaign || !fundAmount || parseFloat(fundAmount) <= 0) return

    try {
      const amount = parseFloat(fundAmount)
      const rewardAllocation = (amount * rewardPercentage) / 100
      const dailyAllocation = rewardAllocation * 0.3 // 30% for daily rewards
      const weeklyAllocation = rewardAllocation * 0.7 // 70% for weekly rewards

      // In a real app, this would create a payment intent with Stripe
      // For now, we'll simulate the funding
      
      const newContribution: FundContribution = {
        id: `cont_${Date.now()}`,
        campaignId: selectedCampaign,
        candidateName: campaignFunds.find(c => c.id === selectedCampaign)?.candidateName || '',
        amount,
        rewardPoolAllocation: rewardAllocation,
        dailyPoolAllocation: dailyAllocation,
        weeklyPoolAllocation: weeklyAllocation,
        createdAt: new Date().toISOString()
      }

      setContributions(prev => [newContribution, ...prev])

      // Update campaign fund totals
      setCampaignFunds(prev => prev.map(campaign => 
        campaign.id === selectedCampaign 
          ? {
              ...campaign,
              currentAmount: campaign.currentAmount + amount,
              rewardPool: campaign.rewardPool + rewardAllocation,
              dailyRewardPool: campaign.dailyRewardPool + dailyAllocation,
              weeklyRewardPool: campaign.weeklyRewardPool + weeklyAllocation,
              contributorsCount: campaign.contributorsCount + 1
            }
          : campaign
      ))

      // Reset form
      setSelectedCampaign('')
      setFundAmount('')
      
      alert(`Successfully funded ₦${amount.toLocaleString()}! ₦${rewardAllocation.toLocaleString()} added to supporter reward pool.`)
      
    } catch (error) {
      console.error('Error funding campaign:', error)
      alert('Failed to fund campaign. Please try again.')
    }
  }

  const handleCreateCampaign = async () => {
    if (!newCampaign.candidateName || !newCampaign.targetAmount) return

    try {
      const campaign: CampaignFund = {
        id: `camp_${Date.now()}`,
        candidateName: newCampaign.candidateName,
        partyName: newCampaign.partyName,
        position: newCampaign.position,
        description: newCampaign.description,
        targetAmount: parseFloat(newCampaign.targetAmount),
        currentAmount: 0,
        contributorsCount: 0,
        rewardPool: 0,
        dailyRewardPool: 0,
        weeklyRewardPool: 0,
        isActive: true,
        endDate: newCampaign.endDate,
        createdAt: new Date().toISOString()
      }

      setCampaignFunds(prev => [campaign, ...prev])
      setShowCreateForm(false)
      setNewCampaign({
        candidateName: '',
        partyName: '',
        position: '',
        description: '',
        targetAmount: '',
        endDate: ''
      })

      alert('Campaign created successfully! You can now start funding it.')
      
    } catch (error) {
      console.error('Error creating campaign:', error)
      alert('Failed to create campaign. Please try again.')
    }
  }

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`
  }

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Funding Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Total Funded
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(campaignFunds.reduce((sum, c) => sum + c.currentAmount, 0))}
            </div>
            <p className="text-green-100">Across all campaigns</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Gift className="w-5 h-5 mr-2" />
              Reward Pools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(campaignFunds.reduce((sum, c) => sum + c.rewardPool, 0))}
            </div>
            <p className="text-yellow-100">Available for supporters</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Active Campaigns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaignFunds.filter(c => c.isActive).length}</div>
            <p className="text-blue-100">Currently fundraising</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Contributors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campaignFunds.reduce((sum, c) => sum + c.contributorsCount, 0)}
            </div>
            <p className="text-purple-100">Total funders</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="campaigns" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="campaigns">Active Campaigns</TabsTrigger>
          <TabsTrigger value="fund">Fund Campaign</TabsTrigger>
          <TabsTrigger value="create">Create Campaign</TabsTrigger>
        </TabsList>

        {/* Active Campaigns */}
        <TabsContent value="campaigns" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {campaignFunds.map(campaign => (
              <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={campaign.imageUrl} />
                        <AvatarFallback>{campaign.candidateName[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{campaign.candidateName}</CardTitle>
                        <CardDescription>{campaign.partyName}</CardDescription>
                        <Badge variant="outline" className="mt-1">{campaign.position}</Badge>
                      </div>
                    </div>
                    <Badge variant={campaign.isActive ? "default" : "secondary"}>
                      {campaign.isActive ? "Active" : "Ended"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">{campaign.description}</p>
                  
                  {/* Funding Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Funding Progress</span>
                      <span>{Math.round(calculateProgress(campaign.currentAmount, campaign.targetAmount))}%</span>
                    </div>
                    <Progress value={calculateProgress(campaign.currentAmount, campaign.targetAmount)} />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{formatCurrency(campaign.currentAmount)} raised</span>
                      <span>{formatCurrency(campaign.targetAmount)} target</span>
                    </div>
                  </div>

                  {/* Reward Pool Info */}
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-yellow-800">Supporter Reward Pool</span>
                      <Coins className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div className="text-2xl font-bold text-yellow-900">
                      {formatCurrency(campaign.rewardPool)}
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-yellow-700">
                      <div>Daily: {formatCurrency(campaign.dailyRewardPool)}</div>
                      <div>Weekly: {formatCurrency(campaign.weeklyRewardPool)}</div>
                    </div>
                  </div>

                  {/* Campaign Stats */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-gray-500" />
                      {campaign.contributorsCount} funders
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                      Ends {new Date(campaign.endDate).toLocaleDateString()}
                    </div>
                  </div>

                  <Button 
                    className="w-full" 
                    onClick={() => setSelectedCampaign(campaign.id)}
                  >
                    Support This Campaign
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Fund Campaign */}
        <TabsContent value="fund" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Fund a Campaign
              </CardTitle>
              <CardDescription>
                Fund political campaigns and allocate rewards for supporters who spread the campaign
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Select Campaign</label>
                <select 
                  value={selectedCampaign}
                  onChange={(e) => setSelectedCampaign(e.target.value)}
                  className="w-full p-3 border rounded-md"
                >
                  <option value="">Choose a campaign to fund</option>
                  {campaignFunds.filter(c => c.isActive).map(campaign => (
                    <option key={campaign.id} value={campaign.id}>
                      {campaign.candidateName} - {campaign.partyName} ({campaign.position})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Funding Amount (₦)</label>
                <Input
                  type="number"
                  placeholder="Enter amount in Naira"
                  value={fundAmount}
                  onChange={(e) => setFundAmount(e.target.value)}
                  min="1000"
                  step="1000"
                />
                <p className="text-xs text-gray-600 mt-1">Minimum: ₦1,000</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Reward Pool Allocation: {rewardPercentage}%
                </label>
                <input
                  type="range"
                  min="50"
                  max="90"
                  value={rewardPercentage}
                  onChange={(e) => setRewardPercentage(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>50% (Min for supporters)</span>
                  <span>90% (Max for supporters)</span>
                </div>
              </div>

              {fundAmount && parseFloat(fundAmount) > 0 && (
                <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                  <h4 className="font-medium text-blue-900">Funding Breakdown</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-blue-700">Campaign Fund:</span>
                      <div className="font-bold text-blue-900">
                        {formatCurrency(parseFloat(fundAmount) * (100 - rewardPercentage) / 100)}
                      </div>
                    </div>
                    <div>
                      <span className="text-blue-700">Supporter Rewards:</span>
                      <div className="font-bold text-blue-900">
                        {formatCurrency(parseFloat(fundAmount) * rewardPercentage / 100)}
                      </div>
                    </div>
                    <div>
                      <span className="text-blue-700">Daily Pool (30%):</span>
                      <div className="font-bold text-blue-900">
                        {formatCurrency(parseFloat(fundAmount) * rewardPercentage / 100 * 0.3)}
                      </div>
                    </div>
                    <div>
                      <span className="text-blue-700">Weekly Pool (70%):</span>
                      <div className="font-bold text-blue-900">
                        {formatCurrency(parseFloat(fundAmount) * rewardPercentage / 100 * 0.7)}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <Button 
                onClick={handleFundCampaign}
                disabled={!selectedCampaign || !fundAmount || parseFloat(fundAmount) < 1000}
                className="w-full"
                size="lg"
              >
                Fund Campaign {fundAmount && `- ${formatCurrency(parseFloat(fundAmount))}`}
              </Button>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-medium text-yellow-800 mb-2">How It Works</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• You fund a political campaign with your chosen amount</li>
                  <li>• A percentage goes to supporter rewards (you choose 50-90%)</li>
                  <li>• Supporters earn from this pool by posting, sharing, and engaging</li>
                  <li>• Daily rewards (30% of pool) distributed to top 10 daily supporters</li>
                  <li>• Weekly rewards (70% of pool) distributed to top 5 weekly supporters</li>
                  <li>• More funding = bigger rewards = more supporter engagement</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Recent Contributions */}
          {contributions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Contributions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {contributions.map(contribution => (
                    <div key={contribution.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">{contribution.candidateName}</div>
                        <div className="text-sm text-gray-600">
                          {new Date(contribution.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">
                          {formatCurrency(contribution.amount)}
                        </div>
                        <div className="text-xs text-gray-600">
                          {formatCurrency(contribution.rewardPoolAllocation)} to rewards
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Create Campaign */}
        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Create New Campaign
              </CardTitle>
              <CardDescription>
                Set up a new political campaign for funding and supporter engagement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Candidate Name</label>
                  <Input
                    placeholder="Enter candidate's full name"
                    value={newCampaign.candidateName}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, candidateName: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Political Party</label>
                  <Input
                    placeholder="Enter party name"
                    value={newCampaign.partyName}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, partyName: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Position/Office</label>
                <Input
                  placeholder="e.g., Governor - Lagos State, Senator - Kano North"
                  value={newCampaign.position}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, position: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Campaign Description</label>
                <Textarea
                  placeholder="Describe the campaign goals, vision, and key promises..."
                  value={newCampaign.description}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Funding Target (₦)</label>
                  <Input
                    type="number"
                    placeholder="Enter target amount"
                    value={newCampaign.targetAmount}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, targetAmount: e.target.value }))}
                    min="1000000"
                    step="1000000"
                  />
                  <p className="text-xs text-gray-600 mt-1">Minimum: ₦1,000,000</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Campaign End Date</label>
                  <Input
                    type="date"
                    value={newCampaign.endDate}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, endDate: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <Button 
                onClick={handleCreateCampaign}
                disabled={!newCampaign.candidateName || !newCampaign.targetAmount}
                className="w-full"
                size="lg"
              >
                Create Campaign
              </Button>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">Campaign Benefits</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Reach thousands of potential supporters through gamified engagement</li>
                  <li>• Supporters earn real cash rewards for spreading your campaign</li>
                  <li>• Track campaign performance and supporter engagement in real-time</li>
                  <li>• Build a community of motivated supporters who benefit from your success</li>
                  <li>• Transparent funding and reward distribution system</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
export interface User {
  id: string
  email: string
  displayName?: string
  avatar?: string
  subscriptionTier?: 'free' | 'basic' | 'premium' | 'vip'
  points?: number
  createdAt?: string
}

export interface Reward {
  id: string
  title: string
  description: string
  value: number
  valueInNaira: number
  type: 'cash' | 'scholarship' | 'job' | 'appointment' | 'rice'
  requiredTier: 'free' | 'basic' | 'premium' | 'vip'
  pointsCost: number
  isActive: boolean
  winnersCount: number
  maxWinners: number
}

export interface GameSession {
  id: string
  userId: string
  gameType: 'qa' | 'trivia' | 'debate'
  score: number
  pointsEarned: number
  completedAt: string
  tier: string
}

export interface Subscription {
  id: string
  userId: string
  tier: 'basic' | 'premium' | 'vip'
  priceInNaira: number
  startDate: string
  endDate: string
  isActive: boolean
}

export interface Campaign {
  id: string
  candidateName: string
  partyName: string
  position: string
  description?: string
  imageUrl?: string
  supportersCount: number
  isActive: string // SQLite compatibility: "0" or "1"
  createdAt: string
}

export interface CampaignPost {
  id: string
  userId: string
  campaignId: string
  type: 'image' | 'video' | 'text'
  content: string
  mediaUrl?: string
  likes: number
  shares: number
  views: number
  pointsEarned: number
  createdAt: string
}

export interface DailyReward {
  id: string
  userId: string
  amount: number
  type: 'daily' | 'weekly' | 'campaign_spread'
  date: string
  claimed: string // SQLite compatibility: "0" or "1"
  rank: number
}

export interface WeeklyLeaderboard {
  id: string
  userId: string
  userName: string
  totalPosts: number
  totalEngagement: number
  totalPoints: number
  rank: number
  weekStart: string
  weekEnd: string
}

export interface RewardPool {
  daily: {
    amount: 20000
    currency: 'NGN'
    winners: 10
  }
  weekly: {
    amount: 100000
    currency: 'NGN'
    winners: 5
  }
}
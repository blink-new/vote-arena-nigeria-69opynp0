import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Badge } from './ui/badge'
import { MapPin, Users, Trophy, Gift } from 'lucide-react'

interface StateRegistrationProps {
  onRegistrationComplete: (stateData: any) => void
}

const NIGERIAN_STATES = [
  { code: 'AB', name: 'Abia', region: 'South East', voters: '2.4M' },
  { code: 'AD', name: 'Adamawa', region: 'North East', voters: '2.1M' },
  { code: 'AK', name: 'Akwa Ibom', region: 'South South', voters: '2.7M' },
  { code: 'AN', name: 'Anambra', region: 'South East', voters: '2.8M' },
  { code: 'BA', name: 'Bauchi', region: 'North East', voters: '3.2M' },
  { code: 'BY', name: 'Bayelsa', region: 'South South', voters: '1.2M' },
  { code: 'BE', name: 'Benue', region: 'North Central', voters: '2.9M' },
  { code: 'BO', name: 'Borno', region: 'North East', voters: '2.8M' },
  { code: 'CR', name: 'Cross River', region: 'South South', voters: '1.9M' },
  { code: 'DE', name: 'Delta', region: 'South South', voters: '2.9M' },
  { code: 'EB', name: 'Ebonyi', region: 'South East', voters: '1.4M' },
  { code: 'ED', name: 'Edo', region: 'South South', voters: '2.2M' },
  { code: 'EK', name: 'Ekiti', region: 'South West', voters: '1.6M' },
  { code: 'EN', name: 'Enugu', region: 'South East', voters: '1.8M' },
  { code: 'FC', name: 'FCT', region: 'North Central', voters: '1.4M' },
  { code: 'GO', name: 'Gombe', region: 'North East', voters: '1.6M' },
  { code: 'IM', name: 'Imo', region: 'South East', voters: '2.5M' },
  { code: 'JI', name: 'Jigawa', region: 'North West', voters: '2.7M' },
  { code: 'KD', name: 'Kaduna', region: 'North West', voters: '4.3M' },
  { code: 'KN', name: 'Kano', region: 'North West', voters: '5.9M' },
  { code: 'KT', name: 'Katsina', region: 'North West', voters: '3.8M' },
  { code: 'KE', name: 'Kebbi', region: 'North West', voters: '2.1M' },
  { code: 'KO', name: 'Kogi', region: 'North Central', voters: '2.0M' },
  { code: 'KW', name: 'Kwara', region: 'North Central', voters: '1.6M' },
  { code: 'LA', name: 'Lagos', region: 'South West', voters: '6.9M' },
  { code: 'NA', name: 'Nasarawa', region: 'North Central', voters: '1.3M' },
  { code: 'NI', name: 'Niger', region: 'North Central', voters: '2.5M' },
  { code: 'OG', name: 'Ogun', region: 'South West', voters: '2.4M' },
  { code: 'ON', name: 'Ondo', region: 'South West', voters: '2.1M' },
  { code: 'OS', name: 'Osun', region: 'South West', voters: '1.9M' },
  { code: 'OY', name: 'Oyo', region: 'South West', voters: '3.2M' },
  { code: 'PL', name: 'Plateau', region: 'North Central', voters: '2.0M' },
  { code: 'RI', name: 'Rivers', region: 'South South', voters: '3.5M' },
  { code: 'SO', name: 'Sokoto', region: 'North West', voters: '2.3M' },
  { code: 'TA', name: 'Taraba', region: 'North East', voters: '1.5M' },
  { code: 'YO', name: 'Yobe', region: 'North East', voters: '1.3M' },
  { code: 'ZA', name: 'Zamfara', region: 'North West', voters: '1.8M' }
]

const STATE_REWARDS = {
  'LA': { daily: '₦25,000', weekly: '₦150,000', special: 'Tech Jobs' },
  'KN': { daily: '₦20,000', weekly: '₦120,000', special: 'Agric Loans' },
  'RI': { daily: '₦30,000', weekly: '₦200,000', special: 'Oil Jobs' },
  'KD': { daily: '₦18,000', weekly: '₦100,000', special: 'Education' },
  'AN': { daily: '₦22,000', weekly: '₦130,000', special: 'Business' },
  'OY': { daily: '₦20,000', weekly: '₦110,000', special: 'Farming' }
}

export default function StateRegistration({ onRegistrationComplete }: StateRegistrationProps) {
  const [selectedState, setSelectedState] = useState('')
  const [formData, setFormData] = useState({
    voterCardNumber: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    lga: '',
    ward: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedStateData = NIGERIAN_STATES.find(state => state.code === selectedState)
  const stateRewards = STATE_REWARDS[selectedState as keyof typeof STATE_REWARDS]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedState || !formData.voterCardNumber || !formData.fullName || !formData.email || !formData.phoneNumber) {
      return
    }

    setIsSubmitting(true)
    
    // Simulate registration process
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const registrationData = {
      ...formData,
      state: selectedStateData,
      registeredAt: new Date().toISOString(),
      points: 100, // Welcome bonus
      tier: 'basic'
    }
    
    onRegistrationComplete(registrationData)
    setIsSubmitting(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen naija-hero-bg p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 naija-gradient rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white bebas-font mb-4">
            Choose Your State & Start Earning!
          </h1>
          <p className="text-xl text-white/90 roboto-font max-w-2xl mx-auto">
            Register with your voter card details and join thousands of Nigerians earning rewards in your state
          </p>
        </div>

        {/* State Selection */}
        <Card className="mb-6 bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl bebas-font naija-text-gradient text-center">
              Select Your State
            </CardTitle>
            <CardDescription className="text-center roboto-font">
              Choose your state to see local campaigns and rewards
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {NIGERIAN_STATES.map(state => (
                <Button
                  key={state.code}
                  variant={selectedState === state.code ? 'default' : 'outline'}
                  className={`h-auto p-3 flex flex-col items-center space-y-1 ${
                    selectedState === state.code 
                      ? 'btn-naija' 
                      : 'border-2 border-yellow-200 hover:border-yellow-400'
                  }`}
                  onClick={() => setSelectedState(state.code)}
                >
                  <div className="font-bold bebas-font">{state.code}</div>
                  <div className="text-xs text-center">{state.name}</div>
                  <div className="text-xs opacity-75">{state.voters}</div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Selected State Info */}
        {selectedStateData && (
          <Card className="mb-6 bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl bebas-font flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                {selectedStateData.name} State
              </CardTitle>
              <CardDescription>
                {selectedStateData.region} • {selectedStateData.voters} registered voters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <Gift className="w-6 h-6 mx-auto mb-2 text-green-600" />
                  <div className="font-bold text-green-600 bebas-font">
                    {stateRewards?.daily || '₦15,000'}
                  </div>
                  <div className="text-sm text-gray-600">Daily Rewards</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg text-center">
                  <Trophy className="w-6 h-6 mx-auto mb-2 text-yellow-600" />
                  <div className="font-bold text-yellow-600 bebas-font">
                    {stateRewards?.weekly || '₦80,000'}
                  </div>
                  <div className="text-sm text-gray-600">Weekly Jackpot</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <Users className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                  <div className="font-bold text-blue-600 bebas-font">
                    {stateRewards?.special || 'Opportunities'}
                  </div>
                  <div className="text-sm text-gray-600">Special Rewards</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Registration Form */}
        {selectedState && (
          <Card className="bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl bebas-font naija-text-gradient text-center">
                Register for {selectedStateData?.name} State
              </CardTitle>
              <CardDescription className="text-center roboto-font">
                Complete your registration to start earning rewards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="voterCard" className="roboto-font font-medium">
                      Voter Card Number *
                    </Label>
                    <Input
                      id="voterCard"
                      placeholder="e.g., 90F5B4C8D2E1A7F9"
                      value={formData.voterCardNumber}
                      onChange={(e) => handleInputChange('voterCardNumber', e.target.value)}
                      className="border-2 border-yellow-200 focus:border-yellow-400"
                      required
                    />
                    <p className="text-xs text-gray-600">
                      Enter your 18-digit voter card number
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="roboto-font font-medium">
                      Full Name (as on voter card) *
                    </Label>
                    <Input
                      id="fullName"
                      placeholder="e.g., Adebayo Ogundimu"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="border-2 border-yellow-200 focus:border-yellow-400"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="roboto-font font-medium">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="e.g., adebayo@email.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="border-2 border-yellow-200 focus:border-yellow-400"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="roboto-font font-medium">
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      placeholder="e.g., +234 801 234 5678"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      className="border-2 border-yellow-200 focus:border-yellow-400"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lga" className="roboto-font font-medium">
                      Local Government Area
                    </Label>
                    <Input
                      id="lga"
                      placeholder="e.g., Ikeja"
                      value={formData.lga}
                      onChange={(e) => handleInputChange('lga', e.target.value)}
                      className="border-2 border-yellow-200 focus:border-yellow-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ward" className="roboto-font font-medium">
                      Ward
                    </Label>
                    <Input
                      id="ward"
                      placeholder="e.g., Ward 01"
                      value={formData.ward}
                      onChange={(e) => handleInputChange('ward', e.target.value)}
                      className="border-2 border-yellow-200 focus:border-yellow-400"
                    />
                  </div>
                </div>

                {/* Benefits Preview */}
                <div className="bg-green-50 p-6 rounded-lg">
                  <h4 className="font-bold text-green-800 mb-3 bebas-font text-lg">
                    🎉 What You Get After Registration:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-green-700">
                        <Badge className="bg-green-200 text-green-800 mr-2">+100</Badge>
                        Welcome bonus points
                      </div>
                      <div className="flex items-center text-green-700">
                        <Badge className="bg-yellow-200 text-yellow-800 mr-2">Daily</Badge>
                        {stateRewards?.daily || '₦15,000'} reward pool access
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center text-green-700">
                        <Badge className="bg-blue-200 text-blue-800 mr-2">Weekly</Badge>
                        {stateRewards?.weekly || '₦80,000'} jackpot eligibility
                      </div>
                      <div className="flex items-center text-green-700">
                        <Badge className="bg-purple-200 text-purple-800 mr-2">Special</Badge>
                        {stateRewards?.special || 'Opportunities'} access
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting || !selectedState || !formData.voterCardNumber || !formData.fullName || !formData.email || !formData.phoneNumber}
                  className="w-full btn-naija text-lg py-4 bebas-font"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <div className="spinner mr-2"></div>
                      Registering...
                    </>
                  ) : (
                    `🚀 Register for ${selectedStateData?.name} & Start Earning!`
                  )}
                </Button>

                <p className="text-xs text-gray-600 text-center roboto-font">
                  By registering, you agree to VoteArena's Terms of Service and Privacy Policy. 
                  Your voter card information is used only for verification and state-specific content.
                </p>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
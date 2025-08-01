'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useGame } from '@/contexts/GameContext';
import { 
  Leaf, Play, Clock, Target, TrendingUp, DollarSign, Zap, Users, Building2, 
  Settings, BarChart3, Shield, FileText, ArrowRight, CheckCircle, Activity,
  Repeat, Factory, Coins, ArrowDown, Info, HelpCircle, AlertCircle
} from 'lucide-react';

export default function SimulationIntroductionPage() {
  const { user } = useAuth();
  const { gameState, selectedRole } = useGame();
  const router = useRouter();
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  const handleEnterSimulation = () => {
    if (user?.isFacilitator) {
      router.push('/session-configuration');
    } else {
      router.push('/session-join');
    }
  };

  const keyConceptCards = [
    {
      icon: <Clock className="w-8 h-8" />,
      title: '1 Round = 1 Year',
      description: 'Each round represents one year of operations. Year 1 is pilot year with no cap reduction.',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Stay Within Your Cap',
      description: 'Avoid penalties by matching emissions to allocated allowances and purchased offsets.',
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Strategic Options',
      description: 'Balance investments, allowance trading, and offset use to minimize compliance costs.',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: 'Cost Optimization',
      description: 'Compete to achieve the lowest cost per ton of CO₂ across the simulation.',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    }
  ];

  const learningObjectives = [
    'Understand the mechanics of cap-and-trade systems',
    'Experience the trade-offs between abatement and allowance purchasing',
    'Learn about price formation in carbon markets',
    'Explore the role of offsets and banking in compliance strategies',
    'Understand the impact of policy changes and market events'
  ];

  // Updated simulation flow - linear with continuous trading
  const simulationSteps = [
    {
      id: 1,
      title: 'Planning & Investment',
      description: 'Forecast emissions and select abatement investments.',
      icon: <Building2 className="w-6 h-6" />,
      color: 'bg-blue-500',
      details: 'Companies forecast their emissions for the year and decide on emission reduction investments',
      tradeOff: 'Decide how much to invest in abatement vs. saving budget for allowances or future trades.',
      hasUncertainty: true
    },
    {
      id: 2,
      title: 'Auction 1',
      description: 'Buy allowances in the initial auction.',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'bg-green-500',
      details: 'Government auctions allowances to companies at or above the reserve price',
      tradeOff: 'Decide how much to spend on allowances vs. saving for abatement or future trades.'
    },
    {
      id: 3,
      title: 'Auction 2',
      description: 'Second chance to buy allowances mid-year.',
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'bg-purple-500',
      details: 'Additional auction round for companies to acquire more allowances',
      tradeOff: 'Final opportunity to purchase allowances before reporting phase.'
    },
    {
      id: 4,
      title: 'Trading',
      description: 'Trade allowances with other players in real time.',
      icon: <Activity className="w-6 h-6" />,
      color: 'bg-cyan-500',
      details: 'Over-the-counter trading between companies throughout the simulation',
      tradeOff: 'Balance buying and selling allowances based on your compliance needs.'
    },
    {
      id: 5,
      title: 'Reporting',
      description: 'Submit emissions and offset records.',
      icon: <FileText className="w-6 h-6" />,
      color: 'bg-orange-500',
      details: 'Companies report their actual emissions and can purchase carbon offsets',
      tradeOff: 'Decide whether to purchase offsets to cover any remaining emissions gap.'
    },
    {
      id: 6,
      title: 'Compliance',
      description: 'Receive penalties for exceeding your cap.',
      icon: <Shield className="w-6 h-6" />,
      color: 'bg-red-500',
      details: 'System checks compliance and calculates penalties for excess emissions',
      tradeOff: null
    }
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-emerald-100">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Leaf className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              eMission Trade: ETS Simulator
            </h1>
            <p className="text-gray-600 text-xl mb-6">
              Interactive carbon market simulation for learning and training
            </p>
            
            {/* Role and Session Info */}
            <div className="flex items-center justify-center space-x-6 mt-6">
              <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-full">
                {user.isFacilitator ? <Users className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
                <span>Role: {user.isFacilitator ? 'Facilitator' : 'Player'}</span>
              </div>
              {gameState.sessionId && (
                <div className="text-sm text-gray-600 bg-emerald-100 px-4 py-2 rounded-full">
                  Session: <span className="font-mono font-bold text-emerald-700">{gameState.sessionId}</span>
                </div>
              )}
            </div>
          </div>

          {/* Key Concept Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {keyConceptCards.map((card, index) => (
              <div 
                key={index} 
                className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100"
              >
                <div className={`w-14 h-14 bg-gradient-to-r ${card.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">
                    {card.icon}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-3 group-hover:text-emerald-600 transition-colors">
                  {card.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {card.description}
                </p>
              </div>
            ))}
          </div>

          {/* Updated Linear Simulation Flow */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-12 mb-8 shadow-inner border border-gray-100">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Simulation Process Flow</h2>
              <p className="text-gray-600 text-lg">Step-by-Step ETS Process</p>
            </div>
            
            {/* Linear Flow Container */}
            <div className="relative max-w-5xl mx-auto">
              
              {/* Steps Container */}
              <div className="space-y-6">
                {simulationSteps.map((step, index) => (
                  <div
                    key={step.id}
                    className="relative"
                    onMouseEnter={() => setHoveredStep(step.id)}
                    onMouseLeave={() => setHoveredStep(null)}
                  >
                    {/* Step Card */}
                    <div className={`flex items-center space-x-6 bg-white rounded-2xl p-6 shadow-lg border-2 transition-all duration-500 ${
                      hoveredStep === step.id ? 'border-emerald-500 shadow-2xl scale-102' : 'border-gray-200'
                    }`}>
                      {/* Step Number and Icon */}
                      <div className={`w-20 h-20 ${step.color} rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                        <div className="text-center text-white">
                          <div className="text-lg font-bold mb-1">{step.id}</div>
                          <div className="opacity-90">
                            {step.icon}
                          </div>
                        </div>
                      </div>
                      
                      {/* Step Content */}
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-gray-800 mb-2">
                          {step.title}
                          {step.hasUncertainty && (
                            <div className="inline-flex items-center ml-2 group relative">
                              <AlertCircle className="w-5 h-5 text-amber-500 cursor-help" />
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-amber-100 text-amber-800 text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap border border-amber-200">
                                In Year 1, carbon prices are uncertain. Investment decisions are made without knowledge of final market prices.
                              </div>
                            </div>
                          )}
                        </h4>
                        <p className="text-gray-600 mb-2">
                          {step.description}
                        </p>
                        {step.tradeOff && (
                          <p className="text-sm text-emerald-600 font-medium mb-2">
                            💡 {step.tradeOff}
                          </p>
                        )}
                        {hoveredStep === step.id && (
                          <p className="text-sm text-emerald-600 font-medium animate-fade-in">
                            {step.details}
                          </p>
                        )}
                      </div>

                      {/* Trading Indicator for relevant phases */}
                      {(step.id <= 4) && (
                        <div className="flex items-center space-x-2 text-emerald-600">
                          <Activity className="w-5 h-5" />
                          <div className="text-center">
                            <div className="text-sm font-medium">Trading</div>
                            <div className="text-xs">Available</div>
                          </div>
                        </div>
                      )}
                      
                      {/* Special indicator for Trading phase */}
                      {step.id === 4 && (
                        <div className="flex items-center space-x-2 text-cyan-600">
                          <div className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse"></div>
                          <span className="text-sm font-medium">Primary Focus</span>
                        </div>
                      )}
                    </div>

                    {/* Arrow to Next Step */}
                    {index < simulationSteps.length - 1 && (
                      <div className="flex justify-center my-4">
                        <ArrowDown className="w-8 h-8 text-emerald-500 animate-bounce" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Repeat Indicator */}
              <div className="mt-12 text-center">
                <div className="inline-flex items-center space-x-3 bg-purple-100 rounded-xl px-6 py-4 border-2 border-purple-200">
                  <Repeat className="w-6 h-6 text-purple-600" />
                  <div>
                    <p className="font-bold text-purple-800">Process Repeats</p>
                    <p className="text-sm text-purple-600">Cycle continues for {gameState.totalRounds} rounds (years)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ETS vs Command-and-Control Info Panel */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 mb-12 border border-indigo-100">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Info className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Why Use Market-Based Instruments?</h3>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  ETS systems provide flexibility and cost-efficiency compared to fixed emissions limits (command-and-control) or static carbon taxes.
                </p>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-white rounded-lg p-3 border border-indigo-200">
                    <h4 className="font-semibold text-indigo-800 mb-1">Flexibility</h4>
                    <p className="text-gray-600">Companies choose how to reduce emissions based on their unique circumstances</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-indigo-200">
                    <h4 className="font-semibold text-indigo-800 mb-1">Cost Efficiency</h4>
                    <p className="text-gray-600">Market forces drive reductions where they're cheapest across the economy</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-indigo-200">
                    <h4 className="font-semibold text-indigo-800 mb-1">Innovation</h4>
                    <p className="text-gray-600">Price signals incentivize development of new clean technologies</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Learning Objectives */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 mb-12 border border-blue-100">
            <h3 className="text-2xl font-bold text-gray-800 text-center mb-8">Learning Objectives</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {learningObjectives.map((objective, index) => (
                <div key={index} className="flex items-start space-x-3 group p-3 rounded-xl hover:bg-white hover:shadow-md transition-all duration-300">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700 leading-relaxed group-hover:text-emerald-700 transition-colors duration-300">
                      {objective}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Session Info */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-200">
            <h3 className="text-xl font-semibold mb-4">Session Information</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Session ID</p>
                <p className="font-mono text-lg font-bold text-emerald-600">
                  {gameState.sessionId || 'Not started'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Your Role</p>
                <p className="text-lg font-semibold capitalize text-gray-800">
                  {user.isFacilitator ? 'Facilitator' : 'Player'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Rounds</p>
                <p className="text-lg font-semibold text-gray-800">{gameState.totalRounds}</p>
              </div>
            </div>
          </div>

          {/* Role-Based CTA Button */}
          <div className="text-center">
            <button
              onClick={handleEnterSimulation}
              className="group bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-12 py-6 rounded-2xl font-bold text-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 flex items-center space-x-4 mx-auto shadow-xl hover:shadow-2xl hover:scale-105"
            >
              {user.isFacilitator ? (
                <>
                  <Settings className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300" />
                  <span>Configure Session</span>
                </>
              ) : (
                <>
                  <Building2 className="w-8 h-8 group-hover:scale-110 transition-transform duration-300" />
                  <span>Join Session</span>
                </>
              )}
              <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform duration-300" />
            </button>
            <p className="text-gray-500 mt-6 text-lg">
              {user.isFacilitator 
                ? 'Set up your simulation parameters and create an engaging learning experience'
                : 'Enter your session ID and select your company profile'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
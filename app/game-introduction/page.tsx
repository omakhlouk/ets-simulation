'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useGame } from '@/contexts/GameContext';
import { Leaf, Play, Clock, Target, TrendingUp, DollarSign, Zap, Users, Building2 } from 'lucide-react';

export default function GameIntroductionPage() {
  const { user } = useAuth();
  const { gameState, selectedRole } = useGame();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const handleEnterSimulation = () => {
    if (selectedRole === 'facilitator') {
      router.push('/facilitator-dashboard');
    } else if (selectedRole === 'liable-entity') {
      router.push('/profile-selection');
    }
  };

  const features = [
    {
      icon: <Clock className="w-8 h-8" />,
      title: '3 Rounds = 3 Years',
      description: 'Each round represents one year of operations with emissions reporting and compliance requirements.'
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Stay Within Your Cap',
      description: 'Players must manage emissions within allocated caps or face financial penalties for excess emissions.'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Strategic Options',
      description: 'Choose between abatement investments, allowance trading, and offset purchases to optimize costs.'
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: 'Cost Optimization',
      description: 'Balance compliance costs with business objectives to achieve the lowest cost per ton of emissions.'
    }
  ];

  const gameFlow = [
    { phase: 'Setup', description: 'Configure simulation parameters and assign company profiles' },
    { phase: 'Forecast', description: 'Players forecast their emissions for the upcoming year' },
    { phase: 'Abatement', description: 'Decide on emission reduction investments and technologies' },
    { phase: 'Auction', description: 'Participate in allowance auctions at reserve prices' },
    { phase: 'Trading', description: 'Over-the-counter trading of allowances between players' },
    { phase: 'Offsets', description: 'Optional purchase of carbon offsets for compliance' },
    { phase: 'Reporting', description: 'Submit actual emissions data for the year' },
    { phase: 'Compliance', description: 'Review compliance status and calculate penalties' }
  ];

  const learningObjectives = [
    'Understand the mechanics of cap-and-trade systems',
    'Experience the trade-offs between abatement and allowance purchasing',
    'Learn about price formation in carbon markets',
    'Explore the role of offsets and banking in compliance strategies',
    'Understand the impact of policy changes and market events'
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F0FBF7] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00A878] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0FBF7] p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-[#00A878] rounded-full flex items-center justify-center mx-auto mb-4">
              <Leaf className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              SimuTrade Simulation
            </h1>
            <p className="text-gray-600 text-lg">
              Interactive carbon market simulation for learning and training
            </p>
            
            {/* Role and Session Info */}
            <div className="flex items-center justify-center space-x-6 mt-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                {selectedRole === 'facilitator' ? <Users className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
                <span>Role: {selectedRole === 'facilitator' ? 'Facilitator' : 'Player'}</span>
              </div>
              {gameState.sessionId && (
                <div className="text-sm text-gray-600">
                  Session: <span className="font-mono font-bold">{gameState.sessionId}</span>
                </div>
              )}
            </div>
          </div>

          {/* Key Features */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="text-[#00A878] mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Game Flow */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-center mb-8">Simulation Flow</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {gameFlow.map((step, index) => (
                <div key={index} className="relative">
                  <div className="bg-white border-2 border-[#00A878] rounded-lg p-4 text-center">
                    <div className="w-8 h-8 bg-[#00A878] text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                      {index + 1}
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-1">{step.phase}</h4>
                    <p className="text-xs text-gray-600">{step.description}</p>
                  </div>
                  {index < gameFlow.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-2 w-4 h-0.5 bg-[#00A878] transform -translate-y-1/2"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Learning Objectives */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4">Learning Objectives</h3>
            <ul className="space-y-2 text-gray-700">
              {learningObjectives.map((objective, index) => (
                <li key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-[#00A878] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>{objective}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Session Info */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4">Session Information</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Session ID</p>
                <p className="font-mono text-lg">{gameState.sessionId || 'Not started'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Your Role</p>
                <p className="text-lg font-semibold capitalize">
                  {selectedRole === 'liable-entity' ? 'Player' : selectedRole}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Rounds</p>
                <p className="text-lg font-semibold">{gameState.totalRounds}</p>
              </div>
            </div>
          </div>

          {/* Enter Simulation Button */}
          <div className="text-center">
            <button
              onClick={handleEnterSimulation}
              className="btn-primary text-lg px-8 py-4 flex items-center space-x-2 mx-auto"
            >
              <Play className="w-6 h-6" />
              <span>Enter Simulation</span>
            </button>
            <p className="text-sm text-gray-500 mt-4">
              {selectedRole === 'facilitator' 
                ? 'Access the facilitator dashboard to control the simulation'
                : 'Select your company profile and join the simulation'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
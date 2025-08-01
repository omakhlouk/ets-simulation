'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Zap, Clock, Target, TrendingUp, DollarSign, Users, Building2, 
  Settings, BarChart3, Shield, FileText, ArrowRight, Repeat, CheckCircle,
  Play, Sparkles
} from 'lucide-react';

export default function FacilitatorLandingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  useEffect(() => {
    if (!user || !user.isFacilitator) {
      router.push('/');
      return;
    }
  }, [user, router]);

  const handleConfigureSession = () => {
    router.push('/session-configuration');
  };

  const keyConceptCards = [
    {
      icon: <Clock className="w-8 h-8" />,
      title: '1 Round = 1 Year',
      description: 'Each round simulates a full year of market activity. Determines how many cycles the simulation will run.',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Stay Within Your Cap',
      description: 'Avoid penalties by matching emissions to allocated allowances',
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Strategic Options',
      description: 'Balance investments, allowance trading, and offset use',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: 'Cost Optimization',
      description: 'Compete to minimize $/tCO₂e across the simulation',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    }
  ];

  const simulationSteps = [
    {
      id: 1,
      title: 'Planning & Investment',
      description: 'Forecast & select abatement investments',
      icon: <Settings className="w-6 h-6" />,
      color: 'bg-blue-500'
    },
    {
      id: 2,
      title: 'Auction 1',
      description: 'First allowance auction at reserve price',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'bg-green-500'
    },
    {
      id: 3,
      title: 'Trading',
      description: 'Continuous allowance trading',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'bg-cyan-500'
    },
    {
      id: 4,
      title: 'Auction 2',
      description: 'Second allowance auction opportunity',
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'bg-purple-500'
    },
    {
      id: 5,
      title: 'Reporting',
      description: 'Submit emissions & purchases',
      icon: <FileText className="w-6 h-6" />,
      color: 'bg-orange-500'
    },
    {
      id: 6,
      title: 'Compliance',
      description: 'Calculate compliance and penalties',
      icon: <Shield className="w-6 h-6" />,
      color: 'bg-red-500'
    }
  ];

  const learningObjectives = [
    {
      text: 'Understand the mechanics of cap-and-trade systems',
      icon: <Target className="w-5 h-5 text-emerald-500" />
    },
    {
      text: 'Experience trade-offs between abatement and allowance purchasing',
      icon: <TrendingUp className="w-5 h-5 text-emerald-500" />
    },
    {
      text: 'Learn about price formation and market dynamics',
      icon: <BarChart3 className="w-5 h-5 text-emerald-500" />
    },
    {
      text: 'Explore offsets and banking in compliance strategies',
      icon: <Shield className="w-5 h-5 text-emerald-500" />
    },
    {
      text: 'Analyze the impact of policy changes and market shocks',
      icon: <Zap className="w-5 h-5 text-emerald-500" />
    }
  ];

  const features = [
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Multi-Player Support',
      description: 'Support for 2-40 participants with real-time interaction and competitive dynamics',
      color: 'bg-blue-50',
      iconColor: 'text-blue-600',
      stats: '2-40 players'
    },
    {
      icon: <Settings className="w-8 h-8" />,
      title: 'Customizable Settings',
      description: 'Adjust caps, penalties, allocation methods, and market parameters to fit your training needs',
      color: 'bg-cyan-50',
      iconColor: 'text-cyan-600',
      stats: '15+ parameters'
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Real-Time Analytics',
      description: 'Monitor participant progress, market dynamics, and compliance outcomes in real-time',
      color: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      stats: 'Live tracking'
    }
  ];

  if (!user || !user.isFacilitator) {
    return (
      <div className="min-h-screen bg-[#F0FBF7] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0FBF7] relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-emerald-500 rounded-full filter blur-3xl opacity-10 animate-float"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-teal-500 rounded-full filter blur-3xl opacity-10 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-cyan-500 rounded-full filter blur-3xl opacity-10 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center flex-1 mb-16">
            <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              eMission Trade
            </h1>
            <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
              Interactive carbon market simulation for learning and training
            </p>
          </div>

          {/* Key Features */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {keyConceptCards.map((card, index) => (
              <div 
                key={index} 
                className="group bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-emerald-100"
              >
                <div className={`w-14 h-14 bg-gradient-to-r ${card.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                  <div className="text-white">
                    {card.icon}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-3 group-hover:text-emerald-600 transition-colors duration-300">
                  {card.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {card.description}
                </p>
              </div>
            ))}
          </div>

          {/* Circular Simulation Flow */}
          <div className="bg-white rounded-3xl p-12 mb-16 shadow-2xl border border-emerald-100">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Simulation Flow</h2>
              <p className="text-gray-600 text-lg">Step-by-Step ETS Process</p>
            </div>
            
            {/* Linear Flow Container */}
            <div className="relative max-w-4xl mx-auto">
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
                        </h4>
                        <p className="text-gray-600 mb-2">
                          {step.description}
                        </p>
                        {hoveredStep === step.id && (
                          <p className="text-sm text-emerald-600 font-medium animate-fade-in">
                            Detailed process information and strategic considerations
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Arrow to Next Step */}
                    {index < simulationSteps.length - 1 && (
                      <div className="flex justify-center my-4">
                        <div className="w-8 h-8 text-emerald-500">
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Learning Objectives */}
          <div className="bg-white rounded-3xl p-8 mb-16 shadow-2xl border border-emerald-100">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Learning Objectives</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {learningObjectives.map((objective, index) => (
                <div key={index} className="flex items-start space-x-4 group p-4 rounded-xl hover:bg-emerald-50 transition-colors duration-300">
                  <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 border border-emerald-200">
                    {objective.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700 text-lg leading-relaxed group-hover:text-emerald-700 transition-colors duration-300">
                      {objective.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <div key={index} className="group bg-white rounded-2xl p-8 shadow-2xl hover:shadow-emerald-200/50 transition-all duration-500 hover:scale-105 border border-emerald-100">
                <div className={`w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-emerald-600 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <span className="text-emerald-600 text-sm font-semibold bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                    {feature.stats}
                  </span>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl p-12 text-gray-800 shadow-2xl border border-emerald-200">
              <div className="mb-8">
                <Sparkles className="w-16 h-16 text-emerald-600 mx-auto mb-6 opacity-90 animate-pulse" />
                <h2 className="text-3xl font-bold mb-4">Ready to Begin?</h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                  Configure your simulation parameters and create an engaging learning experience for your participants
                </p>
              </div>
              
              <button
                onClick={handleConfigureSession}
                className="group bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-12 py-6 rounded-2xl font-bold text-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-500 flex items-center space-x-4 mx-auto shadow-2xl hover:shadow-emerald-200/50 hover:scale-105 border border-emerald-400"
              >
                <Settings className="w-8 h-8 group-hover:rotate-90 transition-transform duration-500" />
                <span>Configure My Session</span>
                <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform duration-500" />
              </button>
              
              <p className="text-gray-600 mt-6 text-lg">
                Set up your simulation parameters and start your training session
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
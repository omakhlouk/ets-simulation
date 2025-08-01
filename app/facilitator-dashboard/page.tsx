'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useGame } from '@/contexts/GameContext';
import { 
  Users, Settings, Play, Pause, SkipForward, BarChart3, 
  Clock, Target, TrendingUp, AlertTriangle, CheckCircle,
  Activity, Zap, DollarSign, Building2, ArrowRight, 
  RefreshCw, Download, Eye, Plus, Bot, User, Crown, Timer,
  PlayCircle, PauseCircle, StopCircle
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { companyProfiles, getBalancedCompanySelection } from '@/data/companyProfiles';

export default function FacilitatorDashboardPage() {
  const { user } = useAuth();
  const { 
    gameState, 
    advancePhase, 
    canAdvancePhase, 
    simulateNPCs, 
    addNPCs,
    calculateAllCompliance,
    runFullSimulation,
    isSimulationRunning,
    pauseSimulation,
    resumeSimulation,
    isTimerPaused,
    joinGame,
    gameLogs
  } = useGame();
  const router = useRouter();

  const [isSimulating, setIsSimulating] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'players' | 'market' | 'logs'>('overview');
  const [phaseTimer, setPhaseTimer] = useState(gameState.phaseTimer || 0);

  useEffect(() => {
    if (!user || !user.isFacilitator) {
      router.push('/');
      return;
    }
  }, [user, router]);

  // Timer effect
  useEffect(() => {
    if (!isTimerPaused && phaseTimer > 0) {
      const interval = setInterval(() => {
        setPhaseTimer(prev => {
          if (prev <= 1) {
            // Auto-advance phase when timer reaches 0
            if (!isSimulationRunning) {
              handleAdvancePhase();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [isTimerPaused, phaseTimer, isSimulationRunning]);

  useEffect(() => {
    setPhaseTimer(gameState.phaseTimer || 0);
  }, [gameState.phaseTimer]);

  const populateWithNPCs = async () => {
    const npcCount = 5;
    const selectedProfiles = getBalancedCompanySelection(npcCount);
    
    for (let i = 0; i < npcCount; i++) {
      const npcName = `NPC-${i + 1}`;
      const profile = selectedProfiles[i];
      await joinGame(gameState.sessionId, npcName, profile);
    }
  };

  const handleAdvancePhase = async () => {
    setIsSimulating(true);
    try {
      await simulateNPCs();
      advancePhase();
      calculateAllCompliance();
    } catch (error) {
      console.error('Error advancing phase:', error);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleRunFullSimulation = async () => {
    setIsSimulating(true);
    try {
      await runFullSimulation();
    } catch (error) {
      console.error('Simulation error:', error);
    } finally {
      setIsSimulating(false);
    }
  };

  const getPhaseTitle = (phase: string) => {
    const titles = {
      'planning': 'Planning & Investment',
      'auction1': 'Auction 1',
      'otc-offsets': 'OTC Trading & Offsets',
      'auction2': 'Auction 2',
      'reporting': 'Reporting & Offsets',
      'compliance': 'Compliance Review',
      'completed': 'Simulation Complete'
    };
    return titles[phase as keyof typeof titles] || phase;
  };

  const phases = [
    { id: 'planning', name: 'Planning', icon: <Building2 className="w-4 h-4" /> },
    { id: 'auction1', name: 'Auction 1', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'otc-offsets', name: 'OTC & Offsets', icon: <Activity className="w-4 h-4" /> },
    { id: 'auction2', name: 'Auction 2', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'reporting', name: 'Reporting', icon: <Activity className="w-4 h-4" /> },
    { id: 'compliance', name: 'Compliance', icon: <CheckCircle className="w-4 h-4" /> }
  ];

  const currentPhaseIndex = phases.findIndex(p => p.id === gameState.currentPhase);
  const progressPercentage = currentPhaseIndex >= 0 ? ((currentPhaseIndex + 1) / phases.length) * 100 : 0;

  // Chart data
  const emissionsData = gameState.players.map(player => ({
    name: player.name,
    emissions: player.actualEmissions || player.profile?.emissions || 0,
    coverage: player.allowancesOwned + player.offsetsPurchased,
    abatement: player.profile ? 
      (player.abatementInvestments?.option1 ? player.profile.abatementOption1?.tons || 0 : 0) +
      (player.abatementInvestments?.option2 ? player.profile.abatementOption2?.tons || 0 : 0) : 0
  }));

  const budgetData = gameState.players.map(player => ({
    name: player.name,
    spent: player.budgetSpent || 0,
    remaining: player.remainingBudget || 0,
    total: player.profile?.budget || 0
  }));

  const complianceData = [
    { name: 'Compliant', value: gameState.players.filter(p => p.compliance?.isCompliant).length, color: '#10B981' },
    { name: 'Non-Compliant', value: gameState.players.filter(p => !p.compliance?.isCompliant).length, color: '#EF4444' }
  ];

  const sectorData = gameState.players.reduce((acc, player) => {
    if (player.profile) {
      const existing = acc.find(item => item.name === player.profile!.category);
      if (existing) {
        existing.value += 1;
      } else {
        acc.push({ name: player.profile.category, value: 1 });
      }
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  const marketParticipants = {
    human: gameState.players.filter(p => !p.name.startsWith('NPC')).length,
    npc: gameState.players.filter(p => p.name.startsWith('NPC')).length,
    total: gameState.players.length
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getMarketData = () => gameState.getMarketData?.() || { otcOffers: [], offsetOffers: [] };

  if (!user || !user.isFacilitator) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600">Facilitator access required</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Facilitator Dashboard</h1>
            <p className="text-gray-600">Session {gameState.sessionId} - Round {gameState.currentRound} of {gameState.totalRounds}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Facilitator</p>
              <p className="font-semibold text-gray-800">{user.name}</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        {/* Current Phase Status */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-emerald-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <Timer className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Phase Timer</p>
                  <p className={`text-2xl font-bold font-mono ${
                    phaseTimer <= 60 ? 'text-red-600' : 'text-blue-600'
                  }`}>
                    {formatTime(phaseTimer)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={isTimerPaused ? resumeSimulation : pauseSimulation}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  {isTimerPaused ? <PlayCircle className="w-5 h-5" /> : <PauseCircle className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{getPhaseTitle(gameState.currentPhase)}</h2>
              <p className="text-gray-600">Current simulation phase</p>
            </div>
            <div className="flex items-center space-x-2">
              {isSimulationRunning ? (
                <div className="flex items-center space-x-2 text-blue-600">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  <span className="font-medium">Simulating...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Ready</span>
                </div>
              )}
            </div>
          </div>

          {/* Phase Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Phase Progress</span>
              <span className="font-medium">{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-teal-600 h-3 rounded-full transition-all duration-500" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Phase Timeline */}
          <div className="grid grid-cols-6 gap-2 mb-6">
            {phases.map((phase, index) => (
              <div
                key={phase.id}
                className={`text-center p-3 rounded-lg transition-all duration-300 ${
                  gameState.currentPhase === phase.id
                    ? 'bg-emerald-600 text-white shadow-lg'
                    : currentPhaseIndex > index
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                <div className="flex justify-center mb-1">
                  {phase.icon}
                </div>
                <p className="text-xs font-medium">{phase.name}</p>
              </div>
            ))}
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-center space-x-4">
            {gameState.currentPhase !== 'completed' && (
              <>
                <button
                  onClick={handleAdvancePhase}
                  disabled={isSimulating || !canAdvancePhase()}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <SkipForward className="w-5 h-5" />
                  <span>Advance Phase</span>
                </button>

                <button
                  onClick={handleRunFullSimulation}
                  disabled={isSimulating}
                  className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-indigo-700 transition-all flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSimulationRunning ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Simulating...</span>
                    </>
                  ) : (
                    <>
                      <PlayCircle className="w-5 h-5" />
                      <span>Simulate Game</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => addNPCs(3)}
                  disabled={isSimulating}
                  className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:from-gray-600 hover:to-gray-700 transition-all flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add NPCs</span>
                </button>

                {isSimulationRunning && (
                  <button
                    onClick={pauseSimulation}
                    className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:from-yellow-600 hover:to-orange-700 transition-all flex items-center space-x-2"
                  >
                    <PauseCircle className="w-5 h-5" />
                    <span>Pause</span>
                  </button>
                )}
              </>
            )}

            <button
              onClick={() => router.push('/compliance-scoreboard')}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:from-emerald-600 hover:to-teal-700 transition-all flex items-center space-x-2"
            >
              <Eye className="w-5 h-5" />
              <span>View Scoreboard</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg mb-8 border border-emerald-100">
          <div className="flex border-b border-gray-200">
            {[
              { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
              { id: 'players', label: 'Players', icon: <Users className="w-4 h-4" /> },
              { id: 'market', label: 'Market Data', icon: <TrendingUp className="w-4 h-4" /> },
              { id: 'logs', label: 'Activity Logs', icon: <Activity className="w-4 h-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <>
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Players</p>
                <p className="text-2xl font-bold text-blue-600">{gameState.players.length}</p>
              </div>
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Compliant</p>
                <p className="text-2xl font-bold text-green-600">
                  {gameState.players.filter(p => p.compliance?.isCompliant).length}
                </p>
              </div>
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Emissions</p>
                <p className="text-2xl font-bold text-orange-600">
                  {gameState.players.reduce((sum, p) => sum + (p.actualEmissions || p.profile?.emissions || 0), 0).toLocaleString()}
                </p>
              </div>
              <Zap className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">System Cap</p>
                <p className="text-2xl font-bold text-purple-600">{gameState.systemCap.toLocaleString()}</p>
              </div>
              <Target className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Emissions vs Coverage Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Emissions vs Coverage</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={emissionsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip formatter={(value) => `${value.toLocaleString()} tCO₂e`} />
                <Bar dataKey="emissions" fill="#EF4444" name="Emissions" />
                <Bar dataKey="coverage" fill="#10B981" name="Coverage" />
                <Bar dataKey="abatement" fill="#3B82F6" name="Abatement" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Budget Utilization Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Budget Utilization</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={budgetData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                <Bar dataKey="spent" fill="#F59E0B" name="Spent" />
                <Bar dataKey="remaining" fill="#6B7280" name="Remaining" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Compliance Pie Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Compliance Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={complianceData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {complianceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Sector Distribution */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Sector Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sectorData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="value" fill="#8B5CF6" name="Companies" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
          </>
        )}

        {activeTab === 'players' && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Player Summary</h3>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-blue-600" />
                <span>Human: {marketParticipants.human}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Bot className="w-4 h-4 text-gray-600" />
                <span>NPCs: {marketParticipants.npc}</span>
              </div>
            </div>
          </div>
          
          {gameState.players.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No players in session</p>
              <button
                onClick={() => addNPCs(5)}
                className="mt-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all flex items-center space-x-2 mx-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add NPCs</span>
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                    <tr className="border-b bg-gray-50">
                    <th className="text-left py-3 px-4 font-medium">Player</th>
                    <th className="text-left py-3 px-4 font-medium">Company</th>
                    <th className="text-left py-3 px-4 font-medium">Emissions</th>
                    <th className="text-left py-3 px-4 font-medium">Allowances</th>
                    <th className="text-left py-3 px-4 font-medium">Offsets</th>
                    <th className="text-left py-3 px-4 font-medium">Budget Used</th>
                    <th className="text-left py-3 px-4 font-medium">Compliance</th>
                      <th className="text-left py-3 px-4 font-medium">OTC Trades</th>
                      <th className="text-left py-3 px-4 font-medium">Last Activity</th>
                  </tr>
                </thead>
                <tbody>
                  {gameState.players.map((player) => (
                    <tr key={player.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          {player.name.startsWith('NPC') ? (
                            <Bot className="w-4 h-4 text-gray-500" />
                          ) : (
                            <User className="w-4 h-4 text-blue-500" />
                          )}
                          <span className="font-medium">{player.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {player.profile ? (
                          <div>
                            <p className="font-medium">{player.profile.name}</p>
                            <p className="text-xs text-gray-500">{player.profile.category}</p>
                          </div>
                        ) : (
                          <span className="text-gray-400">Not assigned</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {(player.actualEmissions || player.profile?.emissions || 0).toLocaleString()} tCO₂e
                      </td>
                      <td className="py-3 px-4">{player.allowancesOwned.toLocaleString()}</td>
                      <td className="py-3 px-4">{player.offsetsPurchased.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <div className="text-xs">
                          <p>${(player.budgetSpent || 0).toLocaleString()}</p>
                          <p className="text-gray-500">
                            {player.profile ? Math.round(((player.budgetSpent || 0) / player.profile.budget) * 100) : 0}%
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          player.compliance?.isCompliant 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {player.compliance?.isCompliant ? '✓ Compliant' : '✗ Non-compliant'}
                        </span>
                      </td>
                        <td className="py-3 px-4">
                          <div className="text-xs">
                            <p>Bought: {player.otcTrades?.bought || 0}</p>
                            <p className="text-gray-500">Value: ${(player.otcTrades?.totalValue || 0).toLocaleString()}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-xs text-gray-500">
                          {player.lastActivity ? new Date(player.lastActivity).toLocaleTimeString() : 'Never'}
                        </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        )}

        {activeTab === 'market' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">OTC Allowance Offers</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left py-3 px-4 font-medium">Player</th>
                      <th className="text-left py-3 px-4 font-medium">Quantity</th>
                      <th className="text-left py-3 px-4 font-medium">Price</th>
                      <th className="text-left py-3 px-4 font-medium">Total Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getMarketData().otcOffers.map((offer: any, index: number) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{offer.player}</td>
                        <td className="py-3 px-4">{offer.quantity.toLocaleString()} tCO₂e</td>
                        <td className="py-3 px-4">${offer.price.toFixed(2)}</td>
                        <td className="py-3 px-4">${(offer.quantity * offer.price).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Carbon Offset Market</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left py-3 px-4 font-medium">Offset Type</th>
                      <th className="text-left py-3 px-4 font-medium">Available</th>
                      <th className="text-left py-3 px-4 font-medium">Price</th>
                      <th className="text-left py-3 px-4 font-medium">Total Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getMarketData().offsetOffers.map((offer: any, index: number) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{offer.type}</td>
                        <td className="py-3 px-4">{offer.quantity.toLocaleString()} tCO₂e</td>
                        <td className="py-3 px-4">${offer.price.toFixed(2)}</td>
                        <td className="py-3 px-4">${(offer.quantity * offer.price).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Activity Logs</h3>
            <button
              onClick={() => setShowLogs(!showLogs)}
              className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
            >
              {showLogs ? 'Hide' : 'Show'} Logs
            </button>
          </div>
            <div className="max-h-60 overflow-y-auto space-y-2">
              {gameLogs.slice(0, 50).map((log) => (
                <div key={log.id} className="flex items-center space-x-3 text-sm p-2 bg-gray-50 rounded">
                  <span className="text-gray-500 text-xs">
                    {log.timestamp.toLocaleTimeString()}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    log.type === 'phase' ? 'bg-blue-100 text-blue-800' :
                    log.type === 'round' ? 'bg-purple-100 text-purple-800' :
                    log.type === 'system' ? 'bg-gray-100 text-gray-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {log.type}
                  </span>
                  <span className="text-gray-700">{log.message}</span>
                </div>
              ))}
            </div>
        </div>
        )}

      </div>
    </div>
  );
}
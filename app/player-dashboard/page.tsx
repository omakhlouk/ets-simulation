'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useGame } from '@/contexts/GameContext';
import { 
  Building2, DollarSign, Zap, Target, TrendingUp, 
  AlertTriangle, CheckCircle, Clock, Users, BarChart3,
  Lightbulb, Calculator, ShoppingCart, Leaf, Activity,
  ArrowRight, Play, Pause, SkipForward, Info, User, Bot
} from 'lucide-react';
import CompanyCard from '@/components/CompanyCard';
import InvestmentGuidanceModal from '@/components/InvestmentGuidanceModal';

export default function PlayerDashboardPage() {
  const { user } = useAuth();
  const { 
    gameState, 
    makeAbatementInvestment, 
    purchaseAllowances, 
    purchaseOffsets,
    updateActualEmissions,
    calculateAllCompliance,
    markPhaseComplete,
    getPhaseInstructions,
    runFullSimulation,
    isSimulationRunning
  } = useGame();
  const router = useRouter();

  const [showGuidanceModal, setShowGuidanceModal] = useState(false);
  const [allowancesToBuy, setAllowancesToBuy] = useState(0);
  const [offsetsToBuy, setOffsetsToBuy] = useState(0);
  const [actualEmissions, setActualEmissions] = useState(0);
  const [phaseCompleted, setPhaseCompleted] = useState(false);

  // Find current player
  const currentPlayer = gameState.players.find(p => p.name === user?.name);

  useEffect(() => {
    if (!user || user.isFacilitator) {
      router.push('/');
      return;
    }

    if (!currentPlayer) {
      router.push('/profile-selection');
      return;
    }

    // Initialize actual emissions to profile emissions
    if (currentPlayer.profile && actualEmissions === 0) {
      setActualEmissions(currentPlayer.profile.emissions);
    }

    // Check if current phase is completed
    if (currentPlayer.phaseProgress) {
      const isCompleted = currentPlayer.phaseProgress[gameState.currentPhase as keyof typeof currentPlayer.phaseProgress];
      console.log('Phase progress check:', gameState.currentPhase, isCompleted, currentPlayer.phaseProgress);
      setPhaseCompleted(isCompleted);
    }
  }, [user, currentPlayer, router, actualEmissions, gameState.currentPhase]);

  useEffect(() => {
    // Recalculate compliance when player data changes
    calculateAllCompliance();
  }, [currentPlayer?.abatementInvestments, currentPlayer?.allowancesOwned, currentPlayer?.offsetsPurchased, actualEmissions]);

  if (!user || !currentPlayer || !currentPlayer.profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your company dashboard...</p>
        </div>
      </div>
    );
  }

  const profile = currentPlayer.profile;

  // Calculate current state
  const abatementReduction = 
    (currentPlayer.abatementInvestments.option1 ? profile.abatementOption1.tons : 0) +
    (currentPlayer.abatementInvestments.option2 ? profile.abatementOption2.tons : 0);
  
  const netEmissions = Math.max(0, actualEmissions - abatementReduction);
  const totalCoverage = currentPlayer.allowancesOwned + currentPlayer.offsetsPurchased;
  const complianceGap = Math.max(0, netEmissions - totalCoverage);
  const isCompliant = complianceGap === 0;

  const handleAbatementInvestment = (option: 'option1' | 'option2') => {
    makeAbatementInvestment(currentPlayer.id, option);
  };

  const handleAllowancePurchase = () => {
    if (allowancesToBuy > 0) {
      purchaseAllowances(currentPlayer.id, allowancesToBuy, gameState.settings.reservePrice);
      setAllowancesToBuy(0);
    }
  };

  const handleOffsetPurchase = () => {
    if (offsetsToBuy > 0) {
      purchaseOffsets(currentPlayer.id, offsetsToBuy);
      setOffsetsToBuy(0);
    }
  };

  const handleEmissionsUpdate = () => {
    updateActualEmissions(currentPlayer.id, actualEmissions);
  };

  const handleCompletePhase = () => {
    markPhaseComplete(currentPlayer.id, gameState.currentPhase);
    setPhaseCompleted(true);
  };

  const handleRunFullSimulation = async () => {
    try {
      await runFullSimulation();
    } catch (error) {
      console.error('Simulation error:', error);
    }
  };
  const offsetPrice = gameState.settings.reservePrice * 0.8;

  const getPhaseTitle = (phase: string) => {
    const titles = {
      planning: 'Planning & Investment Phase',
      auction1: 'Auction 1 - Primary Allowance Market',
      'otc-offsets': 'OTC Trading & Offset Purchase Phase',
      auction2: 'Auction 2 - Secondary Allowance Market', 
      reporting: 'Reporting & Offset Purchase Phase',
      compliance: 'Compliance Review Phase'
    };
    return titles[phase as keyof typeof titles] || phase;
  };

  const getPhaseActions = (phase: string) => {
    switch (phase) {
      case 'planning':
        return ['Review company profile', 'Make abatement investments', 'Plan compliance strategy'];
      case 'auction1':
      case 'otc-offsets':
        return ['Trade allowances with other players', 'Purchase carbon offsets', 'Monitor market activity'];
        return ['Participate in primary auction', 'Purchase allowances at reserve price', 'Monitor market activity'];
      case 'auction2':
        return ['Participate in secondary auction', 'Adjust allowance holdings', 'Finalize market positions'];
      case 'reporting':
        return ['Report actual emissions', 'Purchase carbon offsets if needed', 'Prepare compliance documentation'];
      case 'compliance':
        return ['Review compliance status', 'Calculate penalties', 'Analyze performance metrics'];
      default:
        return [];
    }
  };

  const canCompletePhase = () => {
    switch (gameState.currentPhase) {
      case 'planning':
        return true; // Can always complete planning
      case 'auction1':
      case 'otc-offsets':
      case 'auction2':
        return true; // Can complete auction phases (participation is optional)
      case 'reporting':
        return actualEmissions > 0; // Must report emissions
      case 'compliance':
        return true; // Can always complete compliance review
      default:
        return false;
    }
  };

  // Get market participants info
  const getMarketParticipants = () => {
    const humanPlayers = gameState.players.filter(p => !p.name.startsWith('NPC'));
    const npcPlayers = gameState.players.filter(p => p.name.startsWith('NPC'));
    
    return {
      human: humanPlayers.length,
      npc: npcPlayers.length,
      total: gameState.players.length
    };
  };

  const marketParticipants = getMarketParticipants();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Header with Phase Information */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-emerald-100">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-gray-800">{getPhaseTitle(gameState.currentPhase)}</h1>
                  <p className="text-gray-600">Round {gameState.currentRound} of {gameState.totalRounds}</p>
                </div>
              </div>
              
              {/* Phase Instructions */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-4">
                <div className="flex items-start space-x-3">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-800 mb-2">Phase Instructions</h3>
                    <p className="text-blue-700 text-sm mb-3">{getPhaseInstructions(gameState.currentPhase)}</p>
                    <div className="space-y-1">
                      {getPhaseActions(gameState.currentPhase).map((action, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm text-blue-600">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                          <span>{action}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Phase Completion Status */}
              <div className="flex items-center justify-center space-x-4">
                {phaseCompleted ? (
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Phase Completed - Waiting for others</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={handleCompletePhase}
                      disabled={!canCompletePhase()}
                      className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:from-emerald-600 hover:to-teal-700 transition-all flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <CheckCircle className="w-5 h-5" />
                      <span>Complete Phase</span>
                    </button>
                    
                    {/* Demo simulation button */}
                    {gameState.sessionId === '999999' && (
                      <button
                        onClick={handleRunFullSimulation}
                        disabled={isSimulationRunning}
                        className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-indigo-700 transition-all flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSimulationRunning ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            <span>Running Simulation...</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-5 h-5" />
                            <span>Run Full Simulation</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Company Profile Card */}
            <CompanyCard 
              profile={profile} 
              showFinancials={true} 
              showProduction={true}
            />

            {/* Current Status */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">Sustainability Budget</h3>
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                </div>
                <p className="text-2xl font-bold text-gray-800">${currentPlayer.remainingBudget.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Remaining of ${profile.budget.toLocaleString()}</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">Net Emissions</h3>
                  <Zap className="w-5 h-5 text-orange-600" />
                </div>
                <p className="text-2xl font-bold text-gray-800">{netEmissions.toLocaleString()}</p>
                <p className="text-xs text-gray-500">After {abatementReduction.toLocaleString()} tCO₂e reduction</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">Coverage</h3>
                  <Target className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-gray-800">{totalCoverage.toLocaleString()}</p>
                <p className="text-xs text-gray-500">{currentPlayer.allowancesOwned} allowances + {currentPlayer.offsetsPurchased} offsets</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">Compliance</h3>
                  {isCompliant ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  )}
                </div>
                <p className={`text-2xl font-bold ${isCompliant ? 'text-green-600' : 'text-red-600'}`}>
                  {isCompliant ? 'Compliant' : `Gap: ${complianceGap.toLocaleString()}`}
                </p>
                <p className="text-xs text-gray-500">
                  {isCompliant ? 'Meeting requirements' : 'tCO₂e shortfall'}
                </p>
              </div>
            </div>

            {/* Compliance Alert */}
            {!isCompliant && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                  <div>
                    <h3 className="font-semibold text-red-800">Compliance Warning</h3>
                    <p className="text-red-700 text-sm">
                      You need {complianceGap.toLocaleString()} more allowances or offsets to achieve compliance. 
                      Penalty: ${(complianceGap * gameState.settings.penalty).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Phase-Specific Content */}
            {gameState.currentPhase === 'planning' && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Zap className="w-6 h-6 text-yellow-500 mr-2" />
                  Abatement Investments
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Option 1 */}
                  <div className={`p-4 rounded-lg border-2 ${
                    currentPlayer.abatementInvestments.option1 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-800">{profile.abatementOption1.name}</h3>
                      {currentPlayer.abatementInvestments.option1 && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                      <div>
                        <p className="text-gray-600">Reduction:</p>
                        <p className="font-bold text-green-600">{profile.abatementOption1.tons.toLocaleString()} tCO₂e</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Cost:</p>
                        <p className="font-bold text-gray-800">${profile.abatementOption1.cost.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Cost per tCO₂e:</p>
                        <p className="font-bold text-blue-600">${profile.abatementOption1.costPerTon}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">% of Emissions:</p>
                        <p className="font-bold text-purple-600">{((profile.abatementOption1.tons / profile.emissions) * 100).toFixed(1)}%</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleAbatementInvestment('option1')}
                      disabled={currentPlayer.abatementInvestments.option1 || currentPlayer.remainingBudget < profile.abatementOption1.cost}
                      className="w-full bg-emerald-500 text-white py-2 rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {currentPlayer.abatementInvestments.option1 ? 'Invested' : 'Invest'}
                    </button>
                  </div>

                  {/* Option 2 */}
                  <div className={`p-4 rounded-lg border-2 ${
                    currentPlayer.abatementInvestments.option2 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-800">{profile.abatementOption2.name}</h3>
                      {currentPlayer.abatementInvestments.option2 && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                      <div>
                        <p className="text-gray-600">Reduction:</p>
                        <p className="font-bold text-green-600">{profile.abatementOption2.tons.toLocaleString()} tCO₂e</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Cost:</p>
                        <p className="font-bold text-gray-800">${profile.abatementOption2.cost.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Cost per tCO₂e:</p>
                        <p className="font-bold text-blue-600">${profile.abatementOption2.costPerTon}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">% of Emissions:</p>
                        <p className="font-bold text-purple-600">{((profile.abatementOption2.tons / profile.emissions) * 100).toFixed(1)}%</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleAbatementInvestment('option2')}
                      disabled={currentPlayer.abatementInvestments.option2 || currentPlayer.remainingBudget < profile.abatementOption2.cost}
                      className="w-full bg-emerald-500 text-white py-2 rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {currentPlayer.abatementInvestments.option2 ? 'Invested' : 'Invest'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Auction Phases */}
            {(gameState.currentPhase === 'auction1' || gameState.currentPhase === 'auction2' || gameState.currentPhase === 'otc-offsets') && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <ShoppingCart className="w-6 h-6 text-blue-500 mr-2" />
                  Allowance Auction
                </h2>
                
                <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                  <h3 className="font-medium text-gray-800 mb-3">Purchase Allowances</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                    <div>
                      <p className="text-gray-600">Current Price:</p>
                      <p className="font-bold text-blue-600">${gameState.settings.reservePrice}/tCO₂e</p>
                    </div>
                    <div>
                      <p className="text-gray-600">You Own:</p>
                      <p className="font-bold text-gray-800">{currentPlayer.allowancesOwned.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      min="0"
                      max={Math.floor(currentPlayer.remainingBudget / gameState.settings.reservePrice)}
                      value={allowancesToBuy}
                      onChange={(e) => setAllowancesToBuy(parseInt(e.target.value) || 0)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Amount"
                    />
                    <button
                      onClick={handleAllowancePurchase}
                      disabled={allowancesToBuy === 0 || (allowancesToBuy * gameState.settings.reservePrice) > currentPlayer.remainingBudget}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Buy
                    </button>
                  </div>
                  {allowancesToBuy > 0 && (
                    <p className="text-xs text-gray-600 mt-2">
                      Total cost: ${(allowancesToBuy * gameState.settings.reservePrice).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Reporting Phase */}
            {(gameState.currentPhase === 'reporting' || gameState.currentPhase === 'otc-offsets') && (
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Emissions Reporting */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <BarChart3 className="w-6 h-6 text-purple-500 mr-2" />
                    Emissions Reporting
                  </h2>
                  
                  <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                    <h3 className="font-medium text-gray-800 mb-3">Report Actual Emissions</h3>
                    <div className="text-sm mb-3">
                      <p className="text-gray-600">Baseline: {profile.emissions.toLocaleString()} tCO₂e</p>
                      <p className="text-gray-600">After Abatement: {(profile.emissions - abatementReduction).toLocaleString()} tCO₂e</p>
                    </div>
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        min="0"
                        value={actualEmissions}
                        onChange={(e) => setActualEmissions(parseInt(e.target.value) || 0)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="Actual emissions"
                      />
                      <button
                        onClick={handleEmissionsUpdate}
                        className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors"
                      >
                        Update
                      </button>
                    </div>
                  </div>
                </div>

                {/* Offset Purchase */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <Leaf className="w-6 h-6 text-green-500 mr-2" />
                    Carbon Offsets
                  </h2>
                  
                  <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                    <h3 className="font-medium text-gray-800 mb-3">Purchase Carbon Offsets</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                      <div>
                        <p className="text-gray-600">Current Price:</p>
                        <p className="font-bold text-green-600">${offsetPrice.toFixed(0)}/tCO₂e</p>
                      </div>
                      <div>
                        <p className="text-gray-600">You Own:</p>
                        <p className="font-bold text-gray-800">{currentPlayer.offsetsPurchased.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        min="0"
                        max={Math.floor(currentPlayer.remainingBudget / offsetPrice)}
                        value={offsetsToBuy}
                        onChange={(e) => setOffsetsToBuy(parseInt(e.target.value) || 0)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="Amount"
                      />
                      <button
                        onClick={handleOffsetPurchase}
                        disabled={offsetsToBuy === 0 || (offsetsToBuy * offsetPrice) > currentPlayer.remainingBudget}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Buy
                      </button>
                    </div>
                    {offsetsToBuy > 0 && (
                      <p className="text-xs text-gray-600 mt-2">
                        Total cost: ${(offsetsToBuy * offsetPrice).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Compliance Results */}
            {gameState.currentPhase === 'compliance' && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <BarChart3 className="w-6 h-6 text-purple-500 mr-2" />
                  Compliance Results
                </h2>
                
                <div className={`p-6 rounded-xl border-2 ${
                  isCompliant 
                    ? 'border-green-300 bg-green-50' 
                    : 'border-red-300 bg-red-50'
                }`}>
                  <div className="flex items-center space-x-3 mb-4">
                    {isCompliant ? (
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-8 h-8 text-red-600" />
                    )}
                    <div>
                      <h3 className={`text-xl font-bold ${isCompliant ? 'text-green-800' : 'text-red-800'}`}>
                        {isCompliant ? 'Compliant' : 'Non-Compliant'}
                      </h3>
                      <p className={`text-sm ${isCompliant ? 'text-green-600' : 'text-red-600'}`}>
                        Cost per tCO₂: ${currentPlayer.compliance.costPerTon.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Net Emissions:</p>
                      <p className="font-bold text-gray-800">{netEmissions.toLocaleString()} tCO₂e</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Total Coverage:</p>
                      <p className="font-bold text-gray-800">{totalCoverage.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Compliance Gap:</p>
                      <p className={`font-bold ${complianceGap > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {complianceGap.toLocaleString()} tCO₂e
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Penalty:</p>
                      <p className={`font-bold ${currentPlayer.compliance.penalty > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        ${currentPlayer.compliance.penalty.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Investment Guidance & Market Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Investment Guidance */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-emerald-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Lightbulb className="w-5 h-5 text-purple-600 mr-2" />
                Investment Guidance
              </h3>
              <button
                onClick={() => setShowGuidanceModal(true)}
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-indigo-700 transition-all flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <Calculator className="w-4 h-4" />
                <span>Get Strategic Advice</span>
              </button>
              <p className="text-xs text-gray-500 mt-2 text-center">
                AI-powered investment recommendations based on your company profile and market conditions
              </p>
            </div>

            {/* Market Participants */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-emerald-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Users className="w-5 h-5 text-blue-600 mr-2" />
                Market Participants
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-600">Human Players</span>
                  </div>
                  <span className="font-bold text-blue-600">{marketParticipants.human}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bot className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-600">NPCs</span>
                  </div>
                  <span className="font-bold text-gray-600">{marketParticipants.npc}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Total Market</span>
                    <span className="font-bold text-gray-800">{marketParticipants.total}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Market Prices */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-emerald-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                Current Prices
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Allowances</span>
                  <span className="font-bold text-blue-600">${gameState.settings.reservePrice}/tCO₂e</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Carbon Offsets</span>
                  <span className="font-bold text-green-600">${offsetPrice.toFixed(0)}/tCO₂e</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Penalty Rate</span>
                  <span className="font-bold text-red-600">${gameState.settings.penalty}/tCO₂e</span>
                </div>
              </div>
            </div>

            {/* System Information */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-emerald-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Target className="w-5 h-5 text-orange-600 mr-2" />
                System Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">System Cap</span>
                  <span className="font-bold text-orange-600">{gameState.systemCap.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Emissions</span>
                  <span className="font-bold text-purple-600">{gameState.totalEmissions.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Cap Utilization</span>
                  <span className={`font-bold ${
                    gameState.totalEmissions > gameState.systemCap ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {gameState.systemCap > 0 ? Math.round((gameState.totalEmissions / gameState.systemCap) * 100) : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Investment Guidance Modal */}
        <InvestmentGuidanceModal
          isOpen={showGuidanceModal}
          onClose={() => setShowGuidanceModal(false)}
          profile={profile}
          currentBudget={currentPlayer.remainingBudget}
          systemCap={gameState.systemCap}
          reservePrice={gameState.settings.reservePrice}
          currentRound={gameState.currentRound}
          totalRounds={gameState.totalRounds}
        />
      </div>
    </div>
  );
}
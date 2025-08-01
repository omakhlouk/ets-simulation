'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGame } from '@/contexts/GameContext';
import { 
  Trophy, Award, Target, TrendingUp, DollarSign, Zap, ArrowLeft, Download, BarChart3, Building2,
  Star, Crown, Coins, Shield, Flame, Turtle, Banknote, Skull
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import CompanyCard from '@/components/CompanyCard';

export default function ComplianceScoreboardPage() {
  const { gameState, calculateAllCompliance, calculateBadges } = useGame();
  const router = useRouter();
  const [selectedRound, setSelectedRound] = useState(gameState.currentRound);
  const [viewMode, setViewMode] = useState<'summary' | 'detailed'>('summary');

  // Calculate compliance for all players
  useEffect(() => {
    calculateAllCompliance();
    calculateBadges();
    console.log('Scoreboard loaded with players:', gameState.players.length);
  }, []);

  // Use real players from game state
  const playersToDisplay = gameState.players;

  const getBadgeIcon = (badgeName: string) => {
    const badgeIcons = {
      'Clean Tech Champion': <Zap className="w-4 h-4 text-green-600" />,
      'Thrifty Performer': <Star className="w-4 h-4 text-yellow-600" />,
      'Offset Guru': <Shield className="w-4 h-4 text-cyan-600" />,
      'Kingpin': <Banknote className="w-4 h-4 text-green-700" />,
      'Bankrupt Bandit': <Skull className="w-4 h-4 text-red-600" />,
      'Auction Hawke': <Crown className="w-4 h-4 text-purple-600" />,
      'Allowance Squirrel': <Coins className="w-4 h-4 text-orange-600" />,
      'The Sloth': <Turtle className="w-4 h-4 text-gray-600" />,
      'Master Trader': <TrendingUp className="w-4 h-4 text-blue-600" />,
      'The Sloth': <Turtle className="w-4 h-4 text-gray-600" />,
      'Thrifty Performer': <Star className="w-4 h-4 text-yellow-600" />,
      'Auction Hawke': <Crown className="w-4 h-4 text-purple-600" />,
      'Allowance Squirrel': <Coins className="w-4 h-4 text-orange-600" />,
      'Offset Guru': <Shield className="w-4 h-4 text-cyan-600" />,
      'Kingpin': <Banknote className="w-4 h-4 text-green-700" />,
      'Bankrupt Bandit': <Skull className="w-4 h-4 text-red-600" />
    };
    return badgeIcons[badgeName as keyof typeof badgeIcons] || <Award className="w-4 h-4" />;
  };

  const getBadgeColor = (badgeName: string) => {
    const badgeColors = {
      'Clean Tech Champion': 'bg-green-100 text-green-800 border-green-300',
      'Thrifty Performer': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'Offset Guru': 'bg-cyan-100 text-cyan-800 border-cyan-300',
      'Kingpin': 'bg-green-100 text-green-800 border-green-300',
      'Bankrupt Bandit': 'bg-red-100 text-red-800 border-red-300',
      'Auction Hawke': 'bg-purple-100 text-purple-800 border-purple-300',
      'Allowance Squirrel': 'bg-orange-100 text-orange-800 border-orange-300',
      'The Sloth': 'bg-gray-100 text-gray-800 border-gray-300',
      'Master Trader': 'bg-blue-100 text-blue-800 border-blue-300',
      'The Sloth': 'bg-gray-100 text-gray-800 border-gray-300',
      'Thrifty Performer': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'Auction Hawke': 'bg-purple-100 text-purple-800 border-purple-300',
      'Allowance Squirrel': 'bg-orange-100 text-orange-800 border-orange-300',
      'Offset Guru': 'bg-cyan-100 text-cyan-800 border-cyan-300',
      'Kingpin': 'bg-green-100 text-green-800 border-green-300',
      'Bankrupt Bandit': 'bg-red-100 text-red-800 border-red-300'
    };
    return badgeColors[badgeName as keyof typeof badgeColors] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getBadgeDescription = (badgeName: string) => {
    const descriptions = {
      'Clean Tech Champion': 'Highest % of abatement delivered (abatement / initial emissions)',
      'Thrifty Performer': 'Lowest total abatement cost (cost / tCO₂ avoided)',
      'Offset Guru': 'Highest % of emissions covered by offsets',
      'Kingpin': 'Highest $ of unused budget',
      'Bankrupt Bandit': 'Lowest (or negative) remaining budget',
      'Auction Hawke': 'Highest proportion of allowances purchased at auction',
      'Allowance Squirrel': 'Largest stockpile of unused allowances (unused / initial emissions)',
      'The Sloth': 'Smallest share of OTC traded allowances (same calc as above, lowest player)',
      'Master Trader': 'Largest share of OTC traded allowances (total OTC trades / initial emissions)',
      'The Sloth': 'Smallest share of OTC traded allowances (same calc as above, lowest player)',
      'Thrifty Performer': 'Lowest total abatement cost (cost / tCO₂ avoided)',
      'Auction Hawke': 'Highest proportion of allowances purchased at auction',
      'Allowance Squirrel': 'Largest stockpile of unused allowances (unused / initial emissions)',
      'Offset Guru': 'Highest % of emissions covered by offsets',
      'Kingpin': 'Highest $ of unused budget',
      'Bankrupt Bandit': 'Lowest (or negative) remaining budget'
    };
    return descriptions[badgeName as keyof typeof descriptions] || '';
  };

  const getAbatementReduction = (player: any) => {
    if (!player.profile) return 0;
    return (player.abatementInvestments?.option1 ? player.profile.abatementOption1?.tons || 0 : 0) +
           (player.abatementInvestments?.option2 ? player.profile.abatementOption2?.tons || 0 : 0);
  };

  const sortedPlayers = [...playersToDisplay].sort((a, b) => {
    // Sort by compliance first, then by cost per ton
    if (a.compliance.isCompliant && !b.compliance.isCompliant) return -1;
    if (!a.compliance.isCompliant && b.compliance.isCompliant) return 1;
    return (a.compliance.costPerTon || Infinity) - (b.compliance.costPerTon || Infinity);
  });

  const handleExportResults = () => {
    // Create CSV content
    const headers = ['Player', 'Company', 'Round', 'Emissions', 'Abatement', 'Allowances', 'Offsets', 'Penalty', 'Compliance', 'Cost per tCO2', 'Badges'];
    const csvContent = [
      headers.join(','),
      ...sortedPlayers.map(player => {
        const abatementReduction = getAbatementReduction(player);
        return [
          player.name,
          player.profile?.name || 'Unassigned',
          selectedRound,
          player.actualEmissions || player.profile?.emissions || 0,
          abatementReduction,
          player.allowancesOwned,
          player.offsetsPurchased || 0,
          player.compliance.penalty,
          player.compliance.isCompliant ? 'Compliant' : 'Non-compliant',
          player.compliance.costPerTon.toFixed(2),
          player.badges.join('; ')
        ].join(',');
      })
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ets-simulation-results-round-${selectedRound}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    // Show success toast
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300';
    toast.textContent = '📤 Results exported to CSV successfully!';
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
  };

  // Chart data for emissions vs allowances
  const chartData = sortedPlayers.map(player => ({
    name: player.name,
    emissions: player.actualEmissions || player.profile?.emissions || 0,
    allowances: player.allowancesOwned + player.offsetsPurchased,
    netEmissions: Math.max(0, (player.actualEmissions || player.profile?.emissions || 0) - getAbatementReduction(player))
  }));

  return (
    <div className="min-h-screen bg-[#F0FBF7] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/facilitator-dashboard')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Compliance & Scoreboard</h1>
              <p className="text-gray-600">Round {selectedRound} Results with Company Details</p>
            </div>
          </div>
          <div className="flex space-x-4">
            <select
              value={selectedRound}
              onChange={(e) => setSelectedRound(parseInt(e.target.value))}
              className="border rounded-lg px-3 py-2"
            >
              {Array.from({ length: gameState.currentRound }, (_, i) => (
                <option key={i + 1} value={i + 1}>Round {i + 1}</option>
              ))}
            </select>
            <button
              onClick={() => setViewMode(viewMode === 'summary' ? 'detailed' : 'summary')}
              className="btn-secondary flex items-center space-x-2"
            >
              <Building2 className="w-4 h-4" />
              <span>{viewMode === 'summary' ? 'Show Company Details' : 'Show Summary'}</span>
            </button>
            <button
              onClick={handleExportResults}
              className="btn-secondary flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="kpi-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Players</p>
                <p className="text-2xl font-bold text-blue-600">{playersToDisplay.length}</p>
              </div>
              <Trophy className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="kpi-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Compliant</p>
                <p className="text-2xl font-bold text-green-600">
                  {playersToDisplay.filter(p => p.compliance.isCompliant).length}
                </p>
              </div>
              <Target className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="kpi-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Emissions</p>
                <p className="text-2xl font-bold text-orange-600">
                  {playersToDisplay.reduce((sum, p) => sum + (p.actualEmissions || p.profile?.emissions || 0), 0).toLocaleString()}
                </p>
              </div>
              <Zap className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="kpi-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Compliance Rate</p>
                <p className="text-2xl font-bold text-purple-600">
                  {playersToDisplay.length > 0 ? Math.round((playersToDisplay.filter(p => p.compliance.isCompliant).length / playersToDisplay.length) * 100) : 0}%
                </p>
              </div>
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Emissions vs Allowances Chart */}
        {chartData.length > 0 && (
          <div className="card mb-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Emissions vs Allowances by Player</span>
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip formatter={(value) => `${value.toLocaleString()} tCO₂e`} />
                <Bar dataKey="netEmissions" fill="#FF6B6B" name="Net Emissions" />
                <Bar dataKey="allowances" fill="#00A878" name="Total Coverage" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Results Display */}
        {viewMode === 'detailed' ? (
          /* Detailed Company Cards View */
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Detailed Player Results with Company Information</h3>
            {playersToDisplay.length === 0 ? (
              <div className="text-center py-8">
                <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No players in session</p>
                <p className="text-sm text-gray-500 mt-2">
                  Add players to the session or run NPC simulation
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedPlayers.map((player, index) => {
                  const abatementReduction = getAbatementReduction(player);
                  
                  return (
                    <div key={`${player.id}-${selectedRound}`} className="relative">
                      {/* Ranking Badge */}
                      {index === 0 && player.compliance.isCompliant && (
                        <div className="absolute -top-2 -right-2 z-10">
                          <div className="bg-yellow-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                            <Trophy className="w-4 h-4" />
                          </div>
                        </div>
                      )}
                      
                      {/* Company Card */}
                      {player.profile ? (
                        <CompanyCard
                          profile={player.profile}
                          showFinancials={true}
                          showProduction={true}
                          className="h-full"
                        />
                      ) : (
                        <div className="bg-white rounded-xl shadow-md p-6 h-full">
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">{player.name}</h3>
                          <p className="text-gray-500">No company assigned</p>
                        </div>
                      )}
                      
                      {/* Performance Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-95 backdrop-blur-sm border-t p-4 rounded-b-xl">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Compliance Status:</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              player.compliance.isCompliant 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {player.compliance.isCompliant ? '✓ Compliant' : '✗ Non-compliant'}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Cost per tCO₂:</span>
                            <span className="font-mono font-bold">
                              ${player.compliance.costPerTon > 0 ? player.compliance.costPerTon.toFixed(2) : '0.00'}
                            </span>
                          </div>
                          
                          {abatementReduction > 0 && (
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Abatement:</span>
                              <span className="text-green-600 font-medium">
                                -{abatementReduction.toLocaleString()} tCO₂e
                              </span>
                            </div>
                          )}
                          
                          {player.badges.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {player.badges.map((badge, badgeIndex) => (
                                <span
                                  key={badgeIndex}
                                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getBadgeColor(badge)}`}
                                  title={getBadgeDescription(badge)}
                                >
                                  {getBadgeIcon(badge)}
                                  <span className="ml-1">{badge}</span>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* Summary Table View */
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Player Results Summary</h3>
            {playersToDisplay.length === 0 ? (
              <div className="text-center py-8">
                <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No players in session</p>
                <p className="text-sm text-gray-500 mt-2">
                  Add players to the session or run NPC simulation
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left py-3 px-4 font-medium">Player</th>
                      <th className="text-left py-3 px-4 font-medium">Company</th>
                      <th className="text-left py-3 px-4 font-medium">Round</th>
                      <th className="text-left py-3 px-4 font-medium">Emissions</th>
                      <th className="text-left py-3 px-4 font-medium">Abatement</th>
                      <th className="text-left py-3 px-4 font-medium">Allowances</th>
                      <th className="text-left py-3 px-4 font-medium">Offsets</th>
                      <th className="text-left py-3 px-4 font-medium">Penalty</th>
                      <th className="text-left py-3 px-4 font-medium">Compliance</th>
                      <th className="text-left py-3 px-4 font-medium">Cost per tCO₂</th>
                      <th className="text-left py-3 px-4 font-medium">Badges</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedPlayers.map((player, index) => {
                      const abatementReduction = getAbatementReduction(player);
                      
                      return (
                        <tr key={`${player.id}-${selectedRound}`} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              {index === 0 && player.compliance.isCompliant && (
                                <Trophy className="w-4 h-4 text-yellow-500 mr-2" />
                              )}
                              <div>
                                <p className="font-medium">{player.name}</p>
                                <p className="text-xs text-gray-500">ID: {player.id.split('-')[0]}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            {player.profile ? (
                              <div>
                                <p className="font-medium text-sm">{player.profile.name}</p>
                                <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full mt-1">
                                  {player.profile.category}
                                </span>
                              </div>
                            ) : (
                              <span className="text-gray-400 text-sm">Not assigned</span>
                            )}
                          </td>
                          <td className="py-3 px-4 font-medium">{selectedRound}</td>
                          <td className="py-3 px-4">
                            {(player.actualEmissions || player.profile?.emissions || 0).toLocaleString()} tCO₂e
                          </td>
                          <td className="py-3 px-4">
                            {abatementReduction > 0 ? (
                              <span className="text-green-600">-{abatementReduction.toLocaleString()} tCO₂e</span>
                            ) : (
                              <span className="text-gray-400">None</span>
                            )}
                          </td>
                          <td className="py-3 px-4">{(player.allowancesOwned || 0).toLocaleString()}</td>
                          <td className="py-3 px-4">
                            {(player.offsetsPurchased || 0) > 0 ? (player.offsetsPurchased || 0).toLocaleString() : '-'}
                          </td>
                          <td className="py-3 px-4">
                            {player.compliance.penalty > 0 ? (
                              <span className="text-red-600 font-medium">
                                ${player.compliance.penalty.toLocaleString()}
                              </span>
                            ) : (
                              <span className="text-gray-400">$0</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              player.compliance.isCompliant 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {player.compliance.isCompliant ? '✓' : '✗'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-mono">
                              ${player.compliance.costPerTon > 0 ? player.compliance.costPerTon.toFixed(2) : '0.00'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex flex-wrap gap-1">
                              {player.badges.map((badge, badgeIndex) => (
                                <span
                                  key={badgeIndex}
                                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getBadgeColor(badge)}`}
                                  title={getBadgeDescription(badge)}
                                >
                                  {getBadgeIcon(badge)}
                                  <span className="ml-1">{badge}</span>
                                </span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Badge Explanations */}
        <div className="card mt-6">
          <h3 className="text-lg font-semibold mb-4">Badge Explanations</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { name: 'Clean Tech Champion', description: 'Highest % of abatement delivered (abatement / initial emissions)' },
              { name: 'Master Trader', description: 'Largest share of OTC traded allowances (total OTC trades / initial emissions)' },
              { name: 'The Sloth', description: 'Smallest share of OTC traded allowances (same calc as above, lowest player)' },
              { name: 'Thrifty Performer', description: 'Lowest total abatement cost (cost / tCO₂ avoided)' },
              { name: 'Auction Hawke', description: 'Highest proportion of allowances purchased at auction' },
              { name: 'Allowance Squirrel', description: 'Largest stockpile of unused allowances (unused / initial emissions)' },
              { name: 'Offset Guru', description: 'Highest % of emissions covered by offsets' },
              { name: 'Kingpin', description: 'Highest $ of unused budget' },
              { name: 'Bankrupt Bandit', description: 'Lowest (or negative) remaining budget' }
            ].map((badge, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                {getBadgeIcon(badge.name)}
                <div>
                  <h4 className="font-medium text-sm">{badge.name}</h4>
                  <p className="text-xs text-gray-600">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-8">
          {gameState.currentRound < gameState.totalRounds ? (
            <button
              onClick={() => router.push('/facilitator-dashboard')}
              className="btn-primary"
            >
              Continue to Next Round
            </button>
          ) : (
            <button
              onClick={() => router.push('/facilitator-dashboard')}
              className="btn-primary"
            >
              Start New Simulation
            </button>
          )}
          <button
            onClick={handleExportResults}
            className="btn-secondary flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export Results</span>
          </button>
        </div>
      </div>
    </div>
  );
}
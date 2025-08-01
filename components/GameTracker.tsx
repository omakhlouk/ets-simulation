'use client';
import { useGame } from '@/contexts/GameContext';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';
import { Clock, Users, Target, AlertTriangle, CheckCircle, Circle, ChevronDown, ChevronUp, X, Timer, Activity, TrendingUp, BarChart3 } from 'lucide-react';
import { useState } from 'react';

export default function GameTracker() {
  const { gameState, isOTCMarketOpen } = useGame();
  const { user } = useAuth();
  const pathname = usePathname();
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const getPhaseDisplay = (phase: string) => {
    const phaseMap = {
      'planning': 'Planning & Investment',
      'auction1': 'Auction 1',
      'otc-offsets': 'OTC Trading & Offsets',
      'auction2': 'Auction 2', 
      'reporting': 'Reporting & Offsets',
      'compliance': 'Compliance Review'
    };
    return phaseMap[phase as keyof typeof phaseMap] || phase;
  };

  // Hide on specific pages
  if (!user || pathname === '/' || pathname === '/login' || pathname === '/facilitator-landing' || pathname === '/facilitator-setup' || pathname === '/session-join' || pathname === '/session-configuration') {
    return null;
  }

  // Don't show on facilitator dashboard to avoid duplication
  if (pathname === '/facilitator-dashboard') {
    return null;
  }

  const phases = [
    { id: 'planning', name: 'Planning' },
    { id: 'auction1', name: 'Auction 1' },
    { id: 'otc-offsets', name: 'OTC & Offsets' },
    { id: 'auction2', name: 'Auction 2' },
    { id: 'reporting', name: 'Reporting' },
    { id: 'compliance', name: 'Compliance' }
  ];

  const currentPhaseIndex = phases.findIndex(p => p.id === gameState.currentPhase);
  const progressPercentage = currentPhaseIndex >= 0 ? ((currentPhaseIndex + 1) / phases.length) * 100 : 0;

  // If not visible, show floating button to reopen
  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-emerald-600 text-white p-3 rounded-full shadow-lg hover:bg-emerald-700 transition-colors z-40"
        title="Show Game Status"
      >
        <Target className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed top-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 z-40 transition-all duration-300">
      {/* Header with minimize/close controls */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        <h3 className="font-semibold text-gray-800 text-sm flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Game Status</span>
        </h3>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
            title={isMinimized ? 'Expand' : 'Minimize'}
          >
            {isMinimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content - collapsible */}
      {!isMinimized && (
        <div className="p-4 w-80">
          <div className="space-y-3">
            {/* Session Info */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Session:</span>
              <span className="font-mono text-sm font-bold text-emerald-600">
                {gameState.sessionId || 'Not connected'}
              </span>
            </div>

            {/* Current Phase */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Current Phase:</span>
              <span className="font-medium text-emerald-600 text-sm">
                {getPhaseDisplay(gameState.currentPhase)}
              </span>
            </div>

            {/* OTC Market Status */}
            {isOTCMarketOpen() && (
              <div className="flex items-center justify-between bg-blue-50 p-2 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-blue-600 animate-pulse" />
                  <span className="text-sm text-blue-700 font-medium">OTC Market Open</span>
                </div>
              </div>
            )}

            {/* Round */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Round:</span>
              <span className="font-medium">
                {gameState.currentRound} / {gameState.totalRounds}
              </span>
            </div>

            {/* System Cap */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">System Cap:</span>
              <span className="font-medium text-xs">
                {gameState.systemCap.toLocaleString()} tCO₂e
              </span>
            </div>

            {/* Phase Progress */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600">Phase Progress</span>
                <span className="font-medium">{Math.round(progressPercentage)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-emerald-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Round Progress */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600">Round Progress</span>
                <span className="font-medium">{Math.round((gameState.currentRound / gameState.totalRounds) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300" 
                  style={{ width: `${(gameState.currentRound / gameState.totalRounds) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Players */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Players:</span>
              </div>
              <span className="font-medium">{gameState.players.filter(p => !p.name.startsWith('NPC')).length}</span>
            </div>

            {/* Compliance */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <Target className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Compliant:</span>
              </div>
              <span className="font-medium">
                {gameState.complianceCount} / {gameState.players.length}
              </span>
            </div>

            {/* Total Emissions */}
            {gameState.totalEmissions > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <AlertTriangle className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Emissions:</span>
                </div>
                <span className="font-medium text-xs">
                  {gameState.totalEmissions.toLocaleString()} tCO₂e
                </span>
              </div>
            )}

            {/* System Cap vs Emissions */}
            {gameState.systemCap > 0 && gameState.totalEmissions > 0 && (
              <div className="pt-2 border-t">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600">Cap Utilization</span>
                  <span className={`font-medium ${
                    gameState.totalEmissions > gameState.systemCap ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {Math.round((gameState.totalEmissions / gameState.systemCap) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      gameState.totalEmissions > gameState.systemCap ? 'bg-red-500' : 'bg-green-500'
                    }`}
                    style={{ 
                      width: `${Math.min((gameState.totalEmissions / gameState.systemCap) * 100, 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
            )}

            {/* Phase Indicators */}
            <div className="pt-2 border-t">
              <div className="text-xs text-gray-600 mb-2">Phase Timeline</div>
              <div className="grid grid-cols-6 gap-1">
                {phases.map((phase, index) => (
                  <div
                    key={phase.id}
                    className={`text-center p-1 rounded text-xs ${
                      gameState.currentPhase === phase.id
                        ? 'bg-emerald-600 text-white'
                        : currentPhaseIndex > index
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                    title={phase.name}
                  >
                    {gameState.currentPhase === phase.id ? (
                      <Circle className="w-3 h-3 mx-auto" />
                    ) : currentPhaseIndex > index ? (
                      <CheckCircle className="w-3 h-3 mx-auto" />
                    ) : (
                      <Circle className="w-3 h-3 mx-auto opacity-50" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Market Activity Log */}
            <div className="pt-2 border-t">
              <div className="text-xs text-gray-600 mb-2">Recent Activity</div>
              <div className="space-y-1 max-h-20 overflow-y-auto">
                <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>Phase: {getPhaseDisplay(gameState.currentPhase)}</span>
                  </div>
                </div>
                {isOTCMarketOpen() && (
                  <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                    <div className="flex items-center space-x-1">
                      <Activity className="w-3 h-3" />
                      <span>OTC Trading Active</span>
                    </div>
                  </div>
                )}
                <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                  <div className="flex items-center space-x-1">
                    <BarChart3 className="w-3 h-3" />
                    <span>Allowance Price: ${gameState.settings.reservePrice}/tCO₂e</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
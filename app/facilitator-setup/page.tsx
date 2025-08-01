'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useGame } from '@/contexts/GameContext';
import { 
  Settings, Users, Clock, DollarSign, Target, Zap, 
  ArrowRight, Copy, CheckCircle, AlertTriangle, 
  RotateCcw, Play, Building2, Shuffle, ArrowLeft
} from 'lucide-react';

export default function FacilitatorSetupPage() {
  const { user } = useAuth();
  const { initializeGame } = useGame();
  const router = useRouter();

  const [sessionId, setSessionId] = useState('');
  const [settings, setSettings] = useState({
    sessionName: '',
    cap: 500000,
    penalty: 100,
    allocationRatio: 60,
    reservePrice: 25,
    offsetsEnabled: true,
    roundDuration: 15,
    totalRounds: 3,
    capType: 'absolute' as 'absolute' | 'rate-based',
    allocationMethod: 'mixed' as 'free' | 'auction' | 'mixed',
    bankingEnabled: true,
    expectedPlayers: 6
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user || !user.isFacilitator) {
      router.push('/');
      return;
    }
    
    // Generate session ID
    const newSessionId = Math.floor(100000 + Math.random() * 900000).toString();
    setSessionId(newSessionId);
    setSettings(prev => ({ ...prev, sessionName: `Session ${newSessionId}` }));
  }, [user, router]);

  const handleCopySessionId = () => {
    navigator.clipboard.writeText(sessionId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateSession = () => {
    // Initialize game with settings
    initializeGame({ 
      sessionId,
      settings: {
        ...settings,
        cap: settings.cap,
        penalty: settings.penalty,
        allocationRatio: settings.allocationRatio,
        reservePrice: settings.reservePrice,
        offsetsEnabled: settings.offsetsEnabled,
        roundDuration: settings.roundDuration,
        totalRounds: settings.totalRounds,
        capType: settings.capType,
        allocationMethod: settings.allocationMethod,
        bankingEnabled: settings.bankingEnabled,
        expectedPlayers: settings.expectedPlayers
      }
    });

    // Navigate to facilitator dashboard
    router.push('/facilitator-dashboard');
  };

  const generateNewSessionId = () => {
    const newSessionId = Math.floor(100000 + Math.random() * 900000).toString();
    setSessionId(newSessionId);
    setSettings(prev => ({ ...prev, sessionName: `Session ${newSessionId}` }));
  };

  const presetConfigurations = [
    {
      name: 'Beginner Friendly',
      description: 'Simplified settings for new learners',
      settings: {
        cap: 400000,
        penalty: 50,
        allocationRatio: 80,
        reservePrice: 20,
        offsetsEnabled: true,
        roundDuration: 20,
        totalRounds: 2,
        expectedPlayers: 4
      }
    },
    {
      name: 'Standard Training',
      description: 'Balanced settings for typical training sessions',
      settings: {
        cap: 500000,
        penalty: 100,
        allocationRatio: 60,
        reservePrice: 25,
        offsetsEnabled: true,
        roundDuration: 15,
        totalRounds: 3,
        expectedPlayers: 6
      }
    },
    {
      name: 'Advanced Challenge',
      description: 'Challenging settings for experienced participants',
      settings: {
        cap: 300000,
        penalty: 150,
        allocationRatio: 40,
        reservePrice: 30,
        offsetsEnabled: false,
        roundDuration: 10,
        totalRounds: 4,
        expectedPlayers: 8
      }
    }
  ];

  const applyPreset = (preset: typeof presetConfigurations[0]) => {
    setSettings(prev => ({ ...prev, ...preset.settings }));
  };

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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <button
              onClick={() => router.push('/facilitator-landing')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors mr-4"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
              <Settings className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Session Configuration</h1>
          <p className="text-gray-600">Configure your TradeCraft ETS simulation session</p>
          <div className="mt-4 inline-flex items-center space-x-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full">
            <Users className="w-4 h-4" />
            <span className="font-medium">Facilitator: {user.name}</span>
          </div>
        </div>

        {/* Session ID Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-emerald-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Session Details</h2>
            <button
              onClick={generateNewSessionId}
              className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Generate New ID</span>
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Name
              </label>
              <input
                type="text"
                value={settings.sessionName}
                onChange={(e) => setSettings(prev => ({ ...prev, sessionName: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Enter session name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session ID
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={sessionId}
                  readOnly
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 font-mono text-lg font-bold text-center"
                />
                <button
                  onClick={handleCopySessionId}
                  className="px-4 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center space-x-2"
                >
                  {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Share this ID with participants to join your session
              </p>
            </div>
          </div>
        </div>

        {/* Preset Configurations */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-emerald-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Setup Presets</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {presetConfigurations.map((preset, index) => (
              <div
                key={index}
                className="border-2 border-gray-200 rounded-lg p-4 hover:border-emerald-300 transition-colors cursor-pointer"
                onClick={() => applyPreset(preset)}
              >
                <h3 className="font-semibold text-gray-800 mb-2">{preset.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{preset.description}</p>
                <div className="text-xs text-gray-500 space-y-1">
                  <p>Cap: {preset.settings.cap.toLocaleString()} tCO₂e</p>
                  <p>Rounds: {preset.settings.totalRounds}</p>
                  <p>Players: {preset.settings.expectedPlayers}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Configuration Settings */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-emerald-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Simulation Settings</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Basic Settings */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-800 border-b pb-2">Basic Parameters</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  System Cap (tCO₂e)
                </label>
                <input
                  type="number"
                  value={settings.cap}
                  onChange={(e) => setSettings(prev => ({ ...prev, cap: parseInt(e.target.value) }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Penalty Rate ($/tCO₂e)
                </label>
                <input
                  type="number"
                  value={settings.penalty}
                  onChange={(e) => setSettings(prev => ({ ...prev, penalty: parseInt(e.target.value) }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Free Allocation (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={settings.allocationRatio}
                  onChange={(e) => setSettings(prev => ({ ...prev, allocationRatio: parseInt(e.target.value) }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reserve Price ($/tCO₂e)
                </label>
                <input
                  type="number"
                  value={settings.reservePrice}
                  onChange={(e) => setSettings(prev => ({ ...prev, reservePrice: parseInt(e.target.value) }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Advanced Settings */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-800 border-b pb-2">Advanced Options</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Round Duration (minutes)
                </label>
                <input
                  type="number"
                  value={settings.roundDuration}
                  onChange={(e) => setSettings(prev => ({ ...prev, roundDuration: parseInt(e.target.value) }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Rounds
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={settings.totalRounds}
                  onChange={(e) => setSettings(prev => ({ ...prev, totalRounds: parseInt(e.target.value) }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Players
                </label>
                <input
                  type="number"
                  min="2"
                  max="20"
                  value={settings.expectedPlayers}
                  onChange={(e) => setSettings(prev => ({ ...prev, expectedPlayers: parseInt(e.target.value) }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.offsetsEnabled}
                    onChange={(e) => setSettings(prev => ({ ...prev, offsetsEnabled: e.target.checked }))}
                    className="mr-3 w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Enable Carbon Offsets</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.bankingEnabled}
                    onChange={(e) => setSettings(prev => ({ ...prev, bankingEnabled: e.target.checked }))}
                    className="mr-3 w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Enable Banking Across Rounds</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Summary and Create Button */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-emerald-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Session Summary</h2>
          
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-emerald-50 rounded-lg">
              <Target className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">System Cap</p>
              <p className="font-bold text-emerald-600">{settings.cap.toLocaleString()}</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Duration</p>
              <p className="font-bold text-blue-600">{settings.roundDuration} min/round</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Play className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Rounds</p>
              <p className="font-bold text-purple-600">{settings.totalRounds}</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <Users className="w-6 h-6 text-orange-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Players</p>
              <p className="font-bold text-orange-600">{settings.expectedPlayers}</p>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={handleCreateSession}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-4 rounded-lg font-medium hover:from-emerald-600 hover:to-teal-700 transition-all flex items-center space-x-2 mx-auto text-lg"
            >
              <Building2 className="w-6 h-6" />
              <span>Create Session</span>
              <ArrowRight className="w-6 h-6" />
            </button>
            <p className="text-sm text-gray-500 mt-3">
              Session will be created and you'll be redirected to the facilitator dashboard
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
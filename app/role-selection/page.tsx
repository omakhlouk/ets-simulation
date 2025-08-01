'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useGame } from '@/contexts/GameContext';
import { useRouter } from 'next/navigation';
import { Users, Building2, Plus, Hash } from 'lucide-react';

export default function RoleSelectionPage() {
  const [selectedRole, setSelectedRole] = useState<'facilitator' | 'liable-entity' | null>(null);
  const [sessionMode, setSessionMode] = useState<'create' | 'join'>('create');
  const [sessionId, setSessionId] = useState('');
  const [generatedSessionId, setGeneratedSessionId] = useState('');
  const [error, setError] = useState('');
  
  const { user } = useAuth();
  const { setSelectedRole: setGameRole, initializeGame, joinGame } = useGame();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    // Generate a random 6-digit session ID
    const randomId = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedSessionId(randomId);
  }, [user, router]);

  const handleContinue = () => {
    if (!selectedRole) {
      setError('Please select a role');
      return;
    }

    if (sessionMode === 'join' && !sessionId.trim()) {
      setError('Please enter a session ID');
      return;
    }

    setError('');
    
    // Set the selected role in game context
    setGameRole(selectedRole);
    
    if (sessionMode === 'create') {
      // Create new session with generated ID
      initializeGame({ sessionId: generatedSessionId });
      
      // Store session info in localStorage
      localStorage.setItem('sessionId', generatedSessionId);
      localStorage.setItem('role', selectedRole);
      
      router.push('/game-introduction');
    } else {
      // Join existing session
      joinGame(sessionId, user.username);
      
      // Store session info in localStorage
      localStorage.setItem('sessionId', sessionId);
      localStorage.setItem('role', selectedRole);
      
      router.push('/game-introduction');
    }
  };

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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome, {user.username}!
          </h1>
          <p className="text-gray-600">Choose your role and session to begin the SimuTrade simulation</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Role Selection */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Select Your Role</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div
                onClick={() => setSelectedRole('facilitator')}
                className={`p-6 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                  selectedRole === 'facilitator'
                    ? 'border-[#00A878] bg-[#E3F8F3] ring-2 ring-[#00A878] ring-opacity-20'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#00A878] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Facilitator</h3>
                    <p className="text-gray-600 text-sm">
                      Control the simulation and guide participants through the emissions trading process
                    </p>
                    <ul className="mt-3 text-xs text-gray-500 space-y-1">
                      <li>• Manage simulation settings</li>
                      <li>• Control phase transitions</li>
                      <li>• Monitor player progress</li>
                      <li>• Inject market events</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div
                onClick={() => setSelectedRole('liable-entity')}
                className={`p-6 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                  selectedRole === 'liable-entity'
                    ? 'border-[#00A878] bg-[#E3F8F3] ring-2 ring-[#00A878] ring-opacity-20'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#00A878] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Liable Entity (Player)</h3>
                    <p className="text-gray-600 text-sm">
                      Manage emissions and compliance for a company in the trading system
                    </p>
                    <ul className="mt-3 text-xs text-gray-500 space-y-1">
                      <li>• Forecast emissions</li>
                      <li>• Invest in abatement</li>
                      <li>• Trade allowances</li>
                      <li>• Ensure compliance</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Session Options */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Session Options</h2>
            
            {/* Session Mode Toggle */}
            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => setSessionMode('create')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
                  sessionMode === 'create'
                    ? 'bg-[#00A878] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>Create New Session</span>
              </button>
              <button
                onClick={() => setSessionMode('join')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
                  sessionMode === 'join'
                    ? 'bg-[#00A878] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Hash className="w-4 h-4" />
                <span>Join Existing Session</span>
              </button>
            </div>

            {/* Session Details */}
            {sessionMode === 'create' ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-800 mb-2">New Session</h3>
                <p className="text-blue-600 text-sm mb-3">
                  A new session will be created with the following ID:
                </p>
                <div className="bg-white border border-blue-300 rounded px-3 py-2 font-mono text-lg font-bold text-center">
                  {generatedSessionId}
                </div>
                <p className="text-blue-600 text-xs mt-2">
                  Share this ID with other participants to join your session
                </p>
              </div>
            ) : (
              <div>
                <label htmlFor="sessionId" className="block text-sm font-medium text-gray-700 mb-2">
                  Session ID
                </label>
                <input
                  type="text"
                  id="sessionId"
                  value={sessionId}
                  onChange={(e) => setSessionId(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A878] focus:border-transparent font-mono"
                  placeholder="Enter 6-digit session ID"
                  maxLength={6}
                />
              </div>
            )}
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Continue Button */}
          <div className="text-center">
            <button
              onClick={handleContinue}
              disabled={!selectedRole || (sessionMode === 'join' && !sessionId.trim())}
              className="btn-primary text-lg px-8 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
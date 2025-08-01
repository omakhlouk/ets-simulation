'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useGame } from '@/contexts/GameContext';
import { 
  Hash, Users, Building2, ArrowRight, AlertTriangle, 
  CheckCircle, Clock, Target, DollarSign, Zap, Play
} from 'lucide-react';

export default function SessionJoinPage() {
  const { user } = useAuth();
  const { joinGame, gameState, initializeGame } = useGame();
  const router = useRouter();

  const [sessionId, setSessionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sessionInfo, setSessionInfo] = useState<any>(null);

  useEffect(() => {
    if (!user || user.isFacilitator) {
      router.push('/');
      return;
    }
  }, [user, router]);

  const handleJoinSession = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!sessionId.trim()) {
      setError('Please enter a session ID');
      return;
    }

    if (sessionId.length !== 6) {
      setError('Session ID must be 6 digits');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Simulate session validation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock session info for demo
      const mockSessionInfo = {
        id: sessionId,
        name: `Session ${sessionId}`,
        facilitator: 'Demo Facilitator',
        players: Math.floor(Math.random() * 6) + 2,
        maxPlayers: 8,
        status: 'waiting',
        settings: {
          cap: 500000,
          rounds: 3,
          duration: 15,
          penalty: 100
        }
      };

      setSessionInfo(mockSessionInfo);
      
      // Join the game
      await joinGame(sessionId, user!.name);
      
      // Navigate to profile selection
      router.push('/profile-selection');
      
    } catch (error) {
      console.error('Error joining session:', error);
      setError('Failed to join session. Please check the session ID and try again.');
      setLoading(false);
    }
  };

  const handleQuickJoin = async (demoSessionId: string) => {
    setSessionId(demoSessionId);
    setError('');
    
    // Auto-submit after setting the session ID
    setTimeout(() => {
      const form = document.getElementById('join-form') as HTMLFormElement;
      if (form) {
        form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }
    }, 100);
  };

  const handleSimulationDemo = () => {
    // Create a demo session with realistic data
    const demoSessionId = '999999';
    
    // Initialize a demo game session
    initializeGame({
      sessionId: demoSessionId,
      settings: {
        cap: 500000,
        penalty: 100,
        allocationRatio: 60,
        auctionRatio: 40,
        reservePrice: 25,
        offsetsEnabled: true,
        roundDuration: 15,
        totalRounds: 3,
        capType: 'absolute',
        allocationMethod: 'mixed',
        bankingEnabled: true,
        expectedPlayers: 6,
        humanPlayers: 1,
        capReduction: 15,
        baselineEmissions: 500000,
        emergencyReserveEnabled: false,
        manualTimeControl: true,
        phaseDurations: {
          setup: 5,
          planning: 15,
          auction1: 5,
          auction2: 5,
          reporting: 10,
          compliance: 5
        }
      }
    });

    // Join as a demo player
    joinGame(demoSessionId, user!.name).then(() => {
      router.push('/profile-selection');
    });
  };

  if (!user || user.isFacilitator) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600">Player access required</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Hash className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Join Simulation Session</h1>
          <p className="text-gray-600">Enter the session ID provided by your facilitator</p>
          <div className="mt-4 inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
            <Building2 className="w-4 h-4" />
            <span className="font-medium">Player: {user.name}</span>
          </div>
        </div>

        {/* Simulation Demo Button */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl shadow-lg p-6 mb-8 border border-purple-200">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Play className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Try the Simulation</h2>
            <p className="text-gray-600 mb-4">
              Experience the full simulation flow with realistic data and interactive gameplay
            </p>
            <button
              onClick={handleSimulationDemo}
              className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-indigo-700 transition-all flex items-center space-x-2 mx-auto shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Play className="w-5 h-5" />
              <span>Start Demo Simulation</span>
            </button>
            <p className="text-xs text-gray-500 mt-2">
              No session ID required • Full interactive experience
            </p>
          </div>
        </div>

        {/* Join Form */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-emerald-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Join Existing Session</h2>
          <form id="join-form" onSubmit={handleJoinSession} className="space-y-6">
            <div>
              <label htmlFor="sessionId" className="block text-sm font-medium text-gray-700 mb-2">
                Session ID
              </label>
              <input
                type="text"
                id="sessionId"
                value={sessionId}
                onChange={(e) => setSessionId(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full px-6 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-center text-2xl font-mono tracking-widest"
                placeholder="000000"
                maxLength={6}
                required
              />
              <p className="text-sm text-gray-500 mt-2 text-center">
                Enter the 6-digit session ID from your facilitator
              </p>
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {sessionInfo && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span className="font-medium text-emerald-800">Session Found!</span>
                </div>
                <div className="space-y-2 text-sm text-emerald-700">
                  <p><strong>Name:</strong> {sessionInfo.name}</p>
                  <p><strong>Facilitator:</strong> {sessionInfo.facilitator}</p>
                  <p><strong>Players:</strong> {sessionInfo.players}/{sessionInfo.maxPlayers}</p>
                  <p><strong>Status:</strong> <span className="capitalize">{sessionInfo.status}</span></p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || sessionId.length !== 6}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-4 rounded-lg font-medium hover:from-emerald-600 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Joining Session...
                </>
              ) : (
                <>
                  <span>Join Session</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Demo Sessions */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-emerald-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Demo Sessions</h2>
          <p className="text-sm text-gray-600 mb-4">
            Try these demo sessions to explore the simulation
          </p>
          
          <div className="grid gap-4">
            {[
              {
                id: '123456',
                name: 'Beginner Training',
                description: 'Perfect for first-time users',
                players: 3,
                maxPlayers: 6,
                settings: { cap: 400000, rounds: 2, duration: 20 }
              },
              {
                id: '789012',
                name: 'Standard Session',
                description: 'Balanced simulation experience',
                players: 5,
                maxPlayers: 8,
                settings: { cap: 500000, rounds: 3, duration: 15 }
              },
              {
                id: '345678',
                name: 'Advanced Challenge',
                description: 'For experienced participants',
                players: 2,
                maxPlayers: 6,
                settings: { cap: 300000, rounds: 4, duration: 10 }
              }
            ].map((session) => (
              <div
                key={session.id}
                className="border-2 border-gray-200 rounded-lg p-4 hover:border-emerald-300 transition-colors cursor-pointer"
                onClick={() => handleQuickJoin(session.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-800">{session.name}</h3>
                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                    {session.id}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{session.description}</p>
                
                <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Users className="w-3 h-3" />
                    <span>{session.players}/{session.maxPlayers} players</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Target className="w-3 h-3" />
                    <span>{session.settings.cap.toLocaleString()} tCO₂e cap</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{session.settings.duration} min/round</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Zap className="w-3 h-3" />
                    <span>{session.settings.rounds} rounds</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Don't have a session ID? Contact your facilitator or instructor.
          </p>
          <button
            onClick={() => router.push('/')}
            className="mt-2 text-emerald-600 hover:text-emerald-700 text-sm font-medium"
          >
            ← Back to login
          </button>
        </div>
      </div>
    </div>
  );
}
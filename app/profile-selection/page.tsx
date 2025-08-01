'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGame } from '@/contexts/GameContext';
import { useAuth } from '@/contexts/AuthContext';
import { companyProfiles } from '@/data/companyProfiles';
import { Building2, Clock, Users, CheckCircle, Loader } from 'lucide-react';

export default function ProfileSelectionPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [assignedProfile, setAssignedProfile] = useState<any>(null);
  const [error, setError] = useState('');
  
  const { joinGame, gameState } = useGame();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }

    // Check if player already has a profile assigned
    const existingPlayer = gameState.players.find(p => p.name === user.name);
    if (existingPlayer?.profile) {
      setAssignedProfile(existingPlayer.profile);
      setIsLoading(false);
      // Redirect immediately if already assigned
      setTimeout(() => {
        router.push('/player-dashboard');
      }, 1000);
      return;
    }

    // Auto-assign company process
    const assignCompany = async () => {
      try {
        setIsLoading(true);
        
        // Simulate loading time for better UX
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Auto-assign a random company profile
        const randomProfile = companyProfiles[Math.floor(Math.random() * companyProfiles.length)];
        setAssignedProfile(randomProfile);
        
        // Get session ID from localStorage or gameState
        const sessionId = gameState.sessionId || localStorage.getItem('sessionId') || 'default';
        
        console.log('Assigning company:', {
          sessionId,
          playerName: user.name,
          profile: randomProfile
        });
        
        // Join the game with the assigned profile
        await joinGame(sessionId, user.name, randomProfile);
        
        setIsLoading(false);
        
        // Show success message briefly, then redirect
        setTimeout(() => {
          router.push('/player-dashboard');
        }, 2000);
        
      } catch (error) {
        console.error('Error joining game:', error);
        setError('Failed to assign company profile. Please try again.');
        setIsLoading(false);
      }
    };

    assignCompany();
  }, [user, router, joinGame, gameState.sessionId, gameState.players]);

  const handleRetry = () => {
    setError('');
    setIsLoading(true);
    // Reload the page to restart the assignment process
    window.location.reload();
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
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-emerald-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Company Assignment</h1>
            
            {/* Session Info */}
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-center space-x-4">
                <div>
                  <p className="text-sm text-blue-600">Session ID: <span className="font-mono font-bold">{gameState.sessionId || 'Loading...'}</span></p>
                  <p className="text-sm text-blue-600">Player: <span className="font-bold">{user?.name}</span></p>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600">Connected</span>
                </div>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && !error && (
            <div className="text-center py-12">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Loader className="w-8 h-8 text-emerald-600 animate-spin" />
                </div>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Your company is being assigned...</h2>
              <p className="text-gray-600 mb-4">Please wait while we set up your simulation environment</p>
              
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>This usually takes a few seconds</span>
              </div>

              {/* Progress dots */}
              <div className="flex justify-center space-x-1 mt-6">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          )}

          {/* Assignment Complete */}
          {!isLoading && assignedProfile && !error && (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Assignment Complete!</h2>
              <p className="text-gray-600 mb-6">You have been assigned to:</p>
              
              {/* Assigned Company Card */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border-2 border-emerald-200 mb-6">
                <h3 className="text-2xl font-bold text-emerald-800 mb-2">{assignedProfile.name}</h3>
                <p className="text-emerald-600 mb-4">{assignedProfile.category} Sector</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-left">
                    <p className="text-gray-600">Annual Emissions:</p>
                    <p className="font-bold text-gray-800">{assignedProfile.emissions.toLocaleString()} tCO₂e</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600">Investment Budget:</p>
                    <p className="font-bold text-gray-800">${assignedProfile.budget.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-white rounded-lg">
                  <p className="text-xs text-gray-600 italic">{assignedProfile.description}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-center space-x-2 text-sm text-green-600 mb-4">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-200 border-t-green-600"></div>
                <span>Redirecting to your company dashboard...</span>
              </div>

              {/* Manual continue button as backup */}
              <button
                onClick={() => router.push('/player-dashboard')}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:from-emerald-600 hover:to-teal-700 transition-all"
              >
                Continue to Dashboard
              </button>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Assignment Failed</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              
              <div className="space-y-3">
                <button
                  onClick={handleRetry}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:from-emerald-600 hover:to-teal-700 transition-all"
                >
                  Try Again
                </button>
                <div>
                  <button
                    onClick={() => router.push('/player-dashboard')}
                    className="text-emerald-600 hover:text-emerald-700 text-sm underline"
                  >
                    Skip to Dashboard
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
'use client';
import { useAuth } from '@/contexts/AuthContext';
import { useGame } from '@/contexts/GameContext';
import { useRouter, usePathname } from 'next/navigation';
import { Zap, ChevronDown, RotateCcw, LogOut, User, Shield, Building2, History, Info } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { gameState } = useGame();
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleSessionHistory = () => {
    setShowDropdown(false);
    router.push('/session-history');
  };

  const handleQuickTour = () => {
    setShowDropdown(false);
    console.log('Quick tour triggered');
  };

  const handleSwitchRole = () => {
    setShowDropdown(false);
    router.push('/');
  };

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    router.push('/');
  };

  // Hide navbar on login page AND facilitator landing page to prevent duplication
  if (!user || pathname === '/' || pathname === '/facilitator-landing') return null;

  return (
    <nav className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white px-6 py-4 shadow-2xl border-b border-emerald-500/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-white/20 to-white/30 rounded-lg flex items-center justify-center shadow-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-white">
                eMission Trade
              </span>
              <p className="text-xs text-emerald-100">ETS Simulator</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          {gameState.sessionId && (
            <div className="text-emerald-100 text-sm">
              <span>Session: </span>
              <span className="font-mono font-bold text-white">{gameState.sessionId}</span>
            </div>
          )}
          
          <div className="flex items-center space-x-2 text-emerald-100 text-sm">
            {user.isFacilitator ? (
              <Shield className="w-4 h-4" />
            ) : (
              <Building2 className="w-4 h-4" />
            )}
            <span className="font-medium">
              {user.isFacilitator ? 'Facilitator' : 'Player'}
            </span>
          </div>

          {/* Account Menu */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-2 hover:bg-white hover:bg-opacity-10 px-3 py-2 rounded-lg transition-all duration-300 backdrop-blur-sm"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-white/20 to-white/30 rounded-full flex items-center justify-center shadow-lg">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <p className="font-medium">{user.name}</p>
                <p className="text-xs text-emerald-100">{user.email}</p>
              </div>
              <ChevronDown className="w-4 h-4" />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl py-2 z-50 border border-gray-200 backdrop-blur-lg">
                <button
                  onClick={handleSessionHistory}
                  className="flex items-center w-full text-left px-4 py-2 text-gray-800 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 transition-all duration-300"
                >
                  <History className="w-4 h-4 mr-2" />
                  Session History
                </button>
                <button
                  onClick={handleQuickTour}
                  className="flex items-center w-full text-left px-4 py-2 text-gray-800 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 transition-all duration-300"
                >
                  <Info className="w-4 h-4 mr-2" />
                  Quick Tour
                </button>
                <div className="border-t border-gray-100 my-1"></div>
                <button
                  onClick={handleSwitchRole}
                  className="flex items-center w-full text-left px-4 py-2 text-gray-800 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 transition-all duration-300"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Switch Role
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full text-left px-4 py-2 text-gray-800 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all duration-300"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
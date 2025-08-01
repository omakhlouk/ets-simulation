'use client';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Zap, Eye, EyeOff, AlertCircle, Shield, Users, Building2, CheckCircle, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [isFacilitator, setIsFacilitator] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, signup } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!identifier.trim() || !password.trim()) {
      setError('Please enter both email/username and password');
      return;
    }

    if (mode === 'signup') {
      if (!name.trim()) {
        setError('Please enter your name');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
    }

    setLoading(true);
    setError('');

    try {
      let success = false;
      
      if (mode === 'login') {
        success = await login(identifier, password, isFacilitator);
      } else {
        success = await signup(identifier, password, name, isFacilitator);
      }

      if (success) {
        // Route based on role
        if (isFacilitator) {
          router.push('/facilitator-landing');
        } else {
          router.push('/session-join');
        }
      } else {
        setError('Authentication failed. Please try again.');
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError('Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSSOLogin = async (provider: string) => {
    setLoading(true);
    setError('');

    try {
      // Simulate SSO login
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful SSO login
      const mockUser = {
        identifier: `user@${provider.toLowerCase()}.com`,
        name: `${provider} User`,
        isFacilitator
      };
      
      await login(mockUser.identifier, 'sso-token', isFacilitator);
      
      // Route based on role
      if (isFacilitator) {
        router.push('/facilitator-landing');
      } else {
        router.push('/session-join');
      }
    } catch (error) {
      setError(`${provider} login failed. Please try again.`);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0FBF7] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-emerald-100">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            eMission Trade
          </h1>
          <p className="text-gray-600 mt-2">Advanced ETS Simulation Platform</p>
        </div>

        {/* Mode Toggle */}
        <div className="flex space-x-2 mb-6 bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => {
              setMode('login');
              setError('');
            }}
            className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all duration-300 ${
              mode === 'login'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => {
              setMode('signup');
              setError('');
            }}
            className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all duration-300 ${
              mode === 'signup'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input (Sign Up Only) */}
          {mode === 'signup' && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Enter your full name"
                required
              />
            </div>
          )}

          {/* Email/Username Input */}
          <div>
            <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-2">
              Email or Username
            </label>
            <input
              type="text"
              id="identifier"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Enter your email or username"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent pr-12"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Confirm Password (Sign Up Only) */}
          {mode === 'signup' && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent pr-12"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          )}

          {/* Facilitator Checkbox */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="facilitator"
              checked={isFacilitator}
              onChange={(e) => setIsFacilitator(e.target.checked)}
              className="w-4 h-4 text-emerald-600 bg-white border-gray-300 rounded focus:ring-emerald-500 focus:ring-2"
            />
            <label htmlFor="facilitator" className="flex items-center space-x-2 text-sm text-gray-700">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>I am a facilitator</span>
            </label>
          </div>

          {/* Role Description */}
          <div className={`p-4 rounded-xl border-2 transition-all duration-300 ${
            isFacilitator 
              ? 'border-emerald-300 bg-emerald-50' 
              : 'border-blue-300 bg-blue-50'
          }`}>
            <div className="flex items-center space-x-2 mb-2">
              {isFacilitator ? (
                <Users className="w-4 h-4 text-emerald-600" />
              ) : (
                <Building2 className="w-4 h-4 text-blue-600" />
              )}
              <span className={`font-medium text-sm ${
                isFacilitator ? 'text-emerald-700' : 'text-blue-700'
              }`}>
                {isFacilitator ? 'Facilitator Role' : 'Player Role'}
              </span>
            </div>
            <p className={`text-xs ${
              isFacilitator ? 'text-emerald-600' : 'text-blue-600'
            }`}>
              {isFacilitator 
                ? 'Create and manage simulation sessions, control game flow, and monitor participant progress.'
                : 'Join simulation sessions, manage company emissions, and participate in carbon trading activities.'
              }
            </p>
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-red-600 text-sm bg-red-50 p-3 rounded-xl border border-red-200">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-xl font-medium hover:from-emerald-600 hover:to-teal-700 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-xl hover:shadow-2xl hover:scale-105"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {mode === 'login' ? 'Signing in...' : 'Creating account...'}
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                {mode === 'login' ? 'Sign In' : 'Create Account'}
                {isFacilitator && <Shield className="w-4 h-4 ml-2" />}
              </>
            )}
          </button>
        </form>

        {/* SSO Options */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              onClick={() => handleSSOLogin('Microsoft')}
              disabled={loading}
              className="w-full inline-flex justify-center py-2 px-4 bg-gray-50 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition-all duration-300"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#00BC" d="M0 0h11.377v11.372H0z"/>
                <path fill="#00BC" d="M12.623 0H24v11.372H12.623z"/>
                <path fill="#00BC" d="M0 12.623h11.377V24H0z"/>
                <path fill="#00BC" d="M12.623 12.623H24V24H12.623z"/>
              </svg>
              <span className="ml-2">Microsoft</span>
            </button>

            <button
              onClick={() => handleSSOLogin('Google')}
              disabled={loading}
              className="w-full inline-flex justify-center py-2 px-4 bg-gray-50 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition-all duration-300"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="ml-2">Google</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
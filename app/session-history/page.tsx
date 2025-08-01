'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ArrowLeft, Calendar, Users, Clock, Target, 
  CheckCircle, XCircle, Eye, Download, Trash2,
  Filter, Search, BarChart3, Award, TrendingUp
} from 'lucide-react';

interface SessionRecord {
  id: string;
  name: string;
  dateCreated: Date;
  status: 'Active' | 'Completed' | 'Archived';
  participants: number;
  rounds: number;
  duration: number;
  complianceRate: number;
  avgCostPerTon: number;
  facilitator: string;
}

export default function SessionHistoryPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<SessionRecord[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'participants'>('date');

  useEffect(() => {
    if (!user || !user.isFacilitator) {
      router.push('/');
      return;
    }

    // Mock session data
    const mockSessions: SessionRecord[] = [
      {
        id: '123456',
        name: 'Advanced Training Session',
        dateCreated: new Date('2024-01-15'),
        status: 'Completed',
        participants: 8,
        rounds: 3,
        duration: 15,
        complianceRate: 87.5,
        avgCostPerTon: 23.45,
        facilitator: user.name
      },
      {
        id: '789012',
        name: 'Beginner Workshop',
        dateCreated: new Date('2024-01-10'),
        status: 'Completed',
        participants: 6,
        rounds: 2,
        duration: 20,
        complianceRate: 100,
        avgCostPerTon: 18.92,
        facilitator: user.name
      },
      {
        id: '345678',
        name: 'Executive Briefing',
        dateCreated: new Date('2024-01-08'),
        status: 'Archived',
        participants: 12,
        rounds: 1,
        duration: 30,
        complianceRate: 75,
        avgCostPerTon: 31.67,
        facilitator: user.name
      },
      {
        id: '567890',
        name: 'Current Training Session',
        dateCreated: new Date('2024-01-20'),
        status: 'Active',
        participants: 4,
        rounds: 3,
        duration: 15,
        complianceRate: 0,
        avgCostPerTon: 0,
        facilitator: user.name
      }
    ];

    setSessions(mockSessions);
    setFilteredSessions(mockSessions);
  }, [user, router]);

  useEffect(() => {
    let filtered = sessions;

    // Apply status filter
    if (statusFilter !== 'All') {
      filtered = filtered.filter(session => session.status === statusFilter);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(session => 
        session.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.id.includes(searchTerm)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return b.dateCreated.getTime() - a.dateCreated.getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        case 'participants':
          return b.participants - a.participants;
        default:
          return 0;
      }
    });

    setFilteredSessions(filtered);
  }, [sessions, statusFilter, searchTerm, sortBy]);

  const handleViewSession = (sessionId: string) => {
    // Navigate to session summary/replay
    router.push(`/session-summary/${sessionId}`);
  };

  const handleDownloadResults = (sessionId: string) => {
    // Mock CSV download
    const csvContent = `Session ID,Name,Date,Participants,Compliance Rate,Avg Cost per Ton
${sessionId},Session ${sessionId},${new Date().toLocaleDateString()},6,85%,$24.50`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `session-${sessionId}-results.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleArchiveSession = (sessionId: string) => {
    if (confirm('Are you sure you want to archive this session?')) {
      setSessions(prev => prev.map(session => 
        session.id === sessionId 
          ? { ...session, status: 'Archived' as const }
          : session
      ));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Completed':
        return 'bg-blue-100 text-blue-800';
      case 'Archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>;
      case 'Completed':
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
      case 'Archived':
        return <XCircle className="w-4 h-4 text-gray-600" />;
      default:
        return null;
    }
  };

  if (!user || !user.isFacilitator) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Access denied. Facilitator access required.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/facilitator-landing')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Session History</h1>
              <p className="text-gray-600">View and manage your past simulation sessions</p>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Sessions</p>
                <p className="text-2xl font-bold text-blue-600">{sessions.length}</p>
              </div>
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Sessions</p>
                <p className="text-2xl font-bold text-green-600">
                  {sessions.filter(s => s.status === 'Active').length}
                </p>
              </div>
              <div className="w-6 h-6 bg-green-500 rounded-full animate-pulse" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Participants</p>
                <p className="text-2xl font-bold text-purple-600">
                  {sessions.reduce((sum, s) => sum + s.participants, 0)}
                </p>
              </div>
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Compliance</p>
                <p className="text-2xl font-bold text-orange-600">
                  {Math.round(sessions.filter(s => s.status === 'Completed').reduce((sum, s) => sum + s.complianceRate, 0) / sessions.filter(s => s.status === 'Completed').length || 0)}%
                </p>
              </div>
              <Award className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search sessions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="Archived">Archived</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="date">Date Created</option>
                <option value="name">Session Name</option>
                <option value="participants">Participants</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sessions Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 font-medium text-gray-700">Session</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-700">Date</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-700">Status</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-700">Participants</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-700">Performance</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSessions.map((session) => (
                  <tr key={session.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-gray-800">{session.name}</p>
                        <p className="text-sm text-gray-500 font-mono">ID: {session.id}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">{session.dateCreated.toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(session.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                          {session.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">{session.participants}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {session.status === 'Completed' ? (
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Target className="w-3 h-3 text-green-500" />
                            <span className="text-sm text-gray-700">{session.complianceRate}% compliant</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="w-3 h-3 text-blue-500" />
                            <span className="text-sm text-gray-700">${session.avgCostPerTon}/tCO₂</span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">In progress</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewSession(session.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {session.status === 'Completed' && (
                          <button
                            onClick={() => handleDownloadResults(session.id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Download Results"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        )}
                        {session.status !== 'Archived' && (
                          <button
                            onClick={() => handleArchiveSession(session.id)}
                            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                            title="Archive Session"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredSessions.length === 0 && (
            <div className="text-center py-12">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No sessions found</p>
              <p className="text-sm text-gray-500 mt-2">
                {searchTerm || statusFilter !== 'All' 
                  ? 'Try adjusting your filters'
                  : 'Create your first session to get started'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
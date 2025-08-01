'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useGame } from '@/contexts/GameContext';
import { 
  Settings, Users, Clock, DollarSign, Target, Zap, 
  ArrowRight, Copy, CheckCircle, AlertTriangle, 
  RotateCcw, Play, Building2, Shuffle, ArrowLeft,
  Plus, Minus, Eye, EyeOff, Info, ChevronRight, Edit3,
  Factory, BarChart3, Shield, Activity, Timer,
  Coins, TrendingUp, Award, Crown, HelpCircle, Filter,
  Save, X, ChevronDown, ChevronUp, Calendar, Trash2,
  Mail, User, Bot, RefreshCw, Search, SortAsc, SortDesc, MessageSquare, Edit
} from 'lucide-react';
import { companyProfiles, getCategorizedProfiles } from '@/data/companyProfiles';
import { marketEvents, MarketEvent } from '@/data/marketEvents';
import { Tooltip, ParameterTooltip } from '@/components/ui/tooltip';

type ConfigTab = 'basic' | 'sectors' | 'companies' | 'allocation' | 'events' | 'players';

export default function SessionConfigurationPage() {
  const { user } = useAuth();
  const { initializeGame, updateSettings } = useGame();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<ConfigTab>('basic');
  const [sessionId, setSessionId] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [companySortBy, setCompanySortBy] = useState<'name' | 'emissions' | 'budget' | 'sector'>('name');
  const [companySortOrder, setCompanySortOrder] = useState<'asc' | 'desc'>('asc');
  const [editingCompany, setEditingCompany] = useState<string | null>(null);
  const [customEvents, setCustomEvents] = useState<MarketEvent[]>([]);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [eventSchedule, setEventSchedule] = useState<Record<string, number>>({});
  const [eventNotes, setEventNotes] = useState<Record<string, string>>({});
  const [enableSectorSpecificAllocation, setEnableSectorSpecificAllocation] = useState(false);
  const [sectorAllocations, setSectorAllocations] = useState<Record<string, { free: number; auction: number }>>({});
  const [editableCaps, setEditableCaps] = useState<Record<number, number>>({});
  const [settings, setSettings] = useState({
    sessionName: '',
    totalRounds: 3,
    expectedPlayers: 10,
    humanPlayers: 4,
    capReduction: 15,
    penalty: 100,
    allocationRatio: 60,
    auctionRatio: 40,
    reservePrice: 25,
    bankingEnabled: true,
    emergencyReserveEnabled: false,
    manualTimeControl: false,
    selectedSectors: [] as string[],
    selectedCompanies: [] as string[],
    enabledEvents: [] as string[],
    autoSelectMode: 'balanced' as 'balanced' | 'random' | 'lowest-emissions',
    baselineEmissions: 0,
    phaseDurations: {
      setup: 5,
      planning: 15,
      auction1: 5,
      auction2: 5,
      reporting: 10,
      compliance: 5
    }
  });
  const [editedCompany, setEditedCompany] = useState<CompanyProfile | null>(null);
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: '',
    category: 'Technology',
    description: '',
    impact: '',
    impactValue: 0,
    effects: {
      abatementCosts: 0,
      allowancePrices: 0,
      offsetAvailability: 0,
      emissionsCap: 0,
      companyBudgets: 0,
      penaltyRate: 0
    },
    duration: 1,
    probability: 50
  });
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [playerAssignments, setPlayerAssignments] = useState<{[key: string]: string}>({});
  const [humanPlayers, setHumanPlayers] = useState<string[]>(['Player 1', 'Player 2', 'Player 3', 'Player 4']);
  const [copied, setCopied] = useState(false);

  const categorizedProfiles = getCategorizedProfiles();
  const sectors = Object.keys(categorizedProfiles);

  useEffect(() => {
    if (!user || !user.isFacilitator) {
      router.push('/');
      return;
    }
    
    // Generate session ID
    const newSessionId = Math.floor(100000 + Math.random() * 900000).toString();
    setSessionId(newSessionId);
    setSettings(prev => ({ 
      ...prev, 
      sessionName: `Session ${newSessionId}`,
      enabledEvents: marketEvents.slice(0, 6).map(e => e.id) // Enable first 6 events by default
    }));
  }, [user, router]);

  // Initialize sector allocations when sectors are selected
  useEffect(() => {
    if (settings.selectedSectors.length > 0) {
      const initialAllocations: Record<string, { free: number; auction: number }> = {};
      settings.selectedSectors.forEach(sector => {
        if (!sectorAllocations[sector]) {
          initialAllocations[sector] = { free: settings.allocationRatio, auction: 100 - settings.allocationRatio };
        }
      });
      setSectorAllocations(prev => ({ ...prev, ...initialAllocations }));
    }
  }, [settings.selectedSectors, settings.allocationRatio]);

  // Calculate baseline emissions when companies are selected
  useEffect(() => {
    if (settings.selectedCompanies.length > 0) {
      const totalEmissions = settings.selectedCompanies.reduce((sum, companyId) => {
        const company = companyProfiles.find(c => c.id === companyId);
        return sum + (company?.emissions || 0);
      }, 0);
      setSettings(prev => ({ ...prev, baselineEmissions: totalEmissions }));
    }
  }, [settings.selectedCompanies]);

  // Calculate estimated simulation time
  const getEstimatedDuration = () => {
    if (settings.manualTimeControl) {
      return 'Variable (Manual Control)';
    }
    
    const totalMinutes = settings.totalRounds * Object.values(settings.phaseDurations).reduce((sum, duration) => sum + duration, 0);
    
    if (totalMinutes >= 60) {
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
    
    return `${totalMinutes} minutes`;
  };

  // Ensure allocation percentages add up to 100%
  useEffect(() => {
    const total = settings.allocationRatio + settings.auctionRatio;
    if (total !== 100 && total > 0) {
      const newAuctionRatio = 100 - settings.allocationRatio;
      setSettings(prev => ({ ...prev, auctionRatio: Math.max(0, newAuctionRatio) }));
    }
  }, [settings.allocationRatio]);

  const handleCopySessionId = () => {
    navigator.clipboard.writeText(sessionId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSectorToggle = (sector: string) => {
    setSettings(prev => {
      const newSelectedSectors = prev.selectedSectors.includes(sector)
        ? prev.selectedSectors.filter(s => s !== sector)
        : [...prev.selectedSectors, sector];
      
      return {
        ...prev,
        selectedSectors: newSelectedSectors,
        selectedCompanies: [] // Clear company selection when sectors change
      };
    });
  };

  const handleCompanyToggle = (companyId: string) => {
    setSettings(prev => {
      const newSelectedCompanies = prev.selectedCompanies.includes(companyId)
        ? prev.selectedCompanies.filter(c => c !== companyId)
        : [...prev.selectedCompanies, companyId];
      
      // Limit to expected players
      if (newSelectedCompanies.length > prev.expectedPlayers) {
        return prev; // Don't add if exceeds limit
      }
      
      return {
        ...prev,
        selectedCompanies: newSelectedCompanies
      };
    });
  };

  const handleEventToggle = (eventId: string) => {
    setSettings(prev => ({
      ...prev,
      enabledEvents: prev.enabledEvents.includes(eventId)
        ? prev.enabledEvents.filter(id => id !== eventId)
        : [...prev.enabledEvents, eventId]
    }));
  };

  const handleAutoSelectCompanies = () => {
    const availableCompanies = settings.selectedSectors.length > 0
      ? companyProfiles.filter(c => settings.selectedSectors.includes(c.category))
      : companyProfiles;
    
    let selected: string[] = [];
    
    switch (settings.autoSelectMode) {
      case 'balanced':
        // Ensure at least one company per sector if possible
        const sectorsToUse = settings.selectedSectors.length > 0 ? settings.selectedSectors : sectors;
        const companiesPerSector = Math.floor(settings.expectedPlayers / sectorsToUse.length);
        const remainder = settings.expectedPlayers % sectorsToUse.length;
        
        sectorsToUse.forEach((sector, index) => {
          const sectorCompanies = availableCompanies.filter(c => c.category === sector);
          const count = companiesPerSector + (index < remainder ? 1 : 0);
          const shuffled = [...sectorCompanies].sort(() => Math.random() - 0.5);
          selected.push(...shuffled.slice(0, count).map(c => c.id));
        });
        break;
        
      case 'random':
        const shuffled = [...availableCompanies].sort(() => Math.random() - 0.5);
        selected = shuffled.slice(0, settings.expectedPlayers).map(c => c.id);
        break;
        
      case 'lowest-emissions':
        const sorted = [...availableCompanies].sort((a, b) => a.emissions - b.emissions);
        selected = sorted.slice(0, settings.expectedPlayers).map(c => c.id);
        break;
    }
    
    setSettings(prev => ({ ...prev, selectedCompanies: selected }));
  };

  const handleSectorAllocationChange = (sector: string, type: 'free' | 'auction', value: number) => {
    setSectorAllocations(prev => ({
      ...prev,
      [sector]: {
        ...prev[sector],
        [type]: value,
        [type === 'free' ? 'auction' : 'free']: 100 - value
      }
    }));
  };

  const getAvailableCompanies = () => {
    let companies = settings.selectedSectors.length > 0
      ? companyProfiles.filter(c => settings.selectedSectors.includes(c.category))
      : companyProfiles;
    
    // Apply filter
    if (companyFilter) {
      companies = companies.filter(c => 
        c.name.toLowerCase().includes(companyFilter.toLowerCase()) ||
        c.category.toLowerCase().includes(companyFilter.toLowerCase()) ||
        c.description.toLowerCase().includes(companyFilter.toLowerCase())
      );
    }
    
    // Apply sorting
    companies.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (companySortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'emissions':
          aValue = a.emissions;
          bValue = b.emissions;
          break;
        case 'budget':
          aValue = a.budget;
          bValue = b.budget;
          break;
        case 'sector':
          aValue = a.category;
          bValue = b.category;
          break;
        default:
          return 0;
      }
      
      if (typeof aValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return companySortOrder === 'asc' ? comparison : -comparison;
      } else {
        const comparison = aValue - bValue;
        return companySortOrder === 'asc' ? comparison : -comparison;
      }
    });
    
    return companies;
  };
  
  const getSectorDistribution = () => {
    const distribution: Record<string, number> = {};
    settings.selectedCompanies.forEach(companyId => {
      const company = companyProfiles.find(c => c.id === companyId);
      if (company) {
        distribution[company.category] = (distribution[company.category] || 0) + 1;
      }
    });
    return distribution;
  };
  
  const checkSectorImbalance = () => {
    if (settings.selectedCompanies.length === 0) return false;
    
    const distribution = getSectorDistribution();
    const maxSectorCount = Math.max(...Object.values(distribution));
    const imbalanceThreshold = Math.ceil(settings.expectedPlayers * 0.7);
    
    return maxSectorCount >= imbalanceThreshold;
  };
  
  const getTotalBudget = () => {
    return settings.selectedCompanies.reduce((sum, companyId) => {
      const company = companyProfiles.find(c => c.id === companyId);
      return sum + (company?.budget || 0);
    }, 0);
  };

  const calculateSystemCap = (year: number = 1) => {
    if (year === 1) return settings.baselineEmissions; // Pilot year
    return Math.floor(settings.baselineEmissions * (1 - (settings.capReduction / 100) * (year - 1)));
  };

  const calculateFutureCaps = () => {
    if (settings.baselineEmissions === 0) return [];
    
    const caps = [];
    for (let year = 1; year <= settings.totalRounds; year++) {
      const cap = calculateSystemCap(year);
      caps.push({ year, cap, isPilot: year === 1 });
    }
    return caps;
  };

  const futureCaps = calculateFutureCaps();

  const handleEditCompany = (companyId: string) => {
    const company = companyProfiles.find(c => c.id === companyId);
    if (company) {
      setEditingCompany(companyId);
      setEditedCompany({ ...company });
    }
  };

  const handleSaveCompanyEdit = () => {
    if (editedCompany) {
      // In a real app, this would update the company data
      console.log('Saving company edits:', editedCompany);
      setEditingCompany(null);
      setEditedCompany(null);
    }
  };

  const handleCancelCompanyEdit = () => {
    setEditingCompany(null);
    setEditedCompany(null);
  };

  const handleCreateEvent = () => {
    const customEvent = {
      id: `custom-${Date.now()}`,
      ...newEvent,
      triggerConditions: {}
    };
    
    setSettings(prev => ({
      ...prev,
      marketEvents: [...(prev.marketEvents || []), customEvent.id]
    }));
    
    setShowCreateEventModal(false);
    setNewEvent({
      name: '',
      category: 'Technology',
      description: '',
      impact: '',
      impactValue: 0,
      effects: {
        abatementCosts: 0,
        allowancePrices: 0,
        offsetAvailability: 0,
        emissionsCap: 0,
        companyBudgets: 0,
        penaltyRate: 0
      },
      duration: 1,
      probability: 50
    });
  };

  const handleAssignmentChange = (playerId: string, companyId: string) => {
    setPlayerAssignments(prev => ({
      ...prev,
      [playerId]: companyId
    }));
  };

  const handleRandomizeAssignments = () => {
    const availableCompanies = [...settings.selectedCompanies];
    const allPlayers = [...humanPlayers, ...Array.from({ length: settings.expectedPlayers - humanPlayers.length }, (_, i) => `NPC ${i + 1}`)];
    const newAssignments: {[key: string]: string} = {};
    
    allPlayers.forEach(player => {
      if (availableCompanies.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableCompanies.length);
        newAssignments[player] = availableCompanies.splice(randomIndex, 1)[0];
      }
    });
    
    setPlayerAssignments(newAssignments);
  };

  const addHumanPlayer = () => {
    const newPlayerName = `Player ${humanPlayers.length + 1}`;
    setHumanPlayers(prev => [...prev, newPlayerName]);
  };

  const updatePlayerName = (index: number, newName: string) => {
    setHumanPlayers(prev => prev.map((name, i) => i === index ? newName : name));
  };

  const handleCreateSession = () => {
    // Validate settings
    if (settings.selectedCompanies.length !== settings.expectedPlayers) {
      alert(`Please select exactly ${settings.expectedPlayers} companies for ${settings.expectedPlayers} players.`);
      return;
    }

    const total = settings.allocationRatio + settings.auctionRatio;
    if (total !== 100) {
      alert(`Allocation percentages must add up to 100%. Current total: ${total}%`);
      return;
    }

    // Calculate system cap
    const systemCap = calculateSystemCap(1);

    // Initialize game with settings
    initializeGame({ 
      sessionId,
      settings: {
        ...settings,
        systemCap,
        cap: systemCap,
        offsetsEnabled: true, // Always enabled
        marketEvents: settings.enabledEvents
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

  // Calculate weighted average and totals for sector-specific allocation
  const calculateAllocationSummary = () => {
    if (!enableSectorSpecificAllocation || settings.selectedSectors.length === 0) {
      const totalAllowances = settings.baselineEmissions;
      const freeAllowances = Math.round(totalAllowances * (settings.allocationRatio / 100));
      const auctionAllowances = totalAllowances - freeAllowances;
      
      return {
        totalAllowances,
        freeAllowances,
        auctionAllowances,
        freePercentage: settings.allocationRatio,
        auctionPercentage: 100 - settings.allocationRatio,
        weightedAverage: { free: settings.allocationRatio, auction: 100 - settings.allocationRatio },
        sectorRange: { free: [settings.allocationRatio, settings.allocationRatio], auction: [100 - settings.allocationRatio, 100 - settings.allocationRatio] }
      };
    }

    const sectorCounts = Object.fromEntries(Object.entries(categorizedProfiles).map(([sector, profiles]) => [sector, profiles.length]));
    const totalCompanies = settings.selectedSectors.reduce((sum, sector) => sum + sectorCounts[sector], 0);
    let weightedFree = 0;
    let minFree = 100, maxFree = 0;
    let minAuction = 100, maxAuction = 0;

    settings.selectedSectors.forEach(sector => {
      const allocation = sectorAllocations[sector] || { free: settings.allocationRatio, auction: 100 - settings.allocationRatio };
      const weight = sectorCounts[sector] / totalCompanies;
      weightedFree += allocation.free * weight;
      minFree = Math.min(minFree, allocation.free);
      maxFree = Math.max(maxFree, allocation.free);
      minAuction = Math.min(minAuction, allocation.auction);
      maxAuction = Math.max(maxAuction, allocation.auction);
    });

    const totalAllowances = settings.baselineEmissions;
    const freeAllowances = Math.round(totalAllowances * (weightedFree / 100));
    const auctionAllowances = totalAllowances - freeAllowances;

    return {
      totalAllowances,
      freeAllowances,
      auctionAllowances,
      freePercentage: weightedFree,
      auctionPercentage: 100 - weightedFree,
      weightedAverage: { free: weightedFree, auction: 100 - weightedFree },
      sectorRange: { free: [minFree, maxFree], auction: [minAuction, maxAuction] }
    };
  };

  const tabs = [
    { id: 'basic', name: 'Basic Settings', icon: <Settings className="w-4 h-4" /> },
    { id: 'sectors', name: 'Sector Selection', icon: <Factory className="w-4 h-4" /> },
    { id: 'companies', name: 'Company Profiles', icon: <Building2 className="w-4 h-4" /> },
    { id: 'allocation', name: 'Allocation & Caps', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'events', name: 'Market Events', icon: <Activity className="w-4 h-4" /> },
    { id: 'players', name: 'Player Assignment', icon: <Users className="w-4 h-4" /> }
  ];

  const getEventImpactColor = (impact: string) => {
    if (impact.includes('-') || impact.includes('reduce')) {
      return 'bg-green-100 text-green-800 border-green-300';
    } else if (impact.includes('+') || impact.includes('increase')) {
      return 'bg-red-100 text-red-800 border-red-300';
    }
    return 'bg-blue-100 text-blue-800 border-blue-300';
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Basic Simulation Settings</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session Name
                </label>
                <input
                  type="text"
                  value={settings.sessionName}
                  onChange={(e) => setSettings(prev => ({ ...prev, sessionName: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Enter session name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Rounds (Years)
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={settings.totalRounds}
                  onChange={(e) => setSettings(prev => ({ ...prev, totalRounds: parseInt(e.target.value) || 1 }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Total Players
                  </label>
                  <ParameterTooltip content="Total number of participants including both human players and NPCs" />
                </div>
                <input
                  type="number"
                  min="2"
                  max="20"
                  value={settings.expectedPlayers}
                  onChange={(e) => setSettings(prev => ({ 
                    ...prev, 
                    expectedPlayers: parseInt(e.target.value) || 2,
                    selectedCompanies: []
                  }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Human Players
                  </label>
                  <ParameterTooltip content="Number of real human participants. Remaining slots will be filled with NPCs" />
                </div>
                <input
                  type="number"
                  min="1"
                  max={settings.expectedPlayers}
                  value={settings.humanPlayers}
                  onChange={(e) => setSettings(prev => ({ 
                    ...prev, 
                    humanPlayers: Math.min(parseInt(e.target.value) || 1, prev.expectedPlayers)
                  }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  NPCs: {settings.expectedPlayers - settings.humanPlayers}
                </p>
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Cap Reduction Target (%)
                  </label>
                  <ParameterTooltip content="Annual percentage reduction in emissions cap starting from Year 2. Year 1 is pilot year with no reduction." />
                </div>
                <input
                  type="number"
                  min="0"
                  max="25"
                  value={settings.capReduction}
                  onChange={(e) => setSettings(prev => ({ ...prev, capReduction: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Penalty Rate ($/tCO₂e)
                  </label>
                  <ParameterTooltip content="Fine per ton of excess emissions if companies don't have enough allowances" />
                </div>
                <input
                  type="number"
                  min="0"
                  value={settings.penalty}
                  onChange={(e) => setSettings(prev => ({ ...prev, penalty: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Banking and Controls */}
            <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
              <h4 className="font-medium text-gray-800 mb-4">Advanced Options</h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="banking"
                    checked={settings.bankingEnabled}
                    onChange={(e) => setSettings(prev => ({ ...prev, bankingEnabled: e.target.checked }))}
                    className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                  />
                  <label htmlFor="banking" className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                    <span>Enable banking across rounds</span>
                    <ParameterTooltip content="Allow companies to save unused allowances for future compliance periods" />
                  </label>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="emergency"
                    checked={settings.emergencyReserveEnabled}
                    onChange={(e) => setSettings(prev => ({ ...prev, emergencyReserveEnabled: e.target.checked }))}
                    className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                  />
                  <label htmlFor="emergency" className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                    <span>Enable Emergency Reserve Auction (Auction 3)</span>
                    <ParameterTooltip content="Allow facilitator to call a third auction if cap shortages are severe" />
                  </label>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="manual"
                    checked={settings.manualTimeControl}
                    onChange={(e) => setSettings(prev => ({ ...prev, manualTimeControl: e.target.checked }))}
                    className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                  />
                  <label htmlFor="manual" className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                    <span>Manual time control (start, pause, skip each phase manually)</span>
                    <ParameterTooltip content="Disable automatic timers and control phase progression manually" />
                  </label>
                </div>
              </div>
            </div>

            {/* Phase Durations */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-800">Phase Durations (Minutes)</h4>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Estimated Total Time: </span>
                  <span className="font-bold text-emerald-600">{getEstimatedDuration()}</span>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {Object.entries(settings.phaseDurations).map(([phase, duration]) => (
                  <div key={phase}>
                    <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                      {phase === 'auction1' ? 'Auction 1' : phase === 'auction2' ? 'Auction 2' : phase}
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="60"
                      value={duration}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        phaseDurations: {
                          ...prev.phaseDurations,
                          [phase]: parseInt(e.target.value) || 1
                        }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      disabled={settings.manualTimeControl}
                    />
                  </div>
                ))}
              </div>
              {settings.manualTimeControl && (
                <p className="text-xs text-gray-500 mt-2">
                  Phase durations are disabled when manual time control is enabled
                </p>
              )}
            </div>
          </div>
        );

      case 'sectors':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Sector Selection</h3>
            <p className="text-gray-600 mb-6">
              Select which industry sectors to include in your simulation. All sectors are available by default.
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sectors.map((sector) => {
                const isSelected = settings.selectedSectors.includes(sector);
                const companyCount = categorizedProfiles[sector as keyof typeof categorizedProfiles].length;
                
                return (
                  <div
                    key={sector}
                    onClick={() => handleSectorToggle(sector)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 bg-white hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-800">{sector}</h4>
                      {isSelected && <CheckCircle className="w-5 h-5 text-emerald-600" />}
                    </div>
                    <p className="text-sm text-gray-600">
                      {companyCount} companies available
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
              <h4 className="font-medium text-gray-800 mb-2">Selection Summary</h4>
              <p className="text-sm text-gray-600">
                {settings.selectedSectors.length === 0 
                  ? 'All sectors selected (no filter applied)'
                  : `${settings.selectedSectors.length} sectors selected: ${settings.selectedSectors.join(', ')}`
                }
              </p>
            </div>
          </div>
        );

      case 'companies':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-800">Company Profile Selection</h3>
              <div className="flex items-center space-x-3">
                <select
                  value={settings.autoSelectMode}
                  onChange={(e) => setSettings(prev => ({ ...prev, autoSelectMode: e.target.value as any }))}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="balanced">Balanced Sector</option>
                  <option value="random">Random</option>
                  <option value="lowest-emissions">Lowest Emissions</option>
                </select>
                <button
                  onClick={handleAutoSelectCompanies}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <Shuffle className="w-4 h-4" />
                  <span>Auto-Select {settings.expectedPlayers}</span>
                </button>
              </div>
            </div>
            
            {/* Selection Progress and Warnings */}
            <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-800">Selection Progress</h4>
                  <p className="text-sm text-gray-600">
                    Select exactly {settings.expectedPlayers} companies for your simulation
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-800">
                    {settings.selectedCompanies.length}/{settings.expectedPlayers}
                  </div>
                  <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${(settings.selectedCompanies.length / settings.expectedPlayers) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sector Imbalance Warning */}
            {checkSectorImbalance() && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <div>
                    <h4 className="font-medium text-yellow-800">Warning: Sector Imbalance</h4>
                    <p className="text-sm text-yellow-700">
                      Selection may lead to market imbalance across sectors. Consider selecting companies from different sectors for better simulation dynamics.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Filter and Sort Controls */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search companies..."
                      value={companyFilter}
                      onChange={(e) => setCompanyFilter(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 w-full"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <select
                    value={companySortBy}
                    onChange={(e) => setCompanySortBy(e.target.value as any)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="name">Name</option>
                    <option value="emissions">Emissions</option>
                    <option value="budget">Budget</option>
                    <option value="sector">Sector</option>
                  </select>
                  <button
                    onClick={() => setCompanySortOrder(companySortOrder === 'asc' ? 'desc' : 'asc')}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    {companySortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
              {getAvailableCompanies().map((company) => {
                const isSelected = settings.selectedCompanies.includes(company.id);
                const canSelect = isSelected || settings.selectedCompanies.length < settings.expectedPlayers;
                
                return (
                  <div
                    key={company.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50'
                        : canSelect
                        ? 'border-gray-200 bg-white hover:border-emerald-300'
                        : 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-800 text-sm">{company.name}</h4>
                      <div className="flex items-center space-x-2">
                        <Tooltip content={company.description}>
                          <Info className="w-3 h-3 text-gray-400 cursor-help" />
                        </Tooltip>
                        {isSelected && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-600">{company.category}</p>
                      <div className="flex items-center space-x-1">
                        <p className="text-xs text-gray-600">
                          {company.emissions.toLocaleString()} tCO₂e
                        </p>
                        <Tooltip content="Annual greenhouse gas emissions baseline">
                          <Info className="w-3 h-3 text-gray-400 cursor-help" />
                        </Tooltip>
                      </div>
                      <div className="flex items-center space-x-1">
                        <p className="text-xs text-gray-600">
                          ${company.budget.toLocaleString()} budget
                        </p>
                        <Tooltip content="Sustainability budget per round (replenishes each year)">
                          <Info className="w-3 h-3 text-gray-400 cursor-help" />
                        </Tooltip>
                      </div>
                    </div>
                    
                    {/* Show abatement options */}
                    <div className="mt-3 space-y-2">
                      <div className="bg-gray-100 rounded p-2">
                        <div className="flex justify-between text-xs">
                          <div className="flex items-center space-x-1">
                            <span className="font-medium">{company.abatementOption1.name}</span>
                            <Tooltip content={`Reduces emissions by ${company.abatementOption1.tons.toLocaleString()} tCO₂e for $${company.abatementOption1.cost.toLocaleString()}`}>
                              <Info className="w-3 h-3 text-gray-400 cursor-help" />
                            </Tooltip>
                          </div>
                          <span className="text-blue-600">${company.abatementOption1.costPerTon}/tCO₂e</span>
                        </div>
                        <p className="text-xs text-gray-600">{company.abatementOption1.tons.toLocaleString()} tCO₂e reduction</p>
                      </div>
                      <div className="bg-gray-100 rounded p-2">
                        <div className="flex justify-between text-xs">
                          <div className="flex items-center space-x-1">
                            <span className="font-medium">{company.abatementOption2.name}</span>
                            <Tooltip content={`Reduces emissions by ${company.abatementOption2.tons.toLocaleString()} tCO₂e for $${company.abatementOption2.cost.toLocaleString()}`}>
                              <Info className="w-3 h-3 text-gray-400 cursor-help" />
                            </Tooltip>
                          </div>
                          <span className="text-blue-600">${company.abatementOption2.costPerTon}/tCO₂e</span>
                        </div>
                        <p className="text-xs text-gray-600">{company.abatementOption2.tons.toLocaleString()} tCO₂e reduction</p>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="mt-3 flex space-x-2">
                      <button
                        onClick={() => canSelect && handleCompanyToggle(company.id)}
                        disabled={!canSelect}
                        className={`flex-1 py-2 px-3 rounded text-xs font-medium transition-colors ${
                          isSelected
                            ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                            : canSelect
                            ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {isSelected ? 'Selected' : 'Select'}
                      </button>
                      <button
                        onClick={() => setEditingCompany(company.id)}
                        className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
                        title="Edit Company"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Budget Clarification */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h5 className="font-medium text-blue-800 mb-1">Budget Information</h5>
                  <p className="text-sm text-blue-700">
                    Budgets are provided per round and replenish each year unless specified otherwise. 
                    Companies can use their full budget allocation in each simulation year.
                  </p>
                </div>
              </div>
            </div>

            {settings.baselineEmissions > 0 && (
              <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                <h4 className="font-medium text-gray-800 mb-2">Selection Summary</h4>
                <div className="grid md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Total Baseline Emissions:</p>
                    <p className="font-bold text-gray-800">{settings.baselineEmissions.toLocaleString()} tCO₂e</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Total Budget:</p>
                    <p className="font-bold text-gray-800">${getTotalBudget().toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Year 1 Cap (Pilot):</p>
                    <p className="font-bold text-gray-800">{settings.baselineEmissions.toLocaleString()} tCO₂e</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Year 2 Cap:</p>
                    <p className="font-bold text-gray-800">{calculateSystemCap(2).toLocaleString()} tCO₂e</p>
                  </div>
                </div>
                
                {/* Sector Distribution */}
                <div className="mt-4">
                  <h5 className="font-medium text-gray-800 mb-2">Sector Distribution</h5>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(getSectorDistribution()).map(([sector, count]) => (
                      <span key={sector} className="px-2 py-1 bg-white rounded text-xs border border-emerald-300">
                        {sector}: {count}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'allocation':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Allocation & Cap Design</h3>
            
            {/* Allowance Allocation */}
            <div className="bg-emerald-50 rounded-lg p-6 border border-emerald-200">
              <h4 className="font-medium text-gray-800 mb-4">Allowance Allocation</h4>
              <p className="text-sm text-gray-600 mb-4">
                Configure how allowances are distributed between free allocation and auction sales.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 mb-4">
                  <input
                    type="checkbox"
                    id="enableSectorSpecific"
                    checked={enableSectorSpecificAllocation}
                    onChange={(e) => setEnableSectorSpecificAllocation(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 bg-white border-gray-300 rounded focus:ring-emerald-500 focus:ring-2"
                  />
                  <label htmlFor="enableSectorSpecific" className="text-sm font-medium text-gray-700">
                    Enable Sector-Specific Allocation
                  </label>
                  <ParameterTooltip content="Allow different allocation ratios for each sector instead of a single system-wide ratio" />
                </div>

                {!enableSectorSpecificAllocation ? (
                  /* System-wide allocation */
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">Free Allocation (%)</label>
                      <div className="flex items-center space-x-2">
                        <Tooltip content="Allowances given to companies at no cost based on historical emissions or benchmarks">
                          <Info className="w-4 h-4 text-gray-400 cursor-help" />
                        </Tooltip>
                      <span className="text-gray-800 font-bold">{settings.allocationRatio}%</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={settings.allocationRatio}
                      onChange={(e) => setSettings(prev => ({ 
                        ...prev, 
                        allocationRatio: parseInt(e.target.value),
                        auctionRatio: 100 - parseInt(e.target.value)
                      }))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-emerald"
                    />
                    <div className="flex justify-between text-sm text-gray-600 mt-1">
                      <span>0% (All Auction)</span>
                      <span className="font-medium">{settings.allocationRatio}% Free / {100 - settings.allocationRatio}% Auction</span>
                      <span>100% (All Free)</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <label className="text-sm font-medium text-gray-700">
                        Auction Allocation (%)
                      </label>
                      <ParameterTooltip content="Allowances must be purchased. Increases market-based behavior." />
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">{100 - settings.allocationRatio}% (Automatically calculated)</span>
                    </div>
                  </div>
                ) : (
                  /* Sector-specific allocation */
                  <div className="space-y-4">
                    {settings.selectedSectors.length === 0 ? (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-yellow-800 text-sm">
                          Please select sectors in the Basic Settings tab to configure sector-specific allocations.
                        </p>
                      </div>
                    ) : (
                      settings.selectedSectors.map(sector => {
                        const allocation = sectorAllocations[sector] || { free: settings.allocationRatio, auction: 100 - settings.allocationRatio };
                        const companyCount = categorizedProfiles[sector as keyof typeof categorizedProfiles]?.length || 0;
                        
                        return (
                          <div key={sector} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-medium text-gray-800">{sector}</h4>
                              <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
                                {companyCount} companies
                              </span>
                            </div>
                            
                            <div className="space-y-3">
                              <div>
                                <div className="flex items-center space-x-2 mb-2">
                                  <label className="text-sm font-medium text-gray-700">
                                    Free Allocation (%)
                                  </label>
                                  <ParameterTooltip content="Allowances granted for free. Lowers cost but reduces trading pressure." />
                                </div>
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={allocation.free}
                                  onChange={(e) => handleSectorAllocationChange(sector, 'free', parseInt(e.target.value))}
                                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-emerald"
                                />
                                <div className="flex justify-between text-xs text-gray-600 mt-1">
                                  <span>0%</span>
                                  <span className="font-medium">{allocation.free}%</span>
                                  <span>100%</span>
                                </div>
                              </div>
                              
                              <div>
                                <div className="flex items-center space-x-2 mb-2">
                                  <label className="text-sm font-medium text-gray-700">
                                    Auction Allocation (%)
                                  </label>
                                  <ParameterTooltip content="Allowances must be purchased. Increases market-based behavior." />
                                </div>
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={allocation.auction}
                                  onChange={(e) => handleSectorAllocationChange(sector, 'auction', parseInt(e.target.value))}
                                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-emerald"
                                />
                                <div className="flex justify-between text-xs text-gray-600 mt-1">
                                  <span>0%</span>
                                  <span className="font-medium">{allocation.auction}%</span>
                                  <span>100%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                    
                    {settings.selectedSectors.length > 0 && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-medium text-blue-800 mb-2">Weighted Average & Sector Range</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-blue-700">Weighted Average:</p>
                            <p className="font-medium text-blue-800">
                              {calculateAllocationSummary().weightedAverage.free.toFixed(1)}% Free / {calculateAllocationSummary().weightedAverage.auction.toFixed(1)}% Auction
                            </p>
                          </div>
                          <div>
                            <p className="text-blue-700">Sector Range:</p>
                            <p className="font-medium text-blue-800">
                              Free: {calculateAllocationSummary().sectorRange.free[0].toFixed(0)}%-{calculateAllocationSummary().sectorRange.free[1].toFixed(0)}%
                            </p>
                            <p className="font-medium text-blue-800">
                              Auction: {calculateAllocationSummary().sectorRange.auction[0].toFixed(0)}%-{calculateAllocationSummary().sectorRange.auction[1].toFixed(0)}%
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="bg-white rounded-lg p-3 border border-emerald-300">
                  <p className="text-sm text-gray-700">
                    Total: {settings.allocationRatio + settings.auctionRatio}%
                    {settings.allocationRatio + settings.auctionRatio !== 100 && (
                      <span className="text-red-600 ml-2">⚠ Must equal 100%</span>
                    )}
                  </p>
                </div>
                
                {/* Total Allowances Summary */}
                {settings.baselineEmissions > 0 && (
                  <div className="bg-white rounded-lg p-4 border border-emerald-300">
                    <h5 className="font-medium text-gray-800 mb-2">Total Allowances Available</h5>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Free Allowances:</p>
                        <p className="font-bold text-emerald-600">
                          {Math.floor(settings.baselineEmissions * settings.allocationRatio / 100).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Auction Allowances:</p>
                        <p className="font-bold text-blue-600">
                          {Math.floor(settings.baselineEmissions * settings.auctionRatio / 100).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Total Market Liquidity:</p>
                        <p className="font-bold text-gray-800">
                          {settings.baselineEmissions.toLocaleString()} allowances
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Reserve Price */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h4 className="font-medium text-gray-800 mb-4">Auction Parameters</h4>
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Reserve Price ($/tCO₂e)
                  </label>
                  <Tooltip content="Minimum price for allowances in auctions. Provides price floor.">
                    <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                  </Tooltip>
                </div>
                <input
                  type="number"
                  value={settings.reservePrice}
                  onChange={(e) => setSettings(prev => ({ ...prev, reservePrice: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Future Caps Table */}
            {futureCaps.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h4 className="font-medium text-gray-800 mb-4">Cap Calculation Table</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Year 1 is the pilot year with no cap reduction. Reductions start from Year 2. Click on reduction percentages to edit.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-2 text-left">Year</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Baseline Emissions</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Cap Reduction %</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">System Cap</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {futureCaps.map((yearData) => (
                        <tr key={yearData.year} className={yearData.isPilot ? 'bg-yellow-50' : 'bg-white'}>
                          <td className="border border-gray-300 px-4 py-2 font-medium">
                            Year {yearData.year}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {settings.baselineEmissions.toLocaleString()}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {yearData.isPilot ? (
                              <span className="text-gray-500">0%</span>
                            ) : (
                              <input
                                type="number"
                                min="0"
                                max="50"
                                value={editableCaps[yearData.year] ?? settings.capReduction}
                                onChange={(e) => setEditableCaps(prev => ({
                                  ...prev,
                                  [yearData.year]: parseInt(e.target.value) || 0
                                }))}
                                className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm focus:ring-1 focus:ring-emerald-500"
                              />
                            )}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 font-bold">
                            {yearData.isPilot 
                              ? yearData.cap.toLocaleString()
                              : Math.floor(settings.baselineEmissions * (1 - ((editableCaps[yearData.year] ?? settings.capReduction) / 100) * (yearData.year - 1))).toLocaleString()
                            }
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-sm">
                            {yearData.isPilot ? 'Pilot Year - No reduction' : `${settings.capReduction}% reduction applied`}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Total Allowance Summary */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
              <h3 className="font-semibold text-emerald-800 mb-4">Total Allowance Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-sm text-emerald-600">Total Allowances Available</p>
                  <p className="text-2xl font-bold text-emerald-800">{calculateAllocationSummary().totalAllowances.toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-emerald-600">Free Allocation</p>
                  <p className="text-xl font-bold text-emerald-800">{calculateAllocationSummary().freeAllowances.toLocaleString()}</p>
                  <p className="text-xs text-emerald-600">({calculateAllocationSummary().freePercentage.toFixed(1)}%)</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-emerald-600">Auction Allocation</p>
                  <p className="text-xl font-bold text-emerald-800">{calculateAllocationSummary().auctionAllowances.toLocaleString()}</p>
                  <p className="text-xs text-emerald-600">({calculateAllocationSummary().auctionPercentage.toFixed(1)}%)</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-emerald-600">Total Market Liquidity</p>
                  <p className="text-xl font-bold text-emerald-800">{(calculateAllocationSummary().auctionAllowances * 1.2).toLocaleString()}</p>
                  <p className="text-xs text-emerald-600">(Est. with trading)</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'events':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Market Events Configuration</h3>
            <p className="text-gray-600 mb-6">
              Select which market events can be triggered during the simulation. Events add realism and challenge to the experience.
            </p>
            
            <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Event Selection Summary</h4>
                  <p className="text-sm text-gray-600">
                    {settings.enabledEvents.length} of {marketEvents.length + customEvents.length} events enabled
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowCreateEvent(true)}
                    className="text-xs bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 transition-colors flex items-center space-x-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Create Event</span>
                  </button>
                  <button
                    onClick={() => setSettings(prev => ({ ...prev, enabledEvents: [...marketEvents, ...customEvents].map(e => e.id) }))}
                    className="text-xs bg-emerald-500 text-white px-3 py-1 rounded hover:bg-emerald-600 transition-colors"
                  >
                    Enable All
                  </button>
                  <button
                    onClick={() => setSettings(prev => ({ ...prev, enabledEvents: [] }))}
                    className="text-xs bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 transition-colors"
                  >
                    Disable All
                  </button>
                </div>
              </div>
            </div>
            
            {/* Event Categories */}
            <div className="space-y-4">
              {['Technology', 'Regulatory', 'Economic', 'Environmental', 'Market'].map(category => {
                const categoryEvents = [...marketEvents, ...customEvents].filter(e => e.category === category);
                if (categoryEvents.length === 0) return null;
                
                return (
                  <div key={category} className="bg-white rounded-lg p-4 border border-gray-200">
                    <h5 className="font-medium text-gray-800 mb-3 flex items-center">
                      <span className={`w-3 h-3 rounded-full mr-2 ${
                        category === 'Technology' ? 'bg-blue-500' :
                        category === 'Regulatory' ? 'bg-red-500' :
                        category === 'Economic' ? 'bg-green-500' :
                        category === 'Environmental' ? 'bg-emerald-500' :
                        'bg-purple-500'
                      }`}></span>
                      {category} Events ({categoryEvents.length})
                    </h5>
                    <div className="grid md:grid-cols-2 gap-3">
                      {categoryEvents.map((event) => {
                        const isEnabled = settings.enabledEvents.includes(event.id);
                        
                        return (
                          <div
                            key={event.id}
                            className={`p-3 rounded-lg border-2 transition-all ${
                              isEnabled
                                ? 'border-emerald-500 bg-emerald-50'
                                : 'border-gray-200 bg-white hover:border-emerald-300'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h6 className="font-medium text-gray-800 text-sm">{event.name}</h6>
                              <div className="flex items-center space-x-1">
                                <button
                                  onClick={() => handleEventToggle(event.id)}
                                  className="p-1"
                                >
                                  {isEnabled ? (
                                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                                  ) : (
                                    <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                                  )}
                                </button>
                              </div>
                            </div>
                            
                            <p className="text-xs text-gray-600 mb-2">{event.description}</p>
                            
                            {/* Quantitative Effects */}
                            <div className="flex flex-wrap gap-1 mb-2">
                              <span className={`inline-block px-2 py-1 rounded text-xs font-medium border ${getEventImpactColor(event.impact)}`}>
                                {event.impact}
                              </span>
                              {Object.entries(event.effects).map(([key, value]) => (
                                <span key={key} className="inline-block px-2 py-1 rounded text-xs bg-gray-100 text-gray-700 border border-gray-300">
                                  {key}: {value > 0 ? '+' : ''}{value}%
                                </span>
                              ))}
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex justify-between text-xs text-gray-500">
                                <span>Duration: {event.duration} rounds</span>
                                <span>Probability: {event.probability}%</span>
                              </div>
                              
                              {/* Scheduling */}
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-3 h-3 text-gray-400" />
                                <select
                                  value={eventSchedule[event.id] || ''}
                                  onChange={(e) => setEventSchedule(prev => ({
                                    ...prev,
                                    [event.id]: parseInt(e.target.value) || 0
                                  }))}
                                  className="text-xs border border-gray-300 rounded px-2 py-1 flex-1"
                                >
                                  <option value="">Auto-trigger</option>
                                  {Array.from({ length: settings.totalRounds }, (_, i) => (
                                    <option key={i + 1} value={i + 1}>Round {i + 1}</option>
                                  ))}
                                </select>
                              </div>
                              
                              {/* Notes */}
                              <div className="flex items-start space-x-2">
                                <MessageSquare className="w-3 h-3 text-gray-400 mt-1" />
                                <textarea
                                  placeholder="Add custom notes..."
                                  value={eventNotes[event.id] || ''}
                                  onChange={(e) => setEventNotes(prev => ({
                                    ...prev,
                                    [event.id]: e.target.value
                                  }))}
                                  className="text-xs border border-gray-300 rounded px-2 py-1 flex-1 resize-none"
                                  rows={2}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Legacy grid view for any uncategorized events */}
            <div className="grid md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {[...marketEvents, ...customEvents].filter(event => 
                !['Technology', 'Regulatory', 'Economic', 'Environmental', 'Market'].includes(event.category)
              ).map((event) => {
                const isEnabled = settings.enabledEvents.includes(event.id);
                
                return (
                  <div
                    key={event.id}
                    onClick={() => handleEventToggle(event.id)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      isEnabled
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 bg-white hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-800 text-sm">{event.name}</h4>
                      {isEnabled && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                    </div>
                    
                    <p className="text-xs text-gray-600 mb-3">{event.description}</p>
                    
                    <div className="space-y-2">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium border ${getEventImpactColor(event.impact)}`}>
                        {event.impact}
                      </span>
                      
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Category: {event.category}</span>
                        <span>Duration: {event.duration} rounds</span>
                      </div>
                      
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Probability: {event.probability}%</span>
                        {event.triggerConditions?.minRound && (
                          <span>Min Round: {event.triggerConditions.minRound}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h5 className="font-medium text-yellow-800 mb-1">Event Mechanics</h5>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Events are triggered randomly based on probability and conditions</li>
                    <li>• Some events have minimum round requirements or other triggers</li>
                    <li>• Event effects last for the specified duration</li>
                    <li>• Multiple events can be active simultaneously</li>
                    <li>• Facilitators can manually trigger events during the simulation</li>
                    <li>• Scheduled events will trigger automatically at the specified round</li>
                    <li>• Custom notes help provide context when events are triggered</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 'players':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Player Assignment</h3>
            
            {/* Validation Alert */}
            {settings.selectedCompanies.length !== settings.expectedPlayers && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <div>
                    <h4 className="font-medium text-red-800">Assignment Validation Error</h4>
                    <p className="text-sm text-red-700">
                      You must assign one company per player. Please adjust players ({settings.expectedPlayers}) or company selection ({settings.selectedCompanies.length}) to match.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="bg-emerald-50 rounded-lg p-6 border border-emerald-200">
              <h4 className="font-medium text-gray-800 mb-4">Assignment Summary</h4>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="bg-white rounded-lg p-4 border border-emerald-300">
                  <p className="text-gray-600">Total Players:</p>
                  <p className="text-2xl font-bold text-gray-800">{settings.expectedPlayers}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-emerald-300">
                  <p className="text-gray-600">Human Players:</p>
                  <p className="text-2xl font-bold text-emerald-600">{settings.humanPlayers}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-emerald-300">
                  <p className="text-gray-600">NPCs:</p>
                  <p className="text-2xl font-bold text-purple-600">{settings.expectedPlayers - settings.humanPlayers}</p>
                </div>
              </div>
            </div>

            {/* Human Players Management */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Human Players</h3>
                <button
                  onClick={addHumanPlayer}
                  className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-1 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Player</span>
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {humanPlayers.map((player, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="flex items-center space-x-2 flex-1">
                      {player.includes('@') ? (
                        <Mail className="w-4 h-4 text-blue-500" />
                      ) : (
                        <User className="w-4 h-4 text-gray-500" />
                      )}
                      <input
                        type="text"
                        value={player}
                        onChange={(e) => updatePlayerName(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="Player name or email"
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700">
                  <strong>Tip:</strong> Enter email addresses (e.g., "john@company.com") to link players to their accounts, 
                  or use display names (e.g., "John Smith") for generic assignment.
                </p>
              </div>
            </div>

            {/* Assignment Preview */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Assignment Preview</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={handleRandomizeAssignments}
                    className="bg-purple-500 text-white px-3 py-2 rounded-lg hover:bg-purple-600 transition-colors flex items-center space-x-2 text-sm"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Randomize</span>
                  </button>
                  <button
                    onClick={() => setShowAssignmentModal(true)}
                    className="bg-emerald-500 text-white px-3 py-2 rounded-lg hover:bg-emerald-600 transition-colors flex items-center space-x-2 text-sm"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit Assignments</span>
                  </button>
                </div>
              </div>
              
              {/* Validation Messages */}
              {settings.selectedCompanies.length !== settings.expectedPlayers && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <p className="text-sm text-yellow-700">
                      Company selection ({settings.selectedCompanies.length}) doesn't match expected players ({settings.expectedPlayers}). 
                      Please adjust in the Company Profiles tab.
                    </p>
                  </div>
                </div>
              )}
              
              {/* Assignment Table */}
              <div className="overflow-x-auto mt-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left py-3 px-4 font-medium">Player</th>
                      <th className="text-left py-3 px-4 font-medium">Type</th>
                      <th className="text-left py-3 px-4 font-medium">Company</th>
                      <th className="text-left py-3 px-4 font-medium">Sector</th>
                      <th className="text-left py-3 px-4 font-medium">Emissions</th>
                      <th className="text-left py-3 px-4 font-medium">Budget</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...humanPlayers, ...Array.from({ length: settings.expectedPlayers - humanPlayers.length }, (_, i) => `NPC ${i + 1}`)].map((player, index) => {
                      const companyId = playerAssignments[player] || settings.selectedCompanies[index % settings.selectedCompanies.length];
                      const company = companyProfiles.find(c => c.id === companyId);
                      const isHuman = humanPlayers.includes(player);
                      
                      return (
                        <tr key={player} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              {isHuman ? (
                                player.includes('@') ? (
                                  <Mail className="w-4 h-4 text-blue-500" />
                                ) : (
                                  <User className="w-4 h-4 text-blue-500" />
                                )
                              ) : (
                                <Bot className="w-4 h-4 text-gray-500" />
                              )}
                              <span className="font-medium">{player}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              isHuman ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {isHuman ? 'Human' : 'NPC'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {company ? (
                              <div className="group relative">
                                <span className="font-medium cursor-help">{company.name}</span>
                                <div className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                                  {company.description}
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-400">Not assigned</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            {company ? (
                              <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                                {company.category}
                              </span>
                            ) : (
                              '-'
                            )}
                          </td>
                          <td className="py-3 px-4">
                            {company ? company.emissions.toLocaleString() : '-'}
                          </td>
                          <td className="py-3 px-4">
                            {company ? `$${company.budget.toLocaleString()}` : '-'}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-1">
                              <div className={`w-2 h-2 rounded-full ${
                                isHuman ? 'bg-green-500' : 'bg-gray-400'
                              }`}></div>
                              <span className="text-xs text-gray-600">{isHuman ? 'Ready' : 'AI'}</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Assignment Modal */}
            {showAssignmentModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Edit Player Assignments</h3>
                    <button
                      onClick={() => setShowAssignmentModal(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {[...humanPlayers, ...Array.from({ length: settings.expectedPlayers - humanPlayers.length }, (_, i) => `NPC ${i + 1}`)].map((player) => {
                      const isHuman = humanPlayers.includes(player);
                      
                      return (
                        <div key={player} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-2 w-48">
                            {isHuman ? (
                              player.includes('@') ? (
                                <Mail className="w-4 h-4 text-blue-500" />
                              ) : (
                                <User className="w-4 h-4 text-blue-500" />
                              )
                            ) : (
                              <Bot className="w-4 h-4 text-gray-500" />
                            )}
                            <span className="font-medium">{player}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              isHuman ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {isHuman ? 'Human' : 'NPC'}
                            </span>
                          </div>
                          
                          <div className="flex-1">
                            <select
                              value={playerAssignments[player] || ''}
                              onChange={(e) => handleAssignmentChange(player, e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            >
                              <option value="">Select Company</option>
                              {settings.selectedCompanies.map(companyId => {
                                const company = companyProfiles.find(c => c.id === companyId);
                                return (
                                  <option key={companyId} value={companyId}>
                                    {company?.name} ({company?.category}) - {company?.emissions.toLocaleString()} tCO₂e
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="flex space-x-3 mt-6">
                    <button
                      onClick={handleRandomizeAssignments}
                      className="bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors flex items-center space-x-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Randomize All</span>
                    </button>
                    <div className="flex-1"></div>
                    <button
                      onClick={() => setShowAssignmentModal(false)}
                      className="bg-emerald-500 text-white py-2 px-4 rounded-lg hover:bg-emerald-600 transition-colors"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Assignment Summary */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Assignment Summary</h3>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-2">Human Players</h4>
                  <p className="text-2xl font-bold text-blue-600">{humanPlayers.length}</p>
                  <p className="text-sm text-blue-600">Active participants</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="font-medium text-gray-800 mb-2">NPCs</h4>
                  <p className="text-2xl font-bold text-gray-600">{settings.expectedPlayers - humanPlayers.length}</p>
                  <p className="text-sm text-gray-600">AI-controlled</p>
                </div>
                <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                  <h4 className="font-medium text-emerald-800 mb-2">Total Players</h4>
                  <p className="text-2xl font-bold text-emerald-600">{settings.expectedPlayers}</p>
                  <p className="text-sm text-emerald-600">Market participants</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h4 className="font-medium text-gray-800 mb-4">Assignment Options</h4>
              <p className="text-sm text-gray-600 mb-4">
                Auto-Assignment ensures even distribution of sectors across human players and provides balanced market dynamics.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id="auto-assign"
                    name="assignment"
                    defaultChecked
                    className="w-4 h-4 text-emerald-600"
                  />
                  <label htmlFor="auto-assign" className="text-gray-700">
                    <span className="font-medium">Auto-Assignment</span>
                    <p className="text-sm text-gray-600">Automatically assign companies to players with balanced sector distribution</p>
                  </label>
                </div>
                
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id="manual-assign"
                    name="assignment"
                    className="w-4 h-4 text-emerald-600"
                  />
                  <label htmlFor="manual-assign" className="text-gray-700">
                    <span className="font-medium">Manual Assignment</span>
                    <p className="text-sm text-gray-600">Assign companies to specific players after session creation</p>
                  </label>
                </div>
              </div>
            </div>

            {/* Assignment Preview */}
            {settings.selectedCompanies.length > 0 && (
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h4 className="font-medium text-gray-800 mb-4">Assignment Preview</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Preview how companies will be assigned to players. This can be adjusted after session creation.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-2 text-left">Player Type</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Player #</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Company</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Sector</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Emissions</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Budget</th>
                      </tr>
                    </thead>
                    <tbody>
                      {settings.selectedCompanies.slice(0, settings.expectedPlayers).map((companyId, index) => {
                        const company = companyProfiles.find(c => c.id === companyId);
                        const isHuman = index < settings.humanPlayers;
                        
                        return (
                          <tr key={companyId} className={isHuman ? 'bg-blue-50' : 'bg-purple-50'}>
                            <td className="border border-gray-300 px-4 py-2">
                              <div className="flex items-center space-x-2">
                                {isHuman ? (
                                  <Users className="w-4 h-4 text-blue-600" />
                                ) : (
                                  <Building2 className="w-4 h-4 text-purple-600" />
                                )}
                                <span className={`text-sm font-medium ${isHuman ? 'text-blue-800' : 'text-purple-800'}`}>
                                  {isHuman ? 'Human' : 'NPC'}
                                </span>
                              </div>
                            </td>
                            <td className="border border-gray-300 px-4 py-2 font-medium">
                              Player {index + 1}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              {company ? company.name : 'Unknown Company'}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              {company && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                                  {company.category}
                                </span>
                              )}
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-sm">
                              {company ? company.emissions.toLocaleString() : 'N/A'}
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-sm">
                              {company ? `$${company.budget.toLocaleString()}` : 'N/A'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h5 className="font-medium text-yellow-800 mb-1">Assignment Notes</h5>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Human players will join using the session ID</li>
                    <li>• NPCs will be automatically created and assigned</li>
                    <li>• You can reassign companies after session creation</li>
                    <li>• Sector balance rules can be overridden if needed</li>
                    <li>• Manual assignment allows control over NPC distribution</li>
                    <li>• Each player must be assigned exactly one company</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!user || !user.isFacilitator) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600">Facilitator access required</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-6">
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
          <p className="text-gray-600">Configure your eMission Trade ETS simulation session</p>
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg mb-8 border border-emerald-100">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ConfigTab)}
                className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-emerald-700 bg-emerald-50 border-b-2 border-emerald-500'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                {tab.icon}
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-emerald-100">
          {renderTabContent()}
        </div>

        {/* Summary and Create Button */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-emerald-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Session Summary</h2>
          
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <Users className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Players</p>
              <p className="font-bold text-emerald-600">{settings.humanPlayers} + {settings.expectedPlayers - settings.humanPlayers} NPCs</p>
            </div>
            <div className="text-center p-4 bg-cyan-50 rounded-lg border border-cyan-200">
              <DollarSign className="w-6 h-6 text-cyan-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Total Budget</p>
              <p className="font-bold text-cyan-600">${getTotalBudget().toLocaleString()}</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Target className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Year 1 Cap (Pilot)</p>
              <p className="font-bold text-blue-600">{settings.baselineEmissions.toLocaleString()}</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <Clock className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Rounds</p>
              <p className="font-bold text-purple-600">{settings.totalRounds}</p>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={handleCreateSession}
              disabled={settings.selectedCompanies.length !== settings.expectedPlayers || (settings.allocationRatio + settings.auctionRatio !== 100)}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-4 rounded-lg font-medium hover:from-emerald-600 hover:to-teal-700 transition-all flex items-center space-x-2 mx-auto text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
            >
              <Building2 className="w-6 h-6" />
              <span>Create Session</span>
              <ArrowRight className="w-6 h-6" />
            </button>
            <p className="text-sm text-gray-500 mt-3">
              {settings.selectedCompanies.length !== settings.expectedPlayers
                ? `Please select exactly ${settings.expectedPlayers} companies before creating the session`
                : (settings.allocationRatio + settings.auctionRatio !== 100)
                ? 'Allocation percentages must add up to 100%'
                : 'Session will be created and you\'ll be redirected to the facilitator dashboard'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
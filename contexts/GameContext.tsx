'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CompanyProfile } from '@/data/companyProfiles';
import { companyProfiles, getBalancedCompanySelection } from '@/data/companyProfiles';

interface Player {
  id: string;
  name: string;
  profile?: CompanyProfile;
  allowancesOwned: number;
  allowancesPurchased: number;
  offsetsPurchased: number;
  actualEmissions: number;
  abatementInvestments: {
    option1: boolean;
    option2: boolean;
  };
  compliance: {
    isCompliant: boolean;
    penalty: number;
    costPerTon: number;
  };
  badges: string[];
  budgetSpent: number;
  remainingBudget: number;
  abatementCostModifier?: number;
  budgetModifier?: number;
  otcTrades: {
    bought: number;
    sold: number;
    totalValue: number;
  };
  phaseProgress: {
    planning: boolean;
    auction1: boolean;
    auction2: boolean;
    reporting: boolean;
    compliance: boolean;
  };
  lastActivity?: Date;
}

interface GameSettings {
  cap: number;
  systemCap: number;
  penalty: number;
  allocationRatio: number;
  auctionRatio: number;
  reservePrice: number;
  offsetsEnabled: boolean;
  roundDuration: number;
  totalRounds: number;
  capType: 'absolute' | 'rate-based';
  allocationMethod: 'free' | 'auction' | 'mixed';
  bankingEnabled: boolean;
  expectedPlayers: number;
  humanPlayers: number;
  capReduction: number;
  baselineEmissions: number;
  emergencyReserveEnabled: boolean;
  manualTimeControl: boolean;
  marketEvents?: string[];
  phaseDurations: {
    setup: number;
    planning: number;
    auction1: number;
    auction2: number;
    reporting: number;
    compliance: number;
  };
}

interface GameState {
  sessionId: string;
  currentRound: number;
  totalRounds: number;
  currentPhase: string;
  phaseTimeRemaining: number;
  players: Player[];
  settings: GameSettings;
  systemCap: number;
  totalEmissions: number;
  complianceCount: number;
  allowancePriceModifier?: number;
  activeEvents?: any[];
  isManualMode: boolean;
  phaseTimer: number;
  phaseStartTime?: number;
  gameLogs?: GameLog[];
}

interface GameContextType {
  gameState: GameState;
  selectedRole: 'facilitator' | 'liable-entity' | null;
  setSelectedRole: (role: 'facilitator' | 'liable-entity') => void;
  initializeGame: (config: { sessionId: string; settings?: Partial<GameSettings> }) => void;
  joinGame: (sessionId: string, playerName: string, profile?: CompanyProfile) => Promise<void>;
  updateSettings: (settings: Partial<GameSettings>) => void;
  calculateAllCompliance: () => void;
  calculateBadges: () => void;
  isOTCMarketOpen: () => boolean;
  makeAbatementInvestment: (playerId: string, option: 'option1' | 'option2') => void;
  purchaseAllowances: (playerId: string, amount: number, price: number) => void;
  purchaseOffsets: (playerId: string, amount: number) => void;
  updateActualEmissions: (playerId: string, emissions: number) => void;
  advancePhase: () => void;
  setPhase: (phase: string) => void;
  markPhaseComplete: (playerId: string, phase: string) => void;
  canAdvancePhase: () => boolean;
  getPhaseInstructions: (phase: string) => string;
  simulateNPCs: () => Promise<void>;
  addNPCs: (count: number) => Promise<void>;
  simulateOTCTrading: () => void;
  simulateOffsetPurchases: () => void;
  updatePhaseTimer: (seconds: number) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  isTimerPaused: boolean;
  getMarketData: () => any;
  addGameLog: (message: string, type: string, icon?: React.ReactNode) => void;
  gameLogs: GameLog[];
  runFullSimulation: () => Promise<void>;
  isSimulationRunning: boolean;
  pauseSimulation: () => void;
  resumeSimulation: () => void;
}

interface GameLog {
  id: string;
  type: string;
  message: string;
  timestamp: Date;
  icon?: React.ReactNode;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const defaultGameState: GameState = {
  sessionId: '',
  currentRound: 1,
  totalRounds: 3,
  currentPhase: 'planning',
  phaseTimeRemaining: 0,
  players: [],
  settings: {
    cap: 500000,
    systemCap: 500000,
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
    humanPlayers: 4,
    capReduction: 15,
    baselineEmissions: 0,
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
  },
  systemCap: 500000,
  totalEmissions: 0,
  complianceCount: 0,
  isManualMode: true,
  phaseTimer: 0,
  gameLogs: []
};

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState<GameState>(defaultGameState);
  const [selectedRole, setSelectedRole] = useState<'facilitator' | 'liable-entity' | null>(null);
  const [gameLogs, setGameLogs] = useState<GameLog[]>([]);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [simulationPaused, setSimulationPaused] = useState(false);
  const [isTimerPaused, setIsTimerPaused] = useState(false);

  // Load game state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('gameState');
    const savedRole = localStorage.getItem('selectedRole');
    
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        // Ensure all players have phaseProgress
        const updatedPlayers = parsed.players?.map((player: any) => ({
          ...player,
          phaseProgress: player.phaseProgress || {
            planning: false,
            auction1: false,
            auction2: false,
            reporting: false,
            compliance: false
          }
        })) || [];
        
        setGameState({
          ...parsed,
          players: updatedPlayers,
          isManualMode: parsed.settings?.manualTimeControl ?? true
        });
      } catch (error) {
        console.error('Error loading game state:', error);
      }
    }
    
    if (savedRole) {
      setSelectedRole(savedRole as 'facilitator' | 'liable-entity');
    }
  }, []);

  // Save game state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('gameState', JSON.stringify(gameState));
  }, [gameState]);

  // Save selected role to localStorage
  useEffect(() => {
    if (selectedRole) {
      localStorage.setItem('selectedRole', selectedRole);
    }
  }, [selectedRole]);

  const initializeGame = (config: { sessionId: string; settings?: Partial<GameSettings> }) => {
    const newSettings = { ...defaultGameState.settings, ...config.settings };
    
    setGameState({
      ...defaultGameState,
      sessionId: config.sessionId,
      settings: newSettings,
      totalRounds: newSettings.totalRounds,
      systemCap: newSettings.systemCap || newSettings.cap,
      isManualMode: newSettings.manualTimeControl,
    });
    
    // Auto-add NPCs if this is a demo session
    if (config.sessionId === '999999') {
      setTimeout(() => addNPCs(5), 1000);
    }
  };

  const joinGame = async (sessionId: string, playerName: string, profile?: CompanyProfile): Promise<void> => {
    return new Promise((resolve) => {
      setGameState(prev => {
        // Check if player already exists
        const existingPlayerIndex = prev.players.findIndex(p => p.name === playerName);
        
        if (existingPlayerIndex >= 0) {
          // Update existing player with profile
          const updatedPlayers = [...prev.players];
          updatedPlayers[existingPlayerIndex] = {
            ...updatedPlayers[existingPlayerIndex],
            profile: profile || updatedPlayers[existingPlayerIndex].profile
          };
          
          return {
            ...prev,
            sessionId,
            players: updatedPlayers
          };
        } else {
          // Add new player
          const newPlayer: Player = {
            id: `player-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: playerName,
            profile,
            allowancesOwned: 0,
            allowancesPurchased: 0,
            offsetsPurchased: 0,
            otcTrades: {
              bought: 0,
              sold: 0,
              totalValue: 0
            },
            actualEmissions: profile?.emissions || 0,
            abatementInvestments: {
              option1: false,
              option2: false
            },
            compliance: {
              isCompliant: false,
              penalty: 0,
              costPerTon: 0
            },
            badges: [],
            budgetSpent: 0,
            remainingBudget: profile?.budget || 0,
            phaseProgress: {
              planning: false,
              auction1: false,
              auction2: false,
              reporting: false,
              compliance: false
            },
            lastActivity: new Date()
          };

          return {
            ...prev,
            sessionId,
            players: [...prev.players, newPlayer]
          };
        }
      });
      
      resolve();
    });
  };

  const addNPCs = async (count: number): Promise<void> => {
    const selectedProfiles = getBalancedCompanySelection(count);
    
    for (let i = 0; i < count; i++) {
      const npcName = `NPC-${String.fromCharCode(65 + i)}`;
      const profile = selectedProfiles[i];
      
      if (profile) {
        await joinGame(gameState.sessionId, npcName, profile);
        addGameLog(`${npcName} joined as ${profile.name}`, 'player');
      }
    }
    
    addGameLog(`Added ${count} NPC players to the simulation`, 'system');
  };

  const updatePhaseTimer = (seconds: number) => {
    setGameState(prev => ({
      ...prev,
      phaseTimer: seconds
    }));
  };

  const pauseTimer = () => setIsTimerPaused(true);
  const resumeTimer = () => setIsTimerPaused(false);

  const getMarketData = () => {
    return {
      otcOffers: gameState.players.filter(p => p.allowancesOwned > 0).map(p => ({
        player: p.name,
        quantity: Math.floor(p.allowancesOwned * 0.1),
        price: gameState.settings.reservePrice * (0.9 + Math.random() * 0.2)
      })),
      offsetOffers: [
        { type: 'Forestry', quantity: 10000, price: gameState.settings.reservePrice * 0.8 },
        { type: 'Renewable Energy', quantity: 5000, price: gameState.settings.reservePrice * 0.75 },
        { type: 'Methane Capture', quantity: 3000, price: gameState.settings.reservePrice * 0.85 }
      ]
    };
  };

  const updateSettings = (settings: Partial<GameSettings>) => {
    setGameState(prev => ({
      ...prev,
      settings: { ...prev.settings, ...settings },
      isManualMode: settings.manualTimeControl ?? prev.isManualMode
    }));
  };

  const simulateOTCTrading = () => {
    setGameState(prev => {
      const updatedPlayers = prev.players.map(player => {
        if (!player.name.startsWith('NPC') || !player.profile) return player;
        
        // Simulate some OTC trading activity
        const tradeChance = Math.random();
        if (tradeChance > 0.7) {
          const tradeAmount = Math.floor(Math.random() * 100) + 10;
          const tradePrice = prev.settings.reservePrice * (0.95 + Math.random() * 0.1);
          
          return {
            ...player,
            otcTrades: {
              ...player.otcTrades,
              bought: player.otcTrades.bought + tradeAmount,
              totalValue: player.otcTrades.totalValue + (tradeAmount * tradePrice)
            },
            allowancesOwned: player.allowancesOwned + tradeAmount,
            budgetSpent: player.budgetSpent + (tradeAmount * tradePrice),
            remainingBudget: player.remainingBudget - (tradeAmount * tradePrice),
            lastActivity: new Date()
          };
        }
        
        return player;
      });
      
      return { ...prev, players: updatedPlayers };
    });
  };

  const simulateOffsetPurchases = () => {
    setGameState(prev => {
      const updatedPlayers = prev.players.map(player => {
        if (!player.name.startsWith('NPC') || !player.profile) return player;
        
        // Calculate if NPC needs offsets
        const abatementReduction = 
          (player.abatementInvestments?.option1 ? player.profile.abatementOption1?.tons || 0 : 0) +
          (player.abatementInvestments?.option2 ? player.profile.abatementOption2?.tons || 0 : 0);
        
        const netEmissions = Math.max(0, player.actualEmissions - abatementReduction);
        const complianceGap = Math.max(0, netEmissions - player.allowancesOwned);
        
        if (complianceGap > 0 && player.remainingBudget > 0) {
          const offsetPrice = prev.settings.reservePrice * 0.8;
          const offsetsToBuy = Math.min(
            complianceGap,
            Math.floor(player.remainingBudget / offsetPrice)
          );
          
          if (offsetsToBuy > 0) {
            const cost = offsetsToBuy * offsetPrice;
            return {
              ...player,
              offsetsPurchased: player.offsetsPurchased + offsetsToBuy,
              budgetSpent: player.budgetSpent + cost,
              remainingBudget: player.remainingBudget - cost,
              lastActivity: new Date()
            };
          }
        }
        
        return player;
      });
      
      return { ...prev, players: updatedPlayers };
    });
  };

  const advancePhase = () => {
    setGameState(prev => {
      const phases = ['planning', 'auction1', 'otc-offsets', 'auction2', 'reporting', 'compliance'];
      const currentIndex = phases.indexOf(prev.currentPhase);
      
      if (currentIndex < phases.length - 1) {
        // Move to next phase
        const nextPhase = phases[currentIndex + 1];
        return {
          ...prev,
          currentPhase: nextPhase,
          phaseStartTime: Date.now(),
          phaseTimer: prev.settings.phaseDurations[nextPhase as keyof typeof prev.settings.phaseDurations] * 60 || 300,
          // Reset phase progress for new phase
          players: prev.players.map(player => ({
            ...player,
            phaseProgress: {
              ...player.phaseProgress,
              [nextPhase]: false
            }
          }))
        };
      } else {
        // Move to next round or end game
        if (prev.currentRound < prev.totalRounds) {
          return {
            ...prev,
            currentRound: prev.currentRound + 1,
            currentPhase: 'planning',
            phaseStartTime: Date.now(),
            phaseTimer: prev.settings.phaseDurations.planning * 60,
            // Reset all phase progress for new round
            players: prev.players.map(player => ({
              ...player,
              phaseProgress: {
                planning: false,
                auction1: false,
                auction2: false,
                'otc-offsets': false,
                reporting: false,
                compliance: false
              }
            }))
          };
        } else {
          return {
            ...prev,
            currentPhase: 'completed'
          };
        }
      }
    });
  };

  const setPhase = (phase: string) => {
    setGameState(prev => ({
      ...prev,
      currentPhase: phase,
      phaseTimer: prev.settings.phaseDurations[phase as keyof typeof prev.settings.phaseDurations] * 60 || 300,
      phaseStartTime: Date.now()
    }));
  };

  const markPhaseComplete = (playerId: string, phase: string) => {
    setGameState(prev => ({
      ...prev,
      players: prev.players.map(player => 
        player.id === playerId 
          ? {
              ...player,
              phaseProgress: {
                ...player.phaseProgress,
                [phase]: true
              }
            }
          : player
      )
    }));
  };

  const canAdvancePhase = () => {
    const humanPlayers = gameState.players.filter(p => !p.name.startsWith('NPC'));
    if (humanPlayers.length === 0) return true;
    
    return humanPlayers.every(player => 
      player.phaseProgress[gameState.currentPhase as keyof typeof player.phaseProgress]
    );
  };

  const getPhaseInstructions = (phase: string): string => {
    const instructions = {
      planning: "Review your company profile and make abatement investment decisions. Consider your emissions, budget, and the cost-effectiveness of each option.",
      auction1: "Participate in the first allowance auction. Bid for allowances at or above the reserve price based on your emission reduction needs.",
      'otc-offsets': "Trade allowances with other players and purchase carbon offsets. This is your main trading phase.",
      auction2: "Second auction opportunity. Adjust your allowance holdings based on your compliance requirements and market conditions.",
      reporting: "Report your actual emissions for the year and purchase carbon offsets if needed to meet compliance requirements.",
      compliance: "Review your compliance status, penalties, and performance metrics. Prepare for the next round."
    };
    
    return instructions[phase as keyof typeof instructions] || "Follow the current phase instructions.";
  };

  const calculateAllCompliance = () => {
    setGameState(prev => {
      const updatedPlayers = prev.players.map(player => {
        if (!player.profile) return player;

        // Calculate actual emissions after abatement
        let netEmissions = player.actualEmissions;
        
        if (player.abatementInvestments.option1) {
          netEmissions -= player.profile.abatementOption1.tons;
        }
        if (player.abatementInvestments.option2) {
          netEmissions -= player.profile.abatementOption2.tons;
        }

        // Calculate total coverage (allowances + offsets)
        const totalCoverage = player.allowancesOwned + player.offsetsPurchased;
        
        // Calculate compliance
        const isCompliant = totalCoverage >= netEmissions;
        const excessEmissions = Math.max(0, netEmissions - totalCoverage);
        const penalty = excessEmissions * prev.settings.penalty;

        // Calculate cost per ton
        let totalCost = penalty;
        
        // Add abatement costs
        if (player.abatementInvestments.option1) {
          totalCost += player.profile.abatementOption1.cost;
        }
        if (player.abatementInvestments.option2) {
          totalCost += player.profile.abatementOption2.cost;
        }

        // Add allowance costs (estimated at reserve price)
        totalCost += player.allowancesPurchased * prev.settings.reservePrice;

        // Add offset costs (estimated at 80% of allowance price)
        totalCost += player.offsetsPurchased * (prev.settings.reservePrice * 0.8);

        const costPerTon = player.profile.emissions > 0 ? totalCost / player.profile.emissions : 0;

        return {
          ...player,
          compliance: {
            isCompliant,
            penalty,
            costPerTon
          }
        };
      });

      const complianceCount = updatedPlayers.filter(p => p.compliance.isCompliant).length;
      const totalEmissions = updatedPlayers.reduce((sum, p) => sum + p.actualEmissions, 0);

      return {
        ...prev,
        players: updatedPlayers,
        complianceCount,
        totalEmissions
      };
    });
  };

  const calculateBadges = () => {
    setGameState(prev => {
      const updatedPlayers = prev.players.map(player => {
        const badges: string[] = [];

        if (!player.profile) return { ...player, badges };

        // Calculate metrics for badge determination
        const abatementReduction = 
          (player.abatementInvestments.option1 ? player.profile.abatementOption1.tons : 0) +
          (player.abatementInvestments.option2 ? player.profile.abatementOption2.tons : 0);
        
        const abatementPercentage = (abatementReduction / player.profile.emissions) * 100;
        
        // Clean Tech Champion - Highest % of abatement delivered
        if (abatementPercentage >= 15) {
          badges.push('Clean Tech Champion');
        }

        // Thrifty Performer - Low cost per ton
        if (player.compliance.costPerTon > 0 && player.compliance.costPerTon <= 20) {
          badges.push('Thrifty Performer');
        }

        // Offset Guru - High % of emissions covered by offsets
        const offsetPercentage = (player.offsetsPurchased / player.profile.emissions) * 100;
        if (offsetPercentage >= 10) {
          badges.push('Offset Guru');
        }

        // Kingpin - High remaining budget
        if (player.remainingBudget >= player.profile.budget * 0.5) {
          badges.push('Kingpin');
        }

        // Bankrupt Bandit - Low or negative remaining budget
        if (player.remainingBudget <= player.profile.budget * 0.1) {
          badges.push('Bankrupt Bandit');
        }

        return { ...player, badges };
      });

      return { ...prev, players: updatedPlayers };
    });
  };

  const isOTCMarketOpen = () => {
    const tradingPhases = ['planning', 'auction1', 'auction2', 'reporting'];
    return tradingPhases.includes(gameState.currentPhase);
  };

  const makeAbatementInvestment = (playerId: string, option: 'option1' | 'option2') => {
    setGameState(prev => {
      const updatedPlayers = prev.players.map(player => {
        if (player.id !== playerId || !player.profile) return player;

        const cost = option === 'option1' 
          ? player.profile.abatementOption1.cost 
          : player.profile.abatementOption2.cost;

        if (player.remainingBudget < cost) {
          return player; // Not enough budget
        }

        return {
          ...player,
          abatementInvestments: {
            ...player.abatementInvestments,
            [option]: true
          },
          budgetSpent: player.budgetSpent + cost,
          remainingBudget: player.remainingBudget - cost
        };
      });

      return { ...prev, players: updatedPlayers };
    });
  };

  const purchaseAllowances = (playerId: string, amount: number, price: number) => {
    setGameState(prev => {
      const updatedPlayers = prev.players.map(player => {
        if (player.id !== playerId) return player;

        const totalCost = amount * price;
        if (player.remainingBudget < totalCost) {
          return player; // Not enough budget
        }

        return {
          ...player,
          allowancesOwned: player.allowancesOwned + amount,
          allowancesPurchased: player.allowancesPurchased + amount,
          budgetSpent: player.budgetSpent + totalCost,
          remainingBudget: player.remainingBudget - totalCost
        };
      });

      return { ...prev, players: updatedPlayers };
    });
  };

  const purchaseOffsets = (playerId: string, amount: number) => {
    setGameState(prev => {
      const updatedPlayers = prev.players.map(player => {
        if (player.id !== playerId) return player;

        const offsetPrice = prev.settings.reservePrice * 0.8; // Offsets are 80% of allowance price
        const totalCost = amount * offsetPrice;
        
        if (player.remainingBudget < totalCost) {
          return player; // Not enough budget
        }

        return {
          ...player,
          offsetsPurchased: player.offsetsPurchased + amount,
          budgetSpent: player.budgetSpent + totalCost,
          remainingBudget: player.remainingBudget - totalCost
        };
      });

      return { ...prev, players: updatedPlayers };
    });
  };

  const updateActualEmissions = (playerId: string, emissions: number) => {
    setGameState(prev => {
      const updatedPlayers = prev.players.map(player => {
        if (player.id !== playerId) return player;
        return { ...player, actualEmissions: emissions };
      });

      return { ...prev, players: updatedPlayers };
    });
  };

  const addGameLog = (message: string, type: string, icon?: React.ReactNode) => {
    const newLog: GameLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      message,
      timestamp: new Date(),
      icon
    };
    
    setGameLogs(prev => [newLog, ...prev.slice(0, 49)]); // Keep last 50 logs
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const simulatePhase = async (phase: string) => {
    addGameLog(`Starting ${phase} phase simulation`, 'phase');
    
    setGameState(prev => {
      const updatedPlayers = prev.players.map(player => {
        if (player.name.startsWith('NPC') || !player.profile) return player;

        const abatementReduction = 
          (player.abatementInvestments?.option1 ? player.profile.abatementOption1?.tons || 0 : 0) +
          (player.abatementInvestments?.option2 ? player.profile.abatementOption2?.tons || 0 : 0);
        
        const netEmissions = Math.max(0, player.actualEmissions - abatementReduction);
        const currentCoverage = player.allowancesOwned + player.offsetsPurchased;
        const complianceGap = Math.max(0, netEmissions - currentCoverage);
        
        let updatedPlayer = { ...player };
        
        // Phase-specific NPC logic
        let hasActivity = false;
        if (phase === 'planning') {
          // Make abatement investments
          if (updatedPlayer.remainingBudget > 0) {
            const option1Cost = player.profile.abatementOption1.cost;
            const option2Cost = player.profile.abatementOption2.cost;
            const option1CostPerTon = player.profile.abatementOption1.costPerTon;
            const option2CostPerTon = player.profile.abatementOption2.costPerTon;
            
            // Invest in cost-effective options
            if (!updatedPlayer.abatementInvestments.option1 && 
                updatedPlayer.remainingBudget >= option1Cost &&
                option1CostPerTon < prev.settings.reservePrice * 1.2) {
              updatedPlayer.abatementInvestments.option1 = true;
              updatedPlayer.budgetSpent += option1Cost;
              updatedPlayer.remainingBudget -= option1Cost;
              hasActivity = true;
              
              addGameLog(
                `${player.name} invested in ${player.profile.abatementOption1.name} for $${option1Cost.toLocaleString()}`,
                'abatement'
              );
            } else if (!updatedPlayer.abatementInvestments.option2 && 
                       updatedPlayer.remainingBudget >= option2Cost &&
                       option2CostPerTon < prev.settings.reservePrice * 1.2) {
              updatedPlayer.abatementInvestments.option2 = true;
              updatedPlayer.budgetSpent += option2Cost;
              updatedPlayer.remainingBudget -= option2Cost;
              hasActivity = true;
              
              addGameLog(
                `${player.name} invested in ${player.profile.abatementOption2.name} for $${option2Cost.toLocaleString()}`,
                'abatement'
              );
            }
          }
        } else if (phase === 'auction1' || phase === 'auction2') {
          // Buy allowances if needed
          const allowancePrice = prev.settings.reservePrice;
          const allowancesToBuy = Math.min(
            Math.max(0, Math.ceil(complianceGap * 0.6)), // Buy 60% of gap
            Math.floor(updatedPlayer.remainingBudget / allowancePrice)
          );
          
          if (allowancesToBuy > 0) {
            const cost = allowancesToBuy * allowancePrice;
            updatedPlayer.allowancesOwned += allowancesToBuy;
            updatedPlayer.allowancesPurchased += allowancesToBuy;
            updatedPlayer.budgetSpent += cost;
            hasActivity = true;
            updatedPlayer.remainingBudget -= cost;
            
            addGameLog(
              `${player.name} purchased ${allowancesToBuy.toLocaleString()} allowances at $${allowancePrice}/tCO₂e`,
              'trade'
            );
          }
        } else if (phase === 'otc-offsets') {
          // Simulate OTC trading and offset purchases
          const tradeChance = Math.random();
          if (tradeChance > 0.6 && complianceGap > 0) {
            const tradeAmount = Math.min(complianceGap, Math.floor(Math.random() * 200) + 50);
            const tradePrice = prev.settings.reservePrice * (0.95 + Math.random() * 0.1);
            const tradeCost = tradeAmount * tradePrice;
            
            if (updatedPlayer.remainingBudget >= tradeCost) {
              updatedPlayer.allowancesOwned += tradeAmount;
              updatedPlayer.budgetSpent += tradeCost;
              updatedPlayer.remainingBudget -= tradeCost;
              updatedPlayer.otcTrades.bought += tradeAmount;
              updatedPlayer.otcTrades.totalValue += tradeCost;
              hasActivity = true;
              
              addGameLog(
                `${player.name} purchased ${tradeAmount.toLocaleString()} allowances via OTC at $${tradePrice.toFixed(2)}/tCO₂e`,
                'trade'
              );
            }
          }
        } else if (phase === 'reporting') {
          // Purchase offsets if still have compliance gap
        if (complianceGap > 0 && updatedPlayer.remainingBudget > 0) {
          const offsetPrice = prev.settings.reservePrice * 0.8;
          
            // Buy offsets
            const offsetsToBuy = Math.min(
              complianceGap,
              Math.floor(updatedPlayer.remainingBudget / offsetPrice)
            );
            
            if (offsetsToBuy > 0) {
              const cost = offsetsToBuy * offsetPrice;
              updatedPlayer.offsetsPurchased += offsetsToBuy;
              updatedPlayer.budgetSpent += cost;
              updatedPlayer.remainingBudget -= cost;
              hasActivity = true;
              
              addGameLog(
                `${player.name} purchased ${offsetsToBuy.toLocaleString()} carbon offsets for $${cost.toLocaleString()}`,
                'offset'
              );
            }
          }
        }
        
        if (hasActivity) {
          updatedPlayer.lastActivity = new Date();
        }
        
        return updatedPlayer;
      });

      return {
        ...prev,
        players: updatedPlayers
      };
    });

    // Calculate compliance after each phase
    setTimeout(() => {
      calculateAllCompliance();
      calculateBadges();
    }, 100);
  };

  const pauseSimulation = () => {
    setSimulationPaused(true);
    addGameLog('Simulation paused', 'system');
  };

  const resumeSimulation = () => {
    setSimulationPaused(false);
    setIsTimerPaused(false);
    addGameLog('Simulation resumed', 'system');
  };

  const simulateNPCs = async (): Promise<void> => {
    return new Promise((resolve) => {
      setGameState(prev => {
        // Only simulate NPCs, don't change phases here
        const updatedPlayers = prev.players.map(player => {
          // Skip human players (those without NPC prefix)
          if (!player.name.startsWith('NPC')) {
            return player;
          }

          if (!player.profile) return player;

          // Calculate current situation
          const abatementReduction = 
            (player.abatementInvestments?.option1 ? player.profile.abatementOption1?.tons || 0 : 0) +
            (player.abatementInvestments?.option2 ? player.profile.abatementOption2?.tons || 0 : 0);
          
          const netEmissions = Math.max(0, player.actualEmissions - abatementReduction);
          const currentCoverage = player.allowancesOwned + player.offsetsPurchased;
          const complianceGap = Math.max(0, netEmissions - currentCoverage);
          
          let updatedPlayer = { ...player };
          
          // NPC Decision Logic based on current phase
          if (prev.currentPhase === 'planning') {
            // Consider abatement investments if budget allows and not already invested
            if (updatedPlayer.remainingBudget > 0) {
              const option1Cost = player.profile.abatementOption1.cost;
              const option2Cost = player.profile.abatementOption2.cost;
              const option1CostPerTon = player.profile.abatementOption1.costPerTon;
              const option2CostPerTon = player.profile.abatementOption2.costPerTon;
              
              // Invest in cheaper option first if affordable and cost-effective
              if (!updatedPlayer.abatementInvestments.option1 && 
                  updatedPlayer.remainingBudget >= option1Cost &&
                  option1CostPerTon < prev.settings.reservePrice) {
                updatedPlayer.abatementInvestments.option1 = true;
                updatedPlayer.budgetSpent += option1Cost;
                updatedPlayer.remainingBudget -= option1Cost;
                
                addGameLog(
                  `${player.name} invested in ${player.profile.abatementOption1.name} for $${option1Cost.toLocaleString()}`,
                  'abatement'
                );
              } else if (!updatedPlayer.abatementInvestments.option2 && 
                         updatedPlayer.remainingBudget >= option2Cost &&
                         option2CostPerTon < prev.settings.reservePrice) {
                updatedPlayer.abatementInvestments.option2 = true;
                updatedPlayer.budgetSpent += option2Cost;
                updatedPlayer.remainingBudget -= option2Cost;
                
                addGameLog(
                  `${player.name} invested in ${player.profile.abatementOption2.name} for $${option2Cost.toLocaleString()}`,
                  'abatement'
                );
              }
            }
          } else if (prev.currentPhase === 'auction1' || prev.currentPhase === 'auction2') {
            // Buy allowances if needed and affordable
            const allowancePrice = prev.settings.reservePrice;
            const allowancesToBuy = Math.min(
              Math.max(0, Math.ceil(complianceGap * 0.7)), // Buy 70% of gap
              Math.floor(updatedPlayer.remainingBudget / allowancePrice)
            );
            
            if (allowancesToBuy > 0) {
              const cost = allowancesToBuy * allowancePrice;
              updatedPlayer.allowancesOwned += allowancesToBuy;
              updatedPlayer.allowancesPurchased += allowancesToBuy;
              updatedPlayer.budgetSpent += cost;
              updatedPlayer.remainingBudget -= cost;
              
              addGameLog(
                `${player.name} purchased ${allowancesToBuy.toLocaleString()} allowances at $${allowancePrice}/tCO₂e`,
                'trade'
              );
            }
          } else if (prev.currentPhase === 'reporting') {
            // Purchase offsets if still have compliance gap
          if (complianceGap > 0 && updatedPlayer.remainingBudget > 0) {
            const offsetPrice = prev.settings.reservePrice * 0.8;
            
              // Buy offsets
              const offsetsToBuy = Math.min(
                complianceGap,
                Math.floor(updatedPlayer.remainingBudget / offsetPrice)
              );
              
              if (offsetsToBuy > 0) {
                const cost = offsetsToBuy * offsetPrice;
                updatedPlayer.offsetsPurchased += offsetsToBuy;
                updatedPlayer.budgetSpent += cost;
                updatedPlayer.remainingBudget -= cost;
                
                addGameLog(
                  `${player.name} purchased ${offsetsToBuy.toLocaleString()} carbon offsets for $${cost.toLocaleString()}`,
                  'offset'
                );
              }
            }
          }
          
          return updatedPlayer;
        });

        return {
          ...prev,
          players: updatedPlayers
        };
      });
      
      // Add summary log
      addGameLog(
        `NPC simulation completed for ${gameState.players.filter(p => p.name.startsWith('NPC')).length} NPCs`,
        'simulation'
      );
      
      // Recalculate compliance after simulation
      setTimeout(() => {
        calculateAllCompliance();
        calculateBadges();
        resolve();
      }, 100);
    });
  };

  // Add auto-advance functionality for demo mode
  const autoAdvancePhase = () => {
    setTimeout(() => {
      advancePhase();
    }, 3000); // Auto-advance after 3 seconds in demo mode
  };

  // Add function to run full simulation cycle
  const runFullSimulation = async () => {
    setIsSimulationRunning(true);
    setSimulationPaused(false);
    addGameLog('Starting full simulation', 'system');
    
    const phases = ['planning', 'auction1', 'otc-offsets', 'auction2', 'reporting', 'compliance'];
    
    try {
      for (let round = 1; round <= gameState.totalRounds; round++) {
        if (simulationPaused) {
          while (simulationPaused) {
            await delay(500);
          }
        }
        
        addGameLog(`Starting Round ${round}`, 'round');
        
        // Update current round
        setGameState(prev => ({
          ...prev,
          currentRound: round
        }));
        
        for (const phase of phases) {
          if (simulationPaused) {
            while (simulationPaused) {
              await delay(500);
            }
          }
          
          // Update current phase
          setGameState(prev => ({
            ...prev,
            currentPhase: phase,
            phaseTimer: prev.settings.phaseDurations[phase as keyof typeof prev.settings.phaseDurations] * 60 || 300,
            phaseStartTime: Date.now()
          }));
          
          // Simulate this phase
          await simulatePhase(phase);
          
          // Wait for visual feedback
          if (phase === 'otc-offsets') {
            // Extra simulation for trading phase
            simulateOTCTrading();
            await delay(1000);
            simulateOffsetPurchases();
          }
          await delay(3000);
          
          addGameLog(`${phase} phase completed`, 'phase');
        }
        
        addGameLog(`Round ${round} completed`, 'round');
        
        // Reset phase progress for next round
        if (round < gameState.totalRounds) {
          setGameState(prev => ({
            ...prev,
            players: prev.players.map(player => ({
              ...player,
              phaseProgress: {
                planning: false,
                auction1: false,
                'otc-offsets': false,
                auction2: false,
                reporting: false,
                compliance: false
              }
            }))
          }));
        }
      }
      
      // Simulation complete
      setGameState(prev => ({
        ...prev,
        currentPhase: 'completed'
      }));
      
      addGameLog('Full simulation completed!', 'complete');
      
    } catch (error) {
      console.error('Simulation error:', error);
      addGameLog('Simulation error occurred', 'error');
    } finally {
      setIsSimulationRunning(false);
      setSimulationPaused(false);
    }
  };

  return (
    <GameContext.Provider value={{
      gameState,
      selectedRole,
      setSelectedRole,
      initializeGame,
      joinGame,
      updateSettings,
      calculateAllCompliance,
      calculateBadges,
      isOTCMarketOpen,
      makeAbatementInvestment,
      purchaseAllowances,
      purchaseOffsets,
      updateActualEmissions,
      advancePhase,
      setPhase,
      markPhaseComplete,
      canAdvancePhase,
      getPhaseInstructions,
      simulateNPCs,
      addNPCs,
      simulateOTCTrading,
      simulateOffsetPurchases,
      updatePhaseTimer,
      pauseTimer,
      resumeTimer,
      isTimerPaused,
      getMarketData,
      addGameLog,
      gameLogs,
      runFullSimulation,
      isSimulationRunning,
      pauseSimulation,
      resumeSimulation
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
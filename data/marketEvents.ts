export interface MarketEvent {
  id: string;
  name: string;
  description: string;
  impact: string;
  impactValue: number; // percentage change
  category: 'Technology' | 'Regulatory' | 'Economic' | 'Environmental' | 'Market';
  effects: {
    abatementCosts?: number; // percentage change
    allowancePrices?: number; // percentage change
    offsetAvailability?: number; // percentage change
    emissionsCap?: number; // percentage change
    companyBudgets?: number; // percentage change
    penaltyRate?: number; // percentage change
  };
  duration: number; // rounds the effect lasts
  probability: number; // 0-100, likelihood of occurring
  triggerConditions?: {
    minRound?: number;
    maxRound?: number;
    complianceRate?: number; // trigger if compliance rate is below this
    avgAllowancePrice?: number; // trigger if avg price is above this
  };
}

export const marketEvents: MarketEvent[] = [
  {
    id: 'tech-breakthrough',
    name: 'Technology Breakthrough',
    description: 'Major technological advancement reduces abatement costs across all sectors',
    impact: '-20% abatement costs',
    impactValue: -20,
    category: 'Technology',
    effects: {
      abatementCosts: -20
    },
    duration: 2,
    probability: 15,
    triggerConditions: {
      minRound: 2
    }
  },
  {
    id: 'regulatory-tightening',
    name: 'Regulatory Tightening',
    description: 'Government increases compliance requirements and reduces future caps',
    impact: '+15% stricter caps',
    impactValue: 15,
    category: 'Regulatory',
    effects: {
      emissionsCap: -15,
      penaltyRate: 25
    },
    duration: 3,
    probability: 20,
    triggerConditions: {
      minRound: 2,
      complianceRate: 85 // trigger if compliance is too high
    }
  },
  {
    id: 'economic-recession',
    name: 'Economic Recession',
    description: 'Economic downturn reduces industrial activity and emissions but also budgets',
    impact: '-10% emissions, -15% budgets',
    impactValue: -10,
    category: 'Economic',
    effects: {
      companyBudgets: -15,
      allowancePrices: -25
    },
    duration: 2,
    probability: 12,
    triggerConditions: {
      minRound: 2
    }
  },
  {
    id: 'carbon-tax',
    name: 'Carbon Tax Introduction',
    description: 'Additional carbon pricing mechanism increases overall compliance costs',
    impact: '+25% compliance costs',
    impactValue: 25,
    category: 'Regulatory',
    effects: {
      allowancePrices: 30,
      penaltyRate: 50
    },
    duration: 3,
    probability: 18,
    triggerConditions: {
      minRound: 2
    }
  },
  {
    id: 'offset-scandal',
    name: 'Offset Market Scandal',
    description: 'Fraud in offset markets restricts availability and increases scrutiny',
    impact: '+30% offset costs, -50% availability',
    impactValue: 30,
    category: 'Market',
    effects: {
      offsetAvailability: -50
    },
    duration: 2,
    probability: 10,
    triggerConditions: {
      minRound: 2
    }
  },
  {
    id: 'renewable-subsidies',
    name: 'Renewable Energy Subsidies',
    description: 'Government subsidies reduce clean energy costs and abatement expenses',
    impact: '-15% clean energy costs',
    impactValue: -15,
    category: 'Technology',
    effects: {
      abatementCosts: -15,
      companyBudgets: 10
    },
    duration: 3,
    probability: 25,
    triggerConditions: {
      minRound: 1
    }
  },
  {
    id: 'supply-chain-disruption',
    name: 'Supply Chain Disruption',
    description: 'Global supply chain issues increase costs for abatement technologies',
    impact: '+20% abatement costs',
    impactValue: 20,
    category: 'Economic',
    effects: {
      abatementCosts: 20,
      allowancePrices: 15
    },
    duration: 2,
    probability: 15,
    triggerConditions: {
      minRound: 1
    }
  },
  {
    id: 'climate-emergency',
    name: 'Climate Emergency Declaration',
    description: 'Urgent climate action leads to emergency cap reductions and increased penalties',
    impact: '-25% emergency cap reduction',
    impactValue: -25,
    category: 'Environmental',
    effects: {
      emissionsCap: -25,
      penaltyRate: 100,
      allowancePrices: 50
    },
    duration: 2,
    probability: 8,
    triggerConditions: {
      minRound: 3,
      complianceRate: 70
    }
  },
  {
    id: 'international-cooperation',
    name: 'International Climate Cooperation',
    description: 'Global cooperation increases funding and technology sharing for emission reductions',
    impact: '-10% abatement costs, +20% budgets',
    impactValue: -10,
    category: 'Technology',
    effects: {
      abatementCosts: -10,
      companyBudgets: 20
    },
    duration: 3,
    probability: 20,
    triggerConditions: {
      minRound: 2
    }
  },
  {
    id: 'market-volatility',
    name: 'Carbon Market Volatility',
    description: 'Extreme price swings in carbon markets create uncertainty',
    impact: '±40% allowance price volatility',
    impactValue: 40,
    category: 'Market',
    effects: {
      allowancePrices: 40 // This would be randomized between -40% and +40%
    },
    duration: 1,
    probability: 15,
    triggerConditions: {
      minRound: 2,
      avgAllowancePrice: 30
    }
  },
  {
    id: 'green-finance-boom',
    name: 'Green Finance Boom',
    description: 'Massive influx of green investment capital reduces financing costs',
    impact: '+30% sustainability budgets',
    impactValue: 30,
    category: 'Economic',
    effects: {
      companyBudgets: 30,
      abatementCosts: -10
    },
    duration: 2,
    probability: 18,
    triggerConditions: {
      minRound: 2
    }
  },
  {
    id: 'trade-war',
    name: 'Carbon Border Adjustment',
    description: 'Trade tensions lead to carbon border taxes affecting international competitiveness',
    impact: '+15% compliance pressure',
    impactValue: 15,
    category: 'Regulatory',
    effects: {
      penaltyRate: 25,
      allowancePrices: 20
    },
    duration: 3,
    probability: 12,
    triggerConditions: {
      minRound: 2
    }
  }
];

// Helper functions for market events
export const getEventById = (id: string): MarketEvent | undefined => {
  return marketEvents.find(event => event.id === id);
};

export const getEventsByCategory = (category: MarketEvent['category']): MarketEvent[] => {
  return marketEvents.filter(event => event.category === category);
};

export const getAvailableEvents = (currentRound: number, complianceRate?: number, avgAllowancePrice?: number): MarketEvent[] => {
  return marketEvents.filter(event => {
    const conditions = event.triggerConditions;
    if (!conditions) return true;
    
    // Check round conditions
    if (conditions.minRound && currentRound < conditions.minRound) return false;
    if (conditions.maxRound && currentRound > conditions.maxRound) return false;
    
    // Check compliance rate conditions
    if (conditions.complianceRate && complianceRate !== undefined) {
      if (complianceRate > conditions.complianceRate) return false;
    }
    
    // Check allowance price conditions
    if (conditions.avgAllowancePrice && avgAllowancePrice !== undefined) {
      if (avgAllowancePrice < conditions.avgAllowancePrice) return false;
    }
    
    return true;
  });
};

export const calculateEventProbability = (event: MarketEvent, gameState: any): number => {
  let probability = event.probability;
  
  // Adjust probability based on game state
  if (event.category === 'Regulatory' && gameState.complianceRate > 90) {
    probability *= 1.5; // More likely if compliance is too high
  }
  
  if (event.category === 'Economic' && gameState.currentRound > 2) {
    probability *= 1.2; // More likely in later rounds
  }
  
  return Math.min(probability, 100);
};

export const applyEventEffects = (event: MarketEvent, gameState: any): any => {
  const newState = { ...gameState };
  
  // Apply effects based on event
  if (event.effects.abatementCosts) {
    // Modify abatement costs for all companies
    newState.players = newState.players.map((player: any) => ({
      ...player,
      abatementCostModifier: (player.abatementCostModifier || 1) * (1 + event.effects.abatementCosts! / 100)
    }));
  }
  
  if (event.effects.allowancePrices) {
    newState.allowancePriceModifier = (newState.allowancePriceModifier || 1) * (1 + event.effects.allowancePrices / 100);
  }
  
  if (event.effects.emissionsCap) {
    newState.systemCap = Math.floor(newState.systemCap * (1 + event.effects.emissionsCap / 100));
  }
  
  if (event.effects.penaltyRate) {
    newState.settings.penalty = Math.floor(newState.settings.penalty * (1 + event.effects.penaltyRate / 100));
  }
  
  if (event.effects.companyBudgets) {
    newState.players = newState.players.map((player: any) => ({
      ...player,
      budgetModifier: (player.budgetModifier || 1) * (1 + event.effects.companyBudgets! / 100)
    }));
  }
  
  // Track active events
  if (!newState.activeEvents) {
    newState.activeEvents = [];
  }
  
  newState.activeEvents.push({
    ...event,
    startRound: newState.currentRound,
    endRound: newState.currentRound + event.duration
  });
  
  return newState;
};

export const getActiveEvents = (gameState: any): MarketEvent[] => {
  if (!gameState.activeEvents) return [];
  
  return gameState.activeEvents.filter((event: any) => 
    event.endRound >= gameState.currentRound
  );
};

export const removeExpiredEvents = (gameState: any): any => {
  if (!gameState.activeEvents) return gameState;
  
  const newState = { ...gameState };
  newState.activeEvents = gameState.activeEvents.filter((event: any) => 
    event.endRound >= gameState.currentRound
  );
  
  return newState;
};
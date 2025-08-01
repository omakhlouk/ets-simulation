export interface ProductionInfo {
  productType: string;
  annualProduction: number;
  unit: string;
  emissionIntensity: number; // tCO2e per unit
  intensityUnit: string;
}

export interface FinancialInfo {
  revenue: number; // USD millions
  profitMargin: number; // percentage
  operatingCost: number; // USD millions
  ebitda: number; // USD millions
}

export interface CompanyProfile {
  id: string;
  name: string;
  category: 'Power' | 'Transport' | 'Cement' | 'Heavy Industry' | 'Mining' | 'Agriculture';
  emissions: number; // tCO2e
  budget: number; // USD - Changed from "Investment Budget" to "Sustainability Budget"
  abatementOption1: {
    name: string;
    tons: number;
    cost: number;
    costPerTon: number;
  };
  abatementOption2: {
    name: string;
    tons: number;
    cost: number;
    costPerTon: number;
  };
  description: string;
  financials: FinancialInfo;
  production: ProductionInfo;
}

// Enhanced company profiles with financial and production data
export const companyProfiles: CompanyProfile[] = [
  // Power Sector (10 companies)
  {
    id: 'power-1',
    name: 'ThermalGrid Energy Corp',
    category: 'Power',
    emissions: 90000,
    budget: 491200,
    abatementOption1: {
      name: 'Efficiency Upgrades',
      tons: 2200,
      cost: 18010,
      costPerTon: 8
    },
    abatementOption2: {
      name: 'Natural Gas Conversion',
      tons: 1700,
      cost: 34792,
      costPerTon: 20
    },
    description: 'Mid-size thermal power plant with aging coal infrastructure requiring modernization',
    financials: {
      revenue: 285,
      profitMargin: 12,
      operatingCost: 251,
      ebitda: 34
    },
    production: {
      productType: 'Electricity',
      annualProduction: 180000,
      unit: 'MWh',
      emissionIntensity: 0.5,
      intensityUnit: 'tCO₂e/MWh'
    }
  },
  {
    id: 'power-2',
    name: 'MegaWatt Generation Ltd',
    category: 'Power',
    emissions: 109000,
    budget: 594300,
    abatementOption1: {
      name: 'Boiler Optimization',
      tons: 2700,
      cost: 26743,
      costPerTon: 10
    },
    abatementOption2: {
      name: 'Combined Cycle Upgrade',
      tons: 2100,
      cost: 52000,
      costPerTon: 25
    },
    description: 'Large-scale power generation facility serving metropolitan areas',
    financials: {
      revenue: 425,
      profitMargin: 15,
      operatingCost: 361,
      ebitda: 64
    },
    production: {
      productType: 'Electricity',
      annualProduction: 218000,
      unit: 'MWh',
      emissionIntensity: 0.5,
      intensityUnit: 'tCO₂e/MWh'
    }
  },
  {
    id: 'power-3',
    name: 'FusionGrid Industries',
    category: 'Power',
    emissions: 129500,
    budget: 706300,
    abatementOption1: {
      name: 'Heat Recovery Systems',
      tons: 3200,
      cost: 37671,
      costPerTon: 12
    },
    abatementOption2: {
      name: 'Carbon Capture Technology',
      tons: 2500,
      cost: 73577,
      costPerTon: 29
    },
    description: 'Major coal-fired power station exploring advanced emission reduction technologies',
    financials: {
      revenue: 520,
      profitMargin: 11,
      operatingCost: 463,
      ebitda: 57
    },
    production: {
      productType: 'Electricity',
      annualProduction: 259000,
      unit: 'MWh',
      emissionIntensity: 0.5,
      intensityUnit: 'tCO₂e/MWh'
    }
  },
  {
    id: 'power-4',
    name: 'PowerTech Solutions',
    category: 'Power',
    emissions: 129600,
    budget: 706800,
    abatementOption1: {
      name: 'Turbine Modernization',
      tons: 3200,
      cost: 37697,
      costPerTon: 12
    },
    abatementOption2: {
      name: 'Renewable Integration',
      tons: 2500,
      cost: 73627,
      costPerTon: 29
    },
    description: 'Integrated power company transitioning to cleaner generation mix',
    financials: {
      revenue: 485,
      profitMargin: 13,
      operatingCost: 422,
      ebitda: 63
    },
    production: {
      productType: 'Electricity',
      annualProduction: 259200,
      unit: 'MWh',
      emissionIntensity: 0.5,
      intensityUnit: 'tCO₂e/MWh'
    }
  },
  {
    id: 'power-5',
    name: 'CleanEnergy Dynamics',
    category: 'Power',
    emissions: 105500,
    budget: 575300,
    abatementOption1: {
      name: 'Smart Grid Implementation',
      tons: 2600,
      cost: 24928,
      costPerTon: 10
    },
    abatementOption2: {
      name: 'Wind Farm Development',
      tons: 2000,
      cost: 47938,
      costPerTon: 24
    },
    description: 'Progressive utility focusing on grid modernization and renewable integration',
    financials: {
      revenue: 395,
      profitMargin: 14,
      operatingCost: 340,
      ebitda: 55
    },
    production: {
      productType: 'Electricity',
      annualProduction: 211000,
      unit: 'MWh',
      emissionIntensity: 0.5,
      intensityUnit: 'tCO₂e/MWh'
    }
  },
  {
    id: 'power-6',
    name: 'Regional Power Authority',
    category: 'Power',
    emissions: 92500,
    budget: 504300,
    abatementOption1: {
      name: 'Load Management Systems',
      tons: 2300,
      cost: 19333,
      costPerTon: 8
    },
    abatementOption2: {
      name: 'Solar Panel Installation',
      tons: 1800,
      cost: 37825,
      costPerTon: 21
    },
    description: 'Municipal power authority serving diverse regional communities',
    financials: {
      revenue: 315,
      profitMargin: 10,
      operatingCost: 284,
      ebitda: 32
    },
    production: {
      productType: 'Electricity',
      annualProduction: 185000,
      unit: 'MWh',
      emissionIntensity: 0.5,
      intensityUnit: 'tCO₂e/MWh'
    }
  },
  {
    id: 'power-7',
    name: 'EnergyMax Corporation',
    category: 'Power',
    emissions: 116700,
    budget: 636600,
    abatementOption1: {
      name: 'Cogeneration Systems',
      tons: 2900,
      cost: 30769,
      costPerTon: 11
    },
    abatementOption2: {
      name: 'Biomass Co-firing',
      tons: 2200,
      cost: 58355,
      costPerTon: 27
    },
    description: 'Large independent power producer with diverse generation portfolio',
    financials: {
      revenue: 465,
      profitMargin: 12,
      operatingCost: 409,
      ebitda: 56
    },
    production: {
      productType: 'Electricity',
      annualProduction: 233400,
      unit: 'MWh',
      emissionIntensity: 0.5,
      intensityUnit: 'tCO₂e/MWh'
    }
  },
  {
    id: 'power-8',
    name: 'GridTech Energy',
    category: 'Power',
    emissions: 95300,
    budget: 519600,
    abatementOption1: {
      name: 'Demand Response Programs',
      tons: 2300,
      cost: 19920,
      costPerTon: 9
    },
    abatementOption2: {
      name: 'Battery Storage Systems',
      tons: 1800,
      cost: 38974,
      costPerTon: 22
    },
    description: 'Technology-focused utility implementing smart grid solutions',
    financials: {
      revenue: 335,
      profitMargin: 11,
      operatingCost: 298,
      ebitda: 37
    },
    production: {
      productType: 'Electricity',
      annualProduction: 190600,
      unit: 'MWh',
      emissionIntensity: 0.5,
      intensityUnit: 'tCO₂e/MWh'
    }
  },
  {
    id: 'power-9',
    name: 'SteamWorks Power',
    category: 'Power',
    emissions: 98500,
    budget: 537400,
    abatementOption1: {
      name: 'Steam Cycle Optimization',
      tons: 2400,
      cost: 21495,
      costPerTon: 9
    },
    abatementOption2: {
      name: 'Geothermal Integration',
      tons: 1900,
      cost: 42543,
      costPerTon: 22
    },
    description: 'Steam-based power generation facility exploring geothermal opportunities',
    financials: {
      revenue: 355,
      profitMargin: 13,
      operatingCost: 309,
      ebitda: 46
    },
    production: {
      productType: 'Electricity',
      annualProduction: 197000,
      unit: 'MWh',
      emissionIntensity: 0.5,
      intensityUnit: 'tCO₂e/MWh'
    }
  },
  {
    id: 'power-10',
    name: 'ElectroGrid Systems',
    category: 'Power',
    emissions: 108800,
    budget: 593300,
    abatementOption1: {
      name: 'Grid Efficiency Upgrades',
      tons: 2700,
      cost: 26701,
      costPerTon: 10
    },
    abatementOption2: {
      name: 'Hydroelectric Expansion',
      tons: 2100,
      cost: 51918,
      costPerTon: 25
    },
    description: 'Regional grid operator with hydroelectric generation assets',
    financials: {
      revenue: 415,
      profitMargin: 14,
      operatingCost: 357,
      ebitda: 58
    },
    production: {
      productType: 'Electricity',
      annualProduction: 217600,
      unit: 'MWh',
      emissionIntensity: 0.5,
      intensityUnit: 'tCO₂e/MWh'
    }
  },

  // Transport Sector (10 companies)
  {
    id: 'transport-1',
    name: 'MetroTransit Authority',
    category: 'Transport',
    emissions: 55000,
    budget: 439700,
    abatementOption1: {
      name: 'Electric Bus Fleet',
      tons: 1200,
      cost: 22425,
      costPerTon: 19
    },
    abatementOption2: {
      name: 'Biodiesel Conversion',
      tons: 900,
      cost: 39573,
      costPerTon: 44
    },
    description: 'Urban public transportation system serving major metropolitan area',
    financials: {
      revenue: 185,
      profitMargin: 8,
      operatingCost: 170,
      ebitda: 15
    },
    production: {
      productType: 'Passenger Transport',
      annualProduction: 125,
      unit: 'Million passenger-km',
      emissionIntensity: 0.44,
      intensityUnit: 'tCO₂e/1000 passenger-km'
    }
  },
  {
    id: 'transport-2',
    name: 'CityLink Logistics',
    category: 'Transport',
    emissions: 48400,
    budget: 387400,
    abatementOption1: {
      name: 'Route Optimization',
      tons: 1100,
      cost: 18110,
      costPerTon: 16
    },
    abatementOption2: {
      name: 'Hybrid Vehicle Fleet',
      tons: 800,
      cost: 30991,
      costPerTon: 39
    },
    description: 'Regional logistics company specializing in urban delivery services',
    financials: {
      revenue: 165,
      profitMargin: 9,
      operatingCost: 150,
      ebitda: 15
    },
    production: {
      productType: 'Freight Transport',
      annualProduction: 80,
      unit: 'Million tonne-km',
      emissionIntensity: 0.605,
      intensityUnit: 'tCO₂e/1000 tonne-km'
    }
  },
  {
    id: 'transport-3',
    name: 'FreightMaster Corp',
    category: 'Transport',
    emissions: 55400,
    budget: 443100,
    abatementOption1: {
      name: 'Fuel Efficiency Programs',
      tons: 1200,
      cost: 22600,
      costPerTon: 19
    },
    abatementOption2: {
      name: 'Electric Truck Conversion',
      tons: 900,
      cost: 39882,
      costPerTon: 44
    },
    description: 'Long-haul freight transportation with nationwide coverage',
    financials: {
      revenue: 195,
      profitMargin: 10,
      operatingCost: 176,
      ebitda: 20
    },
    production: {
      productType: 'Freight Transport',
      annualProduction: 92,
      unit: 'Million tonne-km',
      emissionIntensity: 0.602,
      intensityUnit: 'tCO₂e/1000 tonne-km'
    }
  },
  {
    id: 'transport-4',
    name: 'RapidTransit Solutions',
    category: 'Transport',
    emissions: 41700,
    budget: 333300,
    abatementOption1: {
      name: 'Modal Shift Programs',
      tons: 900,
      cost: 12750,
      costPerTon: 14
    },
    abatementOption2: {
      name: 'Alternative Fuel Systems',
      tons: 700,
      cost: 23333,
      costPerTon: 33
    },
    description: 'Multi-modal transportation provider focusing on sustainable mobility',
    financials: {
      revenue: 145,
      profitMargin: 7,
      operatingCost: 135,
      ebitda: 10
    },
    production: {
      productType: 'Passenger Transport',
      annualProduction: 95,
      unit: 'Million passenger-km',
      emissionIntensity: 0.439,
      intensityUnit: 'tCO₂e/1000 passenger-km'
    }
  },
  {
    id: 'transport-5',
    name: 'EcoFleet Services',
    category: 'Transport',
    emissions: 41100,
    budget: 329200,
    abatementOption1: {
      name: 'Driver Training Programs',
      tons: 900,
      cost: 12591,
      costPerTon: 14
    },
    abatementOption2: {
      name: 'CNG Vehicle Conversion',
      tons: 700,
      cost: 23042,
      costPerTon: 33
    },
    description: 'Commercial fleet operator implementing green transportation solutions',
    financials: {
      revenue: 135,
      profitMargin: 8,
      operatingCost: 124,
      ebitda: 11
    },
    production: {
      productType: 'Freight Transport',
      annualProduction: 68,
      unit: 'Million tonne-km',
      emissionIntensity: 0.604,
      intensityUnit: 'tCO₂e/1000 tonne-km'
    }
  },
  {
    id: 'transport-6',
    name: 'UrbanMobility Inc',
    category: 'Transport',
    emissions: 47900,
    budget: 382800,
    abatementOption1: {
      name: 'Traffic Flow Optimization',
      tons: 1100,
      cost: 17898,
      costPerTon: 16
    },
    abatementOption2: {
      name: 'Electric Vehicle Infrastructure',
      tons: 800,
      cost: 30627,
      costPerTon: 38
    },
    description: 'Urban mobility solutions provider with integrated transport services',
    financials: {
      revenue: 155,
      profitMargin: 9,
      operatingCost: 141,
      ebitda: 14
    },
    production: {
      productType: 'Passenger Transport',
      annualProduction: 109,
      unit: 'Million passenger-km',
      emissionIntensity: 0.439,
      intensityUnit: 'tCO₂e/1000 passenger-km'
    }
  },
  {
    id: 'transport-7',
    name: 'CargoLink Express',
    category: 'Transport',
    emissions: 51100,
    budget: 408700,
    abatementOption1: {
      name: 'Load Optimization Systems',
      tons: 1100,
      cost: 19106,
      costPerTon: 17
    },
    abatementOption2: {
      name: 'Hydrogen Fuel Cells',
      tons: 800,
      cost: 32695,
      costPerTon: 41
    },
    description: 'Express cargo and freight services with advanced logistics technology',
    financials: {
      revenue: 175,
      profitMargin: 11,
      operatingCost: 156,
      ebitda: 19
    },
    production: {
      productType: 'Freight Transport',
      annualProduction: 85,
      unit: 'Million tonne-km',
      emissionIntensity: 0.601,
      intensityUnit: 'tCO₂e/1000 tonne-km'
    }
  },
  {
    id: 'transport-8',
    name: 'GreenTransport Co',
    category: 'Transport',
    emissions: 42000,
    budget: 336300,
    abatementOption1: {
      name: 'Eco-Driving Training',
      tons: 900,
      cost: 12862,
      costPerTon: 14
    },
    abatementOption2: {
      name: 'Biofuel Integration',
      tons: 700,
      cost: 23538,
      costPerTon: 34
    },
    description: 'Environmentally-focused transport company pioneering clean technologies',
    financials: {
      revenue: 125,
      profitMargin: 8,
      operatingCost: 115,
      ebitda: 10
    },
    production: {
      productType: 'Freight Transport',
      annualProduction: 70,
      unit: 'Million tonne-km',
      emissionIntensity: 0.6,
      intensityUnit: 'tCO₂e/1000 tonne-km'
    }
  },
  {
    id: 'transport-9',
    name: 'FleetMax Operations',
    category: 'Transport',
    emissions: 40300,
    budget: 322600,
    abatementOption1: {
      name: 'Vehicle Maintenance Optimization',
      tons: 900,
      cost: 12340,
      costPerTon: 14
    },
    abatementOption2: {
      name: 'Telematics Systems',
      tons: 700,
      cost: 22582,
      costPerTon: 32
    },
    description: 'Fleet management company optimizing vehicle performance and efficiency',
    financials: {
      revenue: 115,
      profitMargin: 7,
      operatingCost: 107,
      ebitda: 8
    },
    production: {
      productType: 'Freight Transport',
      annualProduction: 67,
      unit: 'Million tonne-km',
      emissionIntensity: 0.601,
      intensityUnit: 'tCO₂e/1000 tonne-km'
    }
  },
  {
    id: 'transport-10',
    name: 'SmartLogistics Ltd',
    category: 'Transport',
    emissions: 42400,
    budget: 339200,
    abatementOption1: {
      name: 'AI Route Planning',
      tons: 900,
      cost: 12974,
      costPerTon: 14
    },
    abatementOption2: {
      name: 'Electric Last-Mile Delivery',
      tons: 700,
      cost: 23743,
      costPerTon: 34
    },
    description: 'Technology-driven logistics provider using AI and automation',
    financials: {
      revenue: 135,
      profitMargin: 9,
      operatingCost: 123,
      ebitda: 12
    },
    production: {
      productType: 'Freight Transport',
      annualProduction: 71,
      unit: 'Million tonne-km',
      emissionIntensity: 0.597,
      intensityUnit: 'tCO₂e/1000 tonne-km'
    }
  },

  // Cement Sector (5 companies)
  {
    id: 'cement-1',
    name: 'BuildStone Industries',
    category: 'Cement',
    emissions: 62700,
    budget: 492400,
    abatementOption1: {
      name: 'Kiln Efficiency Upgrades',
      tons: 1400,
      cost: 37598,
      costPerTon: 27
    },
    abatementOption2: {
      name: 'Alternative Raw Materials',
      tons: 1000,
      cost: 35808,
      costPerTon: 36
    },
    description: 'Regional cement manufacturer focusing on sustainable building materials',
    financials: {
      revenue: 245,
      profitMargin: 16,
      operatingCost: 206,
      ebitda: 39
    },
    production: {
      productType: 'Cement',
      annualProduction: 85,
      unit: 'Thousand tonnes',
      emissionIntensity: 0.738,
      intensityUnit: 'tCO₂e/tonne cement'
    }
  },
  {
    id: 'cement-2',
    name: 'MegaCement Corp',
    category: 'Cement',
    emissions: 83400,
    budget: 655300,
    abatementOption1: {
      name: 'Clinker Substitution',
      tons: 1900,
      cost: 67911,
      costPerTon: 36
    },
    abatementOption2: {
      name: 'Waste Heat Recovery',
      tons: 1300,
      cost: 61954,
      costPerTon: 48
    },
    description: 'Large-scale cement production facility with multiple plant locations',
    financials: {
      revenue: 325,
      profitMargin: 18,
      operatingCost: 267,
      ebitda: 59
    },
    production: {
      productType: 'Cement',
      annualProduction: 113,
      unit: 'Thousand tonnes',
      emissionIntensity: 0.738,
      intensityUnit: 'tCO₂e/tonne cement'
    }
  },
  {
    id: 'cement-3',
    name: 'EcoCement Solutions',
    category: 'Cement',
    emissions: 75300,
    budget: 591400,
    abatementOption1: {
      name: 'Process Optimization',
      tons: 1700,
      cost: 54841,
      costPerTon: 32
    },
    abatementOption2: {
      name: 'Carbon Capture Systems',
      tons: 1200,
      cost: 51615,
      costPerTon: 43
    },
    description: 'Innovative cement producer developing low-carbon concrete solutions',
    financials: {
      revenue: 295,
      profitMargin: 17,
      operatingCost: 245,
      ebitda: 50
    },
    production: {
      productType: 'Cement',
      annualProduction: 102,
      unit: 'Thousand tonnes',
      emissionIntensity: 0.738,
      intensityUnit: 'tCO₂e/tonne cement'
    }
  },
  {
    id: 'cement-4',
    name: 'ConcreteWorks Ltd',
    category: 'Cement',
    emissions: 72600,
    budget: 570700,
    abatementOption1: {
      name: 'Alternative Fuels',
      tons: 1700,
      cost: 52920,
      costPerTon: 31
    },
    abatementOption2: {
      name: 'Energy Recovery Systems',
      tons: 1100,
      cost: 45657,
      costPerTon: 42
    },
    description: 'Integrated concrete and cement manufacturer with regional distribution',
    financials: {
      revenue: 285,
      profitMargin: 15,
      operatingCost: 242,
      ebitda: 43
    },
    production: {
      productType: 'Cement',
      annualProduction: 98,
      unit: 'Thousand tonnes',
      emissionIntensity: 0.741,
      intensityUnit: 'tCO₂e/tonne cement'
    }
  },
  {
    id: 'cement-5',
    name: 'SustainaBuild Materials',
    category: 'Cement',
    emissions: 83300,
    budget: 654100,
    abatementOption1: {
      name: 'Low-Carbon Clinker',
      tons: 1900,
      cost: 67793,
      costPerTon: 36
    },
    abatementOption2: {
      name: 'Renewable Energy Integration',
      tons: 1300,
      cost: 61846,
      costPerTon: 48
    },
    description: 'Sustainable cement producer pioneering carbon-neutral building materials',
    financials: {
      revenue: 315,
      profitMargin: 16,
      operatingCost: 265,
      ebitda: 50
    },
    production: {
      productType: 'Cement',
      annualProduction: 113,
      unit: 'Thousand tonnes',
      emissionIntensity: 0.737,
      intensityUnit: 'tCO₂e/tonne cement'
    }
  },

  // Heavy Industry Sector (5 companies)
  {
    id: 'heavy-1',
    name: 'SteelWorks Manufacturing',
    category: 'Heavy Industry',
    emissions: 86700,
    budget: 650000,
    abatementOption1: {
      name: 'Electric Arc Furnace',
      tons: 1600,
      cost: 51997,
      costPerTon: 32
    },
    abatementOption2: {
      name: 'Hydrogen Steel Production',
      tons: 1200,
      cost: 58497,
      costPerTon: 49
    },
    description: 'Integrated steel production facility exploring hydrogen-based technologies',
    financials: {
      revenue: 485,
      profitMargin: 14,
      operatingCost: 417,
      ebitda: 68
    },
    production: {
      productType: 'Steel',
      annualProduction: 45,
      unit: 'Thousand tonnes',
      emissionIntensity: 1.93,
      intensityUnit: 'tCO₂e/tonne steel'
    }
  },
  {
    id: 'heavy-2',
    name: 'MetalTech Industries',
    category: 'Heavy Industry',
    emissions: 94700,
    budget: 710500,
    abatementOption1: {
      name: 'Smelter Efficiency',
      tons: 1800,
      cost: 63942,
      costPerTon: 36
    },
    abatementOption2: {
      name: 'Renewable Energy Integration',
      tons: 1300,
      cost: 69271,
      costPerTon: 53
    },
    description: 'Heavy metals processing facility implementing clean energy solutions',
    financials: {
      revenue: 525,
      profitMargin: 15,
      operatingCost: 446,
      ebitda: 79
    },
    production: {
      productType: 'Aluminum',
      annualProduction: 52,
      unit: 'Thousand tonnes',
      emissionIntensity: 1.82,
      intensityUnit: 'tCO₂e/tonne aluminum'
    }
  },
  {
    id: 'heavy-3',
    name: 'Industrial Forge Corp',
    category: 'Heavy Industry',
    emissions: 95300,
    budget: 714900,
    abatementOption1: {
      name: 'Process Heat Recovery',
      tons: 1800,
      cost: 64344,
      costPerTon: 36
    },
    abatementOption2: {
      name: 'Advanced Materials Technology',
      tons: 1300,
      cost: 69706,
      costPerTon: 54
    },
    description: 'Advanced manufacturing facility producing high-performance industrial materials',
    financials: {
      revenue: 535,
      profitMargin: 16,
      operatingCost: 449,
      ebitda: 86
    },
    production: {
      productType: 'Specialty Metals',
      annualProduction: 48,
      unit: 'Thousand tonnes',
      emissionIntensity: 1.985,
      intensityUnit: 'tCO₂e/tonne product'
    }
  },
  {
    id: 'heavy-4',
    name: 'ChemProcess Solutions',
    category: 'Heavy Industry',
    emissions: 89700,
    budget: 672600,
    abatementOption1: {
      name: 'Catalyst Optimization',
      tons: 1700,
      cost: 57167,
      costPerTon: 34
    },
    abatementOption2: {
      name: 'Process Integration',
      tons: 1300,
      cost: 65574,
      costPerTon: 50
    },
    description: 'Chemical processing facility with integrated production systems',
    financials: {
      revenue: 465,
      profitMargin: 13,
      operatingCost: 405,
      ebitda: 60
    },
    production: {
      productType: 'Chemicals',
      annualProduction: 125,
      unit: 'Thousand tonnes',
      emissionIntensity: 0.718,
      intensityUnit: 'tCO₂e/tonne chemicals'
    }
  },
  {
    id: 'heavy-5',
    name: 'TitanForge Industries',
    category: 'Heavy Industry',
    emissions: 92700,
    budget: 694900,
    abatementOption1: {
      name: 'Furnace Modernization',
      tons: 1700,
      cost: 59065,
      costPerTon: 35
    },
    abatementOption2: {
      name: 'Waste Heat Utilization',
      tons: 1300,
      cost: 67751,
      costPerTon: 52
    },
    description: 'Heavy industry manufacturer specializing in high-temperature processing',
    financials: {
      revenue: 495,
      profitMargin: 14,
      operatingCost: 426,
      ebitda: 69
    },
    production: {
      productType: 'Industrial Materials',
      annualProduction: 55,
      unit: 'Thousand tonnes',
      emissionIntensity: 1.685,
      intensityUnit: 'tCO₂e/tonne product'
    }
  },

  // Mining Sector (5 companies)
  {
    id: 'mining-1',
    name: 'DeepEarth Extraction',
    category: 'Mining',
    emissions: 71000,
    budget: 650900,
    abatementOption1: {
      name: 'Methane Capture Systems',
      tons: 1200,
      cost: 71004,
      costPerTon: 59
    },
    abatementOption2: {
      name: 'Electrified Mining Equipment',
      tons: 900,
      cost: 69229,
      costPerTon: 77
    },
    description: 'Underground mining operation implementing advanced emission control technologies',
    financials: {
      revenue: 385,
      profitMargin: 22,
      operatingCost: 300,
      ebitda: 85
    },
    production: {
      productType: 'Coal',
      annualProduction: 2.5,
      unit: 'Million tonnes',
      emissionIntensity: 28.4,
      intensityUnit: 'tCO₂e/1000 tonnes coal'
    }
  },
  {
    id: 'mining-2',
    name: 'MineralTech Operations',
    category: 'Mining',
    emissions: 66100,
    budget: 605500,
    abatementOption1: {
      name: 'Ventilation Optimization',
      tons: 1100,
      cost: 60549,
      costPerTon: 55
    },
    abatementOption2: {
      name: 'Renewable Power Systems',
      tons: 800,
      cost: 57246,
      costPerTon: 72
    },
    description: 'Open-pit mining facility transitioning to renewable energy sources',
    financials: {
      revenue: 355,
      profitMargin: 20,
      operatingCost: 284,
      ebitda: 71
    },
    production: {
      productType: 'Iron Ore',
      annualProduction: 3.2,
      unit: 'Million tonnes',
      emissionIntensity: 20.7,
      intensityUnit: 'tCO₂e/1000 tonnes ore'
    }
  },
  {
    id: 'mining-3',
    name: 'CopperCrest Mining',
    category: 'Mining',
    emissions: 62500,
    budget: 572600,
    abatementOption1: {
      name: 'Processing Efficiency',
      tons: 1000,
      cost: 52050,
      costPerTon: 52
    },
    abatementOption2: {
      name: 'Solar Power Integration',
      tons: 800,
      cost: 54132,
      costPerTon: 68
    },
    description: 'Copper mining and processing operation with integrated smelting facilities',
    financials: {
      revenue: 325,
      profitMargin: 18,
      operatingCost: 267,
      ebitda: 59
    },
    production: {
      productType: 'Copper',
      annualProduction: 185,
      unit: 'Thousand tonnes',
      emissionIntensity: 0.338,
      intensityUnit: 'tCO₂e/tonne copper'
    }
  },
  {
    id: 'mining-4',
    name: 'GoldRush Extractors',
    category: 'Mining',
    emissions: 51600,
    budget: 472600,
    abatementOption1: {
      name: 'Cyanide-Free Processing',
      tons: 900,
      cost: 38664,
      costPerTon: 43
    },
    abatementOption2: {
      name: 'Hybrid Power Systems',
      tons: 600,
      cost: 33509,
      costPerTon: 56
    },
    description: 'Gold extraction facility implementing environmentally-friendly processing methods',
    financials: {
      revenue: 285,
      profitMargin: 25,
      operatingCost: 214,
      ebitda: 71
    },
    production: {
      productType: 'Gold',
      annualProduction: 12.5,
      unit: 'Tonnes',
      emissionIntensity: 4.128,
      intensityUnit: 'tCO₂e/kg gold'
    }
  },
  {
    id: 'mining-5',
    name: 'QuarryStone Industries',
    category: 'Mining',
    emissions: 60100,
    budget: 550800,
    abatementOption1: {
      name: 'Electric Crushers',
      tons: 1000,
      cost: 50073,
      costPerTon: 50
    },
    abatementOption2: {
      name: 'Conveyor Optimization',
      tons: 800,
      cost: 52076,
      costPerTon: 65
    },
    description: 'Aggregate and stone quarry operation serving construction industry',
    financials: {
      revenue: 295,
      profitMargin: 16,
      operatingCost: 248,
      ebitda: 47
    },
    production: {
      productType: 'Aggregates',
      annualProduction: 4.8,
      unit: 'Million tonnes',
      emissionIntensity: 12.5,
      intensityUnit: 'tCO₂e/1000 tonnes aggregates'
    }
  },

  // Agriculture Sector (5 companies)
  {
    id: 'agriculture-1',
    name: 'AgriCycle Enterprises',
    category: 'Agriculture',
    emissions: 31700,
    budget: 316900,
    abatementOption1: {
      name: 'Manure Management Systems',
      tons: 500,
      cost: 29047,
      costPerTon: 58
    },
    abatementOption2: {
      name: 'Precision Agriculture Technology',
      tons: 400,
      cost: 25350,
      costPerTon: 63
    },
    description: 'Large-scale agricultural operation implementing sustainable farming practices',
    financials: {
      revenue: 185,
      profitMargin: 12,
      operatingCost: 163,
      ebitda: 22
    },
    production: {
      productType: 'Livestock Products',
      annualProduction: 25000,
      unit: 'Head of cattle',
      emissionIntensity: 1.268,
      intensityUnit: 'tCO₂e/head cattle'
    }
  },
  {
    id: 'agriculture-2',
    name: 'GreenFarm Solutions',
    category: 'Agriculture',
    emissions: 24700,
    budget: 247300,
    abatementOption1: {
      name: 'Soil Carbon Sequestration',
      tons: 400,
      cost: 18135,
      costPerTon: 45
    },
    abatementOption2: {
      name: 'Methane Reduction Programs',
      tons: 300,
      cost: 14838,
      costPerTon: 49
    },
    description: 'Sustainable agriculture company focusing on carbon sequestration and emission reduction',
    financials: {
      revenue: 145,
      profitMargin: 10,
      operatingCost: 131,
      ebitda: 15
    },
    production: {
      productType: 'Dairy Products',
      annualProduction: 18500,
      unit: 'Head of dairy cattle',
      emissionIntensity: 1.335,
      intensityUnit: 'tCO₂e/head cattle'
    }
  },
  {
    id: 'agriculture-3',
    name: 'CropMax Farming',
    category: 'Agriculture',
    emissions: 34400,
    budget: 344400,
    abatementOption1: {
      name: 'No-Till Farming',
      tons: 600,
      cost: 37882,
      costPerTon: 63
    },
    abatementOption2: {
      name: 'Cover Crop Programs',
      tons: 400,
      cost: 27550,
      costPerTon: 69
    },
    description: 'Large-scale crop production facility implementing regenerative agriculture practices',
    financials: {
      revenue: 195,
      profitMargin: 11,
      operatingCost: 174,
      ebitda: 21
    },
    production: {
      productType: 'Grain Crops',
      annualProduction: 85000,
      unit: 'Tonnes grain',
      emissionIntensity: 0.405,
      intensityUnit: 'tCO₂e/tonne grain'
    }
  },
  {
    id: 'agriculture-4',
    name: 'LivestockPro Operations',
    category: 'Agriculture',
    emissions: 32400,
    budget: 324200,
    abatementOption1: {
      name: 'Feed Optimization',
      tons: 500,
      cost: 29715,
      costPerTon: 59
    },
    abatementOption2: {
      name: 'Biogas Digesters',
      tons: 400,
      cost: 25933,
      costPerTon: 65
    },
    description: 'Integrated livestock operation with advanced waste management systems',
    financials: {
      revenue: 175,
      profitMargin: 13,
      operatingCost: 152,
      ebitda: 23
    },
    production: {
      productType: 'Livestock Products',
      annualProduction: 24500,
      unit: 'Head of cattle',
      emissionIntensity: 1.322,
      intensityUnit: 'tCO₂e/head cattle'
    }
  },
  {
    id: 'agriculture-5',
    name: 'SustainHarvest Co',
    category: 'Agriculture',
    emissions: 24800,
    budget: 247800,
    abatementOption1: {
      name: 'Organic Fertilizer Systems',
      tons: 400,
      cost: 18169,
      costPerTon: 45
    },
    abatementOption2: {
      name: 'Agroforestry Programs',
      tons: 300,
      cost: 14865,
      costPerTon: 50
    },
    description: 'Sustainable farming operation specializing in organic and regenerative practices',
    financials: {
      revenue: 135,
      profitMargin: 9,
      operatingCost: 123,
      ebitda: 12
    },
    production: {
      productType: 'Organic Crops',
      annualProduction: 65000,
      unit: 'Tonnes crops',
      emissionIntensity: 0.382,
      intensityUnit: 'tCO₂e/tonne crops'
    }
  }
];

export const getCategorizedProfiles = () => {
  const categories = ['Power', 'Transport', 'Cement', 'Heavy Industry', 'Mining', 'Agriculture'] as const;
  return categories.reduce((acc, category) => {
    acc[category] = companyProfiles.filter(profile => profile.category === category);
    return acc;
  }, {} as Record<typeof categories[number], CompanyProfile[]>);
};

export const getProfileById = (id: string): CompanyProfile | undefined => {
  return companyProfiles.find(profile => profile.id === id);
};

// Get profiles filtered by selected sectors
export const getProfilesBySectors = (selectedSectors: string[]): CompanyProfile[] => {
  if (selectedSectors.length === 0) return companyProfiles;
  return companyProfiles.filter(profile => selectedSectors.includes(profile.category));
};

// Sector distribution for balanced assignment
export const getSectorDistribution = () => {
  const categorized = getCategorizedProfiles();
  return {
    'Power': categorized.Power.length,
    'Transport': categorized.Transport.length,
    'Cement': categorized.Cement.length,
    'Heavy Industry': categorized['Heavy Industry'].length,
    'Mining': categorized.Mining.length,
    'Agriculture': categorized.Agriculture.length
  };
};

// Get balanced company selection for session assignment
export const getBalancedCompanySelection = (totalPlayers: number, selectedSectors?: string[]): CompanyProfile[] => {
  const availableProfiles = selectedSectors && selectedSectors.length > 0 
    ? getProfilesBySectors(selectedSectors)
    : companyProfiles;
  
  const categorized = selectedSectors && selectedSectors.length > 0
    ? selectedSectors.reduce((acc, sector) => {
        acc[sector] = companyProfiles.filter(p => p.category === sector);
        return acc;
      }, {} as Record<string, CompanyProfile[]>)
    : getCategorizedProfiles();
  
  const selected: CompanyProfile[] = [];
  const sectors = Object.keys(categorized);
  let sectorIndex = 0;
  
  for (let i = 0; i < totalPlayers && selected.length < availableProfiles.length; i++) {
    const sector = sectors[sectorIndex % sectors.length];
    const availableInSector = categorized[sector].filter(
      company => !selected.find(s => s.id === company.id)
    );
    
    if (availableInSector.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableInSector.length);
      selected.push(availableInSector[randomIndex]);
    }
    
    sectorIndex++;
  }
  
  return selected;
};

// Calculate total emissions from production data (for verification)
export const calculateEmissionsFromProduction = (profile: CompanyProfile): number => {
  return Math.round(profile.production.annualProduction * profile.production.emissionIntensity);
};
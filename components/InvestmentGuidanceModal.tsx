'use client';
import { useState } from 'react';
import { X, AlertTriangle, TrendingUp, DollarSign, Target, Lightbulb, Calculator } from 'lucide-react';
import { CompanyProfile } from '@/data/companyProfiles';

interface InvestmentGuidanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: CompanyProfile;
  currentBudget: number;
  systemCap: number;
  reservePrice: number;
  currentRound: number;
  totalRounds: number;
}

export default function InvestmentGuidanceModal({
  isOpen,
  onClose,
  profile,
  currentBudget,
  systemCap,
  reservePrice,
  currentRound,
  totalRounds
}: InvestmentGuidanceModalProps) {
  const [selectedOption, setSelectedOption] = useState<'option1' | 'option2' | 'both' | 'none'>('none');

  if (!isOpen) return null;

  // Calculate potential scenarios
  const calculateScenario = (option: 'option1' | 'option2' | 'both' | 'none') => {
    let abatementCost = 0;
    let emissionReduction = 0;
    
    if (option === 'option1') {
      abatementCost = profile.abatementOption1.cost;
      emissionReduction = profile.abatementOption1.tons;
    } else if (option === 'option2') {
      abatementCost = profile.abatementOption2.cost;
      emissionReduction = profile.abatementOption2.tons;
    } else if (option === 'both') {
      abatementCost = profile.abatementOption1.cost + profile.abatementOption2.cost;
      emissionReduction = profile.abatementOption1.tons + profile.abatementOption2.tons;
    }

    const netEmissions = profile.emissions - emissionReduction;
    const remainingBudget = currentBudget - abatementCost;
    const allowancesNeeded = Math.max(0, netEmissions);
    const allowanceCost = allowancesNeeded * reservePrice;
    const totalCost = abatementCost + allowanceCost;
    const costPerTon = totalCost / profile.emissions;
    
    // Calculate budget constraint
    const canAffordAllowances = remainingBudget >= allowanceCost;
    const shortfall = canAffordAllowances ? 0 : allowanceCost - remainingBudget;
    
    return {
      abatementCost,
      emissionReduction,
      netEmissions,
      remainingBudget,
      allowancesNeeded,
      allowanceCost,
      totalCost,
      costPerTon,
      canAffordAllowances,
      shortfall,
      abatementPercentage: (emissionReduction / profile.emissions) * 100,
      budgetUtilization: (abatementCost / currentBudget) * 100
    };
  };

  const scenarios = {
    none: calculateScenario('none'),
    option1: calculateScenario('option1'),
    option2: calculateScenario('option2'),
    both: calculateScenario('both')
  };

  const getRecommendation = () => {
    const validScenarios = Object.entries(scenarios).filter(([_, scenario]) => 
      scenario.canAffordAllowances && scenario.abatementCost <= currentBudget
    );

    if (validScenarios.length === 0) {
      return {
        option: 'none',
        reason: 'Insufficient budget for any abatement option. Consider purchasing offsets or seeking additional funding.',
        risk: 'high'
      };
    }

    // Find the most cost-effective option
    const bestOption = validScenarios.reduce((best, current) => {
      const [bestKey, bestScenario] = best;
      const [currentKey, currentScenario] = current;
      
      return currentScenario.costPerTon < bestScenario.costPerTon ? current : best;
    });

    const [optionKey, scenario] = bestOption;
    
    return {
      option: optionKey,
      reason: `Most cost-effective at $${scenario.costPerTon.toFixed(2)}/tCO₂e. Reduces emissions by ${scenario.abatementPercentage.toFixed(1)}%.`,
      risk: scenario.shortfall > 0 ? 'high' : scenario.remainingBudget < currentBudget * 0.2 ? 'medium' : 'low'
    };
  };

  const recommendation = getRecommendation();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Investment Strategy Guidance</h2>
              <p className="text-sm text-gray-600">{profile.name} - Round {currentRound}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Current Situation */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Your Current Situation
            </h3>
            <div className="grid md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-blue-600">Annual Emissions:</p>
                <p className="font-bold text-blue-800">{profile.emissions.toLocaleString()} tCO₂e</p>
              </div>
              <div>
                <p className="text-blue-600">Sustainability Budget:</p>
                <p className="font-bold text-blue-800">${currentBudget.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-blue-600">Allowance Price:</p>
                <p className="font-bold text-blue-800">${reservePrice}/tCO₂e</p>
              </div>
              <div>
                <p className="text-blue-600">Round:</p>
                <p className="font-bold text-blue-800">{currentRound} of {totalRounds}</p>
              </div>
            </div>
          </div>

          {/* Strategy Comparison */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
              <Calculator className="w-5 h-5 mr-2" />
              Investment Strategy Comparison
            </h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(scenarios).map(([key, scenario]) => (
                <div
                  key={key}
                  onClick={() => setSelectedOption(key as any)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedOption === key
                      ? 'border-emerald-500 bg-emerald-50'
                      : scenario.canAffordAllowances && scenario.abatementCost <= currentBudget
                      ? 'border-gray-200 bg-white hover:border-emerald-300'
                      : 'border-red-200 bg-red-50 opacity-75'
                  }`}
                >
                  <h4 className="font-medium text-gray-800 mb-2">
                    {key === 'none' ? 'No Investment' :
                     key === 'option1' ? profile.abatementOption1.name :
                     key === 'option2' ? profile.abatementOption2.name :
                     'Both Options'}
                  </h4>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span>Abatement Cost:</span>
                      <span className="font-medium">${scenario.abatementCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Emission Reduction:</span>
                      <span className="font-medium text-green-600">-{scenario.emissionReduction.toLocaleString()} tCO₂e</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Net Emissions:</span>
                      <span className="font-medium">{scenario.netEmissions.toLocaleString()} tCO₂e</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Allowances Needed:</span>
                      <span className="font-medium">{scenario.allowancesNeeded.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Allowance Cost:</span>
                      <span className="font-medium">${scenario.allowanceCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span>Total Cost:</span>
                      <span className="font-bold">${scenario.totalCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cost per tCO₂e:</span>
                      <span className="font-bold">${scenario.costPerTon.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Remaining Budget:</span>
                      <span className={`font-medium ${scenario.remainingBudget < 0 ? 'text-red-600' : 'text-green-600'}`}>
                        ${scenario.remainingBudget.toLocaleString()}
                      </span>
                    </div>
                    
                    {scenario.shortfall > 0 && (
                      <div className="bg-red-100 rounded p-2 mt-2">
                        <p className="text-red-700 text-xs font-medium">
                          ⚠ Budget shortfall: ${scenario.shortfall.toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendation */}
          <div className={`rounded-xl p-4 border-2 ${
            recommendation.risk === 'low' ? 'border-green-300 bg-green-50' :
            recommendation.risk === 'medium' ? 'border-yellow-300 bg-yellow-50' :
            'border-red-300 bg-red-50'
          }`}>
            <h3 className={`font-semibold mb-2 flex items-center ${
              recommendation.risk === 'low' ? 'text-green-800' :
              recommendation.risk === 'medium' ? 'text-yellow-800' :
              'text-red-800'
            }`}>
              <TrendingUp className="w-5 h-5 mr-2" />
              Recommended Strategy: {recommendation.option === 'none' ? 'No Investment' :
                                   recommendation.option === 'option1' ? profile.abatementOption1.name :
                                   recommendation.option === 'option2' ? profile.abatementOption2.name :
                                   'Both Options'}
            </h3>
            <p className={`text-sm ${
              recommendation.risk === 'low' ? 'text-green-700' :
              recommendation.risk === 'medium' ? 'text-yellow-700' :
              'text-red-700'
            }`}>
              {recommendation.reason}
            </p>
          </div>

          {/* Strategic Considerations */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Strategic Considerations
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Future Constraints</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Caps will tighten in future rounds</li>
                  <li>• Allowance prices may increase</li>
                  <li>• Early abatement builds competitive advantage</li>
                  <li>• Banking allows saving allowances for later</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Budget Management</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Reserve budget for unexpected costs</li>
                  <li>• Consider offset purchases as backup</li>
                  <li>• Monitor market prices for opportunities</li>
                  <li>• Balance short-term vs long-term investments</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Value Comparison */}
          <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
            <h3 className="font-semibold text-emerald-800 mb-3 flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Value for Money Analysis
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-emerald-800 mb-2">Abatement Options</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>{profile.abatementOption1.name}:</span>
                    <span className="font-medium">${profile.abatementOption1.costPerTon}/tCO₂e</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{profile.abatementOption2.name}:</span>
                    <span className="font-medium">${profile.abatementOption2.costPerTon}/tCO₂e</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span>Allowance Price:</span>
                    <span className="font-medium">${reservePrice}/tCO₂e</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Offset Price (est.):</span>
                    <span className="font-medium">${(reservePrice * 0.8).toFixed(0)}/tCO₂e</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-emerald-800 mb-2">Relative Value</h4>
                <div className="space-y-2">
                  <div className="text-xs">
                    <p><strong>% of Total Emissions:</strong></p>
                    <p>Option 1: {((profile.abatementOption1.tons / profile.emissions) * 100).toFixed(1)}%</p>
                    <p>Option 2: {((profile.abatementOption2.tons / profile.emissions) * 100).toFixed(1)}%</p>
                  </div>
                  <div className="text-xs">
                    <p><strong>% of Total Budget:</strong></p>
                    <p>Option 1: {((profile.abatementOption1.cost / currentBudget) * 100).toFixed(1)}%</p>
                    <p>Option 2: {((profile.abatementOption2.cost / currentBudget) * 100).toFixed(1)}%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
'use client';
import { CompanyProfile } from '@/data/companyProfiles';
import { Building2, DollarSign, Zap, TrendingUp, BarChart3, Factory } from 'lucide-react';

interface CompanyCardProps {
  profile: CompanyProfile;
  showFinancials?: boolean;
  showProduction?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function CompanyCard({ 
  profile, 
  showFinancials = false, 
  showProduction = false,
  isSelected = false,
  onClick,
  className = ''
}: CompanyCardProps) {
  const getCategoryColor = (category: string) => {
    const colors = {
      'Power': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'Transport': 'bg-blue-100 text-blue-800 border-blue-300',
      'Cement': 'bg-gray-100 text-gray-800 border-gray-300',
      'Heavy Industry': 'bg-red-100 text-red-800 border-red-300',
      'Mining': 'bg-orange-100 text-orange-800 border-orange-300',
      'Agriculture': 'bg-green-100 text-green-800 border-green-300'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount.toLocaleString()}`;
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl shadow-xl p-6 transition-all duration-300 hover:shadow-2xl border-2 ${
        isSelected 
          ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500 ring-opacity-20' 
          : 'border-gray-200 hover:border-emerald-300'
      } ${onClick ? 'cursor-pointer hover:scale-105' : ''} ${className}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {profile.name}
          </h3>
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(profile.category)}`}>
            {profile.category}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Building2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
          {isSelected && (
            <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {profile.description}
      </p>

      {/* Key Metrics */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 flex items-center">
            <Factory className="w-4 h-4 mr-1 text-gray-500" />
            Annual Emissions
          </span>
          <span className="font-semibold text-gray-800">{profile.emissions.toLocaleString()} tCO₂e</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 flex items-center">
            <DollarSign className="w-4 h-4 mr-1 text-emerald-500" />
            Sustainability Budget
          </span>
          <span className="font-semibold text-emerald-600">
            {formatCurrency(profile.budget)}
          </span>
        </div>
      </div>

      {/* Abatement Options */}
      <div className="border-t border-gray-200 pt-4">
        <h4 className="text-sm font-medium text-gray-800 mb-3 flex items-center">
          <Zap className="w-4 h-4 mr-1 text-yellow-500" />
          Abatement Options
        </h4>
        <div className="space-y-3">
          <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-gray-800">{profile.abatementOption1.name}</span>
              <span className="text-xs text-blue-600">
                ${profile.abatementOption1.costPerTon}/tCO₂e
              </span>
            </div>
            <div className="flex justify-between text-xs text-gray-600">
              <span>{profile.abatementOption1.tons.toLocaleString()} tCO₂e reduction</span>
              <span>{formatCurrency(profile.abatementOption1.cost)} total</span>
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-gray-800">{profile.abatementOption2.name}</span>
              <span className="text-xs text-blue-600">
                ${profile.abatementOption2.costPerTon}/tCO₂e
              </span>
            </div>
            <div className="flex justify-between text-xs text-gray-600">
              <span>{profile.abatementOption2.tons.toLocaleString()} tCO₂e reduction</span>
              <span>{formatCurrency(profile.abatementOption2.cost)} total</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { CurrencyStrength } from '../types';
import { TrendingUp, Info, ChevronDown, ChevronUp, Minus, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

interface CurrencyStrengthChartProps {
  strengths: CurrencyStrength[];
}

export function CurrencyStrengthChart({ strengths }: CurrencyStrengthChartProps) {
  const sortedStrengths = [...strengths].sort((a, b) => b.strength - a.strength);
  const strongest = sortedStrengths[0];
  const weakest = sortedStrengths[sortedStrengths.length - 1];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-800">Force des Devises</h2>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <ArrowUpCircle className="w-5 h-5 text-green-600" />
            <h3 className="font-medium text-green-800">Plus forte</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-green-700">{strongest.currency}</span>
            <span className="text-sm text-green-600">
              ({(strongest.strength * 100).toFixed(1)}%)
            </span>
          </div>
        </div>

        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <ArrowDownCircle className="w-5 h-5 text-red-600" />
            <h3 className="font-medium text-red-800">Plus faible</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-red-700">{weakest.currency}</span>
            <span className="text-sm text-red-600">
              ({(weakest.strength * 100).toFixed(1)}%)
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {strengths.map((currency) => (
          <div key={currency.currency} className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">{currency.currency}</span>
                {currency.sentiment === 'bullish' && <ChevronUp className="w-4 h-4 text-green-600" />}
                {currency.sentiment === 'bearish' && <ChevronDown className="w-4 h-4 text-red-600" />}
                {currency.sentiment === 'neutral' && <Minus className="w-4 h-4 text-gray-600" />}
              </div>
              <span className={`text-sm font-medium ${
                currency.sentiment === 'bullish' ? 'text-green-600' :
                currency.sentiment === 'bearish' ? 'text-red-600' :
                'text-gray-600'
              }`}>
                {currency.sentiment === 'bullish' ? 'HAUSSIER' :
                 currency.sentiment === 'bearish' ? 'BAISSIER' :
                 'NEUTRE'}
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${
                  currency.sentiment === 'bullish' ? 'bg-green-600' :
                  currency.sentiment === 'bearish' ? 'bg-red-600' :
                  'bg-gray-600'
                }`}
                style={{ width: `${Math.abs(currency.strength * 100)}%` }}
              ></div>
            </div>

            <div className="mt-2 text-sm text-gray-600 bg-gray-50 rounded-md p-3">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <p className="leading-relaxed">{currency.rationale}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
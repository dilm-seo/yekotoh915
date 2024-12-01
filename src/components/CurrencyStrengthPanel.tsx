import React from 'react';
import { CurrencyStrength } from '../types';
import { TrendingUp, ArrowUpCircle, ArrowDownCircle, Info } from 'lucide-react';

interface CurrencyStrengthPanelProps {
  strengths: CurrencyStrength[];
}

export function CurrencyStrengthPanel({ strengths }: CurrencyStrengthPanelProps) {
  const sortedStrengths = [...strengths].sort((a, b) => b.strength - a.strength);
  const strongest = sortedStrengths[0];
  const weakest = sortedStrengths[sortedStrengths.length - 1];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-800">Force Relative des Devises</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <ArrowUpCircle className="w-5 h-5 text-green-600" />
            <h3 className="font-medium text-green-800">Devise la Plus Forte</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-green-700">{strongest.currency}</span>
            <span className="text-sm text-green-600">
              (Force: {(strongest.strength * 100).toFixed(1)}%)
            </span>
          </div>
          <p className="mt-2 text-sm text-green-700">{strongest.rationale}</p>
        </div>

        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <ArrowDownCircle className="w-5 h-5 text-red-600" />
            <h3 className="font-medium text-red-800">Devise la Plus Faible</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-red-700">{weakest.currency}</span>
            <span className="text-sm text-red-600">
              (Force: {(weakest.strength * 100).toFixed(1)}%)
            </span>
          </div>
          <p className="mt-2 text-sm text-red-700">{weakest.rationale}</p>
        </div>
      </div>

      <div className="space-y-6">
        {sortedStrengths.map((currency) => (
          <div key={currency.currency} className="border-b border-gray-100 pb-4 last:border-0">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">{currency.currency}</span>
                <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                  currency.sentiment === 'bullish' ? 'bg-green-100 text-green-800' :
                  currency.sentiment === 'bearish' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {currency.sentiment === 'bullish' ? 'HAUSSIER' :
                   currency.sentiment === 'bearish' ? 'BAISSIER' :
                   'NEUTRE'}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-600">
                Force: {(currency.strength * 100).toFixed(1)}%
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
              <div
                className={`h-2.5 rounded-full ${
                  currency.sentiment === 'bullish' ? 'bg-green-600' :
                  currency.sentiment === 'bearish' ? 'bg-red-600' :
                  'bg-gray-600'
                }`}
                style={{ width: `${Math.abs(currency.strength * 100)}%` }}
              ></div>
            </div>

            <div className="flex items-start gap-2 bg-gray-50 rounded-md p-3">
              <Info className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-600 leading-relaxed">{currency.rationale}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
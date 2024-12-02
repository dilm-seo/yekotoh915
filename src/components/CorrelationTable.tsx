import React from 'react';
import { Correlation } from '../types';
import { GitCompare } from 'lucide-react';

interface CorrelationTableProps {
  correlations: Correlation[];
}

export function CorrelationTable({ correlations }: CorrelationTableProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500/20 blur-lg rounded-full"></div>
          <GitCompare className="w-6 h-6 text-blue-400 relative" />
        </div>
        <h2 className="text-xl font-semibold text-gray-100">Corrélations</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700/50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Paire 1
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Paire 2
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Corrélation
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Recommandation
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700/30">
            {correlations.map((correlation, index) => (
              <tr key={index} className="hover:bg-gray-800/30 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-gray-100">
                  {correlation.pair1}
                </td>
                <td className="px-6 py-4 text-sm text-gray-300">
                  {correlation.pair2}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-700/50 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500/50 to-blue-400"
                        style={{ width: `${Math.abs(correlation.strength * 100)}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-400">
                      {(correlation.strength * 100).toFixed(1)}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-300">
                  {correlation.recommendation}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
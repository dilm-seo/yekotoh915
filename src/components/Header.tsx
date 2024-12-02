import React from 'react';
import { TrendingUp, BarChart2, Globe } from 'lucide-react';

export function Header() {
  return (
    <header className="glass-panel border-b border-gray-700/50">
      <div className="max-w-8xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"></div>
              <TrendingUp className="w-8 h-8 text-blue-400 relative" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Forex Vision AI
              </h1>
              <p className="text-sm text-gray-400">Analyse en temps réel par Intelligence Artificielle</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2 text-gray-400">
              <BarChart2 className="w-5 h-5" />
              <span className="text-sm">Analyse temps réel</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Globe className="w-5 h-5" />
              <span className="text-sm">Couverture mondiale</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
import React from 'react';
import { TrendingUp } from 'lucide-react';

export function Preloader() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 z-50 flex items-center justify-center">
      <div className="relative">
        <div className="absolute inset-0 bg-blue-500/30 blur-3xl rounded-full animate-pulse"></div>
        <div className="relative flex flex-col items-center">
          <TrendingUp className="w-16 h-16 text-blue-400 animate-bounce" />
          <h1 className="mt-8 text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Forex Vision AI
          </h1>
          <div className="mt-8 flex gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse"></div>
            <div className="w-3 h-3 rounded-full bg-purple-400 animate-pulse delay-150"></div>
            <div className="w-3 h-3 rounded-full bg-pink-400 animate-pulse delay-300"></div>
          </div>
          <p className="mt-4 text-gray-400 text-sm">Chargement de l'application...</p>
        </div>
      </div>
    </div>
  );
}
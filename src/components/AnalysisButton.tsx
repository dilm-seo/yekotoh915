import React from 'react';
import { Play } from 'lucide-react';

interface AnalysisButtonProps {
  onAnalyze: () => void;
  isLoading: boolean;
  disabled: boolean;
}

export function AnalysisButton({ onAnalyze, isLoading, disabled }: AnalysisButtonProps) {
  return (
    <button
      onClick={onAnalyze}
      disabled={disabled || isLoading}
      className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-md text-white font-medium transition-colors ${
        disabled || isLoading
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-green-600 hover:bg-green-700'
      }`}
    >
      <Play className="w-4 h-4" />
      {isLoading ? 'Analyse en cours...' : 'Démarrer l\'analyse'}
    </button>
  );
}
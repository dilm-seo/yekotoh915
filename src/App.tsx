import React from 'react';
import { useQuery } from 'react-query';
import { Settings } from './types';
import { SettingsPanel } from './components/SettingsPanel';
import { NewsFeed } from './components/NewsFeed';
import { CurrencyStrengthPanel } from './components/CurrencyStrengthPanel';
import { CorrelationTable } from './components/CorrelationTable';
import { AnalysisButton } from './components/AnalysisButton';
import { fetchForexNews } from './services/api';
import { AlertCircle } from 'lucide-react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useAnalysis } from './hooks/useAnalysis';

function App() {
  const [settings, setSettings] = useLocalStorage<Settings>('forex-settings', {
    apiKey: '',
    model: 'gpt-4-turbo-preview',
  });

  const { 
    data: news = [], 
    isLoading: isLoadingNews, 
    error: newsError,
    refetch: refetchNews
  } = useQuery(
    'forexNews',
    fetchForexNews,
    { 
      refetchInterval: 300000,
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      onError: (error) => console.error('Error fetching news:', error)
    }
  );

  const {
    analysis,
    newsAnalysis,
    strengths,
    isLoading: isAnalyzing,
    error: analysisError,
    startAnalysis,
    isReady
  } = useAnalysis(news, settings);

  const error = newsError || analysisError;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Analyse Forex Live
        </h1>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {error instanceof Error ? error.message : 'Une erreur est survenue'}
                </p>
                <button
                  onClick={() => refetchNews()}
                  className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
                >
                  Réessayer
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <SettingsPanel
              settings={settings}
              onSettingsChange={setSettings}
            />
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <AnalysisButton
                onAnalyze={startAnalysis}
                isLoading={isAnalyzing}
                disabled={!isReady}
              />
            </div>
            {strengths && strengths.length > 0 && (
              <CurrencyStrengthPanel
                strengths={strengths}
              />
            )}
          </div>

          <div className="lg:col-span-2">
            <div className="space-y-8">
              <NewsFeed
                news={news}
                analysis={newsAnalysis}
                isLoading={isLoadingNews}
              />
              
              {analysis?.correlations.length > 0 && (
                <CorrelationTable
                  correlations={analysis.correlations}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
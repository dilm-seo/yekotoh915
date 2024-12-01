import React from 'react';
import { NewsItem, NewsAnalysis } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Newspaper, ExternalLink, AlertTriangle, AlertCircle, AlertOctagon } from 'lucide-react';

interface NewsFeedProps {
  news: NewsItem[];
  analysis?: NewsAnalysis;
  isLoading: boolean;
}

export function NewsFeed({ news, analysis, isLoading }: NewsFeedProps) {
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-gray-100 h-24 rounded-lg"></div>
        ))}
      </div>
    );
  }

  const renderHighImpactNews = () => {
    if (!analysis?.highImpactNews.length) return null;

    return (
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <AlertOctagon className="w-5 h-5 text-red-500" />
          <h2 className="text-lg font-semibold text-gray-800">Actualités à Fort Impact</h2>
        </div>
        <div className="space-y-4">
          {analysis.highImpactNews.map((item, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-red-500">
              <h3 className="text-lg font-medium text-gray-900 mb-2">{item.title}</h3>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">{item.impact}</p>
                <div className="flex flex-wrap gap-2">
                  {item.affectedCurrencies.map(currency => (
                    <span key={currency} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm">
                      {currency}
                    </span>
                  ))}
                </div>
                <div className="text-sm text-gray-500">
                  <p><strong>Implications:</strong> {item.tradingImplications}</p>
                  <p className="mt-1">
                    <strong>Niveau de risque:</strong>{' '}
                    <span className={`font-medium ${
                      item.riskLevel === 'high' ? 'text-red-600' :
                      item.riskLevel === 'medium' ? 'text-orange-600' :
                      'text-yellow-600'
                    }`}>
                      {item.riskLevel.toUpperCase()}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderMarketContext = () => {
    if (!analysis?.marketContext) return null;

    return (
      <div className="bg-gray-50 rounded-lg p-4 mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Contexte de Marché</h3>
        <div className="space-y-3">
          <p className="text-sm text-gray-600">{analysis.marketContext.currentTrend}</p>
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Risques Principaux:</h4>
            <ul className="list-disc list-inside text-sm text-gray-600">
              {analysis.marketContext.keyRisks.map((risk, index) => (
                <li key={index}>{risk}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Opportunités:</h4>
            <ul className="list-disc list-inside text-sm text-gray-600">
              {analysis.marketContext.tradingOpportunities.map((opportunity, index) => (
                <li key={index}>{opportunity}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Newspaper className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-800">Actualités Forex</h2>
      </div>

      {renderHighImpactNews()}
      {renderMarketContext()}

      <div className="space-y-4">
        {news.map((item, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                <div className="flex items-center gap-4">
                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(item.pubDate), { addSuffix: true, locale: fr })}
                  </p>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    Lire plus <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
import { useQuery, useQueryClient } from 'react-query';
import { NewsItem, Settings, NewsAnalysis } from '../types';
import { analyzeNews } from '../services/api';
import { analyzeCurrencyStrengths } from '../services/currency-analyzer';
import { analyzeNewsContent } from '../services/news-analyzer';

export function useAnalysis(news: NewsItem[], settings: Settings) {
  const queryClient = useQueryClient();

  const analysisQuery = useQuery(
    ['analysis', news, settings],
    () => analyzeNews(news, settings),
    {
      enabled: false,
      retry: 2,
      retryDelay: 1000,
      onError: (error) => console.error('Error analyzing news:', error)
    }
  );

  const strengthsQuery = useQuery(
    ['strengths', news, settings],
    () => analyzeCurrencyStrengths(news, settings),
    {
      enabled: false,
      retry: 2,
      retryDelay: 1000,
      onError: (error) => console.error('Error analyzing strengths:', error)
    }
  );

  const newsAnalysisQuery = useQuery<NewsAnalysis>(
    ['newsAnalysis', news, settings],
    () => analyzeNewsContent(news, settings),
    {
      enabled: false,
      retry: 2,
      retryDelay: 1000,
      onError: (error) => console.error('Error analyzing news content:', error)
    }
  );

  const startAnalysis = async () => {
    try {
      await Promise.all([
        queryClient.invalidateQueries('analysis'),
        queryClient.invalidateQueries('strengths'),
        queryClient.invalidateQueries('newsAnalysis'),
        analysisQuery.refetch(),
        strengthsQuery.refetch(),
        newsAnalysisQuery.refetch()
      ]);
    } catch (error) {
      console.error('Error during analysis:', error);
      throw error;
    }
  };

  return {
    analysis: analysisQuery.data,
    strengths: strengthsQuery.data,
    newsAnalysis: newsAnalysisQuery.data,
    isLoading: analysisQuery.isLoading || strengthsQuery.isLoading || newsAnalysisQuery.isLoading,
    error: analysisQuery.error || strengthsQuery.error || newsAnalysisQuery.error,
    startAnalysis,
    isReady: news.length > 0 && !!settings.apiKey
  };
}
import axios from 'axios';
import { NewsItem } from '../types/news';
import { ApiError } from '../types/errors';
import { parseRSSContent } from './rss-parser';
import OpenAI from 'openai';
import { Settings, CurrencyStrength, Correlation } from '../types';
import { extractMarketContext, analyzeTechnicalFactors } from './market-analysis';

const FOREX_FEED_URL = 'https://www.forexlive.com/feed/news';
const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

export async function fetchForexNews(): Promise<NewsItem[]> {
  try {
    const response = await axios.get(`${CORS_PROXY}${encodeURIComponent(FOREX_FEED_URL)}`, {
      timeout: 10000,
      headers: {
        'Accept': 'application/rss+xml, application/xml, text/xml',
      }
    });

    if (!response.data) {
      throw new Error('Pas de données reçues du flux RSS');
    }

    return await parseRSSContent(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Délai d\'attente dépassé');
      }
      if (error.response) {
        throw new Error(`Erreur serveur: ${error.response.status}`);
      }
      throw new Error(`Erreur réseau: ${error.message}`);
    }
    
    if (error instanceof Error) {
      throw new Error(`Erreur de flux RSS: ${error.message}`);
    }
    
    throw new Error('Une erreur inattendue est survenue');
  }
}

export async function analyzeNews(news: NewsItem[], settings: Settings): Promise<{
  strengths: CurrencyStrength[];
  correlations: Correlation[];
}> {
  if (!settings.apiKey) {
    throw new Error('Clé API OpenAI requise');
  }

  if (!news.length) {
    throw new Error('Aucune actualité disponible pour l\'analyse');
  }

  try {
    const openai = new OpenAI({
      apiKey: settings.apiKey,
      dangerouslyAllowBrowser: true
    });

    const marketContext = extractMarketContext(news);
    const technicalFactors = analyzeTechnicalFactors(news);

    const systemPrompt = `En tant qu'expert en analyse des marchés Forex, analysez les actualités fournies pour:

1. Évaluer la force relative des devises majeures (USD, EUR, GBP, JPY, AUD, NZD, CAD, CHF) en considérant:
   - Les politiques des banques centrales et les anticipations de taux
   - Les indicateurs économiques et leur impact
   - Le sentiment du marché et l'appétit pour le risque
   - Les configurations techniques et l'action des prix

2. Déterminer le sentiment (haussier/baissier/neutre) basé sur:
   - La tendance du score de force
   - Le positionnement du marché
   - L'impact des actualités
   - Les signaux d'analyse technique

3. Identifier les corrélations entre paires de devises en considérant:
   - Les relations de prix historiques
   - Les facteurs économiques communs
   - L'impact du sentiment de risque
   - L'alignement des configurations techniques

4. Fournir des recommandations de trading détaillées basées sur:
   - La force et la stabilité des corrélations
   - Les scénarios risque/rendement
   - Les niveaux d'entrée et de sortie
   - Les directives de gestion des risques

Contexte de marché:
${JSON.stringify(marketContext, null, 2)}

Analyse technique:
${JSON.stringify(technicalFactors, null, 2)}

Format JSON attendu:
{
  "strengths": [
    {
      "currency": "USD",
      "strength": 0.8,
      "sentiment": "bullish",
      "rationale": "Données économiques solides, position hawkish de la Fed, flux refuge"
    }
  ],
  "correlations": [
    {
      "pair1": "EUR/USD",
      "pair2": "GBP/USD",
      "strength": 0.85,
      "recommendation": "Forte corrélation positive - envisager des trades parallèles",
      "rationale": "Conditions économiques similaires, politiques monétaires alignées"
    }
  ]
}`;

    const newsText = news
      .map(item => `${item.title}\n${item.description}`)
      .join('\n\n')
      .slice(0, 4000);

    const response = await openai.chat.completions.create({
      model: settings.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: newsText }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Pas de réponse de OpenAI');
    }

    let analysis;
    try {
      analysis = JSON.parse(content);
    } catch {
      throw new Error('Réponse invalide de OpenAI');
    }
    
    if (!analysis.strengths?.length || !analysis.correlations?.length) {
      throw new Error('Données d\'analyse incomplètes');
    }

    return {
      strengths: analysis.strengths.map((s: any) => ({
        currency: String(s.currency || ''),
        strength: Math.max(-1, Math.min(1, parseFloat(s.strength) || 0)),
        sentiment: (['bullish', 'bearish', 'neutral'].includes(s.sentiment) 
          ? s.sentiment 
          : 'neutral') as 'bullish' | 'bearish' | 'neutral',
        rationale: String(s.rationale || '')
      })),
      correlations: analysis.correlations.map((c: any) => ({
        pair1: String(c.pair1 || ''),
        pair2: String(c.pair2 || ''),
        strength: Math.max(-1, Math.min(1, parseFloat(c.strength) || 0)),
        recommendation: String(c.recommendation || ''),
        rationale: String(c.rationale || '')
      }))
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Erreur d'analyse: ${error.message}`);
    }
    throw new Error('Une erreur inattendue est survenue pendant l\'analyse');
  }
}
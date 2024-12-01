import OpenAI from 'openai';
import { NewsItem, Settings, NewsAnalysis } from '../types';
import { classifyNewsImpact } from '../utils/news-classifier';
import { extractKeywords } from '../utils/keyword-extractor';

export async function analyzeNewsContent(
  news: NewsItem[],
  settings: Settings
): Promise<NewsAnalysis> {
  if (!settings.apiKey) {
    throw new Error('Clé API OpenAI requise');
  }

  const openai = new OpenAI({
    apiKey: settings.apiKey,
    dangerouslyAllowBrowser: true
  });

  const systemPrompt = `En tant qu'expert en analyse des marchés Forex, analysez les actualités fournies pour:

1. Identifier les événements à fort impact:
   - Décisions de taux d'intérêt
   - Données économiques majeures (PIB, inflation, emploi)
   - Déclarations importantes des banques centrales
   - Événements géopolitiques majeurs

2. Évaluer l'impact potentiel sur:
   - Les devises concernées
   - La volatilité attendue
   - Les mouvements de marché probables
   - Les corrélations entre paires de devises

3. Fournir une analyse détaillée:
   - Contexte de l'événement
   - Impact à court et moyen terme
   - Risques potentiels
   - Opportunités de trading

Format JSON attendu:
{
  "highImpactNews": [
    {
      "title": "Titre de l'actualité",
      "impact": "Description détaillée de l'impact",
      "affectedCurrencies": ["USD", "EUR"],
      "tradingImplications": "Implications pour le trading",
      "riskLevel": "high/medium/low",
      "confidence": 0.95
    }
  ],
  "marketContext": {
    "currentTrend": "Description de la tendance actuelle",
    "keyRisks": ["Liste des risques principaux"],
    "tradingOpportunities": ["Liste des opportunités"]
  }
}`;

  try {
    const newsText = news
      .map(item => `${item.title}\n${item.content}`)
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

    const analysis = JSON.parse(content);
    
    if (!analysis.highImpactNews || !analysis.marketContext) {
      throw new Error('Analyse incomplète');
    }

    // Enrichir l'analyse avec des mots-clés et une classification
    const enrichedNews = await Promise.all(analysis.highImpactNews.map(async (news: any) => {
      const keywords = await extractKeywords(news.title + ' ' + news.impact, settings);
      return {
        ...news,
        keywords,
        classification: classifyNewsImpact(news.title, news.impact)
      };
    }));

    return {
      highImpactNews: enrichedNews,
      marketContext: analysis.marketContext,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Erreur d'analyse: ${error.message}`);
    }
    throw new Error('Erreur inattendue lors de l\'analyse');
  }
}
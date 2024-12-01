import OpenAI from 'openai';
import { NewsItem, Settings, CurrencyStrength } from '../types';

export async function analyzeCurrencyStrength(
  news: NewsItem[],
  settings: Settings
): Promise<CurrencyStrength[]> {
  if (!settings.apiKey) {
    throw new Error('Veuillez configurer votre clé API OpenAI');
  }

  const openai = new OpenAI({
    apiKey: settings.apiKey,
    dangerouslyAllowBrowser: true
  });

  const systemPrompt = `En tant qu'expert en analyse des marchés Forex, analysez les actualités fournies pour:

1. Évaluer la force relative des devises majeures (USD, EUR, GBP, JPY, AUD, NZD, CAD, CHF)
2. Attribuer un score de force (-1 à 1) basé sur:
   - Les politiques des banques centrales
   - Les indicateurs économiques
   - Le sentiment du marché
   - Les facteurs techniques
3. Déterminer le sentiment (haussier/baissier/neutre)
4. Fournir une justification détaillée

Format JSON attendu:
{
  "strengths": [
    {
      "currency": "USD",
      "strength": 0.8,
      "sentiment": "bullish",
      "rationale": "Explication détaillée des facteurs..."
    }
  ]
}`;

  const newsText = news
    .map(item => `${item.title}\n${item.content}`)
    .join('\n\n')
    .slice(0, 4000);

  try {
    const response = await openai.chat.completions.create({
      model: settings.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: newsText }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 1500,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Pas de réponse de OpenAI');
    }

    const analysis = JSON.parse(content);
    
    if (!analysis.strengths?.length) {
      throw new Error('Analyse incomplète');
    }

    return analysis.strengths.map((s: any) => ({
      currency: String(s.currency || ''),
      strength: Math.max(-1, Math.min(1, parseFloat(s.strength) || 0)),
      sentiment: (['bullish', 'bearish', 'neutral'].includes(s.sentiment) 
        ? s.sentiment 
        : 'neutral') as 'bullish' | 'bearish' | 'neutral',
      rationale: String(s.rationale || '')
    }));
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Erreur d'analyse: ${error.message}`);
    }
    throw new Error('Erreur inattendue lors de l\'analyse');
  }
}
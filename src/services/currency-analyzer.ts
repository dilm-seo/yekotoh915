import OpenAI from 'openai';
import { NewsItem, Settings, CurrencyStrength } from '../types';

export async function analyzeCurrencyStrengths(
  news: NewsItem[],
  settings: Settings
): Promise<CurrencyStrength[]> {
  if (!settings.apiKey) {
    throw new Error('Clé API OpenAI requise');
  }

  const openai = new OpenAI({
    apiKey: settings.apiKey,
    dangerouslyAllowBrowser: true
  });

  const systemPrompt = `En tant qu'expert en analyse des marchés Forex, analysez les actualités fournies pour évaluer la force relative des principales devises (USD, EUR, GBP, JPY, AUD, NZD, CAD, CHF).

Pour chaque devise, fournissez:

1. Un score de force (-1 à 1) basé sur:
   - Les politiques monétaires actuelles et anticipées
   - Les données économiques récentes et leur impact
   - Le sentiment du marché et les flux de capitaux
   - Les facteurs techniques et le momentum

2. Une analyse détaillée en français expliquant:
   - Les facteurs clés influençant la devise
   - Les catalyseurs potentiels à court terme
   - Les risques et opportunités
   - Le contexte économique et monétaire

3. Un sentiment (haussier/baissier/neutre) avec:
   - Une justification claire du positionnement
   - Les niveaux techniques importants
   - Les événements à surveiller

Format JSON attendu:
{
  "currencies": [
    {
      "currency": "USD",
      "strength": 0.8,
      "sentiment": "bullish",
      "rationale": "Explication détaillée en français..."
    }
  ]
}`;

  try {
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

    const analysis = JSON.parse(content);
    
    if (!analysis.currencies?.length) {
      throw new Error('Analyse des devises incomplète');
    }

    return analysis.currencies.map((c: any) => ({
      currency: String(c.currency || ''),
      strength: Math.max(-1, Math.min(1, parseFloat(c.strength) || 0)),
      sentiment: (['bullish', 'bearish', 'neutral'].includes(c.sentiment) 
        ? c.sentiment 
        : 'neutral') as 'bullish' | 'bearish' | 'neutral',
      rationale: String(c.rationale || '')
    }));
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Erreur d'analyse des devises: ${error.message}`);
    }
    throw new Error('Erreur inattendue lors de l\'analyse des devises');
  }
}
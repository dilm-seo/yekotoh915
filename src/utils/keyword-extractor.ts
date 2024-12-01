import OpenAI from 'openai';
import { Settings } from '../types';

interface KeywordAnalysis {
  keywords: string[];
  entities: {
    currencies: string[];
    economicTerms: string[];
    marketTerms: string[];
    events: string[];
  };
  sentiment: {
    score: number;
    explanation: string;
  };
}

export async function extractKeywords(
  text: string,
  settings: Settings
): Promise<string[]> {
  try {
    const openai = new OpenAI({
      apiKey: settings.apiKey,
      dangerouslyAllowBrowser: true
    });

    const systemPrompt = `En tant qu'expert en analyse des marchés Forex, analysez le texte fourni pour:

1. Extraire les mots-clés pertinents en les classant par catégories:
   - Devises et paires de devises (ex: EUR, USD, EUR/USD)
   - Termes économiques (ex: PIB, inflation, taux)
   - Termes de marché (ex: support, résistance, tendance)
   - Événements importants (ex: réunion Fed, NFP)

2. Identifier les entités nommées:
   - Banques centrales et institutions
   - Indicateurs économiques
   - Acteurs du marché
   - Événements géopolitiques

3. Analyser le sentiment:
   - Score (-1 à 1)
   - Explication du score

Format JSON attendu:
{
  "keywords": ["liste", "de", "mots-clés"],
  "entities": {
    "currencies": ["USD", "EUR"],
    "economicTerms": ["inflation", "PIB"],
    "marketTerms": ["support", "résistance"],
    "events": ["réunion Fed", "NFP"]
  },
  "sentiment": {
    "score": 0.8,
    "explanation": "Explication du sentiment"
  }
}`;

    const response = await openai.chat.completions.create({
      model: settings.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 1000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Pas de réponse de OpenAI');
    }

    const analysis: KeywordAnalysis = JSON.parse(content);
    
    // Fusionner tous les mots-clés pertinents
    const allKeywords = new Set([
      ...analysis.keywords,
      ...analysis.entities.currencies,
      ...analysis.entities.economicTerms,
      ...analysis.entities.marketTerms,
      ...analysis.entities.events
    ]);

    return Array.from(allKeywords);
  } catch (error) {
    console.error('Erreur lors de l\'extraction des mots-clés:', error);
    // Fallback sur l'extraction basique en cas d'erreur
    return extractBasicKeywords(text);
  }
}

// Fonction de fallback pour l'extraction basique des mots-clés
function extractBasicKeywords(text: string): string[] {
  const CURRENCY_KEYWORDS = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'NZD', 'CAD', 'CHF'];
  const ECONOMIC_KEYWORDS = ['PIB', 'inflation', 'emploi', 'taux', 'croissance'];
  const MARKET_KEYWORDS = ['hausse', 'baisse', 'volatilité', 'tendance', 'support', 'résistance'];

  const normalizedText = text.toUpperCase();
  const words = normalizedText.split(/\s+/);
  const keywords = new Set<string>();

  // Extraction des devises
  CURRENCY_KEYWORDS.forEach(currency => {
    if (normalizedText.includes(currency)) {
      keywords.add(currency);
    }
  });

  // Extraction des termes économiques
  ECONOMIC_KEYWORDS.forEach(term => {
    if (normalizedText.includes(term.toUpperCase())) {
      keywords.add(term);
    }
  });

  // Extraction des termes de marché
  MARKET_KEYWORDS.forEach(term => {
    if (normalizedText.includes(term.toUpperCase())) {
      keywords.add(term);
    }
  });

  // Extraction des paires de devises
  words.forEach(word => {
    if (/^[A-Z]{3}\/[A-Z]{3}$/.test(word)) {
      keywords.add(word);
    }
  });

  return Array.from(keywords);
}
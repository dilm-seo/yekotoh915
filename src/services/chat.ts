import OpenAI from 'openai';
import { Settings } from '../types';

export async function analyzeWithAI(message: string, settings: Settings): Promise<string> {
  if (!settings.apiKey) {
    throw new Error('Clé API OpenAI requise');
  }

  const openai = new OpenAI({
    apiKey: settings.apiKey,
    dangerouslyAllowBrowser: true
  });

  const systemPrompt = `Tu es un expert en analyse des marchés Forex. Tu dois:

1. Analyser les questions des utilisateurs sur le marché Forex
2. Fournir des analyses détaillées sur:
   - Les tendances actuelles
   - Les niveaux techniques importants
   - Les corrélations entre paires de devises
   - Les opportunités de trading potentielles
3. Donner des recommandations claires mais rappeler que ce ne sont que des suggestions
4. Toujours inclure des avertissements sur les risques du trading

Réponds en français de manière professionnelle mais accessible.`;

  try {
    const response = await openai.chat.completions.create({
      model: settings.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return response.choices[0]?.message?.content || 'Désolé, je n\'ai pas pu analyser votre demande.';
  } catch (error) {
    console.error('Erreur lors de l\'analyse:', error);
    throw new Error('Erreur lors de l\'analyse de votre demande');
  }
}
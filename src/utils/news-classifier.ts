interface NewsClassification {
  category: 'monetary' | 'economic' | 'geopolitical' | 'technical';
  confidence: number;
  keywords: string[];
}

const CLASSIFICATION_PATTERNS = {
  monetary: {
    keywords: ['taux d\'intérêt', 'banque centrale', 'fed', 'bce', 'politique monétaire'],
    weight: 1.0
  },
  economic: {
    keywords: ['pib', 'inflation', 'emploi', 'chômage', 'ipc', 'production industrielle'],
    weight: 0.9
  },
  geopolitical: {
    keywords: ['guerre', 'conflit', 'sanctions', 'élections', 'politique'],
    weight: 0.8
  },
  technical: {
    keywords: ['support', 'résistance', 'tendance', 'momentum', 'indicateur'],
    weight: 0.7
  }
};

export function classifyNewsImpact(title: string, content: string): NewsClassification {
  const text = `${title} ${content}`.toLowerCase();
  let maxScore = 0;
  let category: NewsClassification['category'] = 'economic';
  const matchedKeywords: string[] = [];

  Object.entries(CLASSIFICATION_PATTERNS).forEach(([cat, pattern]) => {
    let score = 0;
    pattern.keywords.forEach(keyword => {
      if (text.includes(keyword.toLowerCase())) {
        score += pattern.weight;
        matchedKeywords.push(keyword);
      }
    });

    if (score > maxScore) {
      maxScore = score;
      category = cat as NewsClassification['category'];
    }
  });

  return {
    category,
    confidence: Math.min(maxScore / 3, 1),
    keywords: [...new Set(matchedKeywords)]
  };
}
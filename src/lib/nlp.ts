export function extractKeywords(text: string, topN: number = 25): string[] {
    const stopwords = new Set([
        "the","and","or","to","of","in","a","an","for","with","on","at","by","is","are",
        "was","were","be","this","that","as","it","from","i","you","we","they","their","your",
        "has","have","had","do","does","did","but","if","then","else","when","where","who",
        "why","how","all","any","both","each","few","more","most","other","some","such",
        "no","nor","not","only","own","same","so","than","too","very","can","will","just",
        "should","now","about","which","there","also","been","can","one","out","up",
        "over","under","through","after","before"
    ]);

    const words = text.toLowerCase().match(/[a-z]+/g) || [];
    const filtered = words.filter(w => !stopwords.has(w) && w.length > 2);
    
    const counts: Record<string, number> = {};
    for (const w of filtered) {
        counts[w] = (counts[w] || 0) + 1;
    }
    
    return Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, topN)
        .map(e => e[0]);
}

export function calculateCosineSimilarity(text1: string, text2: string): number {
    const getVector = (text: string) => {
        const words = text.toLowerCase().match(/[a-z]+/g) || [];
        const counts: Record<string, number> = {};
        for (let w of words) {
            if (w.length > 2) counts[w] = (counts[w] || 0) + 1;
        }
        return counts;
    };

    const v1 = getVector(text1);
    const v2 = getVector(text2);
    
    const uniqueWords = new Set([...Object.keys(v1), ...Object.keys(v2)]);
    let dotProduct = 0;
    let mag1 = 0;
    let mag2 = 0;
    
    for (const w of uniqueWords) {
        const val1 = v1[w] || 0;
        const val2 = v2[w] || 0;
        dotProduct += val1 * val2;
        mag1 += val1 * val1;
        mag2 += val2 * val2;
    }
    
    mag1 = Math.sqrt(mag1);
    mag2 = Math.sqrt(mag2);
    
    if (mag1 === 0 || mag2 === 0) return 0;
    return dotProduct / (mag1 * mag2);
}

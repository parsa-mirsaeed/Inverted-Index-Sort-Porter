import { DocumentInput, IntermediatePair, DictionaryEntry } from '../types';

// ==========================================
// PORTER STEMMER IMPLEMENTATION (Lite)
// ==========================================
// Implements the standard Porter Stemming algorithm rules
// to allow for dynamic and accurate stemming in the interactive lab.

function isConsonant(str: string, i: number): boolean {
    const vowels = /[aeiou]/;
    const letter = str[i];
    if (vowels.test(letter)) return false;
    if (letter === 'y') {
        if (i === 0) return true;
        return !isConsonant(str, i - 1);
    }
    return true;
}

function getMeasure(str: string): number {
    let m = 0;
    let i = 0;
    const len = str.length;
    while (i < len) {
        if (i >= len) return m;
        if (!isConsonant(str, i)) break;
        i++;
    }
    while (i < len) {
        if (i >= len) return m;
        if (isConsonant(str, i)) {
            m++;
            i++;
            while (i < len) {
                if (i >= len) return m;
                if (!isConsonant(str, i)) break;
                i++;
            }
        } else {
            i++;
        }
    }
    return m;
}

function containsVowel(str: string): boolean {
    for (let i = 0; i < str.length; i++) {
        if (!isConsonant(str, i)) return true;
    }
    return false;
}

function endsWithDoubleConsonant(str: string): boolean {
    const l = str.length;
    if (l < 2) return false;
    if (str[l - 1] !== str[l - 2]) return false;
    return isConsonant(str, l - 1);
}

function cvc(str: string): boolean {
    const l = str.length;
    if (l < 3) return false;
    const c1 = isConsonant(str, l - 3);
    const v = !isConsonant(str, l - 2);
    const c2 = isConsonant(str, l - 1);
    const wxy = ['w', 'x', 'y'];
    return c1 && v && c2 && !wxy.includes(str[l - 1]);
}

export function porterStemmer(w: string): string {
    if (w.length < 3) return w;
    let word = w.toLowerCase();

    // Step 1a
    if (word.endsWith('sses')) word = word.slice(0, -2);
    else if (word.endsWith('ies')) word = word.slice(0, -2);
    else if (word.endsWith('ss')) word = word;
    else if (word.endsWith('s')) word = word.slice(0, -1);

    // Step 1b
    let success1b = false;
    if (word.endsWith('eed')) {
        const stem = word.slice(0, -3);
        if (getMeasure(stem) > 0) word = stem + 'ee';
    } else if (word.endsWith('ed')) {
        const stem = word.slice(0, -2);
        if (containsVowel(stem)) {
            word = stem;
            success1b = true;
        }
    } else if (word.endsWith('ing')) {
        const stem = word.slice(0, -3);
        if (containsVowel(stem)) {
            word = stem;
            success1b = true;
        }
    }

    if (success1b) {
        if (word.endsWith('at')) word += 'e';
        else if (word.endsWith('bl')) word += 'e';
        else if (word.endsWith('iz')) word += 'e';
        else if (endsWithDoubleConsonant(word) && !['l', 's', 'z'].includes(word[word.length - 1])) {
            word = word.slice(0, -1);
        } else if (getMeasure(word) === 1 && cvc(word)) {
            word += 'e';
        }
    }

    // Step 1c
    if (word.endsWith('y')) {
        const stem = word.slice(0, -1);
        if (containsVowel(stem)) word = stem + 'i';
    }

    // Step 2
    if (word.endsWith('ational')) { if (getMeasure(word.slice(0, -7)) > 0) word = word.replace('ational', 'ate'); }
    else if (word.endsWith('tional')) { if (getMeasure(word.slice(0, -6)) > 0) word = word.replace('tional', 'tion'); }
    else if (word.endsWith('enci')) { if (getMeasure(word.slice(0, -4)) > 0) word = word.replace('enci', 'ence'); }
    else if (word.endsWith('anci')) { if (getMeasure(word.slice(0, -4)) > 0) word = word.replace('anci', 'ance'); }
    else if (word.endsWith('izer')) { if (getMeasure(word.slice(0, -4)) > 0) word = word.replace('izer', 'ize'); }
    else if (word.endsWith('abli')) { if (getMeasure(word.slice(0, -4)) > 0) word = word.replace('abli', 'able'); }
    else if (word.endsWith('alli')) { if (getMeasure(word.slice(0, -4)) > 0) word = word.replace('alli', 'al'); }
    else if (word.endsWith('entli')) { if (getMeasure(word.slice(0, -5)) > 0) word = word.replace('entli', 'ent'); }
    else if (word.endsWith('eli')) { if (getMeasure(word.slice(0, -3)) > 0) word = word.replace('eli', 'e'); }
    else if (word.endsWith('ousli')) { if (getMeasure(word.slice(0, -5)) > 0) word = word.replace('ousli', 'ous'); }

    // Step 3
    if (word.endsWith('icate')) { if (getMeasure(word.slice(0, -5)) > 0) word = word.replace('icate', 'ic'); }
    else if (word.endsWith('ative')) { if (getMeasure(word.slice(0, -5)) > 0) word = word.replace('ative', ''); }
    else if (word.endsWith('alize')) { if (getMeasure(word.slice(0, -5)) > 0) word = word.replace('alize', 'al'); }
    else if (word.endsWith('iciti')) { if (getMeasure(word.slice(0, -5)) > 0) word = word.replace('iciti', 'ic'); }
    else if (word.endsWith('ical')) { if (getMeasure(word.slice(0, -4)) > 0) word = word.replace('ical', 'ic'); }
    else if (word.endsWith('ful')) { if (getMeasure(word.slice(0, -3)) > 0) word = word.replace('ful', ''); }
    else if (word.endsWith('ness')) { if (getMeasure(word.slice(0, -4)) > 0) word = word.replace('ness', ''); }

    // Step 4
    if (word.endsWith('al')) { if (getMeasure(word.slice(0, -2)) > 1) word = word.slice(0, -2); }
    else if (word.endsWith('ance')) { if (getMeasure(word.slice(0, -4)) > 1) word = word.slice(0, -4); }
    else if (word.endsWith('ence')) { if (getMeasure(word.slice(0, -4)) > 1) word = word.slice(0, -4); }
    else if (word.endsWith('er')) { if (getMeasure(word.slice(0, -2)) > 1) word = word.slice(0, -2); }
    else if (word.endsWith('ic')) { if (getMeasure(word.slice(0, -2)) > 1) word = word.slice(0, -2); }
    else if (word.endsWith('able')) { if (getMeasure(word.slice(0, -4)) > 1) word = word.slice(0, -4); }
    else if (word.endsWith('ible')) { if (getMeasure(word.slice(0, -4)) > 1) word = word.slice(0, -4); }
    else if (word.endsWith('ant')) { if (getMeasure(word.slice(0, -3)) > 1) word = word.slice(0, -3); }
    else if (word.endsWith('ement')) { if (getMeasure(word.slice(0, -5)) > 1) word = word.slice(0, -5); }
    else if (word.endsWith('ment')) { if (getMeasure(word.slice(0, -4)) > 1) word = word.slice(0, -4); }
    else if (word.endsWith('ent')) { if (getMeasure(word.slice(0, -3)) > 1) word = word.slice(0, -3); }
    else if (word.endsWith('ou')) { if (getMeasure(word.slice(0, -2)) > 1) word = word.slice(0, -2); }
    else if (word.endsWith('ism')) { if (getMeasure(word.slice(0, -3)) > 1) word = word.slice(0, -3); }
    else if (word.endsWith('ate')) { if (getMeasure(word.slice(0, -3)) > 1) word = word.slice(0, -3); }
    else if (word.endsWith('iti')) { if (getMeasure(word.slice(0, -3)) > 1) word = word.slice(0, -3); }
    else if (word.endsWith('ous')) { if (getMeasure(word.slice(0, -3)) > 1) word = word.slice(0, -3); }
    else if (word.endsWith('ive')) { if (getMeasure(word.slice(0, -3)) > 1) word = word.slice(0, -3); }
    else if (word.endsWith('ize')) { if (getMeasure(word.slice(0, -3)) > 1) word = word.slice(0, -3); }

    // Step 5
    if (word.endsWith('e')) {
        const stem = word.slice(0, -1);
        if (getMeasure(stem) > 1) word = stem;
        else if (getMeasure(stem) === 1 && !cvc(stem)) word = stem;
    }
    if (getMeasure(word) > 1 && endsWithDoubleConsonant(word) && word.endsWith('l')) {
        word = word.slice(0, -1);
    }

    return word;
}

export const rawDocuments: DocumentInput[] = [
  { id: 1, text: "Friends, Romans, countrymen, lend me your ears;" },
  { id: 2, text: "I come to bury Caesar, not to praise him." },
  { id: 3, text: "The evil that men do lives after them;" },
  { id: 4, text: "The good is oft interred with their bones;" },
  { id: 5, text: "So let it be with Caesar. The noble Brutus" },
];

export const getStem = (word: string): string => {
    // Manually handle irregulars or words that Porter stems 'too aggressively' for this specific context if needed
    // But for general purpose, use the algorithm.
    // Overrides for specific presentation requirements if necessary:
    const overrides: Record<string, string> = {
        "men": "men", // Porter doesn't handle irregular plurals well
        "feet": "feet",
    };
    if (overrides[word.toLowerCase()]) return overrides[word.toLowerCase()];
    
    return porterStemmer(word);
};

export const tokenizeAndStem = (docs: DocumentInput[]): IntermediatePair[] => {
  const pairs: IntermediatePair[] = [];
  
  docs.forEach(doc => {
    // Regex logic mimicking: Regex::new(r"[a-zA-Z]+").unwrap();
    const tokens = doc.text.toLowerCase().match(/[a-z]+/g) || [];
    
    tokens.forEach(token => {
      // Apply stemmer logic
      const stemmed = getStem(token);
      pairs.push({
        term: stemmed,
        docId: doc.id,
        originalToken: token
      });
    });
  });

  return pairs;
};

// Sort logic mimicking Rust's Default Sort (Term then DocID)
export const sortPairs = (pairs: IntermediatePair[]): IntermediatePair[] => {
  return [...pairs].sort((a, b) => {
    const termComparison = a.term.localeCompare(b.term);
    if (termComparison !== 0) return termComparison;
    return a.docId - b.docId;
  });
};

export const buildIndex = (sortedPairs: IntermediatePair[]): DictionaryEntry[] => {
  const indexMap = new Map<string, Set<number>>();

  sortedPairs.forEach(pair => {
    if (!indexMap.has(pair.term)) {
      indexMap.set(pair.term, new Set());
    }
    indexMap.get(pair.term)?.add(pair.docId);
  });

  // Convert map to array for visualization, sorted by term
  return Array.from(indexMap.entries())
    .map(([term, docSet]) => ({
      term,
      postings: Array.from(docSet).sort((a, b) => a - b)
    }))
    .sort((a, b) => a.term.localeCompare(b.term));
};

export const searchIndex = (query: string, index: DictionaryEntry[]): number[] => {
    const tokens = query.toLowerCase().match(/[a-z]+/g);
    if (!tokens || tokens.length === 0) return [];

    // Simple single term search or OR search for demo
    const stem = getStem(tokens[0]);
    
    const entry = index.find(e => e.term === stem);
    return entry ? entry.postings : [];
};

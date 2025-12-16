/*
 * Project: Inverted Index Construction with Porter Stemming
 * Course: Information Retrieval (Hadi Saboohi)
 * Logic based on Slides: IR_01 (Structure), IR_02 (Stemming), IR_04 (Sorting)
 */

use rust_stemmers::{Algorithm, Stemmer};
use regex::Regex;
use std::collections::HashMap;
use std::cmp::Ordering;

// A struct to represent our raw (Term, DocID) pair before the index is built.
// This corresponds to the table seen in IR_01 Slide 26[cite: 432].
#[derive(Debug, Eq, Clone)]
struct IntermediatePair {
    term: String,
    doc_id: u32,
}

// Implement sorting logic: Sort by Term first, then by DocID.
// This is critical based on IR_01 Slide 27[cite: 498].
impl Ord for IntermediatePair {
    fn cmp(&self, other: &Self) -> Ordering {
        match self.term.cmp(&other.term) {
            Ordering::Equal => self.doc_id.cmp(&other.doc_id),
            other => other,
        }
    }
}

impl PartialOrd for IntermediatePair {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        Some(self.cmp(other))
    }
}

impl PartialEq for IntermediatePair {
    fn eq(&self, other: &Self) -> bool {
        self.term == other.term && self.doc_id == other.doc_id
    }
}

// The Final Inverted Index Structure
struct InvertedIndex {
    // Dictionary: Term -> Postings List (Vec<u32>)
    // Using BTreeMap is also an option if we want the final dictionary keys sorted,
    // but HashMap is O(1) for lookup.
    index_map: HashMap<String, Vec<u32>>,
}

impl InvertedIndex {
    fn new() -> Self {
        InvertedIndex {
            index_map: HashMap::new(),
        }
    }

    // Function to build the index from sorted pairs
    fn build_from_sorted_pairs(&mut self, sorted_pairs: Vec<IntermediatePair>) {
        for pair in sorted_pairs {
            // entry() API in Rust handles checking if key exists
            let postings = self.index_map.entry(pair.term).or_insert(Vec::new());
            
            // Only add doc_id if it's not the most recent one (avoid duplicates within same doc)
            if postings.last() != Some(&pair.doc_id) {
                postings.push(pair.doc_id);
            }
        }
    }

    // Search functionality
    fn search(&self, query: &str) {
        let en_stemmer = Stemmer::create(Algorithm::English);
        let query_term = query.to_lowercase();
        let stemmed_query = en_stemmer.stem(&query_term);

        println!("--- Searching for: '{}' (Stemmed: '{}') ---", query, stemmed_query);

        match self.index_map.get(stemmed_query.as_ref()) {
            Some(postings) => {
                println!("Found in {} documents: {:?}", postings.len(), postings);
            }
            None => {
                println!("Term not found in index.");
            }
        }
    }
}

fn main() {
    // 1. DATA INPUT (Simulating documents)
    let documents = vec![
        (1, "Friends, Romans, countrymen, lend me your ears;"),
        (2, "I come to bury Caesar, not to praise him."),
        (3, "The evil that men do lives after them;"),
        (4, "The good is oft interred with their bones;"),
        (5, "So let it be with Caesar. The noble Brutus"), // "Brutus" example from slides
    ];

    println!("Processing {} documents...", documents.len());

    // 2. INITIALIZATION
    // Use Porter Stemmer as requested 
    let en_stemmer = Stemmer::create(Algorithm::English);
    let re = Regex::new(r"[a-zA-Z]+").unwrap();
    let mut intermediate_list: Vec<IntermediatePair> = Vec::new();

    // 3. PROCESSING (Tokenization & Stemming)
    for (doc_id, text) in documents {
        // Tokenize: Lowercase and match words only (removing punctuation)
        for cap in re.captures_iter(&text.to_lowercase()) {
            let token = &cap[0];
            
            // Stemming
            let stemmed_cow = en_stemmer.stem(token);
            let stemmed_term = stemmed_cow.into_owned();

            // Add to intermediate list
            intermediate_list.push(IntermediatePair {
                term: stemmed_term,
                doc_id,
            });
        }
    }

    println!("Total tokens processed: {}", intermediate_list.len());

    // 4. SORTING
    // "Sorting is important at the end" - This matches IR_01 Slide 27 [cite: 498]
    intermediate_list.sort(); 

    // 5. INDEX CONSTRUCTION (Dictionary + Postings)
    let mut my_index = InvertedIndex::new();
    my_index.build_from_sorted_pairs(intermediate_list);

    // 6. OUTPUT & STATISTICS
    println!("\n=== Index Statistics ===");
    // "Print number of rows" (Unique terms in dictionary)
    println!("Number of Terms (Rows) in Dictionary: {}", my_index.index_map.len());
    
    // 7. SEARCH DEMONSTRATION
    // Searching for terms used in the slides to prove correctness
    my_index.search("Romans");    // Should match stemming 'roman'
    my_index.search("Countrymen"); // Should match stemming 'countryman'
    my_index.search("Caesar");
    my_index.search("Brutus");
    
    println!("\nProject Ready for Delivery.");
}

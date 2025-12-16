import React from 'react';
import Hero from './components/Hero';
import PipelineVisualizer from './components/PipelineVisualizer';
import CodeBlock from './components/CodeBlock';
import { Github, FileText, Cpu, GitBranch } from 'lucide-react';

const App: React.FC = () => {
  return (
    <div className="min-h-screen font-sans selection:bg-accent selection:text-white bg-[#0f1012] overflow-x-hidden">
      <Hero />
      
      {/* Introduction Section */}
      <section className="py-20 px-6 max-w-5xl mx-auto relative">
        <div className="absolute left-0 top-20 w-1 h-24 bg-gradient-to-b from-accent to-transparent"></div>
        <h2 className="text-4xl font-serif font-bold text-white mb-8 pl-8">
            Context & Objectives
        </h2>
        <div className="prose prose-invert prose-lg text-academic-300 max-w-none pl-8">
            <p className="lead text-xl text-academic-200">
                This artifact visualizes the implementation of a high-performance <strong>Inverted Index Construction</strong> engine (v0.1.0). 
                Designed to complement the theoretical framework of Information Retrieval, it specifically addresses the pipeline of 
                <strong> Tokenization</strong>, <strong>Stemming (Root Extraction)</strong>, and <strong>Indexing</strong>.
            </p>
            <div className="grid md:grid-cols-3 gap-6 my-16 not-prose">
                <div className="glass-panel p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-500 border-t border-t-white/10 group">
                    <div className="w-12 h-12 bg-academic-800 rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                        <FileText className="text-academic-400 group-hover:text-accent transition-colors" />
                    </div>
                    <h3 className="text-white font-bold text-xl mb-3">Dictionary Separation</h3>
                    <p className="text-sm text-academic-400 leading-relaxed">Lecture IR_01 architecture separating Dictionary from Postings Lists for modularity.</p>
                </div>
                <div className="glass-panel p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-500 border-t border-t-white/10 group">
                    <div className="w-12 h-12 bg-academic-800 rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                        <GitBranch className="text-academic-400 group-hover:text-accent transition-colors" />
                    </div>
                    <h3 className="text-white font-bold text-xl mb-3">Porter Stemming</h3>
                    <p className="text-sm text-academic-400 leading-relaxed">Lecture IR_02 linguistic normalization reducing inflectional forms to roots.</p>
                </div>
                <div className="glass-panel p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-500 border-t border-t-white/10 group">
                    <div className="w-12 h-12 bg-academic-800 rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                        <Cpu className="text-academic-400 group-hover:text-accent transition-colors" />
                    </div>
                    <h3 className="text-white font-bold text-xl mb-3">BSBI Sorting</h3>
                    <p className="text-sm text-academic-400 leading-relaxed">Lecture IR_04 Sort-Based Indexing strategy ensuring O(N log N) scalability.</p>
                </div>
            </div>
            <p>
               The system uses <strong>Rust</strong> for memory safety and performance. Below is the strict type definition used 
               to enforce the sorting logic required by the research specifications.
            </p>
            
            <div className="my-8 shadow-2xl">
                <CodeBlock 
                    title="src/main.rs - IntermediatePair"
                    code={`#[derive(Debug, Eq, Clone)]
struct IntermediatePair {
    term: String,
    doc_id: u32,
}

// Critical: Sort by Term first, then by DocID
impl Ord for IntermediatePair {
    fn cmp(&self, other: &Self) -> Ordering {
        match self.term.cmp(&other.term) {
            Ordering::Equal => self.doc_id.cmp(&other.doc_id),
            other => other,
        }
    }
}`}
                />
            </div>
        </div>
      </section>

      {/* Interactive Visualization Section */}
      <section className="py-24 bg-black border-y border-academic-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-academic-900 via-black to-black opacity-50"></div>
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          
          <div className="relative z-10">
              <div className="text-center mb-16 px-4">
                <span className="text-accent font-mono text-xs uppercase tracking-[0.2em] mb-4 block">Interactive Demo</span>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">Pipeline Artifact</h2>
                <p className="text-academic-400 text-lg max-w-2xl mx-auto">Explore the data transformation stages dynamically from raw text to inverted index.</p>
              </div>
              <PipelineVisualizer />
          </div>
      </section>

      {/* Implementation Details */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16">
            <div className="prose prose-invert prose-lg text-academic-300">
                <h2 className="text-3xl font-serif font-bold text-white mb-6">
                    Algorithmic Engineering
                </h2>
                <p>
                    The sorting phase is the critical engineering step. Standard insertion into a Hash Map is sufficient for small data, 
                    but this artifact simulates <strong>Block Sort-Based Indexing (BSBI)</strong>. The collection is explicitly sorted 
                    before the index is finalized to ensure scalability.
                </p>
                <p>
                    This approach minimizes random memory access patterns during index construction, optimizing cache locality and overall throughput.
                </p>
            </div>
            
            <div className="space-y-6">
                 <div className="shadow-2xl">
                    <CodeBlock 
                        title="src/main.rs - Index Construction"
                        code={`fn build_from_sorted_pairs(&mut self, sorted_pairs: Vec<IntermediatePair>) {
    for pair in sorted_pairs {
        // entry() API handles checking if key exists
        let postings = self.index_map.entry(pair.term).or_insert(Vec::new());
        
        // Only add doc_id if not duplicate
        if postings.last() != Some(&pair.doc_id) {
            postings.push(pair.doc_id);
        }
    }
}`}
                    />
                 </div>
            </div>
        </div>

        <div className="mt-20">
            <h3 className="text-xl font-bold text-white mb-6 border-b border-academic-800 pb-2">Performance Metrics (v0.1.0)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Documents", value: "5", desc: "Corpus Size" },
                    { label: "Tokens", value: "41", desc: "Total Processed" },
                    { label: "Dictionary", value: "36", desc: "Unique Terms" },
                    { label: "Compression", value: "1.14x", desc: "Token/Term Ratio" },
                ].map((stat, i) => (
                    <div key={i} className="bg-academic-900/50 border border-academic-800 p-6 rounded-xl text-center">
                        <div className="text-3xl font-mono font-bold text-white mb-1">{stat.value}</div>
                        <div className="text-sm font-bold text-academic-400 uppercase tracking-wider">{stat.label}</div>
                        <div className="text-xs text-academic-600 mt-2">{stat.desc}</div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-academic-800 bg-black py-16 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
                <h4 className="text-white font-serif font-bold text-2xl mb-2">Foundations of IR</h4>
                <p className="text-academic-500">Seyed Parsa Qazi MirSaeed &bull; Semester 1404/1405</p>
            </div>
            <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-academic-900 flex items-center justify-center text-academic-500 hover:text-white hover:bg-accent transition-all">
                    <Github size={20} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-academic-900 flex items-center justify-center text-academic-500 hover:text-white hover:bg-accent transition-all">
                    <FileText size={20} />
                </a>
            </div>
        </div>
        <div className="text-center mt-12 pt-8 border-t border-academic-900 text-xs text-academic-600 font-mono">
            Research artifact submitted to Dr. Hadi Saboohi, Islamic Azad University. <br/>
            &copy; 2025 All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};

export default App;
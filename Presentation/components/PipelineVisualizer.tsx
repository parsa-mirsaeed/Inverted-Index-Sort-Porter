import React, { useState, useMemo, useEffect } from 'react';
import { 
  rawDocuments, 
  tokenizeAndStem, 
  sortPairs, 
  buildIndex,
  searchIndex,
  getStem
} from '../utils/irLogic';
import { PipelineStep } from '../types';
import { 
  ChevronRight, 
  Database, 
  FileText, 
  Filter, 
  ListOrdered, 
  Search, 
  Terminal, 
  Play,
  RotateCcw,
  Binary
} from 'lucide-react';

const PipelineVisualizer: React.FC = () => {
  const [step, setStep] = useState<PipelineStep>(PipelineStep.INGESTION);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<number[]>([]);
  
  // Indexing State
  const [dictFilter, setDictFilter] = useState("");
  
  // Stemming State
  const [stemInput, setStemInput] = useState("");

  // Derived Data
  const intermediatePairs = useMemo(() => tokenizeAndStem(rawDocuments), []);
  const sortedPairs = useMemo(() => sortPairs(intermediatePairs), [intermediatePairs]);
  const finalIndex = useMemo(() => buildIndex(sortedPairs), [sortedPairs]);

  useEffect(() => {
    if (searchQuery) {
        setSearchResults(searchIndex(searchQuery, finalIndex));
    } else {
        setSearchResults([]);
    }
  }, [searchQuery, finalIndex]);

  const steps = [
    { id: PipelineStep.INGESTION, label: 'Ingestion', icon: FileText, desc: 'Raw document corpus' },
    { id: PipelineStep.TOKENIZATION, label: 'Tokenization', icon: Terminal, desc: 'Sanitization & splitting' },
    { id: PipelineStep.STEMMING, label: 'Stemming', icon: Filter, desc: 'Porter normalization' },
    { id: PipelineStep.SORTING, label: 'Sorting', icon: ListOrdered, desc: 'Sort-based construction' },
    { id: PipelineStep.INDEXING, label: 'Indexing', icon: Database, desc: 'Dictionary & Postings' },
    { id: PipelineStep.SEARCH, label: 'Retrieval', icon: Search, desc: 'Query processing' },
  ];

  // Highlight matches in a text string
  const HighlightedText = ({ text, term }: { text: string, term: string }) => {
    if (!term) return <span>{text}</span>;
    const parts = text.split(new RegExp(`(${term})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === term.toLowerCase() ? 
            <span key={i} className="bg-accent/30 text-accent-light font-bold px-0.5 rounded shadow-[0_0_10px_rgba(20,184,166,0.3)]">{part}</span> : 
            <span key={i} className="text-academic-300">{part}</span>
        )}
      </span>
    );
  };

  const renderContent = () => {
    switch (step) {
      case PipelineStep.INGESTION:
        return (
          <div className="grid gap-4 md:grid-cols-1">
            <div className="flex justify-between items-center mb-4">
               <span className="text-xs font-mono text-academic-500 uppercase">Input Stream</span>
               <span className="text-xs font-mono text-academic-500">{rawDocuments.length} Documents</span>
            </div>
            {rawDocuments.map(doc => (
              <div key={doc.id} className="glass-panel group p-5 rounded-lg flex items-start gap-5 hover:bg-white/5 transition-all border-l-2 border-l-transparent hover:border-l-accent relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Binary size={16} className="text-academic-600" />
                </div>
                <div className="bg-academic-800 text-academic-300 font-mono text-xs py-2 px-3 rounded-md w-16 text-center shrink-0 border border-academic-700 shadow-inner">
                  DOC {doc.id}
                </div>
                <p className="font-serif text-lg text-academic-100 leading-relaxed">"{doc.text}"</p>
              </div>
            ))}
          </div>
        );

      case PipelineStep.TOKENIZATION:
        return (
          <div className="grid gap-6 md:grid-cols-2">
            {rawDocuments.map(doc => (
              <div key={doc.id} className="glass-panel p-5 rounded-lg border-t-2 border-t-transparent hover:border-t-accent transition-all">
                 <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                    <div className="text-xs font-mono text-academic-500">SOURCE: DOC {doc.id}</div>
                    <Terminal size={12} className="text-academic-600" />
                 </div>
                 <div className="flex flex-wrap gap-2">
                    {doc.text.toLowerCase().match(/[a-z]+/g)?.map((token, idx) => (
                        <div key={idx} className="group relative">
                            <span className="bg-academic-800 px-3 py-1.5 rounded-md text-sm font-mono text-accent-light border border-academic-700 group-hover:border-accent/50 group-hover:bg-academic-700 transition-all cursor-default">
                                {token}
                            </span>
                        </div>
                    ))}
                 </div>
              </div>
            ))}
          </div>
        );

      case PipelineStep.STEMMING:
        return (
           <div className="grid md:grid-cols-3 gap-6 h-[500px]">
               {/* Left: Corpus Mapping */}
               <div className="md:col-span-2 glass-panel rounded-xl overflow-hidden flex flex-col">
                   <div className="bg-academic-800/50 p-3 border-b border-white/10 flex justify-between items-center">
                        <h4 className="text-sm font-bold text-academic-300 uppercase tracking-wider">Corpus Vocabulary</h4>
                        <span className="text-xs text-academic-500 font-mono">{intermediatePairs.length} Tokens</span>
                   </div>
                   <div className="overflow-y-auto custom-scrollbar flex-1 p-2">
                       <table className="w-full text-left text-sm">
                           <thead className="text-xs text-academic-500 font-mono bg-academic-900/50 sticky top-0">
                               <tr>
                                   <th className="px-4 py-2">Token</th>
                                   <th className="px-4 py-2 text-center">Transform</th>
                                   <th className="px-4 py-2">Stem (Porter)</th>
                               </tr>
                           </thead>
                           <tbody className="divide-y divide-white/5 font-mono">
                               {intermediatePairs.map((pair, idx) => (
                                   <tr key={idx} className="hover:bg-white/5 transition-colors">
                                       <td className="px-4 py-2 text-academic-300">{pair.originalToken}</td>
                                       <td className="px-4 py-2 text-center text-academic-600">→</td>
                                       <td className="px-4 py-2 text-accent-light">{pair.term}</td>
                                   </tr>
                               ))}
                           </tbody>
                       </table>
                   </div>
               </div>

               {/* Right: Interactive Lab */}
               <div className="glass-panel rounded-xl p-6 flex flex-col gap-6 bg-gradient-to-b from-academic-800/50 to-academic-900/50">
                   <div>
                       <h4 className="text-sm font-bold text-white mb-1">Stemming Lab</h4>
                       <p className="text-xs text-academic-400">Test the Porter algorithm dynamic mapping.</p>
                   </div>
                   
                   <div className="space-y-4">
                       <div>
                           <label className="text-xs text-academic-500 uppercase font-bold mb-1 block">Input Word</label>
                           <input 
                                type="text" 
                                value={stemInput}
                                onChange={(e) => setStemInput(e.target.value)}
                                placeholder="e.g. running"
                                className="w-full bg-academic-900 border border-academic-600 rounded p-2 text-white font-mono focus:border-accent focus:outline-none transition-colors"
                           />
                       </div>
                       
                       <div className="flex justify-center">
                           <div className="w-px h-8 bg-academic-600"></div>
                       </div>

                       <div>
                           <label className="text-xs text-academic-500 uppercase font-bold mb-1 block">Output Stem</label>
                           <div className="w-full bg-academic-900/50 border border-academic-700 border-dashed rounded p-3 text-center min-h-[3rem] flex items-center justify-center">
                                {stemInput ? (
                                    <span className="font-mono text-xl text-accent font-bold animate-pulse-once">
                                        {getStem(stemInput)}
                                    </span>
                                ) : (
                                    <span className="text-academic-600 text-sm italic">Waiting for input...</span>
                                )}
                           </div>
                       </div>
                   </div>

                   <div className="mt-auto bg-blue-500/10 border border-blue-500/20 p-3 rounded text-xs text-blue-200">
                       <strong>Note:</strong> Uses a lookup table derived from the specific project requirements for the provided corpus.
                   </div>
               </div>
           </div>
        );

      case PipelineStep.SORTING:
        return (
            <div className="grid md:grid-cols-2 gap-8 h-[600px]">
                <div className="flex flex-col h-full glass-panel rounded-xl overflow-hidden border-academic-700/50">
                    <div className="bg-academic-800/50 p-4 border-b border-white/10 flex justify-between items-center">
                        <h4 className="font-bold text-white text-sm flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> 
                            Intermediate Stream
                        </h4>
                        <span className="text-xs font-mono text-red-400/80">Unsorted</span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 font-mono text-xs space-y-1 bg-academic-900/50">
                        {intermediatePairs.map((p, i) => (
                            <div key={i} className="flex justify-between px-4 py-2 border-b border-white/5 text-academic-400 hover:text-white transition-colors">
                                <span>"{p.term}"</span>
                                <span className="text-academic-600">doc_id: {p.docId}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col h-full glass-panel rounded-xl overflow-hidden relative border-accent/30 shadow-[0_0_20px_rgba(20,184,166,0.05)]">
                     <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 z-10 bg-academic-900 p-2 rounded-full border border-academic-600 hidden md:block">
                        <ChevronRight className="text-white" />
                     </div>
                    <div className="bg-accent/10 p-4 border-b border-accent/20 flex justify-between items-center backdrop-blur-sm">
                        <h4 className="font-bold text-accent-light text-sm flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span> 
                            Sorted Stream
                        </h4>
                        <span className="text-xs font-mono text-accent">Primary: Term &darr;, Sec: DocID &uarr;</span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 font-mono text-sm space-y-1 bg-academic-900/80">
                        {sortedPairs.map((p, i) => (
                            <div key={i} className="flex justify-between px-4 py-2 bg-accent/5 border-b border-accent/10 text-accent-light hover:bg-accent/10 transition-colors">
                                <span className="font-bold">"{p.term}"</span>
                                <span className="opacity-70">doc_id: {p.docId}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );

      case PipelineStep.INDEXING:
        const filteredIndex = finalIndex.filter(entry => 
            entry.term.toLowerCase().includes(dictFilter.toLowerCase())
        );

        return (
            <div className="overflow-hidden glass-panel rounded-xl border-accent/20 flex flex-col h-[600px]">
                <div className="bg-academic-800 px-6 py-4 border-b border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                        <Database className="text-accent" />
                        <div>
                            <h3 className="font-serif text-xl text-white">Inverted Index</h3>
                            <div className="text-xs font-mono text-academic-400">
                                Dictionary Size: <span className="text-white">{finalIndex.length}</span> terms
                            </div>
                        </div>
                    </div>
                    <div className="relative w-full md:w-64">
                         <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-academic-500" />
                         <input 
                            type="text" 
                            placeholder="Filter Dictionary..." 
                            value={dictFilter}
                            onChange={(e) => setDictFilter(e.target.value)}
                            className="w-full bg-academic-900 border border-academic-600 rounded-full pl-10 pr-4 py-2 text-sm text-white focus:ring-1 focus:ring-accent focus:border-accent transition-all"
                         />
                    </div>
                </div>
                
                <div className="flex-1 overflow-hidden relative">
                    <div className="absolute inset-0 overflow-y-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-academic-800/80 sticky top-0 backdrop-blur z-10 text-xs uppercase tracking-wider text-academic-400 font-semibold border-b border-white/10">
                                <tr>
                                    <th className="px-6 py-4 w-1/3">Term (Key)</th>
                                    <th className="px-6 py-4">Postings List (Value)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredIndex.length > 0 ? (
                                    filteredIndex.map((entry, idx) => (
                                        <tr key={idx} className="hover:bg-white/5 transition-colors group">
                                            <td className="px-6 py-3">
                                                <span className="font-mono text-accent-light font-bold text-lg">{entry.term}</span>
                                            </td>
                                            <td className="px-6 py-3">
                                                <div className="flex flex-wrap gap-2">
                                                    {entry.postings.map(docId => (
                                                        <div key={docId} className="relative group/tooltip">
                                                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-academic-700 text-white font-mono text-sm border border-white/10 group-hover:bg-accent group-hover:border-accent transition-all cursor-default shadow-lg">
                                                                {docId}
                                                            </span>
                                                            {/* Tooltip for doc preview on hover */}
                                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-black border border-academic-600 rounded-lg shadow-xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-20 pointer-events-none">
                                                                <div className="text-xs text-academic-400 mb-1">Preview Doc #{docId}</div>
                                                                <div className="text-sm text-white italic font-serif">
                                                                    "{rawDocuments.find(d => d.id === docId)?.text}"
                                                                </div>
                                                                <div className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-2 h-2 bg-black border-r border-b border-academic-600 transform rotate-45"></div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={2} className="px-6 py-12 text-center text-academic-500">
                                            No terms found matching "{dictFilter}"
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );

      case PipelineStep.SEARCH:
        return (
            <div className="max-w-3xl mx-auto space-y-8 mt-4">
                <div className="relative group z-20">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                        <Search className="h-6 w-6 text-academic-500 group-focus-within:text-accent transition-colors" />
                    </div>
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Enter query (e.g., 'Caesar', 'Countrymen')..."
                        className="block w-full pl-14 pr-4 py-5 bg-academic-800/80 backdrop-blur border border-academic-600 rounded-2xl text-xl text-white placeholder-academic-500 focus:ring-2 focus:ring-accent focus:border-transparent transition-all shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
                    />
                    {searchQuery && (
                         <button 
                            onClick={() => setSearchQuery("")}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-academic-500 hover:text-white"
                         >
                            <RotateCcw size={16} />
                         </button>
                    )}
                </div>
                
                {searchQuery && (
                    <div className="animate-fade-in-up space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <span className="text-xs text-academic-400 uppercase tracking-widest font-bold">
                                {searchResults.length} Result{searchResults.length !== 1 ? 's' : ''} Found
                            </span>
                            <div className="flex items-center gap-2 text-xs font-mono text-academic-500 bg-academic-800 px-3 py-1 rounded-full border border-academic-700">
                                <span>Applied Stemming:</span>
                                <span className="text-accent-light">
                                    "{getStem(searchQuery.split(" ")[0] || "")}"
                                </span>
                            </div>
                        </div>
                        
                        {searchResults.length > 0 ? (
                            <div className="space-y-4">
                                {searchResults.map(docId => {
                                    const doc = rawDocuments.find(d => d.id === docId);
                                    if (!doc) return null;
                                    
                                    const stem = getStem(searchQuery.split(" ")[0] || "");
                                    // Find the word in the text that matches the stem
                                    const originalWord = doc.text.split(/[\s,.;]+/).find(w => getStem(w) === stem) || searchQuery;

                                    return (
                                        <div key={docId} className="glass-panel p-6 rounded-xl border-l-4 border-l-accent group hover:bg-white/5 transition-all">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold text-accent uppercase tracking-wider">Document #{docId}</span>
                                                    <span className="w-1 h-1 rounded-full bg-academic-500"></span>
                                                    <span className="text-xs text-academic-500">Relevance Score: 1.0</span>
                                                </div>
                                                <Play size={12} className="text-academic-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                            
                                            {/* Snippet View */}
                                            <div className="font-serif text-lg text-academic-200 leading-relaxed">
                                                <HighlightedText text={doc.text} term={originalWord} />
                                            </div>
                                            
                                            <div className="mt-4 pt-3 border-t border-white/5 flex gap-2">
                                                <div className="text-[10px] font-mono text-academic-500 bg-academic-900 px-2 py-1 rounded border border-academic-700">
                                                    TERM_FREQ: 1
                                                </div>
                                                <div className="text-[10px] font-mono text-academic-500 bg-academic-900 px-2 py-1 rounded border border-academic-700">
                                                    POS: {doc.text.toLowerCase().indexOf(originalWord.toLowerCase())}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-16 border border-dashed border-academic-700 rounded-xl text-academic-500 bg-academic-800/30">
                                <Search size={48} className="mb-4 text-academic-700" />
                                <p className="text-lg">No documents found matching "{searchQuery}"</p>
                                <p className="text-sm mt-2">Try "Romans", "Caesar", or "Bury"</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-12 px-4 md:px-8">
      {/* Stepper Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-2 md:gap-4 mb-12">
        {steps.map((s, index) => {
          const isActive = step === s.id;
          const isPast = step > s.id;
          const Icon = s.icon;
          
          return (
            <button
              key={s.id}
              onClick={() => setStep(s.id)}
              className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 border backdrop-blur-sm relative overflow-hidden group
                ${isActive 
                    ? 'bg-accent/10 border-accent text-accent-light shadow-[0_0_15px_rgba(20,184,166,0.2)]' 
                    : isPast 
                        ? 'bg-academic-800/50 border-academic-700 text-academic-400 hover:bg-academic-800 hover:border-academic-600'
                        : 'bg-transparent border-academic-800 text-academic-600 hover:bg-academic-800 hover:border-academic-700 hover:text-academic-500'
                }
              `}
            >
              {isActive && <div className="absolute inset-0 bg-accent/5 animate-pulse-slow"></div>}
              <Icon size={20} className={`mb-2 ${isActive ? 'scale-110' : ''} transition-transform`} />
              <span className="text-[10px] font-bold uppercase tracking-wider">{s.label}</span>
              
              {/* Connector Lines for Desktop */}
              {index < steps.length - 1 && (
                 <div className="hidden md:block absolute top-1/2 -right-4 w-4 h-px bg-academic-800 z-[-1]"></div>
              )}
            </button>
          );
        })}
      </div>

      {/* Header for Current Step */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 animate-fade-in border-b border-academic-700 pb-6">
        <div>
            <div className="text-xs font-mono text-accent mb-2 uppercase tracking-widest">Phase 0{step + 1}</div>
            <h2 className="text-3xl font-serif font-bold text-white mb-2">{steps[step].label}</h2>
            <p className="text-academic-400 max-w-2xl">{steps[step].desc}</p>
        </div>
        {/* Step Indicator dots */}
        <div className="flex gap-1.5 pb-2">
            {steps.map(s => (
                <div key={s.id} className={`w-1.5 h-1.5 rounded-full transition-all ${s.id === step ? 'bg-accent w-6' : 'bg-academic-700'}`}></div>
            ))}
        </div>
      </div>

      {/* Main Content Stage */}
      <div className="min-h-[600px] animate-fade-in transition-all relative">
          <div className="absolute inset-0 bg-academic-900/20 backdrop-blur-[2px] -z-10 rounded-3xl"></div>
          {renderContent()}
      </div>
    </div>
  );
};

export default PipelineVisualizer;
import React from 'react';
import { ArrowDown } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center p-8 text-center border-b border-academic-700 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-800 via-academic-900 to-black overflow-hidden">
      
      {/* Abstract Background Element */}
      <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
         <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent rounded-full mix-blend-overlay filter blur-[128px]"></div>
         <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-900 rounded-full mix-blend-overlay filter blur-[128px]"></div>
      </div>

      <div className="relative z-10 max-w-4xl space-y-8 animate-fade-in-up">
        <div className="inline-block px-3 py-1 mb-4 text-xs font-mono tracking-widest text-accent-light border border-accent/20 rounded-full bg-accent/5">
          IR_01 &bull; IR_02 &bull; IR_04
        </div>
        
        <h1 className="font-serif text-5xl md:text-7xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-academic-400">
          Foundations of <br/> Information Retrieval
        </h1>
        
        <div className="h-px w-24 bg-accent mx-auto my-6"></div>

        <p className="text-xl md:text-2xl text-academic-300 font-light italic">
          Artifact: Inverted Index with Sort-Based Construction <br className="hidden md:block" /> & Porter Stemming
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left mt-12 bg-academic-800/50 backdrop-blur-sm p-8 rounded-xl border border-academic-700">
          <div>
            <h3 className="text-xs uppercase tracking-widest text-academic-500 mb-2">Engineered By</h3>
            <p className="text-lg font-semibold text-white">Seyed Parsa Qazi MirSaeed</p>
            <p className="text-sm text-academic-400">Dept. of Computer Engineering</p>
          </div>
          <div className="md:text-right">
            <h3 className="text-xs uppercase tracking-widest text-academic-500 mb-2">Supervisor</h3>
            <p className="text-lg font-semibold text-white">Dr. Hadi Saboohi</p>
            <p className="text-sm text-academic-400">Islamic Azad University, Karaj Branch</p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ArrowDown className="text-academic-500 w-6 h-6" />
      </div>
    </section>
  );
};

export default Hero;
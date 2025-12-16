import React from 'react';

interface CodeBlockProps {
    title: string;
    code: string;
    language?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ title, code }) => {
    return (
        <div className="rounded-lg overflow-hidden border border-academic-700 bg-[#0d1117] font-mono text-sm my-6">
            <div className="flex items-center justify-between px-4 py-2 bg-academic-800/50 border-b border-academic-700">
                <span className="text-xs text-academic-400 font-bold uppercase tracking-wider">{title}</span>
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/20"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/20"></div>
                </div>
            </div>
            <div className="p-4 overflow-x-auto">
                <pre className="text-academic-300">
                    <code>{code}</code>
                </pre>
            </div>
        </div>
    );
};

export default CodeBlock;
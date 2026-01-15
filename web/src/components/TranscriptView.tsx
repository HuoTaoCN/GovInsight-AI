import React from 'react';
import { User, Headphones, Building2 } from 'lucide-react';

export const TranscriptView: React.FC<{ content: string }> = ({ content }) => {
  // Simple parser to split dialogue based on common prefixes
  const lines = content.trim().split('\n').filter(line => line.trim() !== '');

  return (
    <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-[500px] overflow-y-auto font-mono text-sm">
      {lines.map((line, idx) => {
        let role = 'unknown';
        let text = line;
        
        if (line.startsWith('市民：')) {
          role = 'citizen';
          text = line.replace('市民：', '');
        } else if (line.startsWith('话务员：')) {
          role = 'agent';
          text = line.replace('话务员：', '');
        } else if (line.includes('：')) {
          // Generic department handling
          role = 'dept';
        }

        return (
          <div key={idx} className="flex gap-3">
            <div className="shrink-0 mt-0.5">
              {role === 'citizen' && <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center"><User size={16} className="text-blue-600"/></div>}
              {role === 'agent' && <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center"><Headphones size={16} className="text-purple-600"/></div>}
              {role === 'dept' && <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center"><Building2 size={16} className="text-orange-600"/></div>}
              {role === 'unknown' && <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center"><span className="text-xs text-gray-500">?</span></div>}
            </div>
            <div className="flex-1">
              <p className="text-gray-800 leading-relaxed">{text}</p>
              {role !== 'unknown' && <span className="text-xs text-gray-400 block mt-1">{line.split('：')[0]}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
};

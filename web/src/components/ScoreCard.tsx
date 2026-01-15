import React from 'react';
import type { ScoreDimension } from '../types/quality_inspection';
import { CheckCircle, XCircle } from 'lucide-react';
import { clsx } from 'clsx';

interface ScoreCardProps {
  title: string;
  data: ScoreDimension;
  maxScore: number;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({ title, data, maxScore }) => {
  const percentage = (data.score / maxScore) * 100;
  
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-600">
            {data.judgement}
          </span>
          <span className={clsx(
            "text-lg font-bold",
            percentage >= 90 ? "text-green-600" : percentage >= 60 ? "text-yellow-600" : "text-red-600"
          )}>
            {data.score} <span className="text-xs text-gray-400">/ {maxScore}</span>
          </span>
        </div>
      </div>
      
      <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
        <div 
          className={clsx(
            "h-2 rounded-full transition-all duration-500",
            percentage >= 90 ? "bg-green-500" : percentage >= 60 ? "bg-yellow-500" : "bg-red-500"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {data.issues.length > 0 ? (
        <ul className="space-y-1">
          {data.issues.map((d, i) => (
            <li key={i} className="text-xs text-red-600 flex items-start gap-1">
              <XCircle size={12} className="mt-0.5 shrink-0" />
              <span>{d}</span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-xs text-green-600 flex items-center gap-1">
          <CheckCircle size={12} />
          <span>无扣分项</span>
        </div>
      )}
    </div>
  );
};

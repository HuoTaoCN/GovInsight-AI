import React from 'react';
import { FileCheck, AlertTriangle, ArrowRight, FileText } from 'lucide-react';
import { clsx } from 'clsx';
import { CheckCircle } from 'lucide-react';

const PRIORITY_MAP: Record<string, string> = {
  'Normal': '普通',
  'Urgent': '紧急',
  'Emergency': '特急'
};

interface RevisionViewProps {
  isAnalyzed?: boolean;
  original?: {
    title: string;
    description: string;
    priority: string;
  };
  revision?: {
    title: string;
    description: string;
    priority: string;
  } | null;
}

export const RevisionView: React.FC<RevisionViewProps> = ({ isAnalyzed = false, original, revision }) => {
  // Logic:
  // 1. Not Analyzed -> Show "Waiting"
  // 2. Analyzed BUT No Revision -> Show "Good Quality"
  // 3. Analyzed AND Has Revision -> Show "Comparison"

  if (!isAnalyzed) {
    return (
      <div className="bg-white rounded-lg border border-blue-200 shadow-sm overflow-hidden ring-2 ring-blue-50">
        <div className="bg-blue-50 border-b border-blue-100 px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-blue-700" />
            <h3 className="font-bold text-blue-800">AI 建议修正工单</h3>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-8 text-gray-400">
          <div className="bg-gray-50 p-3 rounded-full mb-3">
            <FileText size={24} className="opacity-20" />
          </div>
          <p className="text-xs font-medium">待生成...</p>
        </div>
      </div>
    );
  }

  if (!revision || !original) {
    return (
      <div className="bg-white rounded-lg border border-blue-200 shadow-sm overflow-hidden ring-2 ring-blue-50">
        <div className="bg-blue-50 border-b border-blue-100 px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-blue-700" />
            <h3 className="font-bold text-blue-800">AI 建议修正工单</h3>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-8 text-green-600 bg-green-50/50">
          <div className="bg-green-100 p-3 rounded-full mb-3">
            <CheckCircle size={24} className="text-green-600" />
          </div>
          <p className="text-sm font-bold">工单质量优秀</p>
          <p className="text-xs text-green-700 mt-1 opacity-80">无需修正</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-blue-200 shadow-sm overflow-hidden ring-2 ring-blue-50">
      <div className="bg-blue-50 border-b border-blue-100 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FileText size={18} className="text-blue-700" />
          <h3 className="font-bold text-blue-800">AI 建议修正工单</h3>
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        {/* Title Comparison */}
        <div>
          <div className="text-xs font-bold text-gray-500 mb-1 uppercase">工单标题</div>
          {original.title !== revision.title ? (
             <div className="flex flex-col gap-2">
               <div className="text-sm text-gray-500 line-through bg-gray-50 p-2 rounded border border-dashed">{original.title}</div>
               <div className="text-sm font-bold text-gray-800 bg-green-50 p-2 rounded border border-green-200 flex items-center gap-2">
                 <ArrowRight size={14} className="text-green-600" />
                 {revision.title}
               </div>
             </div>
          ) : (
             <div className="text-sm text-gray-800 bg-gray-50 p-2 rounded border border-gray-200">{original.title}</div>
          )}
        </div>

        {/* Priority Comparison */}
        <div>
           <div className="text-xs font-bold text-gray-500 mb-1 uppercase">优先级</div>
           {original.priority !== revision.priority ? (
              <div className="flex items-center gap-3">
                 <span className="text-xs text-gray-500 line-through">{PRIORITY_MAP[original.priority] || original.priority}</span>
                 <ArrowRight size={12} className="text-gray-400" />
                 <span className={clsx(
                   "text-xs font-bold px-2 py-1 rounded",
                   revision.priority === 'Emergency' ? "bg-red-100 text-red-700" :
                   revision.priority === 'Urgent' ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"
                 )}>
                   {PRIORITY_MAP[revision.priority] || revision.priority}
                 </span>
              </div>
           ) : (
              <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">{PRIORITY_MAP[original.priority] || original.priority}</span>
           )}
        </div>

        {/* Description Comparison */}
        <div>
           <div className="text-xs font-bold text-gray-500 mb-1 uppercase">问题描述</div>
           <div className="bg-green-50 p-3 rounded-lg border border-green-200 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
             {revision.description}
           </div>
           <div className="mt-2 flex items-start gap-2 text-xs text-orange-600 bg-orange-50 p-2 rounded">
             <AlertTriangle size={14} className="shrink-0 mt-0.5" />
             AI 已自动补充缺失的关键细节（如时间、地点、频率、风险词等），请人工核对后采信。
           </div>
        </div>
      </div>
    </div>
  );
};

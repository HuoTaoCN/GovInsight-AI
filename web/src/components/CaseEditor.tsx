import React from 'react';
import type { WorkOrderInput } from '../types/quality_inspection';
import { User, Phone, FileText, MessageSquare, Edit3 } from 'lucide-react';
import { TranscriptView } from './TranscriptView';

interface CaseEditorProps {
  input: WorkOrderInput;
  onChange: (newInput: WorkOrderInput) => void;
}

export const CaseEditor: React.FC<CaseEditorProps> = ({ input, onChange }) => {
  const { form_data, transcript, metadata } = input;

  const handleFormChange = (field: keyof typeof form_data, value: string) => {
    onChange({
      ...input,
      form_data: {
        ...form_data,
        [field]: value,
      },
    });
  };

  const handleMetadataChange = (field: keyof typeof metadata, value: string) => {
    onChange({
      ...input,
      metadata: {
        ...metadata,
        [field]: value,
      },
    });
  };

  const handleTranscriptChange = (value: string) => {
    onChange({
      ...input,
      transcript: value,
    });
  };

  return (
    <div className="flex flex-col h-full gap-3 overflow-hidden">
      {/* Title Header - Fixed */}
      <div className="flex items-center gap-2 shrink-0">
        <Edit3 size={18} className="text-gray-600" />
        <h2 className="text-lg font-bold text-gray-800">1. 手动录入测试</h2>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto min-h-0 pr-1 space-y-3 flex flex-col">
        {/* Work Order Form Editor */}
        <div className="bg-white rounded-lg border border-blue-200 shadow-sm overflow-hidden ring-2 ring-blue-50 shrink-0">
          <div className="bg-blue-50 border-b border-blue-100 px-3 py-2">
            <div className="flex flex-wrap justify-between items-center gap-y-2 gap-x-2">
              <div className="flex items-center gap-2 shrink-0">
                <FileText size={16} className="text-blue-700" />
                <h3 className="font-bold text-blue-800 whitespace-nowrap text-sm">工单详情</h3>
              </div>
              <div className="flex flex-wrap gap-2 items-center ml-auto">
                <div className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-blue-200 shadow-sm">
                   <span className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">NO.</span>
                   <input 
                     type="text"
                     value={metadata.ticket_id}
                     onChange={(e) => handleMetadataChange('ticket_id', e.target.value)}
                     className="text-xs font-mono font-bold text-gray-700 w-24 outline-none bg-transparent"
                   />
                </div>
                <div className="flex gap-1">
                  <select
                    value={form_data.priority}
                    onChange={(e) => handleFormChange('priority', e.target.value as any)}
                    className="px-2 py-1 text-xs rounded border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700 shadow-sm cursor-pointer hover:border-blue-300 transition-colors"
                  >
                    <option value="Normal">普通</option>
                    <option value="Urgent">紧急</option>
                    <option value="Emergency">特急</option>
                  </select>
                  <select
                    value={form_data.handling_type || 'Dispatch'}
                    onChange={(e) => handleFormChange('handling_type', e.target.value as any)}
                    className="px-2 py-1 text-xs rounded border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700 shadow-sm cursor-pointer hover:border-blue-300 transition-colors"
                  >
                    <option value="Dispatch">转办</option>
                    <option value="Direct">直接办结</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">工单标题</label>
              <input
                type="text"
                value={form_data.title}
                onChange={(e) => handleFormChange('title', e.target.value)}
                className="w-full text-sm font-medium text-gray-900 bg-gray-50 p-2 rounded border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                placeholder="请输入工单标题"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">问题描述 (话务员录入)</label>
              <textarea
                value={form_data.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                className="w-full text-sm text-gray-800 bg-white p-3 rounded border border-gray-200 min-h-[120px] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all resize-y"
                placeholder="请输入话务员记录的详细描述..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-1 text-xs font-semibold text-gray-500 mb-1">
                  <User size={12} /> 市民姓名
                </label>
                <input
                  type="text"
                  value={form_data.citizen_name}
                  onChange={(e) => handleFormChange('citizen_name', e.target.value)}
                  className="w-full text-sm text-gray-900 p-2 rounded border border-gray-200 focus:border-blue-500 outline-none"
                  placeholder="市民姓名"
                />
              </div>
              <div>
                <label className="flex items-center gap-1 text-xs font-semibold text-gray-500 mb-1">
                  <Phone size={12} /> 联系电话
                </label>
                <input
                  type="text"
                  value={form_data.citizen_phone}
                  onChange={(e) => handleFormChange('citizen_phone', e.target.value)}
                  className="w-full text-sm text-gray-900 font-mono p-2 rounded border border-gray-200 focus:border-blue-500 outline-none"
                  placeholder="联系电话"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="relative shrink-0">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-gray-50 px-2 text-sm text-gray-500">VS</span>
          </div>
        </div>

        {/* Transcript Editor - Replaced with TranscriptView that supports Editing/Upload */}
        <div className="bg-white rounded-lg border border-purple-200 shadow-sm overflow-hidden ring-2 ring-purple-50 flex flex-col flex-1 min-h-[200px]">
          <div className="bg-purple-50 border-b border-purple-100 px-4 py-3 flex items-center gap-2 shrink-0">
            <MessageSquare size={18} className="text-purple-700" />
            <h3 className="font-bold text-purple-800">通话录音转写 (事实依据)</h3>
          </div>
          <div className="p-4 flex-1 h-full overflow-hidden flex flex-col">
            <TranscriptView 
              content={transcript} 
              onUpdate={handleTranscriptChange} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

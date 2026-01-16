import React from 'react';
import type { WorkOrderInput } from '../types/quality_inspection';
import { User, Phone, FileText, MessageSquare, Edit3 } from 'lucide-react';

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
      <div className="shrink-0 flex flex-col gap-2 max-h-[60%] overflow-y-auto pr-1">
        <div className="flex items-center gap-2 mb-1 shrink-0">
          <Edit3 size={18} className="text-gray-600" />
          <h2 className="text-lg font-bold text-gray-800">1. 手动录入测试</h2>
        </div>

        {/* Work Order Form Editor */}
        <div className="bg-white rounded-lg border border-blue-200 shadow-sm overflow-hidden ring-2 ring-blue-50 shrink-0">
          <div className="bg-blue-50 border-b border-blue-100 px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <FileText size={18} className="text-blue-700" />
              <h3 className="font-bold text-blue-800">工单详情</h3>
            </div>
            <div className="flex gap-2 items-center">
              <div className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-blue-200">
                 <span className="text-xs text-gray-500 font-mono">No.</span>
                 <input 
                   type="text"
                   value={metadata.ticket_id}
                   onChange={(e) => handleMetadataChange('ticket_id', e.target.value)}
                   className="text-xs font-mono font-bold text-gray-700 w-28 outline-none bg-transparent"
                 />
              </div>
              <select
                value={form_data.priority}
                onChange={(e) => handleFormChange('priority', e.target.value as any)}
                className="px-2 py-1 text-xs rounded border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700"
              >
                <option value="Normal">普通</option>
                <option value="Urgent">紧急</option>
                <option value="Emergency">特急</option>
              </select>
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
      </div>

      {/* Transcript Editor */}
      <div className="flex-1 min-h-0 bg-white rounded-lg border border-purple-200 shadow-sm overflow-hidden ring-2 ring-purple-50 flex flex-col">
        <div className="bg-purple-50 border-b border-purple-100 px-4 py-3 flex items-center gap-2 shrink-0">
          <MessageSquare size={18} className="text-purple-700" />
          <h3 className="font-bold text-purple-800">通话录音转写 (事实依据)</h3>
        </div>
        <div className="p-4 flex-1">
          <textarea
            value={transcript}
            onChange={(e) => handleTranscriptChange(e.target.value)}
            className="w-full h-full text-sm leading-relaxed text-gray-700 p-4 bg-gray-50 rounded-lg border border-gray-200 font-mono focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none resize-none"
            placeholder={`市民：你好，我想反映...
话务员：请问具体位置是？
市民：...`}
          />
        </div>
      </div>
    </div>
  );
};

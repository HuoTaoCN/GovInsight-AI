import React from 'react';
import type { WorkOrderInput } from '../types/quality_inspection';
import { User, Phone, FileText } from 'lucide-react';
import { clsx } from 'clsx';

export const WorkOrderView: React.FC<{ input: WorkOrderInput }> = ({ input }) => {
  const { form_data, metadata } = input;

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="bg-slate-50 border-b border-gray-200 px-4 py-3 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-2 shrink-0">
          <FileText size={18} className="text-slate-600" />
          <h3 className="font-bold text-slate-800 whitespace-nowrap">工单详情</h3>
        </div>
        <div className="flex gap-2 ml-auto">
          <span className="px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded-full font-mono">
            {metadata.ticket_id}
          </span>
          <span className={clsx(
            "px-2 py-0.5 text-xs rounded-full font-bold",
            form_data.priority === 'Emergency' ? "bg-red-100 text-red-700" :
            form_data.priority === 'Urgent' ? "bg-orange-100 text-orange-700" :
            "bg-blue-100 text-blue-700"
          )}>
            {form_data.priority === 'Normal' ? '普通' : 
             form_data.priority === 'Urgent' ? '紧急' : '特急'}
          </span>
          <span className={clsx(
            "px-2 py-0.5 text-xs rounded-full font-bold",
            form_data.handling_type === 'Direct' ? "bg-green-100 text-green-700" : "bg-purple-100 text-purple-700"
          )}>
            {form_data.handling_type === 'Direct' ? '直接办结' : '转办'}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Title & Description */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">工单标题</label>
          <div className="text-sm font-medium text-gray-900 bg-gray-50 p-2 rounded border border-gray-100">
            {form_data.title}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">问题描述 (话务员录入)</label>
          <div className="text-sm text-gray-800 bg-white p-3 rounded border border-gray-200 min-h-[80px] leading-relaxed">
            {form_data.description}
          </div>
        </div>

        {/* Form Grid - Simplified */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-1 text-xs font-semibold text-gray-500 mb-1">
              <User size={12} /> 市民姓名
            </label>
            <div className="text-sm text-gray-900">{form_data.citizen_name}</div>
          </div>
          <div>
            <label className="flex items-center gap-1 text-xs font-semibold text-gray-500 mb-1">
              <Phone size={12} /> 联系电话
            </label>
            <div className="text-sm text-gray-900 font-mono">{form_data.citizen_phone}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

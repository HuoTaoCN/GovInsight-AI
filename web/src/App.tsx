import { useState } from 'react';
import { MOCK_CASES } from './data/mock_cases';
import { TranscriptView } from './components/TranscriptView';
import { ScoreCard } from './components/ScoreCard';
import { WorkOrderView } from './components/WorkOrderView';
import { CaseEditor } from './components/CaseEditor';
import { Tooltip } from './components/Tooltip';
import { Logo } from './components/Logo';
import { Activity, BrainCircuit, Play, MessageSquare, FileInput, ShieldCheck, UserCheck, CheckCircle, Edit3, HelpCircle } from 'lucide-react';
import { clsx } from 'clsx';
import type { EvaluationResult, WorkOrderInput } from './types/quality_inspection';

const CUSTOM_CASE_ID = 'custom-case';

// Initial empty state for custom case
const INITIAL_CUSTOM_INPUT: WorkOrderInput = {
  transcript: '',
  form_data: {
    title: '',
    description: '',
    citizen_name: '',
    citizen_phone: '',
    priority: 'Normal'
  },
  metadata: {
    ticket_id: '20250114-NEW',
    category: '待分类',
    timestamp: new Date().toLocaleString(),
    handling_department: '待分配',
    status: 'Draft'
  },
  history_factors: {
    agent_consistency_score: 1.0,
    has_callback_complaint: false
  }
};

import { RevisionView } from './components/RevisionView';

function App() {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(MOCK_CASES[0].id);
  const [customInput, setCustomInput] = useState<WorkOrderInput>(INITIAL_CUSTOM_INPUT);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<EvaluationResult | null>(null);

  const isCustomMode = true; // Always enable editing mode

  // Helper to get current input data
  const getCurrentInput = () => {
    return customInput;
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setShowResult(false);
    setAnalysisResult(null);

    const inputData = getCurrentInput();

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcript: inputData.transcript,
          form_data: inputData.form_data,
          history_factors: inputData.history_factors
        }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const result = await response.json();
      console.log("API Result:", result); // Debug: Check if suggested_revision exists
      console.log("Suggested Revision:", result.suggested_revision); 
      setAnalysisResult(result);
      setShowResult(true);
    } catch (error) {
      console.error("Failed to analyze:", error);
      
      // Fallback for demo if API fails
      if (!isCustomMode) {
        alert("AI 服务暂时不可用（可能欠费或网络问题）。已自动切换为 Mock 演示数据。");
        setAnalysisResult(null); // Ensure displayResult falls back to mock
        setShowResult(true);
      } else {
        alert("AI 分析失败，请检查后端服务是否启动。");
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCaseChange = (id: string) => {
    setSelectedCaseId(id);
    setAnalysisResult(null);
    
    // When a case is selected (Mock or Custom), populate the input form
    if (id === CUSTOM_CASE_ID) {
      // If switching to Custom, keep existing input or reset if needed (keeping helps continuity)
      // For now, let's keep it as is.
      setShowResult(false);
    } else {
      // If switching to a Mock Case, LOAD it into the customInput state so it's editable
      const mockCase = MOCK_CASES.find(c => c.id === id);
      if (mockCase) {
        setCustomInput(mockCase.input);
        // We want to effectively treat this as "Custom Mode" but pre-filled
        setSelectedCaseId(CUSTOM_CASE_ID); 
        
        // Restore the mock result initially so the user sees the demo state
        setAnalysisResult(mockCase.result);
        setShowResult(true);
      } else {
        setShowResult(false);
      }
    }
  };

  const currentMockCase = MOCK_CASES.find(c => c.id === selectedCaseId);
  // Fallback to mock result if analysisResult is null and we are not in custom mode
  const displayResult = analysisResult || (selectedCaseId !== CUSTOM_CASE_ID ? currentMockCase?.result : null);

  // Helper to localize overall_level
  const getLocalizedLevel = (level: string) => {
    const map: Record<string, string> = {
      'Excellent': '优秀',
      'Qualified': '合格',
      'Risk': '存在风险',
      'Unqualified': '不合格'
    };
    return map[level] || level;
  };

  // Helper to get action status and color
  const getActionStatus = (result: EvaluationResult) => {
    const level = getLocalizedLevel(result.overall_level);
    const isBadQuality = ['不合格', '存在风险'].includes(level);
    const isHighConfidence = result.confidence_bucket === 'High';
    const forceReview = result.need_human_review;

    // 逻辑判定优先级
    // 1. 如果 AI 不确定（Confidence != High 或明确要求复核），则必须人工复核，不能自动通过，也不能直接退回（防误判）
    //    但是，如果 AI 觉得是“不合格”但置信度低，是否应该退回？为了稳妥，先让人看一眼确认是否真的不合格。
    //    修正逻辑：只要 AI 觉得是“不合格”或“存在风险”，不管置信度如何，都倾向于“退回重写”的严重性展示。
    //    但是用户说“置信度低 -> 人工复核”。
    //    所以：
    //    Case A: High Conf + Bad Quality -> 退回重写 (Red)
    //    Case B: Low Conf + Bad Quality -> 人工复核 (Orange)
    //    Case C: High Conf + Good Quality -> 通过 (Green)
    //    Case D: Low Conf + Good Quality -> 人工复核 (Orange)
    
    if (forceReview || !isHighConfidence) {
       return { type: 'review', label: '人工复核 (Human Review)', color: 'bg-orange-500' };
    }
    
    if (isBadQuality) {
       return { type: 'rewrite', label: '退回重写 (Rewrite)', color: 'bg-red-600' };
    }

    return { type: 'pass', label: '通过 (Pass)', color: 'bg-green-600' };
  };

  const actionStatus = displayResult ? getActionStatus(displayResult) : null;

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-slate-900 text-white p-4 shadow-md shrink-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Logo className="text-blue-400" />
            <div>
              <h1 className="text-xl font-bold tracking-tight">GovInsight-AI 热线工单质量智能检测系统 <span className="text-xs font-normal text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded ml-2">V0.3.2</span></h1>
              <p className="text-xs text-slate-400">Intelligent Quality Inspection System for Government Service Hotline Work Orders</p>
            </div>
          </div>
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full shadow-lg text-sm font-bold flex items-center gap-2 transition-all disabled:opacity-50 disabled:scale-95 active:scale-95"
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"/>
                AI 正在质检...
              </>
            ) : (
              <>
                <Play size={16} fill="currentColor" />
                开始智能质检
              </>
            )}
          </button>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 grid grid-cols-12 gap-4 min-h-0 overflow-hidden">
        {/* Sidebar: Case Selector */}
        <div className="col-span-12 lg:col-span-2 flex flex-col h-full overflow-hidden">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 shrink-0">测试案例</h2>
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {MOCK_CASES.map((c) => (
              <button
                key={c.id}
                onClick={() => handleCaseChange(c.id)}
                className={clsx(
                  "w-full text-left p-3 rounded-lg border transition-all text-sm",
                  selectedCaseId === c.id
                    ? "bg-white border-blue-500 shadow-md ring-1 ring-blue-500"
                    : "bg-white border-gray-200 hover:border-blue-300 text-gray-600"
                )}
              >
                <div className="font-bold mb-1">{c.name}</div>
                <div className="text-xs text-gray-400 line-clamp-2">{c.description}</div>
              </button>
            ))}
            
            {/* Custom Case Button */}
            <button
              onClick={() => handleCaseChange(CUSTOM_CASE_ID)}
              className={clsx(
                "w-full text-left p-3 rounded-lg border-2 border-dashed transition-all text-sm flex items-center gap-2 group",
                isCustomMode
                  ? "bg-blue-50 border-blue-500 text-blue-700"
                  : "bg-transparent border-gray-300 text-gray-500 hover:border-blue-400 hover:text-blue-600"
              )}
            >
              <div className="bg-white p-1.5 rounded-full border shadow-sm group-hover:scale-110 transition-transform">
                <Edit3 size={14} />
              </div>
              <div className="font-bold">手动录入测试</div>
            </button>
          </div>
        </div>

        {/* Center: Work Order & Transcript Comparison */}
        <div className="col-span-12 lg:col-span-3 flex flex-col h-full gap-3 overflow-hidden">
            <CaseEditor 
              input={customInput} 
              onChange={setCustomInput} 
            />
            <div className="flex-1 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-0">
              <div className="bg-slate-50 border-b border-gray-200 px-4 py-3 flex items-center gap-2 shrink-0">
                <MessageSquare size={18} className="text-slate-600" />
                <h3 className="font-bold text-slate-800">通话录音转写 (事实依据)</h3>
              </div>
              <div className="p-4 flex-1 min-h-0 overflow-hidden">
                <TranscriptView content={getCurrentInput().transcript} />
              </div>
            </div>
        </div>

        {/* Right: AI Analysis Result */}
        <div className="col-span-12 lg:col-span-3 flex flex-col h-full gap-3 overflow-hidden">
          <div className="shrink-0 flex items-center gap-2 mb-0">
            <BrainCircuit size={18} className="text-purple-600" />
            <h2 className="text-lg font-bold text-gray-800">2. AI 质检报告</h2>
          </div>

          {/* Score Card Container */}
          <div className="flex-[2.33] min-h-0 bg-white rounded-lg border border-blue-200 shadow-sm ring-2 ring-blue-50 flex flex-col">
            <div className="bg-blue-50 border-b border-blue-100 px-4 py-2.5 flex items-center gap-2 shrink-0 rounded-t-lg">
               <Activity size={18} className="text-blue-700" />
               <h3 className="font-bold text-blue-800">质检得分</h3>
            </div>
            
            <div className="p-3 flex-1 overflow-y-auto">
              {showResult && displayResult ? (
                <div className="space-y-3">
                  {/* Total Score Summary */}
                  <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex justify-between items-center">
                     <div>
                       <div className="text-xs text-gray-500 uppercase font-bold">综合评分</div>
                       <div className={clsx(
                          "text-3xl font-black mt-0.5",
                          displayResult.total_score >= 90 ? "text-green-600" :
                          displayResult.total_score >= 75 ? "text-yellow-600" : "text-red-600"
                        )}>
                          {displayResult.total_score}
                        </div>
                     </div>
                     <div className="text-right">
                        <div className="text-sm font-bold text-gray-600">{getLocalizedLevel(displayResult.overall_level)}</div>
                     </div>
                  </div>

                  {/* Score Cards (Priority Display) */}
                  <div className="space-y-2">
                      <ScoreCard 
                        title="A. 诉求完整性 (35%)" 
                        data={displayResult.scores.completeness} 
                        maxScore={35} 
                        description={[
                          "完整记录核心诉求",
                          "包含时间、地点、人物等关键要素",
                          "包含起因、经过、结果及特殊要求"
                        ]}
                      />
                      <ScoreCard 
                        title="B. 语义一致性 (20%)" 
                        data={displayResult.scores.consistency} 
                        maxScore={20} 
                        description={[
                          "真实还原录音内容",
                          "无歪曲事实或主观臆断",
                          "无关键信息偏差"
                        ]}
                      />
                      <ScoreCard 
                        title="C. 表述规范性 (20%)" 
                        data={displayResult.scores.clarity} 
                        maxScore={20} 
                        description={[
                          "语言通顺，逻辑清晰",
                          "用词规范，无歧义表达",
                          "无错别字及格式错误"
                        ]}
                      />
                      <ScoreCard 
                        title="D. 风险敏感性 (25%)" 
                        data={displayResult.scores.risk_awareness} 
                        maxScore={25} 
                        description={[
                          "识别情绪风险（如愤怒、扬言）",
                          "识别舆情风险及群体事件隐患",
                          "对安全隐患进行恰当标记"
                        ]}
                      />
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                  <div className="bg-gray-50 p-3 rounded-full mb-3">
                    <Activity size={24} className="opacity-20" />
                  </div>
                  <p className="text-xs font-medium">待评分...</p>
                </div>
              )}
            </div>
          </div>

          {/* Reasoning Container */}
          <div className="flex-1 min-h-0 bg-white rounded-lg border border-blue-200 shadow-sm overflow-hidden ring-2 ring-blue-50 flex flex-col">
            <div className="bg-blue-50 border-b border-blue-100 px-4 py-3 flex items-center gap-2 shrink-0">
               <BrainCircuit size={18} className="text-blue-700" />
               <h3 className="font-bold text-blue-800">思考过程</h3>
            </div>
            
            <div className="p-4 flex-1 overflow-y-auto">
               {showResult && displayResult && displayResult.reasoning_trace ? (
                 <div className="bg-gray-50 text-gray-700 p-4 rounded-lg border border-gray-200 text-sm leading-relaxed font-mono h-full overflow-y-auto">
                    <div className="whitespace-pre-wrap">
                      {/* Format the reasoning trace: replace semicolons and numbered lists with newlines */}
                      {displayResult.reasoning_trace.split(/(?:;|\d+\.)/).map((segment, index) => {
                        const trimmed = segment.trim();
                        if (!trimmed) return null;
                        // Simplified approach: just list items without bold markdown artifacts
                        const cleanText = trimmed.replace(/\*\*/g, '');
                        return (
                          <div key={index} className="mb-2 last:mb-0">
                            {index > 0 ? `${index}. ` : ''}{cleanText}
                          </div>
                        );
                      })}
                    </div>
                 </div>
               ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                  <div className="bg-gray-50 p-3 rounded-full mb-3">
                    <BrainCircuit size={24} className="opacity-20" />
                  </div>
                  <p className="text-xs font-medium">待推理...</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* New Column: 3. Action & Revision */}
        <div className="col-span-12 lg:col-span-4 flex flex-col h-full gap-3 overflow-hidden">
          <div className="shrink-0 flex items-center gap-2 mb-0">
            <ShieldCheck size={18} className="text-green-600" />
            <h2 className="text-lg font-bold text-gray-800">3. 处置建议与修正</h2>
          </div>

          {/* Confidence & Action Card */}
          <div className="flex-1 min-h-0 bg-white rounded-lg border border-blue-200 shadow-sm ring-2 ring-blue-50 flex flex-col">
            <div className="bg-blue-50 border-b border-blue-100 px-4 py-3 flex justify-between items-center rounded-t-lg shrink-0">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-blue-700" />
                <h3 className="font-bold text-blue-800">置信度和处置建议</h3>
              </div>
            </div>
            
            <div className="p-4 flex-1 overflow-y-auto">
              {showResult && displayResult ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="text-xs font-bold text-gray-500 uppercase">置信度评估</div>
                    <div className={clsx(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold border",
                        displayResult.confidence_bucket === 'High' 
                          ? "bg-green-50 text-green-700 border-green-200"
                          : displayResult.confidence_bucket === 'Medium'
                          ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                          : "bg-red-50 text-red-700 border-red-200"
                      )}>
                        {displayResult.confidence_bucket} ({displayResult.adjusted_confidence})
                    </div>
                  </div>

                  {displayResult.need_human_review ? (
                    <div className="bg-red-50 border border-red-200 rounded p-3 text-red-800 text-sm">
                      <div className="flex items-center gap-2 font-bold mb-1">
                        <UserCheck size={16} />
                        建议人工复核
                      </div>
                      <div className="text-xs opacity-90 leading-snug">{displayResult.review_reason}</div>
                    </div>
                  ) : (
                     <div className="bg-green-50 border border-green-200 rounded p-3 text-green-800 text-sm">
                      <div className="flex items-center gap-2 font-bold mb-1">
                        <CheckCircle size={16} />
                        建议自动采信
                      </div>
                      <div className="text-xs opacity-90">系统判断稳定，无需人工介入</div>
                    </div>
                  )}

                  <div className="pt-3 border-t border-gray-100">
                    <div className="text-xs font-bold text-gray-500 uppercase mb-2">改进建议</div>
                    <div className="mb-2 flex items-center gap-2">
                      {actionStatus && (
                        <span className={`${actionStatus.color} text-white px-3 py-1 rounded text-sm font-bold shadow-sm`}>
                          {actionStatus.label}
                        </span>
                      )}

                      {/* Tooltip for Strategy Explanation */}
                      <Tooltip 
                        position="bottom"
                        content={
                          <div className="w-72">
                            <div className="font-bold mb-2 text-gray-700 border-b pb-1">AI 处置建议判定规则</div>
                            <div className="space-y-2.5">
                              <div className="flex items-start gap-2">
                                <span className="w-2 h-2 mt-1.5 rounded-full bg-red-600 shrink-0 shadow-sm"></span>
                                <div>
                                  <span className="font-bold text-gray-800">退回重写</span>
                                  <div className="text-gray-500 scale-90 origin-top-left mt-0.5">工单质量极差 (如严重遗漏、歪曲事实)，且 AI 非常确定。</div>
                                </div>
                              </div>
                              <div className="flex items-start gap-2">
                                <span className="w-2 h-2 mt-1.5 rounded-full bg-orange-500 shrink-0 shadow-sm"></span>
                                <div>
                                  <span className="font-bold text-gray-800">人工复核</span>
                                  <div className="text-gray-500 scale-90 origin-top-left mt-0.5">AI 置信度不足 (如信息模糊、逻辑冲突)，或虽质量尚可但需人工确认。</div>
                                </div>
                              </div>
                              <div className="flex items-start gap-2">
                                <span className="w-2 h-2 mt-1.5 rounded-full bg-green-600 shrink-0 shadow-sm"></span>
                                <div>
                                  <span className="font-bold text-gray-800">通过</span>
                                  <div className="text-gray-500 scale-90 origin-top-left mt-0.5">工单质量优秀/合格，且 AI 置信度高，建议直接采信。</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        }
                      >
                        <HelpCircle size={15} className="text-gray-400 cursor-help hover:text-gray-600 transition-colors" />
                      </Tooltip>
                    </div>
                    <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded leading-relaxed">
                      {displayResult.suggestion}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                  <div className="bg-gray-50 p-3 rounded-full mb-3">
                    <ShieldCheck size={24} className="opacity-20" />
                  </div>
                  <p className="text-xs font-medium">待生成...</p>
                </div>
              )}
            </div>
          </div>

          {/* Auto-generated Revision (Always visible, shows placeholder if no data) */}
          <div className="flex-1 min-h-0 flex flex-col">
            <RevisionView 
              isAnalyzed={showResult && !!displayResult}
              original={displayResult ? {
                title: getCurrentInput().form_data.title,
                description: getCurrentInput().form_data.description,
                priority: getCurrentInput().form_data.priority
              } : undefined}
              revision={displayResult?.suggested_revision}
            />
          </div>
        </div>
      </main>
      <footer className="bg-white border-t border-gray-200 py-3 shrink-0">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <div className="mb-2 md:mb-0">
            <span className="font-bold text-gray-700">GovInsight-AI</span>
            <span className="mx-2">|</span>
            <span>于细微处，洞见政务未来</span>
          </div>
          <div className="flex items-center gap-4">
            <span>&copy; {new Date().getFullYear()} Huotao</span>
            <a 
              href="https://ai.huotao.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors flex items-center gap-1"
            >
              Powered by 见微 (AInsight)
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

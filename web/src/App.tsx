import { useState } from 'react';
import { MOCK_CASES } from './data/mock_cases';
import type { MockCase } from './data/mock_cases';
import { TranscriptView } from './components/TranscriptView';
import { ScoreCard } from './components/ScoreCard';
import { WorkOrderView } from './components/WorkOrderView';
import { CaseEditor } from './components/CaseEditor';
import { Activity, BrainCircuit, Play, MessageSquare, FileInput, AlertTriangle, ShieldCheck, UserCheck, CheckCircle, Edit3 } from 'lucide-react';
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

  const isCustomMode = selectedCaseId === CUSTOM_CASE_ID;

  // Helper to get current input data
  const getCurrentInput = () => {
    if (isCustomMode) return customInput;
    return MOCK_CASES.find(c => c.id === selectedCaseId)?.input || MOCK_CASES[0].input;
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
    
    // For Mock cases, always show result by default
    // For Custom case, wait for user to click analyze
    if (id === CUSTOM_CASE_ID) {
      setShowResult(false);
    } else {
      setShowResult(true);
    }
  };

  const currentMockCase = MOCK_CASES.find(c => c.id === selectedCaseId);
  // Fallback to mock result if analysisResult is null and we are not in custom mode
  const displayResult = analysisResult || (selectedCaseId !== CUSTOM_CASE_ID ? currentMockCase?.result : null);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 text-white p-4 shadow-md sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Activity className="text-blue-400" />
            <div>
              <h1 className="text-xl font-bold tracking-tight">GovInsight-AI 热线工单质量智能检测</h1>
              <p className="text-xs text-slate-400">V0.3 (Qwen Real-time API)</p>
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

      <main className="flex-1 container mx-auto p-6 grid grid-cols-12 gap-6">
        {/* Sidebar: Case Selector */}
        <div className="col-span-12 lg:col-span-2 space-y-4">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">测试案例</h2>
          <div className="space-y-2">
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
        <div className="col-span-12 lg:col-span-3 space-y-6">
          {isCustomMode ? (
            <CaseEditor 
              input={customInput} 
              onChange={setCustomInput} 
            />
          ) : (
            <>
              <div className="flex items-center gap-2 mb-2">
                <FileInput size={18} className="text-gray-600" />
                <h2 className="text-lg font-bold text-gray-800">1. 工单内容与录音内容</h2>
              </div>
              
              <WorkOrderView input={getCurrentInput()} />

              <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-gray-50 px-2 text-sm text-gray-500">VS</span>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                 <div className="bg-slate-50 border-b border-gray-200 px-4 py-3 flex items-center gap-2">
                    <MessageSquare size={18} className="text-slate-600" />
                    <h3 className="font-bold text-slate-800">通话录音转写 (事实依据)</h3>
                 </div>
                 <div className="p-4">
                    <TranscriptView content={getCurrentInput().transcript} />
                 </div>
              </div>
            </>
          )}
        </div>

        {/* Right: AI Analysis Result */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <BrainCircuit size={18} className="text-purple-600" />
            <h2 className="text-lg font-bold text-gray-800">2. AI 质检报告</h2>
          </div>

          {/* Score Card Container */}
          <div className="bg-white rounded-lg border border-blue-200 shadow-sm overflow-hidden ring-2 ring-blue-50">
            <div className="bg-blue-50 border-b border-blue-100 px-4 py-3 flex items-center gap-2">
               <Activity size={18} className="text-blue-700" />
               <h3 className="font-bold text-blue-800">质检得分</h3>
            </div>
            
            <div className="p-4 space-y-4">
              {showResult && displayResult ? (
                <>
                  {/* Total Score Summary */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex justify-between items-center">
                     <div>
                       <div className="text-xs text-gray-500 uppercase font-bold">综合评分</div>
                       <div className={clsx(
                          "text-3xl font-black mt-1",
                          displayResult.total_score >= 90 ? "text-green-600" :
                          displayResult.total_score >= 75 ? "text-yellow-600" : "text-red-600"
                        )}>
                          {displayResult.total_score}
                        </div>
                     </div>
                     <div className="text-right">
                        <div className="text-sm font-bold text-gray-600">{displayResult.overall_level}</div>
                     </div>
                  </div>

                  {/* Score Cards (Priority Display) */}
                  <div className="space-y-3">
                      <ScoreCard 
                        title="A. 诉求完整性 (35%)" 
                        data={displayResult.scores.completeness} 
                        maxScore={35} 
                      />
                      <ScoreCard 
                        title="B. 语义一致性 (30%)" 
                        data={displayResult.scores.consistency} 
                        maxScore={30} 
                      />
                      <ScoreCard 
                        title="C. 表述规范性 (20%)" 
                        data={displayResult.scores.clarity} 
                        maxScore={20} 
                      />
                      <ScoreCard 
                        title="D. 风险敏感性 (15%)" 
                        data={displayResult.scores.risk_awareness} 
                        maxScore={15} 
                      />
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                  <div className="bg-gray-50 p-3 rounded-full mb-3">
                    <Activity size={24} className="opacity-20" />
                  </div>
                  <p className="text-xs font-medium">待评分...</p>
                </div>
              )}
            </div>
          </div>

          {/* Reasoning Container */}
          <div className="bg-white rounded-lg border border-blue-200 shadow-sm overflow-hidden ring-2 ring-blue-50">
            <div className="bg-blue-50 border-b border-blue-100 px-4 py-3 flex items-center gap-2">
               <BrainCircuit size={18} className="text-blue-700" />
               <h3 className="font-bold text-blue-800">思考过程</h3>
            </div>
            
            <div className="p-4">
               {showResult && displayResult && displayResult.reasoning_trace ? (
                 <div className="bg-gray-50 text-gray-700 p-4 rounded-lg border border-gray-200 text-sm leading-relaxed font-mono">
                    <div className="whitespace-pre-wrap max-h-60 overflow-y-auto">
                      {displayResult.reasoning_trace}
                    </div>
                 </div>
               ) : (
                <div className="flex flex-col items-center justify-center py-8 text-gray-400">
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
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck size={18} className="text-green-600" />
            <h2 className="text-lg font-bold text-gray-800">3. 处置建议与修正</h2>
          </div>

          {/* Confidence & Action Card */}
          <div className="bg-white rounded-lg border border-blue-200 shadow-sm overflow-hidden ring-2 ring-blue-50">
            <div className="bg-blue-50 border-b border-blue-100 px-4 py-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-blue-700" />
                <h3 className="font-bold text-blue-800">处置建议</h3>
              </div>
            </div>
            
            <div className="p-4 space-y-4">
              {showResult && displayResult ? (
                <>
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
                    <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded leading-relaxed">
                      {displayResult.suggestion}
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                  <div className="bg-gray-50 p-3 rounded-full mb-3">
                    <ShieldCheck size={24} className="opacity-20" />
                  </div>
                  <p className="text-xs font-medium">待生成...</p>
                </div>
              )}
            </div>
          </div>

          {/* Auto-generated Revision (Always visible, shows placeholder if no data) */}
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
      </main>
      <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <div className="mb-4 md:mb-0">
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

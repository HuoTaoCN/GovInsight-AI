/**
 * Intelligent Government Service Hotline Work Order Quality Inspection System
 * Type Definitions based on V1.3 Architecture
 */

export interface EvaluationResult {
  /** UUID */
  evaluation_id: string;
  
  /** Concise summary of the case */
  summary: string;
  
  /** Multi-dimensional scoring results */
  scores: ScoringMatrix;
  
  /** The synthesis of reasoning, identifying key evidence */
  reasoning_trace: string;
  
  /** How historical context influenced this decision */
  calibration_note: string;
  
  /** Risk and safety assessment */
  risk_assessment: RiskAssessment;
  
  /** Confidence estimation */
  confidence: ConfidenceMetric;
}

export interface ScoringMatrix {
  service_norms: ScoreDimension;
  business_accuracy: ScoreDimension;
  resolution_quality: ScoreDimension;
  total_score: number; // 0-100
}

export interface ScoreDimension {
  /** Score for this dimension */
  score: number;
  /** List of deduction reasons */
  deductions: string[];
}

export interface RiskAssessment {
  has_risk: boolean;
  risk_level: 'None' | 'Low' | 'Medium' | 'High' | 'Critical';
  risk_flags: string[];
  /** 
   * Detected sensitive info types (e.g., 'ID Number'). 
   * DO NOT include actual values.
   */
  sensitive_info_detected: string[];
}

export interface ConfidenceMetric {
  /** 0.0 - 1.0 */
  value: number;
  bucket: 'Auto-Pass' | 'Manual-Review';
  /** Reason why confidence is < 1.0 */
  reason: string;
}

/**
 * Input Data Structure for the System
 */
export interface WorkOrderInput {
  /** The verbatim dialogue between citizen and operator/department */
  transcript: string;
  
  metadata: {
    ticket_id: string;
    category: string;
    timestamp: string;
    handling_department: string;
  };
  
  /** Top-3 similar past cases with human-verified scores */
  historical_context: HistoricalCase[];
}

export interface HistoricalCase {
  summary: string;
  expert_score: number;
  expert_reasoning: string;
  similarity_score?: number;
}

/**
 * Intelligent Government Service Hotline Work Order Quality Inspection System
 * Type Definitions based on V1.3 Architecture (Consistency Check)
 */

export interface EvaluationResult {
  /** Multi-dimensional scoring results (V1.1 Metrics) */
  scores: ScoringMatrix;
  
  /** Total score (0-100) */
  total_score: number;
  
  /** Overall level */
  overall_level: 'Excellent' | 'Qualified' | 'Risk' | 'Unqualified';
  
  /** Raw Confidence estimation (0.0 - 1.0) */
  confidence: number;
  
  /** Calibrated Confidence (V1.3) */
  adjusted_confidence: number;
  
  /** Confidence Bucket */
  confidence_bucket: 'High' | 'Medium' | 'Low';
  
  /** Whether human review is mandatory */
  need_human_review: boolean;
  
  /** Reason for human review */
  review_reason?: string;
  
  /** Actionable suggestion for the operator */
  suggestion: string;

  /** AI suggested revision for the work order */
  suggested_revision?: {
    title: string;
    description: string;
    priority: string;
  };

  /** Chain of Thought Trace (Optional for display) */
  reasoning_trace?: string;
}

export interface ScoringMatrix {
  /** 诉求完整性 (35%) */
  completeness: ScoreDimension;
  /** 语义一致性 (30%) */
  consistency: ScoreDimension;
  /** 表述规范性 (20%) */
  clarity: ScoreDimension;
  /** 风险敏感性 (15%) */
  risk_awareness: ScoreDimension;
}

export interface ScoreDimension {
  score: number;
  judgement: string; // e.g., "基本完整", "部分偏差"
  issues: string[];
}

/**
 * Input Data Structure for the System
 */
export interface WorkOrderInput {
  /** The verbatim dialogue between citizen and operator/department */
  transcript: string;
  
  /** 
   * V1.3 Core Input: The Work Order Form 
   * This is what we check against the transcript.
   */
  form_data: {
    title: string;
    description: string;
    citizen_name: string;
    citizen_phone: string;
    priority: 'Normal' | 'Urgent' | 'Emergency';
  };

  metadata: {
    ticket_id: string;
    category: string;
    timestamp: string;
    handling_department: string;
    status: string;
  };
  
  /** V1.3 Calibration Factors */
  history_factors?: {
    agent_consistency_score?: number; // 0-1.0
    has_callback_complaint?: boolean;
    leader_review_deviation?: boolean;
  };
}

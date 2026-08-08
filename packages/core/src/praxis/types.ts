/**
 * Praxis module types for ADP
 */

import type { FileMetrics, RefactoringRecommendation } from '../types.js';

/**
 * Context provided to ADP praxis rules during evaluation.
 */
export interface ADPContext {
  /** Metrics for files under analysis */
  fileMetrics: FileMetrics[];
  /** Thresholds for complexity */
  complexityThreshold: number;
  /** Thresholds for file size (lines) */
  maxFileLines: number;
  /** Minimum acceptable purity score */
  minPurityScore: number;
  /** Maximum allowed function lines */
  maxFunctionLines: number;
}

/**
 * Pattern detection result payload.
 */
export interface PatternDetectionPayload {
  file: string;
  pattern: string;
  category: 'anti-pattern' | 'pattern';
  severity: 'critical' | 'high' | 'medium' | 'low';
  details: string;
}

/**
 * Refactoring policy result payload.
 */
export interface RefactoringPolicyPayload {
  file: string;
  recommendation: RefactoringRecommendation;
  impactScore: number;
  effortScore: number;
}

/**
 * Compliance gate result payload.
 */
export interface CompliancePayload {
  file: string;
  gate: string;
  passed: boolean;
  message: string;
}

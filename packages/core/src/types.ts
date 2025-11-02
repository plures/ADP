/**
 * Core types for the Architectural Discipline System
 */

export type SupportedLanguage = 'typescript' | 'javascript' | 'powershell' | 'csharp' | 'rust';

export interface FileMetrics {
  file: string;
  language: SupportedLanguage;
  fileType: FileType;
  lines: number;
  functions: FunctionMetrics[];
  complexity: number;
  purity: number;
  dependencies: string[];
  responsibilities: string[];
}

export interface FunctionMetrics {
  name: string;
  line: number;
  lines: number;
  complexity: number;
  purity: number;
  parameters: number;
  returnType: string;
  sideEffects: string[];
}

export interface FileType {
  category: 'machine' | 'client' | 'handler' | 'utility' | 'integration' | 'test' | 'config' | 'class' | 'module' | 'service' | 'controller' | 'script';
  subcategory: string;
  expectedSizeRange: [number, number];
  complexityThreshold: number;
}

/**
 * Language analyzer interface - all language-specific analyzers must implement this
 */
export interface LanguageAnalyzer {
  /**
   * Detect the language from file path and/or content
   */
  detectLanguage(filePath: string, content?: string): SupportedLanguage | null;

  /**
   * Extract functions from source code
   */
  extractFunctions(content: string): Array<{
    name: string;
    line: number;
    lines: number;
    content: string;
    signature: string;
  }>;

  /**
   * Calculate cyclomatic complexity for the language
   */
  calculateComplexity(content: string): number;

  /**
   * Extract dependencies (imports/using statements)
   */
  extractDependencies(content: string): string[];

  /**
   * Extract side effects from function content
   */
  extractSideEffects(content: string): string[];

  /**
   * Extract return type from function signature
   */
  extractReturnType(signature: string): string;

  /**
   * Count parameters in function signature
   */
  countParameters(signature: string): number;

  /**
   * Extract function name from signature
   */
  extractFunctionName(signature: string): string;
}

export interface StatisticalAnalysis {
  fileTypeStats: Map<string, FileTypeStatistics>;
  outliers: FileMetrics[];
  recommendations: RefactoringRecommendation[];
  projectHealth: ProjectHealthScore;
}

export interface FileTypeStatistics {
  count: number;
  meanLines: number;
  medianLines: number;
  standardDeviation: number;
  percentile95: number;
  percentile99: number;
  outliers: number[];
}

export interface RefactoringRecommendation {
  file: string;
  priority: 'high' | 'medium' | 'low';
  type: 'extract-function' | 'extract-module' | 'reduce-complexity' | 'improve-purity';
  reason: string;
  suggestedActions: string[];
  estimatedEffort: 'low' | 'medium' | 'high';
}

export interface ProjectHealthScore {
  overall: number; // 0-100
  maintainability: number;
  testability: number;
  modularity: number;
  complexity: number;
  trends: {
    fileSizeGrowth: number;
    complexityTrend: number;
    purityTrend: number;
  };
}

/**
 * @architectural-discipline/core
 * 
 * Core statistical analysis engine and architectural rule definitions
 * for the Architectural Discipline System.
 */

import * as path from 'path';
import type {
  FileMetrics,
  FunctionMetrics,
  FileType,
  StatisticalAnalysis,
  FileTypeStatistics,
  RefactoringRecommendation,
  ProjectHealthScore,
  SupportedLanguage,
  LanguageAnalyzer,
} from './types.js';
import { detectLanguage, getLanguageAnalyzer } from './languages/index.js';
import { classifyPowerShellFileType } from './patterns/powershell.js';
import { classifyCSharpFileType } from './patterns/csharp.js';
import { classifyRustFileType } from './patterns/rust.js';

// File Type Classification System
export const FILE_TYPE_PATTERNS = {
  machine: {
    patterns: ['**/machines/**', '**/*Machine.ts', '**/*machine.ts'],
    expectedSizeRange: [50, 200] as [number, number],
    complexityThreshold: 8,
  },
  client: {
    patterns: ['**/client.ts', '**/Client.ts', '**/*Client.ts'],
    expectedSizeRange: [100, 400] as [number, number],
    complexityThreshold: 12,
  },
  handler: {
    patterns: ['**/handler.ts', '**/Handler.ts', '**/*Handler.ts'],
    expectedSizeRange: [80, 300] as [number, number],
    complexityThreshold: 10,
  },
  utility: {
    patterns: ['**/utils/**', '**/util/**', '**/*Utils.ts', '**/*util.ts'],
    expectedSizeRange: [30, 150] as [number, number],
    complexityThreshold: 6,
  },
  integration: {
    patterns: ['**/integration.ts', '**/bridge/**', '**/adapter/**'],
    expectedSizeRange: [60, 250] as [number, number],
    complexityThreshold: 9,
  },
  test: {
    patterns: ['**/*.test.ts', '**/*.spec.ts', '**/tests/**'],
    expectedSizeRange: [20, 200] as [number, number],
    complexityThreshold: 5,
  },
  config: {
    patterns: ['**/config.ts', '**/Config.ts', '**/settings/**'],
    expectedSizeRange: [20, 100] as [number, number],
    complexityThreshold: 4,
  },
};

/**
 * Core analysis engine for architectural discipline
 * 
 * This class implements LanguageAnalyzer for TypeScript/JavaScript compatibility
 */
export class ArchitecturalAnalyzer implements LanguageAnalyzer {
  detectLanguage(filePath: string, content?: string): SupportedLanguage | null {
    return detectLanguage(filePath, content);
  }
  /**
   * Analyze a single file and extract comprehensive metrics
   */
  analyzeFile(filePath: string, content: string): FileMetrics {
    const lines = content.split('\n');
    
    // Detect language
    const language = detectLanguage(filePath, content) || 'typescript';
    const languageAnalyzer = getLanguageAnalyzer(filePath, content);
    
    // Use language-specific file type classification
    const fileType = this.classifyFileType(filePath, content, language);
    
    // Use language-specific analyzer if available, otherwise fall back to TypeScript patterns
    const analyzer = languageAnalyzer || this;
    
    const metrics: FileMetrics = {
      file: filePath,
      language,
      fileType,
      lines: lines.length,
      functions: [],
      complexity: analyzer.calculateComplexity(content),
      purity: 0,
      dependencies: analyzer.extractDependencies(content),
      responsibilities: this.extractResponsibilities(content, language),
    };

    // Extract function information with enhanced analysis
    const functions = analyzer.extractFunctions(content);
    metrics.functions = functions.map((func) => {
      const sideEffects = analyzer.extractSideEffects(func.content);
      const parameters = analyzer.countParameters(func.signature);
      const complexity = analyzer.calculateComplexity(func.content);

      const funcMetrics: FunctionMetrics = {
        name: func.name,
        line: func.line,
        lines: func.lines,
        complexity,
        purity: 0,
        parameters,
        returnType: analyzer.extractReturnType(func.signature),
        sideEffects,
      };

      funcMetrics.purity = this.calculateFunctionPurity(funcMetrics, func.content);
      return funcMetrics;
    });

    // Calculate overall file purity
    if (metrics.functions.length > 0) {
      metrics.purity =
        metrics.functions.reduce((sum, f) => sum + f.purity, 0) / metrics.functions.length;
    }

    return metrics;
  }

  /**
   * Classify file type based on path and content analysis
   */
  classifyFileType(filePath: string, content: string, language?: SupportedLanguage): FileType {
    // Use language-specific classification if available
    const detectedLanguage = language || detectLanguage(filePath, content);
    
    if (detectedLanguage === 'powershell') {
      return classifyPowerShellFileType(filePath, content);
    }
    if (detectedLanguage === 'csharp') {
      return classifyCSharpFileType(filePath, content);
    }
    if (detectedLanguage === 'rust') {
      return classifyRustFileType(filePath, content);
    }
    
    // Default TypeScript/JavaScript classification
    const fileName = path.basename(filePath);
    const dirName = path.dirname(filePath);

    // Check patterns for each type
    for (const [category, config] of Object.entries(FILE_TYPE_PATTERNS)) {
      for (const pattern of config.patterns) {
        // Convert glob pattern to simple string matching
        const cleanPattern = pattern.replace('**/', '').replace('/**', '').replace('*', '');
        if (filePath.includes(cleanPattern) || fileName.includes(cleanPattern)) {
          return {
            category: category as any,
            subcategory: fileName,
            expectedSizeRange: config.expectedSizeRange,
            complexityThreshold: config.complexityThreshold,
          };
        }
      }
    }

    // Default classification based on content analysis
    if (content.includes('createMachine') || content.includes('fromPromise')) {
      return {
        category: 'machine',
        subcategory: 'fsm',
        expectedSizeRange: [50, 200],
        complexityThreshold: 8,
      };
    }

    if (content.includes('class') && content.includes('constructor')) {
      return {
        category: 'client',
        subcategory: 'service',
        expectedSizeRange: [100, 400],
        complexityThreshold: 12,
      };
    }

    return {
      category: 'utility',
      subcategory: 'general',
      expectedSizeRange: [30, 150],
      complexityThreshold: 6,
    };
  }

  /**
   * Calculate cyclomatic complexity
   */
  calculateComplexity(content: string): number {
    const complexityKeywords = [
      'if',
      'else',
      'while',
      'for',
      'switch',
      'case',
      'catch',
      '&&',
      '||',
      '\\?',
      ':',
    ];

    let complexity = 1; // Base complexity

    for (const keyword of complexityKeywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      const matches = content.match(regex);
      if (matches) {
        complexity += matches.length;
      }
    }

    return complexity;
  }

  /**
   * Calculate function purity score (0-100)
   * Higher score = more pure function
   */
  calculateFunctionPurity(func: FunctionMetrics, content: string): number {
    let purityScore = 100;

    // Deduct points for side effects
    purityScore -= func.sideEffects.length * 10;

    // Deduct points for high parameter count
    if (func.parameters > 5) {
      purityScore -= (func.parameters - 5) * 5;
    }

    // Deduct points for high complexity
    if (func.complexity > 5) {
      purityScore -= (func.complexity - 5) * 8;
    }

    // Check for pure function indicators
    if (content.includes('return') && !content.includes('console.log')) {
      purityScore += 5;
    }

    if (!content.includes('this.') && !content.includes('global')) {
      purityScore += 5;
    }

    return Math.max(0, Math.min(100, purityScore));
  }

  /**
   * Extract function information from TypeScript content
   */
  extractFunctions(content: string): Array<{
    name: string;
    line: number;
    lines: number;
    content: string;
    signature: string;
  }> {
    const functions: Array<{
      name: string;
      line: number;
      lines: number;
      content: string;
      signature: string;
    }> = [];

    const lines = content.split('\n');
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      // Detect function start
      if (
        line.match(/^(export\s+)?(async\s+)?function\s+\w+/) ||
        line.match(/^(export\s+)?(async\s+)?\w+\s*\([^)]*\)\s*[:=]/)
      ) {
        const startLine = i;
        const signature = line.trim();
        const name = this.extractFunctionName(signature);

        // Find function end by counting braces
        let braceCount = 0;
        let endLine = i;

        for (let j = i; j < lines.length; j++) {
          const currentLine = lines[j];
          braceCount += (currentLine.match(/\{/g) || []).length;
          braceCount -= (currentLine.match(/\}/g) || []).length;

          if (braceCount === 0 && currentLine.includes('}')) {
            endLine = j;
            break;
          }
        }

        const functionContent = lines.slice(startLine, endLine + 1).join('\n');

        functions.push({
          name,
          line: startLine + 1,
          lines: endLine - startLine + 1,
          content: functionContent,
          signature,
        });

        i = endLine + 1;
      } else {
        i++;
      }
    }

    return functions;
  }

  /**
   * Extract function name from signature
   */
  extractFunctionName(signature: string): string {
    const patterns = [
      /function\s+(\w+)/,
      /(\w+)\s*\([^)]*\)\s*[:=]/,
      /(\w+)\s*\([^)]*\)\s*[:=]\s*async\s+function/,
    ];

    for (const pattern of patterns) {
      const match = signature.match(pattern);
      if (match) {
        return match[1];
      }
    }

    return 'anonymous';
  }

  /**
   * Count function parameters
   */
  countParameters(signature: string): number {
    const paramMatch = signature.match(/\(([^)]*)\)/);
    if (!paramMatch) return 0;

    const params = paramMatch[1].split(',').filter((p) => p.trim());
    return params.length;
  }

  /**
   * Extract return type from signature
   */
  extractReturnType(signature: string): string {
    const returnMatch = signature.match(/\)\s*:\s*(\w+)/);
    return returnMatch ? returnMatch[1] : 'any';
  }

  /**
   * Extract side effects from function content
   */
  extractSideEffects(content: string): string[] {
    const sideEffects: string[] = [];

    if (content.includes('console.log')) sideEffects.push('logging');
    if (content.includes('this.')) sideEffects.push('state-mutation');
    if (content.includes('global')) sideEffects.push('global-access');
    if (content.includes('process.')) sideEffects.push('process-access');
    if (content.includes('fs.')) sideEffects.push('file-system');
    if (content.includes('fetch(') || content.includes('axios.')) sideEffects.push('network');

    return sideEffects;
  }

  /**
   * Extract dependencies from file content
   */
  extractDependencies(content: string): string[] {
    const imports: string[] = [];
    const importRegex = /import.*from\s+['"]([^'"]+)['"]/g;
    let match;

    while ((match = importRegex.exec(content)) !== null) {
      imports.push(match[1]);
    }

    return imports;
  }

  /**
   * Extract responsibilities from file content
   */
  extractResponsibilities(content: string, language?: SupportedLanguage): string[] {
    const responsibilities: string[] = [];
    const lang = language || 'typescript';

    if (lang === 'typescript' || lang === 'javascript') {
      if (content.includes('createMachine')) responsibilities.push('state-management');
      if (content.includes('class')) responsibilities.push('object-oriented');
      if (content.includes('async')) responsibilities.push('asynchronous');
      if (content.includes('export')) responsibilities.push('module-export');
      if (content.includes('test') || content.includes('expect')) responsibilities.push('testing');
    } else if (lang === 'powershell') {
      if (content.match(/function\s+\w+-\w+/)) responsibilities.push('cmdlet');
      if (content.includes('module')) responsibilities.push('module-export');
      if (content.includes('Describe') || content.includes('It ')) responsibilities.push('testing');
      if (content.includes('param(')) responsibilities.push('parameter-handling');
    } else if (lang === 'csharp') {
      if (content.includes('class ')) responsibilities.push('object-oriented');
      if (content.includes('async ') || content.includes('Task')) responsibilities.push('asynchronous');
      if (content.includes('interface ')) responsibilities.push('interface-definition');
      if (content.includes('[Test]') || content.includes('TestMethod')) responsibilities.push('testing');
    } else if (lang === 'rust') {
      if (content.includes('pub struct ')) responsibilities.push('data-structure');
      if (content.includes('impl ')) responsibilities.push('implementation');
      if (content.includes('async ') || content.includes('await')) responsibilities.push('asynchronous');
      if (content.includes('#[test]')) responsibilities.push('testing');
    }

    return responsibilities;
  }

  /**
   * Calculate statistical thresholds for file types
   */
  calculateStatisticalThresholds(metrics: FileMetrics[]): Map<string, FileTypeStatistics> {
    const typeGroups = new Map<string, FileMetrics[]>();

    // Group files by type
    metrics.forEach((metric) => {
      const key = `${metric.fileType.category}-${metric.fileType.subcategory}`;
      if (!typeGroups.has(key)) {
        typeGroups.set(key, []);
      }
      typeGroups.get(key)!.push(metric);
    });

    const stats = new Map<string, FileTypeStatistics>();

    typeGroups.forEach((files, type) => {
      const lines = files.map((f) => f.lines).sort((a, b) => a - b);

      const mean = lines.reduce((sum, line) => sum + line, 0) / lines.length;
      const median = lines[Math.floor(lines.length / 2)];

      // Calculate standard deviation
      const variance = lines.reduce((sum, line) => sum + Math.pow(line - mean, 2), 0) / lines.length;
      const standardDeviation = Math.sqrt(variance);

      // Calculate percentiles
      const percentile95 = lines[Math.floor(lines.length * 0.95)];
      const percentile99 = lines[Math.floor(lines.length * 0.99)];

      // Identify outliers (beyond 2 standard deviations)
      const outliers = lines.filter((line) => Math.abs(line - mean) > 2 * standardDeviation);

      stats.set(type, {
        count: files.length,
        meanLines: Math.round(mean),
        medianLines: median,
        standardDeviation: Math.round(standardDeviation),
        percentile95,
        percentile99,
        outliers: outliers,
      });
    });

    return stats;
  }

  /**
   * Detect outliers using statistical methods
   */
  detectOutliers(
    metrics: FileMetrics[],
    stats: Map<string, FileTypeStatistics>
  ): FileMetrics[] {
    const outliers: FileMetrics[] = [];

    metrics.forEach((metric) => {
      const key = `${metric.fileType.category}-${metric.fileType.subcategory}`;
      const typeStats = stats.get(key);

      if (!typeStats) return;

      // Check if file is an outlier (beyond 95th percentile or 2 standard deviations)
      const isSizeOutlier =
        metric.lines > typeStats.percentile95 ||
        Math.abs(metric.lines - typeStats.meanLines) > 2 * typeStats.standardDeviation;

      // Check complexity outliers
      const isComplexityOutlier = metric.complexity > metric.fileType.complexityThreshold * 1.5;

      // Check purity outliers
      const isPurityOutlier = metric.purity < 50; // Low purity score

      if (isSizeOutlier || isComplexityOutlier || isPurityOutlier) {
        outliers.push(metric);
      }
    });

    return outliers;
  }

  /**
   * Generate intelligent refactoring recommendations
   */
  generateRecommendations(outliers: FileMetrics[]): RefactoringRecommendation[] {
    const recommendations: RefactoringRecommendation[] = [];

    outliers.forEach((metric) => {
      // Size-based recommendations
      if (metric.lines > metric.fileType.expectedSizeRange[1]) {
        recommendations.push({
          file: metric.file,
          priority: 'high',
          type: 'extract-module',
          reason: `File exceeds expected size range for ${metric.fileType.category} files`,
          suggestedActions: [
            'Extract related functions into separate modules',
            'Apply single responsibility principle',
            'Create focused, cohesive modules',
          ],
          estimatedEffort: 'medium',
        });
      }

      // Function-based recommendations
      const largeFunctions = metric.functions.filter((f) => f.lines > 50);
      if (largeFunctions.length > 0) {
        recommendations.push({
          file: metric.file,
          priority: 'medium',
          type: 'extract-function',
          reason: `${largeFunctions.length} functions exceed recommended size`,
          suggestedActions: [
            'Break down large functions into smaller, focused functions',
            'Extract complex logic into utility functions',
            'Use composition over large monolithic functions',
          ],
          estimatedEffort: 'low',
        });
      }

      // Complexity-based recommendations
      if (metric.complexity > metric.fileType.complexityThreshold) {
        recommendations.push({
          file: metric.file,
          priority: 'high',
          type: 'reduce-complexity',
          reason: `Cyclomatic complexity exceeds threshold for ${metric.fileType.category} files`,
          suggestedActions: [
            'Simplify conditional logic',
            'Extract complex conditions into named functions',
            'Use early returns to reduce nesting',
          ],
          estimatedEffort: 'medium',
        });
      }

      // Purity-based recommendations
      if (metric.purity < 60) {
        recommendations.push({
          file: metric.file,
          priority: 'low',
          type: 'improve-purity',
          reason: 'Low function purity score indicates many side effects',
          suggestedActions: [
            'Reduce side effects in functions',
            'Separate pure logic from side effects',
            'Use functional programming patterns',
          ],
          estimatedEffort: 'high',
        });
      }
    });

    return recommendations;
  }

  /**
   * Calculate overall project health score
   */
  calculateProjectHealth(
    metrics: FileMetrics[],
    stats: Map<string, FileTypeStatistics>
  ): ProjectHealthScore {
    const totalFiles = metrics.length;
    const avgLines = metrics.reduce((sum, m) => sum + m.lines, 0) / totalFiles;
    const avgComplexity = metrics.reduce((sum, m) => sum + m.complexity, 0) / totalFiles;
    const avgPurity = metrics.reduce((sum, m) => sum + m.purity, 0) / totalFiles;

    // Calculate maintainability score (0-100)
    const maintainability = Math.max(0, 100 - avgLines / 10 - avgComplexity * 5);

    // Calculate testability score (0-100)
    const testability = Math.max(0, avgPurity - 20);

    // Calculate modularity score (0-100)
    const avgFunctionsPerFile = metrics.reduce((sum, m) => sum + m.functions.length, 0) / totalFiles;
    const modularity = Math.max(0, 100 - avgFunctionsPerFile * 2);

    // Calculate complexity score (0-100)
    const complexity = Math.max(0, 100 - avgComplexity * 8);

    // Overall health score
    const overall = (maintainability + testability + modularity + complexity) / 4;

    return {
      overall: Math.round(overall),
      maintainability: Math.round(maintainability),
      testability: Math.round(testability),
      modularity: Math.round(modularity),
      complexity: Math.round(complexity),
      trends: {
        fileSizeGrowth: 0, // TODO: Implement trend analysis
        complexityTrend: 0,
        purityTrend: 0,
      },
    };
  }
}

// Re-export types and constants for external use
export * from './types.js';
export { detectLanguage, getLanguageAnalyzer, getAllAnalyzers } from './languages/index.js';
export { TypeScriptAnalyzer, PowerShellAnalyzer, CSharpAnalyzer, RustAnalyzer } from './languages/index.js';

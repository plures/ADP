/**
 * TypeScript/JavaScript language analyzer
 */

import * as path from 'path';
import type { LanguageAnalyzer, SupportedLanguage } from '../types.js';

export class TypeScriptAnalyzer implements LanguageAnalyzer {
  detectLanguage(filePath: string, content?: string): SupportedLanguage | null {
    const ext = path.extname(filePath).toLowerCase();
    if (ext === '.ts' || ext === '.tsx') return 'typescript';
    if (ext === '.js' || ext === '.jsx' || ext === '.mjs' || ext === '.cjs') return 'javascript';
    return null;
  }

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
        line.match(/^(export\s+)?(async\s+)?\w+\s*\([^)]*\)\s*[:=]/) ||
        // Variable-assigned arrow function: const name = (args) => { or const name = (args): type => {
        line.match(/^(export\s+)?(const|let|var)\s+\w+\s*=\s*(async\s+)?\([^)]*\)(?:\s*:\s*[^=]+)?\s*=>\s*\{/)
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

  extractDependencies(content: string): string[] {
    const imports: string[] = [];
    const importRegex = /import.*from\s+['"]([^'"]+)['"]/g;
    let match;

    while ((match = importRegex.exec(content)) !== null) {
      imports.push(match[1]);
    }

    return imports;
  }

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

  extractReturnType(signature: string): string {
    const returnMatch = signature.match(/\)\s*:\s*(\w+)/);
    return returnMatch ? returnMatch[1] : 'any';
  }

  countParameters(signature: string): number {
    const paramMatch = signature.match(/\(([^)]*)\)/);
    if (!paramMatch) return 0;

    const params = paramMatch[1].split(',').filter((p) => p.trim());
    return params.length;
  }

  extractFunctionName(signature: string): string {
    const patterns = [
      // function declaration
      /function\s+(\w+)/,
      // variable assigned arrow/function expression: const name = (...) => or const name = (...): type =>
      /^(?:export\s+)?(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s+)?\([^)]*\)(?:\s*:\s*[^=]+)?\s*=>/,
      /^(?:export\s+)?(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s+)?function\b/,
      // method-like pattern at start of line: name(args) := or :
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
}


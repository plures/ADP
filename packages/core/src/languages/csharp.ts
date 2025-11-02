/**
 * C# language analyzer
 */

import * as path from 'path';
import type { LanguageAnalyzer, SupportedLanguage } from '../types.js';

export class CSharpAnalyzer implements LanguageAnalyzer {
  detectLanguage(filePath: string, content?: string): SupportedLanguage | null {
    const ext = path.extname(filePath).toLowerCase();
    if (ext === '.cs' || ext === '.csx') {
      return 'csharp';
    }
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

      // C# method pattern: [access] [modifiers] [return type] MethodName([parameters]) { ... }
      // Also handles: async Task MethodName(...), public void MethodName(...), etc.
      const methodMatch = line.match(/(?:public|private|internal|protected)?\s*(?:static\s+)?(?:async\s+)?(?:[\w<>,\[\]\.\s]+\s+)?(\w+)\s*\([^)]*\)/);
      if (methodMatch && !line.includes('class ') && !line.includes('interface ') && !line.includes('struct ')) {
        const startLine = i;
        const signature = line.trim();

        // Check if it's a method declaration (has { or ; at the end, or next line has {)
        const hasBlockStart = line.includes('{') || (i + 1 < lines.length && lines[i + 1].trim().startsWith('{'));
        
        if (hasBlockStart) {
          let braceCount = 0;
          let endLine = i;
          let foundStart = false;

          for (let j = i; j < lines.length; j++) {
            const currentLine = lines[j];
            if (!foundStart && currentLine.includes('{')) {
              foundStart = true;
            }
            if (foundStart) {
              braceCount += (currentLine.match(/\{/g) || []).length;
              braceCount -= (currentLine.match(/\}/g) || []).length;

              if (braceCount === 0 && currentLine.includes('}')) {
                endLine = j;
                break;
              }
            }
          }

          if (foundStart) {
            const functionContent = lines.slice(startLine, endLine + 1).join('\n');
            const name = this.extractFunctionName(signature);

            functions.push({
              name,
              line: startLine + 1,
              lines: endLine - startLine + 1,
              content: functionContent,
              signature,
            });

            i = endLine + 1;
            continue;
          }
        }
      }
      i++;
    }

    return functions;
  }

  calculateComplexity(content: string): number {
    const complexityKeywords = [
      'if',
      'else',
      'while',
      'for',
      'foreach',
      'switch',
      'case',
      'catch',
      'finally',
      '&&',
      '||',
      '?',
      ':',
      '??',
    ];

    let complexity = 1; // Base complexity

    for (const keyword of complexityKeywords) {
      if (keyword === '&&' || keyword === '||' || keyword === '?' || keyword === ':' || keyword === '??') {
        const regex = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        const matches = content.match(regex);
        if (matches) {
          complexity += matches.length;
        }
      } else {
        const regex = new RegExp(`\\b${keyword}\\b`, 'g');
        const matches = content.match(regex);
        if (matches) {
          complexity += matches.length;
        }
      }
    }

    return complexity;
  }

  extractDependencies(content: string): string[] {
    const dependencies: string[] = [];
    
    // C# using statements: using System; using System.IO;
    const usingRegex = /using\s+(?:static\s+)?([\w.]+)(?:\s*=\s*[\w.]+)?\s*;/g;
    
    let match;
    while ((match = usingRegex.exec(content)) !== null) {
      dependencies.push(match[1]);
    }

    return dependencies;
  }

  extractSideEffects(content: string): string[] {
    const sideEffects: string[] = [];

    if (content.match(/Console\.(?:Write|Read)/i)) {
      sideEffects.push('console-io');
    }
    if (content.includes('this.') || content.match(/^\s*\[.*\]\s*public|private/)) {
      sideEffects.push('state-mutation');
    }
    if (content.match(/File\.|Directory\.|StreamReader|StreamWriter/i)) {
      sideEffects.push('file-system');
    }
    if (content.match(/HttpClient|WebRequest|WebResponse/i)) {
      sideEffects.push('network');
    }
    if (content.match(/Process\.Start|ProcessStartInfo/i)) {
      sideEffects.push('external-process');
    }
    if (content.match(/await|async|Task/i)) {
      sideEffects.push('asynchronous');
    }

    return sideEffects;
  }

  extractReturnType(signature: string): string {
    // Extract return type from C# method signature
    // Pattern: [access] [modifiers] ReturnType MethodName(...)
    const returnTypeMatch = signature.match(/(?:public|private|internal|protected)?\s*(?:static\s+)?(?:async\s+)?([\w<>,\[\]\.\s]+?)\s+\w+\s*\(/);
    if (returnTypeMatch) {
      return returnTypeMatch[1].trim();
    }
    return 'void';
  }

  countParameters(signature: string): number {
    const paramMatch = signature.match(/\(([^)]*)\)/);
    if (!paramMatch) return 0;

    const params = paramMatch[1].split(',').filter((p) => p.trim());
    return params.length;
  }

  extractFunctionName(signature: string): string {
    // Extract method name from C# signature
    const nameMatch = signature.match(/(?:public|private|internal|protected)?\s*(?:static\s+)?(?:async\s+)?(?:[\w<>,\[\]\.\s]+\s+)?(\w+)\s*\(/);
    return nameMatch ? nameMatch[1] : 'anonymous';
  }
}


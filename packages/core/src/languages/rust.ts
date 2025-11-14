/**
 * Rust language analyzer
 */

import * as path from 'path';
import type { LanguageAnalyzer, SupportedLanguage } from '../types.js';

export class RustAnalyzer implements LanguageAnalyzer {
  detectLanguage(filePath: string, content?: string): SupportedLanguage | null {
    const ext = path.extname(filePath).toLowerCase();
    if (ext === '.rs') {
      return 'rust';
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

      // Rust function pattern: [pub] [async] fn function_name([params]) [-> return_type] { ... }
      // Also handles: pub fn, async fn, unsafe fn, etc.
      const functionMatch = line.match(/(?:pub\s+)?(?:async\s+)?(?:unsafe\s+)?fn\s+(\w+)\s*\([^)]*\)(?:\s*->\s*[^{]+)?\s*\{/);
      if (functionMatch) {
        const startLine = i;
        const signature = line.trim();
        const name = this.extractFunctionName(signature);

        // Find function end by counting braces
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
      'loop',
      'match',
      'if let',
      'while let',
      '&&',
      '||',
      '?',
    ];

    let complexity = 1; // Base complexity

    for (const keyword of complexityKeywords) {
      if (keyword === '&&' || keyword === '||' || keyword === '?') {
        const regex = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        const matches = content.match(regex);
        if (matches) {
          complexity += matches.length;
        }
      } else if (keyword.includes(' ')) {
        // Handle multi-word keywords like "if let", "while let"
        const regex = new RegExp(keyword.replace(/\s+/g, '\\s+'), 'g');
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
    
    // Rust use statements: use std::io; use crate::module;
    // Also handles: use std::io::{self, Read};
    const useRegex = /use\s+([^;]+);/g;
    
    let match;
    while ((match = useRegex.exec(content)) !== null) {
      const raw = match[1].trim();
      const withoutBraces = raw.includes('::{') ? raw.split('::{')[0] : raw;
      const base = withoutBraces.split('::')[0];
      if (base && !dependencies.includes(base)) {
        dependencies.push(base);
      }
    }

    return dependencies;
  }

  extractSideEffects(content: string): string[] {
    const sideEffects: string[] = [];

    if (content.match(/println!|eprintln!|print!/)) {
      sideEffects.push('console-io');
    }
    if (content.match(/mut\s+\w+/) || content.includes('&mut')) {
      sideEffects.push('state-mutation');
    }
    if (content.match(/std::fs::|File::|BufReader|BufWriter/i)) {
      sideEffects.push('file-system');
    }
    if (content.match(/std::net::|reqwest|hyper/i)) {
      sideEffects.push('network');
    }
    if (content.match(/std::process::|Command::new/i)) {
      sideEffects.push('external-process');
    }
    if (content.match(/async|await|tokio/i)) {
      sideEffects.push('asynchronous');
    }
    if (content.match(/unwrap\(|expect\(|panic!/)) {
      sideEffects.push('error-handling');
    }

    return sideEffects;
  }

  extractReturnType(signature: string): string {
    // Extract return type from Rust function signature
    // Pattern: fn name(...) -> ReturnType
    const returnTypeMatch = signature.match(/->\s*([^{]+)/);
    if (returnTypeMatch) {
      return returnTypeMatch[1].trim();
    }
    return '()';
  }

  countParameters(signature: string): number {
    const paramMatch = signature.match(/\(([^)]*)\)/);
    if (!paramMatch) return 0;

    const params = paramMatch[1].split(',').filter((p) => p.trim());
    return params.length;
  }

  extractFunctionName(signature: string): string {
    // Extract function name from Rust signature
    const nameMatch = signature.match(/(?:pub\s+)?(?:async\s+)?(?:unsafe\s+)?fn\s+(\w+)\s*\(/);
    return nameMatch ? nameMatch[1] : 'anonymous';
  }
}


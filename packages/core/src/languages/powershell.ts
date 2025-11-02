/**
 * PowerShell language analyzer
 */

import * as path from 'path';
import type { LanguageAnalyzer, SupportedLanguage } from '../types.js';

export class PowerShellAnalyzer implements LanguageAnalyzer {
  detectLanguage(filePath: string, content?: string): SupportedLanguage | null {
    const ext = path.extname(filePath).toLowerCase();
    if (ext === '.ps1' || ext === '.psm1' || ext === '.psd1' || ext === '.ps1xml') {
      return 'powershell';
    }
    // Check content for PowerShell shebang or keywords
    if (content && (content.includes('#!') && content.includes('pwsh') || content.match(/function\s+\w+-\w+/))) {
      return 'powershell';
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

      // PowerShell function pattern: function Verb-Noun { ... }
      // Also supports: function Name { ... } or [type] function Name { ... }
      const functionMatch = line.match(/^(?:\[.*?\]\s*)?function\s+([\w-]+)\s*(?:\([^)]*\))?\s*\{/i);
      if (functionMatch) {
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
      'elseif',
      'while',
      'for',
      'foreach',
      'switch',
      'where',
      'until',
      'catch',
      'finally',
      '-and',
      '-or',
      '-not',
      '\\?',
      ':',
    ];

    let complexity = 1; // Base complexity

    for (const keyword of complexityKeywords) {
      // Use word boundaries for keywords, but handle operators differently
      if (keyword.startsWith('-') || keyword === '?' || keyword === ':') {
        const regex = new RegExp(keyword.replace(/\\/g, ''), 'g');
        const matches = content.match(regex);
        if (matches) {
          complexity += matches.length;
        }
      } else {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
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
    
    // PowerShell module imports: Import-Module, using module, using namespace
    const importModuleRegex = /Import-Module\s+['"]?([\w.-]+)['"]?/gi;
    const usingModuleRegex = /using\s+module\s+['"]?([\w.\\-]+)['"]?/gi;
    const usingNamespaceRegex = /using\s+namespace\s+([\w.\\]+)/gi;
    
    let match;
    while ((match = importModuleRegex.exec(content)) !== null) {
      dependencies.push(match[1]);
    }
    while ((match = usingModuleRegex.exec(content)) !== null) {
      dependencies.push(match[1]);
    }
    while ((match = usingNamespaceRegex.exec(content)) !== null) {
      dependencies.push(match[1]);
    }

    return dependencies;
  }

  extractSideEffects(content: string): string[] {
    const sideEffects: string[] = [];

    if (content.match(/Write-(?:Host|Output|Warning|Error|Verbose|Debug)/i)) {
      sideEffects.push('output');
    }
    if (content.includes('$global:') || content.includes('$script:')) {
      sideEffects.push('state-mutation');
    }
    if (content.match(/Get-Content|Set-Content|Out-File|Export-Csv/i)) {
      sideEffects.push('file-system');
    }
    if (content.match(/Invoke-WebRequest|Invoke-RestMethod|Start-Process/i)) {
      sideEffects.push('external-process');
    }
    if (content.match(/Get-Service|Set-Service|Start-Service|Stop-Service/i)) {
      sideEffects.push('system-service');
    }

    return sideEffects;
  }

  extractReturnType(signature: string): string {
    // PowerShell return types: [Type] function Name
    const returnTypeMatch = signature.match(/\[([\w.]+)\]\s*function/i);
    return returnTypeMatch ? returnTypeMatch[1] : 'object';
  }

  countParameters(signature: string): number {
    // PowerShell parameters: param($param1, $param2) or function Name($param1, $param2)
    const functionParamMatch = signature.match(/\(([^)]*)\)/);
    if (functionParamMatch) {
      const params = functionParamMatch[1].split(',').filter((p) => p.trim());
      return params.length;
    }
    
    return 0;
  }

  extractFunctionName(signature: string): string {
    // PowerShell function naming: Verb-Noun or just Name
    const match = signature.match(/function\s+([\w-]+)/i);
    return match ? match[1] : 'anonymous';
  }
}


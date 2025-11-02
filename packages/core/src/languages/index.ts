/**
 * Language analyzer registry and factory
 */

import type { LanguageAnalyzer, SupportedLanguage } from '../types.js';
import { TypeScriptAnalyzer } from './typescript.js';
import { PowerShellAnalyzer } from './powershell.js';
import { CSharpAnalyzer } from './csharp.js';
import { RustAnalyzer } from './rust.js';

const analyzers: LanguageAnalyzer[] = [
  new TypeScriptAnalyzer(),
  new PowerShellAnalyzer(),
  new CSharpAnalyzer(),
  new RustAnalyzer(),
];

/**
 * Detect language from file path and optionally content
 */
export function detectLanguage(filePath: string, content?: string): SupportedLanguage | null {
  for (const analyzer of analyzers) {
    const detected = analyzer.detectLanguage(filePath, content);
    if (detected) {
      return detected;
    }
  }
  return null;
}

/**
 * Get the appropriate language analyzer for a file
 */
export function getLanguageAnalyzer(filePath: string, content?: string): LanguageAnalyzer | null {
  for (const analyzer of analyzers) {
    if (analyzer.detectLanguage(filePath, content)) {
      return analyzer;
    }
  }
  return null;
}

/**
 * Get all registered analyzers
 */
export function getAllAnalyzers(): LanguageAnalyzer[] {
  return analyzers;
}

export { TypeScriptAnalyzer, PowerShellAnalyzer, CSharpAnalyzer, RustAnalyzer };


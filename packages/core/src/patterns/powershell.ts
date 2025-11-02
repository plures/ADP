/**
 * PowerShell-specific file type patterns
 */

import type { FileType } from '../types.js';

export const POWERSHELL_FILE_TYPE_PATTERNS = {
  module: {
    patterns: ['**/*.psm1', '**/Modules/**', '**/*Module.ps1'],
    expectedSizeRange: [100, 500] as [number, number],
    complexityThreshold: 10,
  },
  script: {
    patterns: ['**/*.ps1', '**/Scripts/**'],
    expectedSizeRange: [50, 300] as [number, number],
    complexityThreshold: 8,
  },
  manifest: {
    patterns: ['**/*.psd1', '**/*Manifest.psd1'],
    expectedSizeRange: [20, 150] as [number, number],
    complexityThreshold: 2,
  },
  function: {
    patterns: ['**/Functions/**', '**/*Function.ps1', '**/*-*.ps1'],
    expectedSizeRange: [30, 200] as [number, number],
    complexityThreshold: 6,
  },
  test: {
    patterns: ['**/*.Tests.ps1', '**/*.Tests.psm1', '**/Tests/**'],
    expectedSizeRange: [20, 250] as [number, number],
    complexityThreshold: 5,
  },
  config: {
    patterns: ['**/*.ps1xml', '**/Config/**'],
    expectedSizeRange: [10, 100] as [number, number],
    complexityThreshold: 3,
  },
};

/**
 * Classify PowerShell file type
 */
export function classifyPowerShellFileType(filePath: string, content: string): FileType {
  const fileName = filePath.toLowerCase();

  // Check patterns
  for (const [category, config] of Object.entries(POWERSHELL_FILE_TYPE_PATTERNS)) {
    for (const pattern of config.patterns) {
      const cleanPattern = pattern.replace('**/', '').replace('/**', '').replace('*', '').toLowerCase();
      if (fileName.includes(cleanPattern)) {
        return {
          category: category as any,
          subcategory: fileName,
          expectedSizeRange: config.expectedSizeRange,
          complexityThreshold: config.complexityThreshold,
        };
      }
    }
  }

  // Content-based classification
  if (content.includes('function ') && content.match(/function\s+\w+-\w+/)) {
    return {
      category: 'function',
      subcategory: 'cmdlet',
      expectedSizeRange: [30, 200],
      complexityThreshold: 6,
    };
  }

  if (content.includes('Describe') || content.includes('It ') || content.includes('Context ')) {
    return {
      category: 'test',
      subcategory: 'pester',
      expectedSizeRange: [20, 250],
      complexityThreshold: 5,
    };
  }

  return {
    category: 'script',
    subcategory: 'general',
    expectedSizeRange: [50, 300],
    complexityThreshold: 8,
  };
}


/**
 * C#-specific file type patterns
 */

import type { FileType } from '../types.js';

export const CSHARP_FILE_TYPE_PATTERNS = {
  class: {
    patterns: ['**/*.cs', '**/Models/**', '**/Entities/**', '**/*Model.cs', '**/*Entity.cs'],
    expectedSizeRange: [50, 400] as [number, number],
    complexityThreshold: 10,
  },
  controller: {
    patterns: ['**/Controllers/**', '**/*Controller.cs'],
    expectedSizeRange: [80, 300] as [number, number],
    complexityThreshold: 12,
  },
  service: {
    patterns: ['**/Services/**', '**/*Service.cs'],
    expectedSizeRange: [100, 500] as [number, number],
    complexityThreshold: 15,
  },
  handler: {
    patterns: ['**/Handlers/**', '**/*Handler.cs'],
    expectedSizeRange: [60, 250] as [number, number],
    complexityThreshold: 9,
  },
  utility: {
    patterns: ['**/Utils/**', '**/Helpers/**', '**/*Utils.cs', '**/*Helper.cs'],
    expectedSizeRange: [30, 150] as [number, number],
    complexityThreshold: 6,
  },
  test: {
    patterns: ['**/*.Tests.cs', '**/*Test.cs', '**/Tests/**'],
    expectedSizeRange: [20, 300] as [number, number],
    complexityThreshold: 5,
  },
  config: {
    patterns: ['**/Config/**', '**/*Config.cs'],
    expectedSizeRange: [20, 100] as [number, number],
    complexityThreshold: 4,
  },
};

/**
 * Classify C# file type
 */
export function classifyCSharpFileType(filePath: string, content: string): FileType {
  const fileName = filePath.toLowerCase();

  // Check patterns
  for (const [category, config] of Object.entries(CSHARP_FILE_TYPE_PATTERNS)) {
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
  if (content.match(/class\s+\w+\s*:\s*Controller/i)) {
    return {
      category: 'controller',
      subcategory: 'mvc',
      expectedSizeRange: [80, 300],
      complexityThreshold: 12,
    };
  }

  if (content.match(/interface\s+\w+/i)) {
    return {
      category: 'class',
      subcategory: 'interface',
      expectedSizeRange: [20, 200],
      complexityThreshold: 4,
    };
  }

  if (content.includes('class ') && content.includes('public ')) {
    return {
      category: 'class',
      subcategory: 'general',
      expectedSizeRange: [50, 400],
      complexityThreshold: 10,
    };
  }

  return {
    category: 'class',
    subcategory: 'general',
    expectedSizeRange: [50, 400],
    complexityThreshold: 10,
  };
}


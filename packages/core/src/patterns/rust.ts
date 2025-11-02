/**
 * Rust-specific file type patterns
 */

import type { FileType } from '../types.js';

export const RUST_FILE_TYPE_PATTERNS = {
  module: {
    patterns: ['**/*.rs', '**/src/**', '**/lib.rs', '**/main.rs'],
    expectedSizeRange: [100, 500] as [number, number],
    complexityThreshold: 10,
  },
  service: {
    patterns: ['**/services/**', '**/*service.rs'],
    expectedSizeRange: [80, 400] as [number, number],
    complexityThreshold: 12,
  },
  handler: {
    patterns: ['**/handlers/**', '**/*handler.rs'],
    expectedSizeRange: [60, 300] as [number, number],
    complexityThreshold: 9,
  },
  utility: {
    patterns: ['**/utils/**', '**/*utils.rs', '**/*util.rs'],
    expectedSizeRange: [30, 200] as [number, number],
    complexityThreshold: 6,
  },
  test: {
    patterns: ['**/*test.rs', '**/tests/**'],
    expectedSizeRange: [20, 300] as [number, number],
    complexityThreshold: 5,
  },
  config: {
    patterns: ['**/config/**', '**/*config.rs'],
    expectedSizeRange: [20, 150] as [number, number],
    complexityThreshold: 4,
  },
};

/**
 * Classify Rust file type
 */
export function classifyRustFileType(filePath: string, content: string): FileType {
  const fileName = filePath.toLowerCase();

  // Check patterns
  for (const [category, config] of Object.entries(RUST_FILE_TYPE_PATTERNS)) {
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
  if (content.includes('pub struct ') && content.includes('impl ')) {
    return {
      category: 'module',
      subcategory: 'struct',
      expectedSizeRange: [100, 500],
      complexityThreshold: 10,
    };
  }

  if (content.includes('#[test]') || content.includes('#[cfg(test)]')) {
    return {
      category: 'test',
      subcategory: 'unit',
      expectedSizeRange: [20, 300],
      complexityThreshold: 5,
    };
  }

  if (content.includes('fn main()')) {
    return {
      category: 'module',
      subcategory: 'binary',
      expectedSizeRange: [50, 300],
      complexityThreshold: 8,
    };
  }

  return {
    category: 'module',
    subcategory: 'general',
    expectedSizeRange: [100, 500],
    complexityThreshold: 10,
  };
}


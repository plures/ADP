/**
 * Tests for Rust language analyzer
 */

import { describe, it, expect } from 'vitest';
import { RustAnalyzer } from '../../src/languages/rust.js';

describe('RustAnalyzer', () => {
  const analyzer = new RustAnalyzer();

  describe('detectLanguage', () => {
    it('should detect Rust from .rs extension', () => {
      expect(analyzer.detectLanguage('main.rs')).toBe('rust');
    });

    it('should return null for non-Rust files', () => {
      expect(analyzer.detectLanguage('file.js')).toBeNull();
      expect(analyzer.detectLanguage('file.cs')).toBeNull();
    });
  });

  describe('extractFunctions', () => {
    it('should extract simple Rust function', () => {
      const content = `fn calculate(x: i32, y: i32) -> i32 {
  x + y
}`;

      const functions = analyzer.extractFunctions(content);
      expect(functions).toHaveLength(1);
      expect(functions[0].name).toBe('calculate');
    });

    it('should extract public functions', () => {
      const content = `pub fn public_function() {
  println!("Hello");
}`;

      const functions = analyzer.extractFunctions(content);
      expect(functions).toHaveLength(1);
      expect(functions[0].name).toBe('public_function');
    });

    it('should extract async functions', () => {
      const content = `async fn fetch_data() -> Result<String, Error> {
  // async implementation
}`;

      const functions = analyzer.extractFunctions(content);
      expect(functions).toHaveLength(1);
    });

    it('should extract unsafe functions', () => {
      const content = `unsafe fn unsafe_operation() {
  // unsafe code
}`;

      const functions = analyzer.extractFunctions(content);
      expect(functions).toHaveLength(1);
    });
  });

  describe('calculateComplexity', () => {
    it('should calculate basic complexity', () => {
      const content = 'fn test() { }';
      expect(analyzer.calculateComplexity(content)).toBeGreaterThanOrEqual(1);
    });

    it('should increase complexity for if statements', () => {
      const content = `if condition {
  do_something();
}`;
      const complexity = analyzer.calculateComplexity(content);
      expect(complexity).toBeGreaterThan(1);
    });

    it('should handle match expressions', () => {
      const content = `match value {
  Some(x) => x,
  None => 0,
}`;
      const complexity = analyzer.calculateComplexity(content);
      expect(complexity).toBeGreaterThan(1);
    });

    it('should handle if let patterns', () => {
      const content = `if let Some(value) = option {
  process(value);
}`;
      const complexity = analyzer.calculateComplexity(content);
      expect(complexity).toBeGreaterThan(1);
    });

    it('should handle logical operators', () => {
      const content = `if a && b || c {
  return true;
}`;
      const complexity = analyzer.calculateComplexity(content);
      expect(complexity).toBeGreaterThan(2);
    });
  });

  describe('extractDependencies', () => {
    it('should extract use statements', () => {
      const content = `use std::io;
use std::fs::File;
use crate::module;`;
      const deps = analyzer.extractDependencies(content);
      expect(deps.length).toBeGreaterThan(0);
    });

    it('should handle use statements with braces', () => {
      const content = `use std::io::{self, Read, Write};`;
      const deps = analyzer.extractDependencies(content);
      expect(deps.length).toBeGreaterThan(0);
    });
  });

  describe('extractSideEffects', () => {
    it('should detect println! macro', () => {
      const content = 'println!("Hello");';
      const effects = analyzer.extractSideEffects(content);
      expect(effects).toContain('console-io');
    });

    it('should detect mutable references', () => {
      const content = 'let mut x = 5;';
      const effects = analyzer.extractSideEffects(content);
      expect(effects).toContain('state-mutation');
    });

    it('should detect file system operations', () => {
      const content = 'let file = File::open("test.txt")?;';
      const effects = analyzer.extractSideEffects(content);
      expect(effects).toContain('file-system');
    });

    it('should detect async operations', () => {
      const content = 'tokio::spawn(async { });';
      const effects = analyzer.extractSideEffects(content);
      expect(effects).toContain('asynchronous');
    });

    it('should detect error handling patterns', () => {
      const content = 'value.unwrap();';
      const effects = analyzer.extractSideEffects(content);
      expect(effects).toContain('error-handling');
    });
  });

  describe('extractReturnType', () => {
    it('should extract return type', () => {
      const signature = 'fn test() -> i32';
      expect(analyzer.extractReturnType(signature)).toBe('i32');
    });

    it('should extract Result return type', () => {
      const signature = 'fn test() -> Result<String, Error>';
      const returnType = analyzer.extractReturnType(signature);
      expect(returnType).toContain('Result');
    });

    it('should return unit type for no return', () => {
      const signature = 'fn test()';
      expect(analyzer.extractReturnType(signature)).toBe('()');
    });
  });

  describe('countParameters', () => {
    it('should count function parameters', () => {
      const signature = 'fn test(x: i32, y: String, z: bool)';
      expect(analyzer.countParameters(signature)).toBe(3);
    });

    it('should return 0 for no parameters', () => {
      const signature = 'fn test()';
      expect(analyzer.countParameters(signature)).toBe(0);
    });
  });

  describe('extractFunctionName', () => {
    it('should extract function name', () => {
      const signature = 'fn calculate_total()';
      expect(analyzer.extractFunctionName(signature)).toBe('calculate_total');
    });

    it('should extract public function name', () => {
      const signature = 'pub fn public_api()';
      expect(analyzer.extractFunctionName(signature)).toBe('public_api');
    });
  });
});


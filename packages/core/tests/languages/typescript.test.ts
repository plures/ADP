/**
 * Tests for TypeScript language analyzer
 */

import { describe, it, expect } from 'vitest';
import { TypeScriptAnalyzer } from '../../src/languages/typescript.js';

describe('TypeScriptAnalyzer', () => {
  const analyzer = new TypeScriptAnalyzer();

  describe('detectLanguage', () => {
    it('should detect TypeScript from .ts extension', () => {
      expect(analyzer.detectLanguage('file.ts')).toBe('typescript');
    });

    it('should detect TypeScript from .tsx extension', () => {
      expect(analyzer.detectLanguage('component.tsx')).toBe('typescript');
    });

    it('should detect JavaScript from .js extension', () => {
      expect(analyzer.detectLanguage('file.js')).toBe('javascript');
    });

    it('should detect JavaScript from .jsx extension', () => {
      expect(analyzer.detectLanguage('component.jsx')).toBe('javascript');
    });

    it('should return null for non-JS/TS files', () => {
      expect(analyzer.detectLanguage('file.cs')).toBeNull();
      expect(analyzer.detectLanguage('file.ps1')).toBeNull();
    });
  });

  describe('extractFunctions', () => {
    it('should extract function declarations', () => {
      const content = `function calculate(x: number, y: number): number {
  return x + y;
}`;

      const functions = analyzer.extractFunctions(content);
      expect(functions).toHaveLength(1);
      expect(functions[0].name).toBe('calculate');
    });

    it('should extract arrow functions', () => {
      const content = `const add = (x: number, y: number): number => {
  return x + y;
}`;

      const functions = analyzer.extractFunctions(content);
      expect(functions.length).toBeGreaterThanOrEqual(1);
    });

    it('should extract async functions', () => {
      const content = `async function fetchData(): Promise<string> {
  return await fetch('url');
}`;

      const functions = analyzer.extractFunctions(content);
      expect(functions).toHaveLength(1);
    });

    it('should extract exported functions', () => {
      const content = `export function publicApi() {
  return 'test';
}`;

      const functions = analyzer.extractFunctions(content);
      expect(functions).toHaveLength(1);
      expect(functions[0].name).toBe('publicApi');
    });
  });

  describe('calculateComplexity', () => {
    it('should calculate basic complexity', () => {
      const content = 'function test() { return; }';
      expect(analyzer.calculateComplexity(content)).toBeGreaterThanOrEqual(1);
    });

    it('should increase complexity for if statements', () => {
      const content = `if (condition) {
  doSomething();
}`;
      const complexity = analyzer.calculateComplexity(content);
      expect(complexity).toBeGreaterThan(1);
    });

    it('should handle logical operators', () => {
      const content = `if (a && b || c) {
  return true;
}`;
      const complexity = analyzer.calculateComplexity(content);
      expect(complexity).toBeGreaterThan(2);
    });

    it('should handle ternary operators', () => {
      const content = `const result = condition ? a : b;`;
      const complexity = analyzer.calculateComplexity(content);
      expect(complexity).toBeGreaterThan(1);
    });
  });

  describe('extractDependencies', () => {
    it('should extract import statements', () => {
      const content = `import { Component } from 'react';
import * as utils from './utils';`;
      const deps = analyzer.extractDependencies(content);
      expect(deps).toContain('react');
      expect(deps).toContain('./utils');
    });

    it('should handle default imports', () => {
      const content = `import express from 'express';`;
      const deps = analyzer.extractDependencies(content);
      expect(deps).toContain('express');
    });
  });

  describe('extractSideEffects', () => {
    it('should detect console.log', () => {
      const content = 'console.log("Test");';
      const effects = analyzer.extractSideEffects(content);
      expect(effects).toContain('logging');
    });

    it('should detect this access', () => {
      const content = 'this.property = value;';
      const effects = analyzer.extractSideEffects(content);
      expect(effects).toContain('state-mutation');
    });

    it('should detect file system operations', () => {
      const content = 'fs.readFileSync("file.txt");';
      const effects = analyzer.extractSideEffects(content);
      expect(effects).toContain('file-system');
    });

    it('should detect network operations', () => {
      const content = 'fetch("https://api.example.com");';
      const effects = analyzer.extractSideEffects(content);
      expect(effects).toContain('network');
    });
  });

  describe('extractReturnType', () => {
    it('should extract return type from function signature', () => {
      const signature = 'function test(): string';
      expect(analyzer.extractReturnType(signature)).toBe('string');
    });

    it('should return any for no return type', () => {
      const signature = 'function test()';
      expect(analyzer.extractReturnType(signature)).toBe('any');
    });
  });

  describe('countParameters', () => {
    it('should count function parameters', () => {
      const signature = 'function test(x: number, y: string)';
      expect(analyzer.countParameters(signature)).toBe(2);
    });

    it('should return 0 for no parameters', () => {
      const signature = 'function test()';
      expect(analyzer.countParameters(signature)).toBe(0);
    });
  });

  describe('extractFunctionName', () => {
    it('should extract function name', () => {
      const signature = 'function calculateTotal()';
      expect(analyzer.extractFunctionName(signature)).toBe('calculateTotal');
    });

    it('should extract arrow function name', () => {
      const signature = 'const add = (x, y) =>';
      expect(analyzer.extractFunctionName(signature)).toBe('add');
    });
  });
});


/**
 * Tests for C# language analyzer
 */

import { describe, it, expect } from 'vitest';
import { CSharpAnalyzer } from '../../src/languages/csharp.js';

describe('CSharpAnalyzer', () => {
  const analyzer = new CSharpAnalyzer();

  describe('detectLanguage', () => {
    it('should detect C# from .cs extension', () => {
      expect(analyzer.detectLanguage('Program.cs')).toBe('csharp');
    });

    it('should detect C# from .csx extension', () => {
      expect(analyzer.detectLanguage('script.csx')).toBe('csharp');
    });

    it('should return null for non-C# files', () => {
      expect(analyzer.detectLanguage('file.js')).toBeNull();
      expect(analyzer.detectLanguage('file.ps1')).toBeNull();
    });
  });

  describe('extractFunctions', () => {
    it('should extract simple C# method', () => {
      const content = `public class Program {
  public void DoSomething() {
    Console.WriteLine("Hello");
  }
}`;

      const functions = analyzer.extractFunctions(content);
      expect(functions.length).toBeGreaterThanOrEqual(1);
    });

    it('should extract async methods', () => {
      const content = `public async Task<string> GetDataAsync() {
  return await httpClient.GetStringAsync("url");
}`;

      const functions = analyzer.extractFunctions(content);
      expect(functions.length).toBeGreaterThanOrEqual(1);
    });

    it('should extract static methods', () => {
      const content = `public static int Calculate(int x, int y) {
  return x + y;
}`;

      const functions = analyzer.extractFunctions(content);
      expect(functions.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('calculateComplexity', () => {
    it('should calculate basic complexity', () => {
      const content = 'public void Test() { return; }';
      expect(analyzer.calculateComplexity(content)).toBeGreaterThanOrEqual(1);
    });

    it('should increase complexity for if statements', () => {
      const content = `if (condition) {
  DoSomething();
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

    it('should handle switch statements', () => {
      const content = `switch (value) {
  case 1:
    return "one";
  case 2:
    return "two";
}`;
      const complexity = analyzer.calculateComplexity(content);
      expect(complexity).toBeGreaterThan(2);
    });

    it('should handle null-coalescing operator', () => {
      const content = `var result = value ?? defaultValue;`;
      const complexity = analyzer.calculateComplexity(content);
      expect(complexity).toBeGreaterThan(1);
    });
  });

  describe('extractDependencies', () => {
    it('should extract using statements', () => {
      const content = `using System;
using System.IO;
using System.Collections.Generic;`;
      const deps = analyzer.extractDependencies(content);
      expect(deps).toContain('System');
      expect(deps).toContain('System.IO');
      expect(deps).toContain('System.Collections.Generic');
    });

    it('should handle using static', () => {
      const content = `using static System.Console;`;
      const deps = analyzer.extractDependencies(content);
      expect(deps.length).toBeGreaterThan(0);
    });
  });

  describe('extractSideEffects', () => {
    it('should detect Console.WriteLine', () => {
      const content = 'Console.WriteLine("Test");';
      const effects = analyzer.extractSideEffects(content);
      expect(effects).toContain('console-io');
    });

    it('should detect file system operations', () => {
      const content = 'File.ReadAllText("file.txt");';
      const effects = analyzer.extractSideEffects(content);
      expect(effects).toContain('file-system');
    });

    it('should detect network operations', () => {
      const content = 'var client = new HttpClient();';
      const effects = analyzer.extractSideEffects(content);
      expect(effects).toContain('network');
    });

    it('should detect async operations', () => {
      const content = 'await Task.Delay(1000);';
      const effects = analyzer.extractSideEffects(content);
      expect(effects).toContain('asynchronous');
    });

    it('should detect state mutations', () => {
      const content = 'this.Property = value;';
      const effects = analyzer.extractSideEffects(content);
      expect(effects).toContain('state-mutation');
    });
  });

  describe('extractReturnType', () => {
    it('should extract return type from method signature', () => {
      const signature = 'public string GetName()';
      expect(analyzer.extractReturnType(signature)).toBe('string');
    });

    it('should extract Task return type', () => {
      const signature = 'public async Task<int> GetValueAsync()';
      const returnType = analyzer.extractReturnType(signature);
      expect(returnType).toContain('Task');
    });

    it('should return void for void methods', () => {
      const signature = 'public void DoSomething()';
      expect(analyzer.extractReturnType(signature)).toBe('void');
    });
  });

  describe('countParameters', () => {
    it('should count method parameters', () => {
      const signature = 'public void Test(int x, string y, bool z)';
      expect(analyzer.countParameters(signature)).toBe(3);
    });

    it('should return 0 for no parameters', () => {
      const signature = 'public void Test()';
      expect(analyzer.countParameters(signature)).toBe(0);
    });
  });

  describe('extractFunctionName', () => {
    it('should extract method name', () => {
      const signature = 'public void CalculateTotal()';
      expect(analyzer.extractFunctionName(signature)).toBe('CalculateTotal');
    });

    it('should extract async method name', () => {
      const signature = 'public async Task<string> GetDataAsync()';
      expect(analyzer.extractFunctionName(signature)).toBe('GetDataAsync');
    });
  });
});


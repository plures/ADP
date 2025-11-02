/**
 * Tests for PowerShell language analyzer
 */

import { describe, it, expect } from 'vitest';
import { PowerShellAnalyzer } from '../../src/languages/powershell.js';

describe('PowerShellAnalyzer', () => {
  const analyzer = new PowerShellAnalyzer();

  describe('detectLanguage', () => {
    it('should detect PowerShell from .ps1 extension', () => {
      expect(analyzer.detectLanguage('script.ps1')).toBe('powershell');
    });

    it('should detect PowerShell from .psm1 extension', () => {
      expect(analyzer.detectLanguage('module.psm1')).toBe('powershell');
    });

    it('should detect PowerShell from .psd1 extension', () => {
      expect(analyzer.detectLanguage('manifest.psd1')).toBe('powershell');
    });

    it('should return null for non-PowerShell files', () => {
      expect(analyzer.detectLanguage('script.js')).toBeNull();
      expect(analyzer.detectLanguage('file.cs')).toBeNull();
    });

    it('should detect PowerShell from content with function Verb-Noun pattern', () => {
      const content = 'function Get-Data {\n  return $data\n}';
      expect(analyzer.detectLanguage('file.txt', content)).toBe('powershell');
    });
  });

  describe('extractFunctions', () => {
    it('should extract simple PowerShell function', () => {
      const content = `function Get-UserData {
  param($UserId)
  return $users[$UserId]
}`;

      const functions = analyzer.extractFunctions(content);
      expect(functions).toHaveLength(1);
      expect(functions[0].name).toBe('Get-UserData');
      expect(functions[0].line).toBe(1);
    });

    it('should extract multiple functions', () => {
      const content = `function Get-User {
  return $user
}

function Set-User {
  param($User)
  $global:users += $User
}`;

      const functions = analyzer.extractFunctions(content);
      expect(functions).toHaveLength(2);
      expect(functions[0].name).toBe('Get-User');
      expect(functions[1].name).toBe('Set-User');
    });

    it('should handle functions with typed return values', () => {
      const content = `[string] function Get-Name {
  return "Test"
}`;

      const functions = analyzer.extractFunctions(content);
      expect(functions).toHaveLength(1);
      expect(functions[0].name).toBe('Get-Name');
    });
  });

  describe('calculateComplexity', () => {
    it('should calculate basic complexity', () => {
      const content = 'function Test { return $true }';
      expect(analyzer.calculateComplexity(content)).toBeGreaterThanOrEqual(1);
    });

    it('should increase complexity for if statements', () => {
      const content = `function Test {
  if ($condition) { return $true }
}`;
      const complexity = analyzer.calculateComplexity(content);
      expect(complexity).toBeGreaterThan(1);
    });

    it('should handle PowerShell operators', () => {
      const content = `function Test {
  if ($a -and $b) { return $true }
  if ($x -or $y) { return $false }
}`;
      const complexity = analyzer.calculateComplexity(content);
      expect(complexity).toBeGreaterThan(2);
    });

    it('should handle switch statements', () => {
      const content = `function Test {
  switch ($value) {
    case 1 { return "one" }
    case 2 { return "two" }
  }
}`;
      const complexity = analyzer.calculateComplexity(content);
      expect(complexity).toBeGreaterThan(2);
    });
  });

  describe('extractDependencies', () => {
    it('should extract Import-Module statements', () => {
      const content = `Import-Module Az.Accounts
Import-Module ActiveDirectory`;
      const deps = analyzer.extractDependencies(content);
      expect(deps).toContain('Az.Accounts');
      expect(deps).toContain('ActiveDirectory');
    });

    it('should extract using module statements', () => {
      const content = `using module MyModule
using namespace System.Collections`;
      const deps = analyzer.extractDependencies(content);
      expect(deps.length).toBeGreaterThan(0);
    });
  });

  describe('extractSideEffects', () => {
    it('should detect Write-Output side effect', () => {
      const content = 'Write-Output "Hello"';
      const effects = analyzer.extractSideEffects(content);
      expect(effects).toContain('output');
    });

    it('should detect file system operations', () => {
      const content = 'Get-Content file.txt';
      const effects = analyzer.extractSideEffects(content);
      expect(effects).toContain('file-system');
    });

    it('should detect global state mutations', () => {
      const content = '$global:counter = 0';
      const effects = analyzer.extractSideEffects(content);
      expect(effects).toContain('state-mutation');
    });

    it('should detect external process execution', () => {
      const content = 'Start-Process notepad.exe';
      const effects = analyzer.extractSideEffects(content);
      expect(effects).toContain('external-process');
    });
  });

  describe('extractReturnType', () => {
    it('should extract typed return type', () => {
      const signature = '[string] function Get-Name';
      expect(analyzer.extractReturnType(signature)).toBe('string');
    });

    it('should return default for untyped functions', () => {
      const signature = 'function Get-Data';
      expect(analyzer.extractReturnType(signature)).toBe('object');
    });
  });

  describe('countParameters', () => {
    it('should count function parameters', () => {
      const signature = 'function Test($param1, $param2)';
      expect(analyzer.countParameters(signature)).toBe(2);
    });

    it('should return 0 for no parameters', () => {
      const signature = 'function Test';
      expect(analyzer.countParameters(signature)).toBe(0);
    });
  });

  describe('extractFunctionName', () => {
    it('should extract Verb-Noun function name', () => {
      const signature = 'function Get-UserData';
      expect(analyzer.extractFunctionName(signature)).toBe('Get-UserData');
    });

    it('should extract simple function name', () => {
      const signature = 'function TestFunction';
      expect(analyzer.extractFunctionName(signature)).toBe('TestFunction');
    });
  });
});


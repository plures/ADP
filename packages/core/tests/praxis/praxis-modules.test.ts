/**
 * Tests for ADP Praxis modules
 */

import { describe, it, expect } from 'vitest';
import { LogicEngine, PraxisRegistry } from '@plures/praxis';
import {
  patternDetectionModule,
  refactoringPolicyModule,
  complianceModule,
  adpModules,
} from '../../src/praxis/index.js';
import type { ADPContext } from '../../src/praxis/types.js';
import type { FileMetrics } from '../../src/types.js';

function makeMetric(overrides: Partial<FileMetrics> = {}): FileMetrics {
  return {
    file: 'test.ts',
    language: 'typescript',
    fileType: { category: 'utility', subcategory: 'general', expectedSizeRange: [30, 150], complexityThreshold: 6 },
    lines: 50,
    functions: [],
    complexity: 5,
    purity: 80,
    dependencies: [],
    responsibilities: ['module-export'],
    ...overrides,
  };
}

function makeContext(overrides: Partial<ADPContext> = {}): ADPContext {
  return {
    fileMetrics: [],
    complexityThreshold: 10,
    maxFileLines: 300,
    minPurityScore: 60,
    maxFunctionLines: 50,
    ...overrides,
  };
}

describe('Pattern Detection Module', () => {
  it('should detect god objects', () => {
    const registry = new PraxisRegistry<ADPContext>();
    registry.registerModule(patternDetectionModule);

    const ctx = makeContext({
      fileMetrics: [
        makeMetric({
          responsibilities: ['state-management', 'object-oriented', 'asynchronous', 'module-export', 'testing'],
        }),
      ],
    });

    const engine = new LogicEngine<ADPContext>({
      initialContext: ctx,
      registry,
    });

    const result = engine.step([{ tag: 'analyze', payload: {} }]);
    const antiPatterns = result.state.facts.filter((f) => f.tag === 'adp.anti-pattern.detected');
    expect(antiPatterns.length).toBeGreaterThan(0);
    expect((antiPatterns[0].payload as { pattern: string }).pattern).toBe('god-object');
  });

  it('should return noop when no issues found', () => {
    const registry = new PraxisRegistry<ADPContext>();
    registry.registerModule(patternDetectionModule);

    const ctx = makeContext({
      fileMetrics: [makeMetric()],
    });

    const engine = new LogicEngine<ADPContext>({
      initialContext: ctx,
      registry,
    });

    const result = engine.step([{ tag: 'analyze', payload: {} }]);
    const antiPatterns = result.state.facts.filter((f) => f.tag === 'adp.anti-pattern.detected');
    expect(antiPatterns).toHaveLength(0);
  });

  it('should detect excessive coupling', () => {
    const registry = new PraxisRegistry<ADPContext>();
    registry.registerModule(patternDetectionModule);

    const deps = Array.from({ length: 12 }, (_, i) => `./module-${i}`);
    const ctx = makeContext({
      fileMetrics: [makeMetric({ dependencies: deps })],
    });

    const engine = new LogicEngine<ADPContext>({
      initialContext: ctx,
      registry,
    });

    const result = engine.step([{ tag: 'analyze', payload: {} }]);
    const antiPatterns = result.state.facts.filter((f) => f.tag === 'adp.anti-pattern.detected');
    expect(antiPatterns.length).toBeGreaterThan(0);
    expect((antiPatterns[0].payload as { pattern: string }).pattern).toBe('excessive-coupling');
  });
});

describe('Refactoring Policy Module', () => {
  it('should recommend module extraction for large files', () => {
    const registry = new PraxisRegistry<ADPContext>();
    registry.registerModule(refactoringPolicyModule);

    const ctx = makeContext({
      fileMetrics: [makeMetric({ lines: 500 })],
      maxFileLines: 300,
    });

    const engine = new LogicEngine<ADPContext>({
      initialContext: ctx,
      registry,
    });

    const result = engine.step([{ tag: 'analyze', payload: {} }]);
    const recs = result.state.facts.filter((f) => f.tag === 'adp.refactoring.recommended');
    expect(recs.length).toBeGreaterThan(0);
  });

  it('should recommend function extraction for large functions', () => {
    const registry = new PraxisRegistry<ADPContext>();
    registry.registerModule(refactoringPolicyModule);

    const ctx = makeContext({
      fileMetrics: [
        makeMetric({
          functions: [
            { name: 'bigFn', line: 1, lines: 80, complexity: 5, purity: 70, parameters: 2, returnType: 'void', sideEffects: [] },
          ],
        }),
      ],
      maxFunctionLines: 50,
    });

    const engine = new LogicEngine<ADPContext>({
      initialContext: ctx,
      registry,
    });

    const result = engine.step([{ tag: 'analyze', payload: {} }]);
    const recs = result.state.facts.filter((f) => f.tag === 'adp.refactoring.recommended');
    expect(recs.length).toBeGreaterThan(0);
  });
});

describe('Compliance Module', () => {
  it('should emit compliance failures for high complexity', () => {
    const registry = new PraxisRegistry<ADPContext>();
    registry.registerModule(complianceModule);

    const ctx = makeContext({
      fileMetrics: [makeMetric({ complexity: 25 })],
      complexityThreshold: 10,
    });

    const engine = new LogicEngine<ADPContext>({
      initialContext: ctx,
      registry,
    });

    const result = engine.step([{ tag: 'analyze', payload: {} }]);
    const compliance = result.state.facts.filter((f) => f.tag === 'adp.compliance.result');
    expect(compliance.length).toBeGreaterThan(0);
    expect((compliance[0].payload as { passed: boolean }).passed).toBe(false);
  });

  it('should detect critical constraint violations', () => {
    const registry = new PraxisRegistry<ADPContext>();
    registry.registerModule(complianceModule);

    const ctx = makeContext({
      fileMetrics: [makeMetric({ complexity: 35 })],
      complexityThreshold: 10,
    });

    const engine = new LogicEngine<ADPContext>({
      initialContext: ctx,
      registry,
    });

    const result = engine.step([{ tag: 'analyze', payload: {} }]);
    // Constraint violation should appear in diagnostics
    const violations = result.diagnostics.filter((d) => d.kind === 'constraint-violation');
    expect(violations.length).toBeGreaterThan(0);
  });

  it('should pass when files are compliant', () => {
    const registry = new PraxisRegistry<ADPContext>();
    registry.registerModule(complianceModule);

    const ctx = makeContext({
      fileMetrics: [makeMetric({ complexity: 5, lines: 50 })],
      complexityThreshold: 10,
      maxFileLines: 300,
    });

    const engine = new LogicEngine<ADPContext>({
      initialContext: ctx,
      registry,
    });

    const result = engine.step([{ tag: 'analyze', payload: {} }]);
    const compliance = result.state.facts.filter((f) => f.tag === 'adp.compliance.result');
    expect(compliance).toHaveLength(0);
    const violations = result.diagnostics.filter((d) => d.kind === 'constraint-violation');
    expect(violations).toHaveLength(0);
  });
});

describe('ADP Modules Bundle', () => {
  it('should register all modules without errors', () => {
    const registry = new PraxisRegistry<ADPContext>();
    for (const mod of adpModules) {
      registry.registerModule(mod);
    }
    expect(registry.getRuleIds().length).toBeGreaterThan(0);
    expect(registry.getConstraintIds().length).toBeGreaterThan(0);
  });
});

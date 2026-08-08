/**
 * Refactoring Policy Praxis Module
 *
 * Determines which refactorings to suggest, priority scoring,
 * and effort estimation using declarative Praxis rules.
 */

import { RuleResult, fact } from '@plures/praxis';
import type { PraxisModule, RuleDescriptor } from '@plures/praxis';
import type { ADPContext, RefactoringPolicyPayload } from './types.js';

type ADPRuleDescriptor = RuleDescriptor<ADPContext>;

/**
 * Recommends module extraction for oversized files.
 */
const extractModuleRule: ADPRuleDescriptor = {
  id: 'adp.refactoring.extract-module',
  description: 'Recommends extracting modules from oversized files',
  impl(state) {
    const { fileMetrics, maxFileLines } = state.context;
    const facts: Array<{ tag: string; payload: RefactoringPolicyPayload }> = [];

    for (const metric of fileMetrics) {
      if (metric.lines > maxFileLines) {
        const overageRatio = metric.lines / maxFileLines;
        facts.push(
          fact('adp.refactoring.recommended', {
            file: metric.file,
            recommendation: {
              file: metric.file,
              priority: overageRatio > 2 ? 'high' : 'medium',
              type: 'extract-module',
              reason: `File has ${metric.lines} lines (max: ${maxFileLines})`,
              suggestedActions: [
                'Extract related functions into separate modules',
                'Apply single responsibility principle',
              ],
              estimatedEffort: overageRatio > 3 ? 'high' : 'medium',
            },
            impactScore: Math.min(100, Math.round(overageRatio * 30)),
            effortScore: Math.min(100, Math.round(overageRatio * 20)),
          } satisfies RefactoringPolicyPayload) as { tag: string; payload: RefactoringPolicyPayload }
        );
      }
    }

    if (facts.length === 0) {
      return RuleResult.noop('No files exceed size threshold');
    }
    return RuleResult.emit(facts);
  },
};

/**
 * Recommends function extraction for oversized functions.
 */
const extractFunctionRule: ADPRuleDescriptor = {
  id: 'adp.refactoring.extract-function',
  description: 'Recommends breaking down oversized functions',
  impl(state) {
    const { fileMetrics, maxFunctionLines } = state.context;
    const facts: Array<{ tag: string; payload: RefactoringPolicyPayload }> = [];

    for (const metric of fileMetrics) {
      const largeFunctions = metric.functions.filter((f) => f.lines > maxFunctionLines);
      if (largeFunctions.length > 0) {
        facts.push(
          fact('adp.refactoring.recommended', {
            file: metric.file,
            recommendation: {
              file: metric.file,
              priority: 'medium',
              type: 'extract-function',
              reason: `${largeFunctions.length} function(s) exceed ${maxFunctionLines} lines`,
              suggestedActions: [
                'Break down large functions into smaller, focused functions',
                'Use composition over monolithic functions',
              ],
              estimatedEffort: 'low',
            },
            impactScore: Math.min(100, largeFunctions.length * 25),
            effortScore: Math.min(100, largeFunctions.length * 15),
          } satisfies RefactoringPolicyPayload) as { tag: string; payload: RefactoringPolicyPayload }
        );
      }
    }

    if (facts.length === 0) {
      return RuleResult.noop('No oversized functions found');
    }
    return RuleResult.emit(facts);
  },
};

/**
 * Recommends purity improvements for impure files.
 */
const improvePurityRule: ADPRuleDescriptor = {
  id: 'adp.refactoring.improve-purity',
  description: 'Recommends reducing side effects in files with low purity scores',
  impl(state) {
    const { fileMetrics, minPurityScore } = state.context;
    const facts: Array<{ tag: string; payload: RefactoringPolicyPayload }> = [];

    for (const metric of fileMetrics) {
      if (metric.purity < minPurityScore) {
        facts.push(
          fact('adp.refactoring.recommended', {
            file: metric.file,
            recommendation: {
              file: metric.file,
              priority: 'low',
              type: 'improve-purity',
              reason: `Purity score ${metric.purity} is below threshold ${minPurityScore}`,
              suggestedActions: [
                'Separate pure logic from side effects',
                'Use functional programming patterns',
              ],
              estimatedEffort: 'high',
            },
            impactScore: Math.round(((minPurityScore - metric.purity) / minPurityScore) * 100),
            effortScore: 70,
          } satisfies RefactoringPolicyPayload) as { tag: string; payload: RefactoringPolicyPayload }
        );
      }
    }

    if (facts.length === 0) {
      return RuleResult.noop('All files meet purity threshold');
    }
    return RuleResult.emit(facts);
  },
};

/**
 * Refactoring Policy Praxis Module
 */
export const refactoringPolicyModule: PraxisModule<ADPContext> = {
  rules: [extractModuleRule, extractFunctionRule, improvePurityRule],
  constraints: [],
  meta: {
    name: 'refactoring-policy',
    description: 'Recommendation priority, impact scoring, effort estimation',
  },
};

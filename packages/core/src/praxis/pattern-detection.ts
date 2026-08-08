/**
 * Pattern Detection Praxis Module
 *
 * Identifies architecture patterns and anti-patterns in code using
 * declarative Praxis rules with typed RuleResult returns.
 */

import { RuleResult, fact } from '@plures/praxis';
import type { PraxisModule, RuleDescriptor } from '@plures/praxis';
import type { ADPContext, PatternDetectionPayload } from './types.js';

type ADPRuleDescriptor = RuleDescriptor<ADPContext>;

/**
 * Detects god objects (files with excessive responsibilities).
 */
const godObjectRule: ADPRuleDescriptor = {
  id: 'adp.pattern.god-object',
  description: 'Detects files with too many responsibilities (god objects)',
  impl(state) {
    const { fileMetrics } = state.context;
    const facts: Array<{ tag: string; payload: PatternDetectionPayload }> = [];

    for (const metric of fileMetrics) {
      if (metric.responsibilities.length > 4) {
        facts.push(
          fact('adp.anti-pattern.detected', {
            file: metric.file,
            pattern: 'god-object',
            category: 'anti-pattern',
            severity: 'high',
            details: `File has ${metric.responsibilities.length} responsibilities: ${metric.responsibilities.join(', ')}`,
          } satisfies PatternDetectionPayload) as { tag: string; payload: PatternDetectionPayload }
        );
      }
    }

    if (facts.length === 0) {
      return RuleResult.noop('No god objects detected');
    }
    return RuleResult.emit(facts);
  },
};

/**
 * Detects excessive coupling (too many dependencies).
 */
const excessiveCouplingRule: ADPRuleDescriptor = {
  id: 'adp.pattern.excessive-coupling',
  description: 'Detects files with too many external dependencies',
  impl(state) {
    const { fileMetrics } = state.context;
    const COUPLING_THRESHOLD = 10;
    const facts: Array<{ tag: string; payload: PatternDetectionPayload }> = [];

    for (const metric of fileMetrics) {
      if (metric.dependencies.length > COUPLING_THRESHOLD) {
        facts.push(
          fact('adp.anti-pattern.detected', {
            file: metric.file,
            pattern: 'excessive-coupling',
            category: 'anti-pattern',
            severity: 'medium',
            details: `File imports ${metric.dependencies.length} modules (threshold: ${COUPLING_THRESHOLD})`,
          } satisfies PatternDetectionPayload) as { tag: string; payload: PatternDetectionPayload }
        );
      }
    }

    if (facts.length === 0) {
      return RuleResult.noop('No excessive coupling detected');
    }
    return RuleResult.emit(facts);
  },
};

/**
 * Detects deeply nested complexity.
 */
const deepNestingRule: ADPRuleDescriptor = {
  id: 'adp.pattern.deep-nesting',
  description: 'Detects functions with excessive cyclomatic complexity indicating deep nesting',
  impl(state) {
    const { fileMetrics, complexityThreshold } = state.context;
    const facts: Array<{ tag: string; payload: PatternDetectionPayload }> = [];

    for (const metric of fileMetrics) {
      const complexFunctions = metric.functions.filter(
        (f) => f.complexity > complexityThreshold * 2
      );
      if (complexFunctions.length > 0) {
        facts.push(
          fact('adp.anti-pattern.detected', {
            file: metric.file,
            pattern: 'deep-nesting',
            category: 'anti-pattern',
            severity: 'high',
            details: `${complexFunctions.length} function(s) exceed 2x complexity threshold: ${complexFunctions.map((f) => f.name).join(', ')}`,
          } satisfies PatternDetectionPayload) as { tag: string; payload: PatternDetectionPayload }
        );
      }
    }

    if (facts.length === 0) {
      return RuleResult.noop('No deep nesting detected');
    }
    return RuleResult.emit(facts);
  },
};

/**
 * Pattern Detection Praxis Module
 */
export const patternDetectionModule: PraxisModule<ADPContext> = {
  rules: [godObjectRule, excessiveCouplingRule, deepNestingRule],
  constraints: [],
  meta: {
    name: 'pattern-detection',
    description: 'Architecture pattern/anti-pattern classification rules',
  },
};

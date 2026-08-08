/**
 * Compliance Praxis Module
 *
 * Enforces architectural standards and quality gates using
 * declarative Praxis constraints.
 */

import { RuleResult, fact } from '@plures/praxis';
import type { PraxisModule, RuleDescriptor, ConstraintDescriptor } from '@plures/praxis';
import type { ADPContext, CompliancePayload } from './types.js';

type ADPRuleDescriptor = RuleDescriptor<ADPContext>;
type ADPConstraintDescriptor = ConstraintDescriptor<ADPContext>;

/**
 * Emits compliance facts for files that violate complexity thresholds.
 */
const complexityGateRule: ADPRuleDescriptor = {
  id: 'adp.compliance.complexity-gate',
  description: 'Checks files against complexity thresholds and emits compliance facts',
  impl(state) {
    const { fileMetrics, complexityThreshold } = state.context;
    const facts: Array<{ tag: string; payload: CompliancePayload }> = [];

    for (const metric of fileMetrics) {
      const passed = metric.complexity <= complexityThreshold;
      if (!passed) {
        facts.push(
          fact('adp.compliance.result', {
            file: metric.file,
            gate: 'complexity',
            passed: false,
            message: `Complexity ${metric.complexity} exceeds threshold ${complexityThreshold}`,
          } satisfies CompliancePayload) as { tag: string; payload: CompliancePayload }
        );
      }
    }

    if (facts.length === 0) {
      return RuleResult.noop('All files pass complexity gate');
    }
    return RuleResult.emit(facts);
  },
};

/**
 * Emits compliance facts for files that violate size thresholds.
 */
const sizeGateRule: ADPRuleDescriptor = {
  id: 'adp.compliance.size-gate',
  description: 'Checks files against size thresholds and emits compliance facts',
  impl(state) {
    const { fileMetrics, maxFileLines } = state.context;
    const facts: Array<{ tag: string; payload: CompliancePayload }> = [];

    for (const metric of fileMetrics) {
      const passed = metric.lines <= maxFileLines;
      if (!passed) {
        facts.push(
          fact('adp.compliance.result', {
            file: metric.file,
            gate: 'size',
            passed: false,
            message: `File has ${metric.lines} lines (max: ${maxFileLines})`,
          } satisfies CompliancePayload) as { tag: string; payload: CompliancePayload }
        );
      }
    }

    if (facts.length === 0) {
      return RuleResult.noop('All files pass size gate');
    }
    return RuleResult.emit(facts);
  },
};

/**
 * Constraint: No critical architectural violations allowed.
 * Returns false if any file has critical anti-patterns.
 */
const noCriticalViolationsConstraint: ADPConstraintDescriptor = {
  id: 'adp.compliance.no-critical-violations',
  description: 'Ensures no files have critical architectural violations',
  impl(state) {
    const { fileMetrics, complexityThreshold } = state.context;

    for (const metric of fileMetrics) {
      // Critical: complexity more than 3x threshold
      if (metric.complexity > complexityThreshold * 3) {
        return `Critical violation: ${metric.file} has complexity ${metric.complexity} (3x threshold: ${complexityThreshold * 3})`;
      }
      // Critical: god object with excessive responsibilities
      if (metric.responsibilities.length > 6) {
        return `Critical violation: ${metric.file} has ${metric.responsibilities.length} responsibilities`;
      }
    }

    return true;
  },
};

/**
 * Compliance Praxis Module
 */
export const complianceModule: PraxisModule<ADPContext> = {
  rules: [complexityGateRule, sizeGateRule],
  constraints: [noCriticalViolationsConstraint],
  meta: {
    name: 'compliance',
    description: 'Architectural standards enforcement, quality gates',
  },
};

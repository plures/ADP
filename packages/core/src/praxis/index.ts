/**
 * ADP Praxis Integration
 *
 * Exports praxis modules for declarative architecture decision logic.
 * These modules can be registered with a PraxisRegistry/LogicEngine to
 * evaluate architectural rules and constraints.
 */

export { patternDetectionModule } from './pattern-detection.js';
export { refactoringPolicyModule } from './refactoring-policy.js';
export { complianceModule } from './compliance.js';
export type {
  ADPContext,
  PatternDetectionPayload,
  RefactoringPolicyPayload,
  CompliancePayload,
} from './types.js';

import type { PraxisModule } from '@plures/praxis';
import type { ADPContext } from './types.js';
import { patternDetectionModule } from './pattern-detection.js';
import { refactoringPolicyModule } from './refactoring-policy.js';
import { complianceModule } from './compliance.js';

/**
 * All ADP praxis modules bundled together.
 * Register with a PraxisRegistry to enable all ADP rules and constraints.
 */
export const adpModules: PraxisModule<ADPContext>[] = [
  patternDetectionModule,
  refactoringPolicyModule,
  complianceModule,
];

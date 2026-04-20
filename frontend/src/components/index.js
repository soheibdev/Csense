/**
 * components/index.js — root barrel for all component sub-groups.
 *
 * Consumers can import from a specific sub-folder (preferred for tree-shaking)
 * or re-export everything through this barrel.
 *
 * Usage:
 *   import { Button }     from '@ui';          // ← preferred (specific)
 *   import { QuizCard }   from '@quiz';
 *   import { XpBar }      from '@gamification';
 */

export * from './ui';
export * from './quiz';
export * from './gamification';

/**
 * modules/index.js — root barrel for all feature modules.
 *
 * Each module is a self-contained vertical slice:
 *   /<module>/
 *     index.js          ← barrel export
 *     <Module>Page.jsx  ← route-level page component
 *     components/       ← module-private components
 *     hooks/            ← module-private hooks (optional)
 *
 * Usage (preferred — import from specific module for tree-shaking):
 *   import { PhishingPage } from '@modules/phishing';
 *
 * Or via this barrel:
 *   import { PhishingPage } from '@modules';
 */

export * from './welcome';
export * from './password';
export * from './phishing';
export * from './browsing';
export * from './physical';
export * from './incident';

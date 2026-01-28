/**
 * Type declarations for Vitest and Testing Library
 * Extends Vitest's expect with jest-dom matchers
 */

/// <reference types="@testing-library/jest-dom" />

import '@testing-library/jest-dom'
import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers'

declare module 'vitest' {
  interface Assertion<T = any> extends TestingLibraryMatchers<T, void> {}
  interface AsymmetricMatchersContaining extends TestingLibraryMatchers<any, void> {}
}

